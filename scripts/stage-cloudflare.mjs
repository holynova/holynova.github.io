import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync, linkSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

// Stages the portfolio + wujun-study only. xiaosang-gallery is a separate
// Worker (holynova/xiaosang-gallery) since 2026-11-18 and is no longer
// staged into this Worker.
const root = fileURLToPath(new URL('../', import.meta.url));
const mounted = JSON.parse(readFileSync(join(root, 'data/mounted-projects.json'), 'utf8'));
const wujun = process.env.WUJUN_STUDY_DIST || join(homedir(), 'code/wujun-study/dist');
if (!existsSync(join(wujun, 'release.json'))) throw new Error('Wu Jun build missing; set WUJUN_STUDY_DIST.');
const wujunReceipt = JSON.parse(readFileSync(join(wujun, 'release.json'), 'utf8'));
if (wujunReceipt.project !== 'wujun-study' || wujunReceipt.commit !== mounted['wujun-study'].commit || wujunReceipt.topics !== 42) {
  throw new Error('Wu Jun release differs from the pinned portfolio mount. Build and synchronize its source commit first.');
}
for (const file of ['index.html', '_headers', 'search.json', 'favicon.svg']) {
  if (!existsSync(join(wujun, file))) throw new Error('Incomplete Wu Jun build: ' + file);
}
if (filesIn(join(wujun, 'slides')).filter(x => x.endsWith('.pdf')).length !== wujunReceipt.decks ||
    filesIn(join(wujun, 'static')).filter(x => x.endsWith('.webp')).length !== wujunReceipt.decks * 15) {
  throw new Error('Incomplete Wu Jun slide library');
}
const directory = join(root, '.cloudflare-build');
// A stale checkout can replace every project on the shared Worker.
execFileSync('git', ['fetch', 'origin', 'master'], {cwd: root, stdio: 'inherit'});
execFileSync('git', ['merge-base', '--is-ancestor', 'origin/master', 'HEAD'], {cwd: root});

function placeTree(source, destination) {
  mkdirSync(destination, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory()) placeTree(from, to);
    else if (entry.isFile()) {
      try { linkSync(from, to); }
      catch (error) {
        if (error.code !== 'EXDEV') throw error;
        copyFileSync(from, to);
      }
    } else throw new Error(`Unexpected release path: ${entry.name}`);
  }
}

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
  const wujunTarget = join(stage, 'wujun-study');
  if (existsSync(wujunTarget)) throw new Error('Conflicting wujun-study route');
  placeTree(wujun, wujunTarget);
  const wujunHeaders = readFileSync(join(wujunTarget, '_headers'), 'utf8').trim()
    .split('\n').map(line => line.startsWith('/') ? `/wujun-study${line}` : line).join('\n');
  rmSync(join(wujunTarget, '_headers'));
  const headers = join(stage, '_headers');
  const oldHeaders = existsSync(headers) ? readFileSync(headers, 'utf8').trimEnd() : '';
  writeFileSync(headers, [oldHeaders, wujunHeaders].filter(Boolean).join('\n\n') + '\n');
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
    wujun: wujunReceipt.commit,
    files: files.length,
  }));
} finally {
  rmSync(temp, { recursive: true, force: true });
}
