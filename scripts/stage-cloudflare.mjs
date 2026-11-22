import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const commit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim();
const output = join(root, '.cloudflare-build');
const temp = mkdtempSync(join(root, '.cloudflare-stage-'));
const stage = join(temp, 'site');

try {
  mkdirSync(stage);
  execFileSync('/bin/bash', ['-o', 'pipefail', '-c',
    'git archive "$1" | tar -xf - -C "$2"', 'stage', commit, stage], {cwd: root});
  const archive = join(stage, 'deploy/legacy-pages.tar.gz');
  const manifest = JSON.parse(readFileSync(join(stage, 'deploy/mounts.json'), 'utf8'));
  if (createHash('sha256').update(readFileSync(archive)).digest('hex') !== manifest.archiveSha256) {
    throw new Error('Legacy page archive checksum mismatch');
  }
  execFileSync('tar', ['-xzf', archive, '-C', stage]);
  const headers = join(stage, '_headers');
  const rules = [existsSync(headers) ? readFileSync(headers, 'utf8').trimEnd() : ''];
  for (const [mount, pin] of Object.entries(manifest.mounts)) {
    const receipt = JSON.parse(readFileSync(join(stage, mount, 'release.json'), 'utf8'));
    if (receipt.commit !== pin.commit) throw new Error('Unexpected release in /' + mount);
    const path = join(stage, mount, '_headers');
    rules.push(readFileSync(path, 'utf8').trim().split('\n').map(line =>
      line.startsWith('/') ? '/' + mount + line : line).join('\n'));
    rmSync(path);
  }
  writeFileSync(headers, rules.filter(Boolean).join('\n\n') + '\n');
  // Only the Worker entry point needs the archive manifest. Neither is a public asset.
  rmSync(join(stage, 'deploy'), {recursive: true});
  const former = join(temp, 'previous');
  if (existsSync(output)) renameSync(output, former);
  try { renameSync(stage, output); }
  catch (error) {
    if (existsSync(former)) renameSync(former, output);
    throw error;
  }
  console.log(JSON.stringify({portfolio: commit, mounts: Object.keys(manifest.mounts)}));
} finally {
  rmSync(temp, {recursive: true, force: true});
}
