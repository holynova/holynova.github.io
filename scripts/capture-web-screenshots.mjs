#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const dataPath = path.join(projectRoot, 'data', 'repos.json');
const screenshotsDir = path.join(projectRoot, 'screenshots');
const reportPath = path.join(projectRoot, 'data', 'screenshot-capture-report.json');
const overridesPath = path.join(projectRoot, 'data', 'screenshot-capture-overrides.json');
const playwrightModule = process.env.PLAYWRIGHT_MODULE || 'playwright';
const concurrency = Math.max(1, Number(process.env.CAPTURE_CONCURRENCY || 4));
const settleMs = Math.max(0, Number(process.env.CAPTURE_SETTLE_MS || 1800));
const viewport = { width: 1280, height: 800, deviceScaleFactor: 1 };

const { chromium } = await import(playwrightModule);
const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const overrides = JSON.parse(await fs.readFile(overridesPath, 'utf8'));
const projects = data.categories.flatMap((category) =>
  category.repos.map((repo) => ({ ...repo, categoryId: category.id }))
).filter((repo) => (
  repo.homepage?.startsWith('https://holynova.github.io/') &&
  repo.categoryId !== 'chrome-extensions' &&
  !overrides[repo.name]?.skip
));

await fs.mkdir(screenshotsDir, { recursive: true });

function screenshotPath(repo) {
  return path.join(projectRoot, repo.screenshot || `screenshots/${repo.name}.png`);
}

async function waitForStableContent(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForFunction(() => {
    const body = document.body;
    if (!body) return false;
    const visibleImages = [...document.images].filter((image) => image.offsetParent !== null);
    const imagesReady = visibleImages.every((image) => image.complete);
    const loadingNodes = document.querySelectorAll(
      '[aria-busy="true"], [data-loading="true"], .skeleton, .loading-spinner'
    );
    const hasContent = body.innerText.trim().length >= 20 || body.querySelector('canvas, svg, video, img');
    return imagesReady && loadingNodes.length === 0 && hasContent;
  }, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(settleMs);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
    `
  }).catch(() => {});
  await page.waitForTimeout(120);
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const visibleImages = [...document.images].filter((image) => image.offsetParent !== null);
    const visibleText = [...document.querySelectorAll('body *')]
      .filter((node) => node.children.length === 0 && node.offsetParent !== null)
      .map((node) => node.textContent.trim())
      .filter(Boolean)
      .join(' ');
    return {
      bodyTextLength: document.body?.innerText.trim().length || 0,
      visibleTextLength: visibleText.length,
      visibleImageCount: visibleImages.length,
      unloadedImageCount: visibleImages.filter((image) => !image.complete).length,
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      title: document.title
    };
  });
}

async function capture(browser, repo) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  const target = new URL(repo.homepage);
  target.searchParams.set('_portfolio_capture', Date.now().toString());
  const output = screenshotPath(repo);
  const startedAt = new Date().toISOString();

  try {
    await page.goto(target.toString(), { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForStableContent(page);
    await page.screenshot({ path: output, type: 'png', fullPage: false });
    const metrics = await inspectPage(page);
    return {
      name: repo.name,
      categoryId: repo.categoryId,
      homepage: repo.homepage,
      screenshot: path.relative(projectRoot, output),
      status: metrics.bodyTextLength >= 20 || metrics.visibleImageCount > 0 ? 'captured' : 'review',
      startedAt,
      metrics,
      consoleErrors: consoleErrors.slice(0, 10)
    };
  } catch (error) {
    return {
      name: repo.name,
      categoryId: repo.categoryId,
      homepage: repo.homepage,
      screenshot: path.relative(projectRoot, output),
      status: 'failed',
      startedAt,
      error: error.message,
      consoleErrors: consoleErrors.slice(0, 10)
    };
  } finally {
    await page.close();
  }
}

const browser = await chromium.launch({ headless: true });
const results = [];
let cursor = 0;

async function worker() {
  while (cursor < projects.length) {
    const repo = projects[cursor++];
    const result = await capture(browser, repo);
    results.push(result);
    console.log(`${result.status.padEnd(8)} ${repo.name}`);
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, projects.length) }, worker));
await browser.close();

results.sort((a, b) => a.name.localeCompare(b.name));
await fs.writeFile(reportPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  viewport,
  settleMs,
  count: results.length,
  skipped: Object.entries(overrides)
    .filter(([, override]) => override.skip)
    .map(([name, override]) => ({ name, reason: override.reason })),
  results
}, null, 2)}\n`);

const failed = results.filter((result) => result.status === 'failed');
const review = results.filter((result) => result.status === 'review');
console.log(`Captured ${results.length - failed.length} / ${results.length}; review ${review.length}; failed ${failed.length}`);
if (failed.length) process.exitCode = 1;
