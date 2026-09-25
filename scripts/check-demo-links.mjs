import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../data/repos.json', import.meta.url), 'utf8'));
const repos = data.categories.flatMap((category) => category.repos);
const exceptions = new Map([
  // This project's custom domain is not yet serving HTTPS.
  ['system-design-learning-lab', 'https://holynova.github.io/system-design-learning-lab/']
]);
const names = new Set();
const errors = [];
let customDomainCount = 0;

if (data.totalRepos !== repos.length) {
  errors.push(`totalRepos is ${data.totalRepos}, but the catalog contains ${repos.length} projects`);
}

for (const repo of repos) {
  if (names.has(repo.name)) errors.push(`Duplicate project name: ${repo.name}`);
  names.add(repo.name);

  if (repo.name === 'holynova') {
    if (repo.homepage) errors.push('GitHub profile should not have a Demo URL');
    continue;
  }

  if (exceptions.has(repo.name)) {
    if (repo.homepage !== exceptions.get(repo.name)) {
      errors.push(`${repo.name}: review the temporary Demo exception before changing it`);
    }
    continue;
  }

  if (!repo.homepage) {
    errors.push(`${repo.name}: missing Demo URL`);
    continue;
  }

  let url;
  try {
    url = new URL(repo.homepage);
  } catch {
    errors.push(`${repo.name}: invalid Demo URL: ${repo.homepage}`);
    continue;
  }

  if (url.protocol !== 'https:' ||
      (url.hostname !== 'xiaosang.cc' && !url.hostname.endsWith('.xiaosang.cc'))) {
    errors.push(`${repo.name}: Demo must use xiaosang.cc: ${repo.homepage}`);
    continue;
  }
  customDomainCount++;
}

for (const name of exceptions.keys()) {
  if (!names.has(name)) errors.push(`Obsolete Demo exception: ${name}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Demo links verified: ${customDomainCount} xiaosang.cc URLs, ${exceptions.size} temporary exception`);
}
