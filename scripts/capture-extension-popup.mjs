#!/usr/bin/env node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const [sourceDir, entry, outputPath] = process.argv.slice(2);
if (!sourceDir || !entry || !outputPath) {
  console.error('Usage: capture-extension-popup.mjs <extension-dir> <entry-file> <output-png>');
  process.exit(2);
}

const playwrightModule = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = await import(playwrightModule);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 560, height: 800 }, deviceScaleFactor: 1 });
const sourcePath = path.resolve(sourceDir, entry);
const temporaryPath = path.join(os.tmpdir(), `extension-capture-${Date.now()}.png`);

try {
  await page.goto(pathToFileURL(sourcePath).href, { waitUntil: 'load', timeout: 30000 });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  }).catch(() => {});
  await page.waitForTimeout(300);
  await page.screenshot({ path: temporaryPath, fullPage: true, type: 'png' });
} finally {
  await browser.close();
}

const result = spawnSync('ffmpeg', [
  '-loglevel', 'error',
  '-y',
  '-i', temporaryPath,
  '-vf', 'scale=1280:800:force_original_aspect_ratio=decrease,pad=1280:800:(ow-iw)/2:(oh-ih)/2:color=#f3f3f3',
  '-frames:v', '1',
  path.resolve(outputPath)
], { encoding: 'utf8' });
await fs.rm(temporaryPath, { force: true });
if (result.status !== 0) {
  console.error(result.stderr || 'ffmpeg failed');
  process.exit(result.status || 1);
}

console.log(`Captured ${path.resolve(outputPath)}`);
