import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync, linkSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
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

const temp = mkdtempSync(join(root, '.cloudflare-stage-'));
try {
  const archive = join(temp, 'portfolio.tar');
  const stage = join(temp, 'site');
  mkdirSync(stage);
  execFileSync('git', ['archive', '--format=tar', '--output', archive, 'HEAD'], { cwd: root });
  execFileSync('tar', ['-xf', archive, '-C', stage]);
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
    portfolio: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    gallery: receipt.commit,
    version: receipt.version,
    files: files.length,
  }));
} finally {
  rmSync(temp, { recursive: true, force: true });
}
