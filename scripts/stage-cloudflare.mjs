import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync, linkSync, copyFileSync } from 'node:fs';
import { resolve, join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const root = fileURLToPath(new URL('../', import.meta.url));
if (process.argv.includes('--portfolio-only')) {
  throw new Error('This Worker includes xiaosang-gallery. Supply its production build for every deployment.');
}
const requestedGallery = process.argv[2] || process.env.XIAOSANG_GALLERY_DIST;
const candidates = requestedGallery ? [resolve(requestedGallery)] : [
  resolve(root, '../xiaosang-gallery/dist'),
  join(homedir(), 'Code/xiaosang-gallery/dist'),
];
const gallery = candidates.find(path => existsSync(join(path, 'release.json')));
if (!gallery) throw new Error('Gallery build missing. Set XIAOSANG_GALLERY_DIST to the complete production dist directory.');
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
const route = 'xiaosang-gallery';
const receipt = JSON.parse(readFileSync(join(gallery, 'release.json'), 'utf8'));
if (receipt.project !== route || !/^[a-f0-9]{40}$/.test(receipt.commit) || !receipt.works) {
  throw new Error('Expected the xiaosang-gallery production build and source commit');
}
for (const required of ['index.html', 'overview.html', 'skills/index.html', 'data/index.js', '_headers']) {
  if (!existsSync(join(gallery, required))) throw new Error('Incomplete gallery build: ' + required);
}
const originals = filesIn(join(gallery, 'originals'));
const media = filesIn(join(gallery, 'media'));
if (originals.length < receipt.works || media.length < receipt.works * 3) {
  throw new Error('Incomplete gallery image library');
}
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
  const galleryTarget = join(stage, route);
  if (existsSync(galleryTarget)) throw new Error(`Existing portfolio route conflicts with /${route}/`);
  placeTree(gallery, galleryTarget);
  const nested = join(galleryTarget, '_headers');
  const galleryHeaders = readFileSync(nested, 'utf8').trim()
    .split('\n').map(line => line.startsWith('/') ? `/${route}${line}` : line).join('\n');
  rmSync(nested);
  const headers = join(stage, '_headers');
  const oldHeaders = existsSync(headers) ? readFileSync(headers, 'utf8').trimEnd() : '';
  writeFileSync(headers, [oldHeaders, galleryHeaders].filter(Boolean).join('\n\n') + '\n');
  const wujunTarget = join(stage, 'wujun-study');
  if (existsSync(wujunTarget)) throw new Error('Conflicting wujun-study route');
  placeTree(wujun, wujunTarget);
  const wujunHeaders = readFileSync(join(wujunTarget, '_headers'), 'utf8').trim()
    .split('\n').map(line => line.startsWith('/') ? `/wujun-study${line}` : line).join('\n');
  rmSync(join(wujunTarget, '_headers'));
  writeFileSync(headers, readFileSync(headers, 'utf8').trimEnd() + '\n\n' + wujunHeaders + '\n');
  // Wrangler already excludes these directories from the asset upload.
  // Keep the preflight count conservative by counting all other files.
  const assetIgnore = readFileSync(join(stage, '.assetsignore'), 'utf8').split(/\r?\n/);
  const ignoredDirectories = ['scripts/', '.github/'].filter(prefix => assetIgnore.includes(prefix));
  const files = filesIn(stage).filter(file => {
    const assetPath = relative(stage, file);
    return !ignoredDirectories.some(prefix => assetPath.startsWith(prefix));
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
    gallery: receipt.commit,
    wujun: wujunReceipt.commit,
    version: receipt.version,
    files: files.length,
  }));
} finally {
  rmSync(temp, { recursive: true, force: true });
}
