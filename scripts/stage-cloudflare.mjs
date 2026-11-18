import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Stages the portfolio only. xiaosang-gallery and wujun-study are separate
// Workers (holynova/xiaosang-gallery, holynova/wujun-study) since 2026-11-18
// and are no longer staged into this Worker.
const root = fileURLToPath(new URL('../', import.meta.url));
const directory = join(root, '.cloudflare-build');
// A stale checkout can replace every project on the shared Worker.
execFileSync('git', ['fetch', 'origin', 'master'], {cwd: root, stdio: 'inherit'});
execFileSync('git', ['merge-base', '--is-ancestor', 'origin/master', 'HEAD'], {cwd: root});

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
  if (process.platform === 'darwin') {
    // APFS clones remain independent of later edits and avoid a second full copy.
    // A clean tracked tree is required to represent the recorded commit exactly.
    execFileSync('git', ['diff', '--quiet', 'HEAD', '--'], {cwd: root});
    const tracked = execFileSync('git', ['ls-tree', '-rz', '--name-only', sourceHead], {cwd: root, encoding: 'utf8'}).split('\0').filter(Boolean);
    for (const relative of tracked) {
      const target = join(stage, relative);
      mkdirSync(dirname(target), {recursive: true});
      execFileSync('/bin/cp', ['-cPp', join(root, relative), target]);
    }
    if (execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim() !== sourceHead) {
      throw new Error('Source commit changed while staging');
    }
    execFileSync('git', ['diff', '--quiet', sourceHead, '--'], {cwd: root});
  } else {
    execFileSync('/bin/bash', ['-o', 'pipefail', '-c',
      'git archive "$1" | tar -xf - -C "$2"', 'stage-cloudflare', sourceHead, stage,
    ], {cwd: root, stdio: 'inherit'});
  }
  const files = filesIn(stage);
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
