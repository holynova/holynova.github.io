import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [index, app, rawData] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../js/detail-app.js', import.meta.url), 'utf8'),
  readFile(new URL('../data/repos.json', import.meta.url), 'utf8')
]);
const data = JSON.parse(rawData);

assert.ok(!index.includes('repos-store.js'), '首页不得加载旧的内嵌数据 store');
assert.ok(app.includes("fetch('./data/repos.json', { cache: 'no-store' })"), '首页必须直接请求 repos.json');
assert.ok(!app.includes('window.store'), '应用不得优先使用静态 store');
assert.ok(data.categories.some((category) => category.repos.some((repo) => repo.name === 'print-atlas')), 'JSON 必须包含 print-atlas');

console.log('Portfolio data source verified: repos.json is the only homepage source.');
