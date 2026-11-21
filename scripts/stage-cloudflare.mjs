import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = join(root, '.cloudflare-build');

function filesIn(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => {
    const child = join(path, entry.name);
    return entry.isDirectory() ? filesIn(child) : [child];
  });
}

const sourceHead = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim();
const temp = mkdtempSync(join(root, '.cloudflare-stage-'));
try {
  const stage = join(temp, 'site');
  mkdirSync(stage);
  execFileSync('/bin/bash', ['-o', 'pipefail', '-c',
    'git archive "$1" | tar -xf - -C "$2"', 'stage-cloudflare', sourceHead, stage,
  ], {cwd: root, stdio: 'inherit'});
  // Respect literal root paths in the upload configuration. Count wildcard
  // rules conservatively, and fall back to counting all files for negations.
  const rules = readFileSync(join(stage, '.assetsignore'), 'utf8').split(/\r?\n/);
  const literalPaths = rules.some(rule => rule.startsWith('!')) ? [] :
    rules.filter(rule => /^[\w./-]+$/.test(rule));
  const ignoredFiles = new Set(literalPaths.filter(rule => !rule.endsWith('/')));
  const ignoredDirectories = literalPaths.filter(rule => rule.endsWith('/'));
  const files = filesIn(stage).filter(file => {
    const assetPath = relative(stage, file);
    return !ignoredFiles.has(assetPath) &&
      !ignoredDirectories.some(prefix => assetPath.startsWith(prefix));
  });
  if (files.length > 20_000 || files.some(file => lstatSync(file).size > 25 * 1024 ** 2)) {
    throw new Error(`Staged portfolio exceeds Workers Static Assets limits (${files.length} files)`);
  }
  const former = join(temp, 'previous');
  if (existsSync(directory)) renameSync(directory, former);
  try { renameSync(stage, directory); }
  catch (error) {
    if (existsSync(former)) renameSync(former, directory);
    throw error;
  }
  console.log(JSON.stringify({
    portfolio: sourceHead,
    files: files.length,
  }));
} finally {
  rmSync(temp, { recursive: true, force: true });
}
