import {estimatePortrait} from './segment.js';
import {addPhoto, listPhotos, readFile, readMask, removePhoto, saveMask, savePhoto, setPhotoRemoval} from './history.js';
import {downloadBlob} from './download.js';
import {openShare} from './share.js';

const icons = {
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  logo: '<path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/><path d="m14 13 5-5" stroke-width="3"/>',
  share: '<path d="M12 16V3m-4 4 4-4 4 4M5 11H3v10h18V11h-2"/>',
  guide: '<path d="M12 5v15M3 4h5c2 0 4 1 4 3 0-2 2-3 4-3h5v14h-5c-2 0-4 1-4 2 0-1-2-2-4-2H3z"/>',
  history: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v14m8-14v14M3 10h5m8 0h5M3 14h5m8 0h5"/>',
  down: '<path d="m5 9 7 7 7-7"/>',
  folder: '<path d="M3 19V5h6l2 2h10v12z"/>',
  eye: '<path d="M2 12c4-7 16-7 20 0-4 7-16 7-20 0Z"/><circle cx="12" cy="12" r="2.5"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  brush: '<path d="m11 15 9-9a2.1 2.1 0 0 0-3-3l-9 9m3 3c0 4-4 6-8 5 2-1 1-3 2-5 1-2 4-3 6 0Z"/>',
  reset: '<path d="M3 11a9 9 0 1 1 2 7M3 5v6h6"/>',
  person: '<circle cx="12" cy="8" r="3"/><path d="M6 19c0-4 2-6 6-6s6 2 6 6M3 9V3h6m6 0h6v6m0 6v6h-6M3 15v6h6"/>',
};
function icon(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + '</svg>';
}
function button(action, label, symbol, extra = '') {
  const symbolOnly = extra.includes('icon-only');
  return '<button type="button" class="btn ' + extra + '" data-action="' + action + '"' +
    (symbolOnly ? ' aria-label="' + label + '" title="' + label + '"' : '') + '>' +
    (symbol ? icon(symbol) : '') + (symbolOnly ? '' : label) + '</button>';
}
function exportButton() {
  return '<button type="button" class="btn" data-action="export" disabled>' +
    '<span data-export-label>导出成品</span></button>';
}
function historyButton() {
  return '<button type="button" class="btn" data-action="toggleHistory" aria-controls="photo-history" hidden>' +
    icon('history') + '历史 <span data-history-count></span></button>';
}
function header() {
  return '<header class="app-head"><div class="brand"><div class="mark">' + icon('logo') + '</div><h1>破框</h1></div>' +
    '<div class="head-actions">' + button('open', '导入照片', 'folder', 'header-import icon-only') +
    exportButton() +
    '<button type="button" class="btn icon-only more-button" popovertarget="editor-more" aria-controls="editor-more" aria-label="更多操作">' + icon('more') + '</button></div>' +
    '<div id="editor-more" class="editor-more" popover role="group" aria-label="更多操作">' +
    button('original', '原图对比', 'eye') + historyButton() +
    button('tutorial', '使用教程', 'guide') + button('share', '分享工具', 'share') + '</div></header>';
}
function stepper(axis, label) {
  return '<div class="layout-row"><span class="control-label">' + label + '</span><div class="stepper" role="group" aria-label="' + label + '数量">' +
    '<button type="button" data-axis="' + axis + '" data-step="-1" aria-label="减少' + label + '数量">−</button>' +
    '<output data-count="' + axis + '" aria-live="polite"></output>' +
    '<button type="button" data-axis="' + axis + '" data-step="1" aria-label="增加' + label + '数量">+</button></div></div>';
}
function field(key, label, min, max, step) {
  return '<div class="field"><div class="range-label"><label for="' + key + '">' + label +
    '</label><output data-value="' + key + '" for="' + key + '"></output></div>' +
    '<input data-range="' + key + '" id="' + key + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '"></div>';
}
const widthControl = () => field('width', '线宽', .3, 4, .1);
const insetControl = () => field('inset', '外框内缩', 1, 18, .5);
const fileName = () => '<div class="filename">' + icon('folder') + '<span data-filename></span></div>';
function brushTools() {
  return button('add', '保留', null) + button('erase', '擦除', null) +
    button('undo', '撤销笔画', 'reset', 'icon-only') + button('finish', '查看网格效果', null, 'primary');
}
function preview() {
  return '<section class="workstage" aria-label="照片预览"><div class="workspace-meta">' + fileName() +
    '<p class="subtle workspace-status" role="status" data-workspace-status></p></div>' +
    '<div class="main-image"><div class="image-wrap" data-photo-wrap hidden>' +
    '<canvas data-image="result" role="img" aria-label="照片预览" tabindex="-1"></canvas>' +
    '<span class="brush-cursor" data-brush-cursor aria-hidden="true"></span></div>' +
    '<div class="removal-recovery" hidden><span data-removal-message role="status"></span>' +
    button('restore', '撤销', null) + '</div>' +
    '<p id="mask-keys" class="sr-only">用方向键移动画笔，按空格落笔。按住 Shift 可加快移动。按 Tab 退出画布。</p>' +
    '<p class="sr-only" data-brush-position role="status"></p>' +
    '<div class="empty-photo" data-empty>' + icon('folder') + button('open', '打开照片', null, 'primary') +
    '<span class="subtle">可一次选择多张</span></div></div>' +
    '<div class="sample-guide" data-sample-guide hidden>' +
    button('open', '导入我的照片', 'folder', 'primary') + '</div>' +
    '<section id="photo-history" class="history" aria-label="编辑历史" data-history hidden>' +
    '<button type="button" class="btn history-arrow" data-history-step="-1" aria-label="上一页历史" hidden>‹</button>' +
    '<div class="filmstrip" data-filmstrip></div>' +
    '<button type="button" class="btn history-arrow" data-history-step="1" aria-label="下一页历史" hidden>›</button>' +
    '<button type="button" class="btn text" data-action="remove">从历史移除</button></section></section>';
}
function footer() {
  return '<footer class="editor-footer subtle"><a href="https://github.com/holynova/photo-breakout">GitHub</a><span class="numbers">' + stage.dataset.version + '</span></footer>';
}
function subject() {
  return '<div class="subject-card"><span class="subject-icon">' + icon('person') + '</span>' +
    '<strong>人物蒙版</strong><span class="subtle" role="status" data-mask-status></span></div>';
}
const tools = {grid: ['网格', 'grid'], mask: ['蒙版', 'brush']};
function gridTools() {
  return '<div class="layout-controls">' + stepper('rows', '横格') + stepper('columns', '竖格') + '</div>' +
    '<div class="tool-sliders">' + widthControl() + insetControl() + '</div>';
}
function editor() {
  return '<div class="app work">' + header() + '<main class="workbody">' + preview() +
    '<aside class="inspector" aria-label="调整面板">' +
    '<div class="tool-head"><div class="tool-switch" role="group" aria-label="编辑工具">' +
    Object.entries(tools).map(([key, [label, symbol]]) =>
      '<button type="button" data-panel-button="' + key + '" aria-controls="tool-' + key + '">' + icon(symbol) + label + '</button>'
    ).join('') + '</div><div class="tool-actions">' + button('reset', '重置网格', 'reset', 'icon-only') +
    button('collapse', '收起编辑工具', 'down', 'icon-only') + '</div></div>' +
    '<div class="tool-panels">' +
    '<div id="tool-grid" class="tool-panel" data-panel="grid">' + gridTools() + '</div>' +
    '<div id="tool-mask" class="tool-panel" data-panel="mask" inert>' + subject() +
    '<div class="mobile-brush" data-brush-tools inert>' + brushTools() + '</div>' +
    '<div class="mask-instruction" data-brush-tools inert><p class="subtle">涂抹照片，标记挡住白线的位置</p>' +
    button('focusMask', '键盘修整', null, 'text') + '</div></div></div>' +
    footer() + '</aside></main></div>';
}

const stage = document.getElementById('stage');
const phone = matchMedia('(max-width: 700px), (orientation: landscape) and (max-height: 480px) and (max-width: 960px)');
const defaults = {rows: 3, columns: 3, width: 1.4, inset: 6};
const state = {...defaults, original: false, brush: null, panel: 'grid', maskStatus: 'empty', filename: ''};
const photo = document.createElement('canvas');
const mask = document.createElement('canvas');
const maskView = document.createElement('canvas');
const foreground = document.createElement('canvas');
const lines = document.createElement('canvas');
const result = document.createElement('canvas');
const undoStack = [];
const statusBar = document.getElementById('status');
const fileInput = document.getElementById('local-file');
const guide = document.getElementById('guide-dialog');
const guideImport = guide.querySelector('[data-guide-import]');
const maskStatusText = {
  empty: '打开照片后自动识别',
  preparing: '正在识别人像',
  ready: '已选中人物',
  manual: '可以用画笔标记人物',
};
const entries = new Map();
const thumbnailUrls = new Map();
const pendingMasks = new Map();
const pendingSettings = new Map();
const pendingRemovals = new Map();
const removalWindow = 20000;
const brushPosition = {x: .5, y: .5};
const lastPhotoKey = 'photo-breakout-active-photo';
let selectedID;
let showingSample = false;
let historyOpen = false;
let historyPage = 0;
const historyPageSize = 3;
let mobileToolsOpen = false;
let photoRevision = 0;
let statusTimer;
let drawFrame;
let activePointer;
let comparePointer;
let importing = false;
let importProgress;
let removing = false;
let warnedStorage = false;

async function loadImage(url) {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}
async function loadBlob(blob) {
  const url = URL.createObjectURL(blob);
  try {
    return await loadImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}
function setPhoto(image) {
  const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
  const w = Math.max(1, Math.round(image.naturalWidth * scale));
  const h = Math.max(1, Math.round(image.naturalHeight * scale));
  for (const canvas of [photo, foreground, lines, result]) {
    canvas.width = w;
    canvas.height = h;
  }
  const maskScale = Math.min(1, 1024 / Math.max(w, h));
  for (const canvas of [mask, maskView]) {
    canvas.width = Math.max(1, Math.round(w * maskScale));
    canvas.height = Math.max(1, Math.round(h * maskScale));
  }
  photo.getContext('2d').drawImage(image, 0, 0, w, h);
  photo.dataset.ready = 'true';
  undoStack.length = 0;
  brushPosition.x = brushPosition.y = .5;
  sync();
}
function showStatus(message, duration = 4200) {
  clearTimeout(statusTimer);
  statusBar.textContent = message;
  statusBar.hidden = false;
  if (duration) statusTimer = setTimeout(() => { statusBar.hidden = true; }, duration);
}
function setMask(alphaImage) {
  const ctx = mask.getContext('2d');
  ctx.clearRect(0, 0, mask.width, mask.height);
  ctx.drawImage(alphaImage, 0, 0, mask.width, mask.height);
}
function rememberPhoto(id) {
  try {
    if (id) localStorage.setItem(lastPhotoKey, id);
    else localStorage.removeItem(lastPhotoKey);
  } catch { /* History still works in this visit. */ }
}
function warnStorage(saved) {
  if (saved || warnedStorage) return;
  warnedStorage = true;
  showStatus('无法保存到本机历史，部分更改只在当前页面保留');
}
function saveSettings() {
  const id = selectedID;
  const entry = entries.get(id);
  if (!entry || removing) return;
  const gridSettings = Object.fromEntries(Object.keys(defaults).map(key => [key, state[key]]));
  entry.settings = {...entry.settings, ...gridSettings};
  const snapshot = {...entry};
  const pending = Promise.resolve(pendingSettings.get(id)).then(() => savePhoto(snapshot));
  pendingSettings.set(id, pending);
  pending.then(saved => {
    if (pendingSettings.get(id) === pending) pendingSettings.delete(id);
    warnStorage(saved);
  });
}
function commitMask(shouldCapture = true) {
  const id = selectedID;
  if (!entries.has(id) || removing) return;
  const status = state.maskStatus;
  const snapshot = shouldCapture ? new Promise(resolve => mask.toBlob(resolve)) : Promise.resolve(null);
  const pending = Promise.all([pendingMasks.get(id), snapshot]).then(([,blob]) => saveMask(id, {status, blob}));
  pendingMasks.set(id, pending);
  pending.then(saved => {
    if (pendingMasks.get(id) === pending) pendingMasks.delete(id);
    warnStorage(saved);
  });
}
function finishStroke() {
  if (!activePointer) return;
  activePointer = undefined;
  commitMask();
}
function setPanel(panel) {
  endComparison();
  finishStroke();
  state.panel = panel;
  state.original = false;
  state.brush = panel === 'mask' && photo.dataset.ready && state.maskStatus !== 'preparing' ? 'add' : null;
}
async function openPhoto(id, showMask = false) {
  const entry = entries.get(id);
  if (!entry) return;
  finishStroke();
  const revision = ++photoRevision;
  selectedID = id;
  showingSample = false;
  mobileToolsOpen = showMask;
  rememberPhoto(id);
  delete photo.dataset.ready;
  for (const key of Object.keys(defaults)) state[key] = entry.settings?.[key] ?? defaults[key];
  Object.assign(state, {filename: entry.name, maskStatus: 'preparing'});
  setPanel(showMask ? 'mask' : 'grid');
  sync();
  let image;
  let saved;
  try {
    [image, saved] = await Promise.all([
      readFile(id).then(loadBlob),
      Promise.resolve(pendingMasks.get(id)).then(() => readMask(id)).catch(() => undefined),
    ]);
  } catch {
    if (revision !== photoRevision) return;
    state.maskStatus = 'empty';
    sync();
    showStatus('无法读取这张照片，请尝试重新打开');
    return;
  }
  if (revision !== photoRevision) return;
  setPhoto(image);
  const decodedMask = saved?.blob ? await loadBlob(saved.blob).catch(() => undefined) : undefined;
  if (revision !== photoRevision) return;
  if (decodedMask || (saved?.status === 'manual' && !saved.blob)) {
    if (decodedMask) setMask(decodedMask);
    state.maskStatus = saved.status;
  } else {
    const matte = await estimatePortrait(image).catch(() => null);
    if (revision !== photoRevision) return;
    if (matte) setMask(matte);
    state.maskStatus = matte ? 'ready' : 'manual';
    commitMask(Boolean(matte));
  }
  if (state.panel === 'mask') state.brush = 'add';
  sync();
}
async function openSample() {
  finishStroke();
  const revision = ++photoRevision;
  selectedID = undefined;
  showingSample = false;
  historyOpen = false;
  mobileToolsOpen = true;
  rememberPhoto();
  delete photo.dataset.ready;
  Object.assign(state, defaults, {filename: '', maskStatus: 'empty'});
  setPanel('grid');
  sync();

  try {
    const [image, matte] = await Promise.all([
      loadImage(new URL('../sample/snow.jpg', import.meta.url)),
      loadImage(new URL('../sample/snow-mask.png', import.meta.url)),
    ]);
    if (revision !== photoRevision) return;
    showingSample = true;
    state.filename = '示例照片';
    state.maskStatus = 'ready';
    setPhoto(image);
    setMask(matte);
    if (state.panel === 'mask') state.brush = 'add';
    sync();
  } catch {
    if (revision === photoRevision) showStatus('示例加载失败，可以打开自己的照片');
  }
}
function thumbnailFor(image) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const size = Math.min(image.naturalWidth, image.naturalHeight);
  canvas.getContext('2d').drawImage(image, (image.naturalWidth-size)/2, (image.naturalHeight-size)/2, size, size, 0, 0, 128, 128);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .79));
}
function refreshHistory({showSelected = false} = {}) {
  const strip = stage.querySelector('[data-filmstrip]');
  const scroll = strip.scrollLeft;
  const ordered = [...entries.values()].sort((a,b) => b.createdAt - a.createdAt);
  const selectedIndex = showSelected ? ordered.findIndex(entry => entry.id === selectedID) : -1;
  if (selectedIndex >= 0 && phone.matches) historyPage = Math.floor(selectedIndex / historyPageSize);
  historyPage = Math.min(historyPage, Math.max(0, Math.ceil(ordered.length / historyPageSize) - 1));
  const offset = historyPage * historyPageSize;
  const visible = phone.matches ? ordered.slice(offset, offset + historyPageSize) : ordered;
  const items = visible.map(entry => {
    const item = document.createElement('button');
    item.type = 'button';
    item.dataset.photo = entry.id;
    item.title = entry.name;
    item.setAttribute('aria-label', '打开 ' + entry.name);
    if (entry.thumbnail) {
      if (!thumbnailUrls.has(entry.id)) thumbnailUrls.set(entry.id, URL.createObjectURL(entry.thumbnail));
      const preview = new Image();
      preview.src = thumbnailUrls.get(entry.id);
      preview.alt = '';
      item.append(preview);
    }
    const label = document.createElement('span');
    label.textContent = entry.name;
    item.append(label);
    return item;
  });
  strip.replaceChildren(...items);
  strip.scrollLeft = scroll;
}
function latestRemoval() {
  return [...pendingRemovals.values()].at(-1);
}
function scheduleRemoval(entry) {
  const expire = () => {
    pendingRemovals.delete(entry.id);
    void removePhoto(entry.id, entry.removedAt);
    syncRecovery();
  };
  const remaining = entry.removedAt + removalWindow - Date.now();
  if (remaining <= 0) return expire();
  pendingRemovals.set(entry.id, {entry, timer: setTimeout(expire, remaining)});
}
function syncRecovery() {
  const recovery = stage.querySelector('.removal-recovery');
  const removal = latestRemoval();
  recovery.hidden = !removal;
  if (!removal) return;
  const label = recovery.querySelector('[data-removal-message]');
  const text = removal.entry.name + ' 已从历史移除';
  if (label.textContent !== text) label.textContent = text;
  recovery.querySelector('[data-action=restore]').disabled = importing || removing;
}
async function deleteSelected() {
  if (importing || removing || !selectedID) return;
  finishStroke();
  const id = selectedID;
  const entry = entries.get(id);
  if (!entry) return;
  const returnFocus = document.activeElement?.dataset.action === 'remove';
  removing = true;
  ++photoRevision;
  sync();
  await Promise.all([pendingMasks.get(id), pendingSettings.get(id)]);
  const removedAt = Date.now();
  const removed = await setPhotoRemoval(id, undefined, removedAt);
  removing = false;
  if (!removed) {
    showStatus('无法从历史移除，请重试');
    return openPhoto(id);
  }
  entries.delete(id);
  if (thumbnailUrls.has(id)) URL.revokeObjectURL(thumbnailUrls.get(id));
  thumbnailUrls.delete(id);
  scheduleRemoval({...entry, removedAt});
  refreshHistory();
  const next = stage.querySelector('[data-photo]')?.dataset.photo;
  if (next) void openPhoto(next);
  else void openSample();
  if (returnFocus) stage.querySelector('[data-action=restore]').focus({preventScroll: true});
}
async function restoreRemoved() {
  const removal = latestRemoval();
  if (!removal || importing || removing) return;
  const {entry, timer} = removal;
  const {removedAt, ...photo} = entry;
  if (Date.now() >= removedAt + removalWindow) return;
  finishStroke();
  clearTimeout(timer);
  removing = true;
  sync();
  const restored = await setPhotoRemoval(photo.id, removedAt, undefined);
  removing = false;
  pendingRemovals.delete(photo.id);
  if (!restored) {
    scheduleRemoval(entry);
    showStatus('无法撤销移除，请重试');
    return sync();
  }
  entries.set(photo.id, photo);
  void openPhoto(photo.id);
  refreshHistory({showSelected: true});
  sync();
  stage.querySelector('.more-button').focus({preventScroll: true});
  showStatus('已恢复照片和编辑记录');
}
function ratio() {
  const pad = Math.min(photo.width, photo.height) * state.inset / 100;
  const w = photo.width - pad * 2;
  const h = photo.height - pad * 2;
  return {pad, w, h};
}
function composite() {
  const w = photo.width;
  const h = photo.height;
  const box = ratio();
  const out = result.getContext('2d');
  const grid = lines.getContext('2d');
  const front = foreground.getContext('2d');
  grid.clearRect(0, 0, w, h);
  grid.fillStyle = '#ffffff';
  const thick = Math.min(w,h) * state.width / 100;
  for (let step = 1; step < state.columns; step++) {
    const x = box.pad + box.w * step / state.columns;
    grid.fillRect(x - thick / 2, box.pad, thick, box.h);
  }
  for (let step = 1; step < state.rows; step++) {
    const y = box.pad + box.h * step / state.rows;
    grid.fillRect(box.pad, y - thick / 2, box.w, thick);
  }
  grid.globalCompositeOperation = 'destination-out';
  grid.drawImage(mask, 0, 0, w, h);
  grid.globalCompositeOperation = 'source-over';

  front.clearRect(0, 0, w, h);
  front.drawImage(photo, 0, 0);
  front.globalCompositeOperation = 'destination-in';
  front.drawImage(mask, 0, 0, w, h);
  front.globalCompositeOperation = 'source-over';

  out.fillStyle = '#fff';
  out.fillRect(0, 0, w, h);
  out.drawImage(foreground, 0, 0);
  out.drawImage(photo, box.pad, box.pad, box.w, box.h, box.pad, box.pad, box.w, box.h);
  out.drawImage(lines, 0, 0);
}
function render() {
  if (!photo.dataset.ready) return;
  const showOriginal = state.original || comparePointer?.held || state.brush || state.maskStatus === 'preparing';
  if (!showOriginal) composite();
  if (state.brush) {
    const visual = maskView.getContext('2d');
    visual.clearRect(0, 0, maskView.width, maskView.height);
    visual.drawImage(mask, 0, 0);
    visual.globalCompositeOperation = 'source-in';
    visual.fillStyle = 'rgba(119, 245, 157, .42)';
    visual.fillRect(0, 0, maskView.width, maskView.height);
    visual.globalCompositeOperation = 'source-over';
  }
  stage.querySelectorAll('[data-image]').forEach(canvas => {
    if (canvas.width !== photo.width || canvas.height !== photo.height) {
      canvas.width = photo.width;
      canvas.height = photo.height;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(showOriginal ? photo : result, 0, 0);
    if (state.brush) ctx.drawImage(maskView, 0, 0, canvas.width, canvas.height);
  });
}
function queueRender() {
  if (drawFrame) return;
  drawFrame = requestAnimationFrame(() => {
    drawFrame = undefined;
    render();
  });
}
function workspaceMessage(ready) {
  if (importing && importProgress) {
    const {current, total} = importProgress;
    return total > 1 ? '正在读取照片 ' + current + ' / ' + total : '正在读取照片…';
  }
  if (state.maskStatus === 'preparing') return ready ? '正在识别人像…' : '正在读取照片…';
  if (state.original) return '正在查看原图，可切回网格效果';
  if (state.maskStatus === 'manual') return '未自动选中人物，可以用画笔标记';
  if (state.brush && state.maskStatus === 'ready' && !showingSample) return '人物已选中，可查看网格效果';
  return '在本机处理 · 历史保存在此浏览器';
}
function syncBrushPosition(announce = false) {
  const cursor = stage.querySelector('[data-brush-cursor]');
  cursor.style.left = brushPosition.x * 100 + '%';
  cursor.style.top = brushPosition.y * 100 + '%';
  if (announce) {
    const x = Math.round(brushPosition.x * 100);
    const y = Math.round(brushPosition.y * 100);
    stage.querySelector('[data-brush-position]').textContent = '横向 ' + x + '%，纵向 ' + y + '%';
  }
}
function sync() {
  const app = stage.querySelector('.app');
  if (!app) return;
  const ready = Boolean(photo.dataset.ready);
  app.style.setProperty('--photo-ratio', ready ? photo.width / photo.height : 1);
  app.querySelector('.filename').hidden = !state.filename;
  app.querySelector('[data-photo-wrap]').hidden = !ready;
  app.querySelector('[data-empty]').hidden = ready || !!selectedID;
  app.querySelector('[data-sample-guide]').hidden = !showingSample;
  app.querySelector('.header-import').hidden = showingSample;
  const message = workspaceMessage(ready);
  const status = app.querySelector('[data-workspace-status]');
  if (status.textContent !== message) status.textContent = message;
  syncRecovery();
  app.querySelector('[data-history]').hidden = !historyOpen || entries.size === 0;
  app.querySelector('[data-history-count]').textContent = entries.size;
  app.querySelectorAll('[data-history-step]').forEach(node => {
    const next = historyPage + Number(node.dataset.historyStep);
    node.hidden = !phone.matches || entries.size <= historyPageSize;
    node.disabled = removing || next < 0 || next * historyPageSize >= entries.size;
  });
  const historyToggle = app.querySelector('[data-action=toggleHistory]');
  historyToggle.hidden = entries.size === 0;
  historyToggle.setAttribute('aria-expanded', historyOpen);
  historyToggle.disabled = removing;
  guideImport.disabled = removing || importing;
  app.querySelectorAll('[data-photo]').forEach(node => {
    node.disabled = removing;
    node.setAttribute('aria-pressed', node.dataset.photo === selectedID);
  });
  app.querySelectorAll('[data-filename]').forEach(node => node.textContent = state.filename);
  app.querySelectorAll('[data-mask-status]').forEach(node => node.textContent = maskStatusText[state.maskStatus]);
  const toolsVisible = !phone.matches || mobileToolsOpen;
  app.querySelector('.tool-panels').hidden = !toolsVisible;
  app.querySelectorAll('[data-panel-button]').forEach(node => {
    node.setAttribute('aria-pressed', toolsVisible && node.dataset.panelButton === state.panel);
  });
  app.querySelectorAll('[data-panel]').forEach(node => {
    node.inert = !toolsVisible || node.dataset.panel !== state.panel;
  });
  app.querySelectorAll('[data-count]').forEach(node => node.value = state[node.dataset.count] + ' 格');
  app.querySelectorAll('[data-axis]').forEach(node => {
    const next = state[node.dataset.axis] + Number(node.dataset.step);
    node.disabled = !ready || removing || next < 1 || next > 12;
  });
  app.querySelectorAll('[data-range]').forEach(node => {
    node.value = state[node.dataset.range];
    node.disabled = !ready || removing;
    node.style.setProperty('--fill', (node.valueAsNumber - Number(node.min)) * 100 / (Number(node.max) - Number(node.min)) + '%');
  });
  app.querySelectorAll('[data-value]').forEach(node => {
    node.value = Number(state[node.dataset.value].toFixed(2)) + '%';
  });
  app.querySelector('[data-action=original]').setAttribute('aria-pressed', state.original);
  app.querySelectorAll('[data-action=open]').forEach(node => node.disabled = importing || removing);
  app.querySelectorAll('[data-action=original], [data-action=reset]').forEach(node => node.disabled = !ready || removing);
  app.querySelector('[data-action=reset]').inert = !toolsVisible || state.panel !== 'grid';
  const collapse = app.querySelector('[data-action=collapse]');
  collapse.hidden = !phone.matches;
  collapse.inert = !mobileToolsOpen;
  app.querySelector('[data-action=remove]').disabled = importing || removing || !selectedID;
  const exportAction = app.querySelector('[data-action=export]');
  const comparing = Boolean(state.original || state.brush);
  exportAction.disabled = !ready || importing || removing || state.maskStatus === 'preparing';
  exportAction.classList.toggle('primary', !showingSample);
  exportAction.querySelector('[data-export-label]').textContent =
    comparing ? '查看成品' : showingSample ? '导出示例' : '导出成品';
  app.querySelectorAll('[data-action=add], [data-action=erase]').forEach(node => node.setAttribute('aria-pressed', state.brush === node.dataset.action));
  app.querySelectorAll('[data-action=undo]').forEach(node => node.disabled = removing || !undoStack.length);
  app.querySelectorAll('[data-brush-tools]').forEach(node => node.inert = !state.brush);
  app.querySelectorAll('[data-image=result]').forEach(node => {
    const editing = Boolean(state.brush);
    node.dataset.edit = editing;
    node.tabIndex = editing ? 0 : -1;
    node.setAttribute('role', editing ? 'application' : 'img');
    node.setAttribute('aria-label', editing ? '人物蒙版编辑画布' : '照片预览');
    if (editing) node.setAttribute('aria-describedby', 'mask-keys');
    else node.removeAttribute('aria-describedby');
    syncBrushPosition();
  });
  queueRender();
}
function exportImage() {
  if (!photo.dataset.ready) return;
  if (state.original || state.brush || comparePointer?.held) {
    setPanel('grid');
    return;
  }
  const name = state.filename.replace(/\.[^.]+$/, '') + ' · 破框.png';
  composite();
  result.toBlob(blob => {
    if (!blob) return showStatus('无法生成 PNG');
    downloadBlob(blob, name);
    showStatus('已生成 PNG');
  });
}
const actions = {
  open: () => fileInput.click(),
  tutorial: () => guide.showModal(),
  toggleHistory: () => {
    historyOpen = !historyOpen;
    if (historyOpen && phone.matches) refreshHistory({showSelected: true});
  },
  collapse: () => {
    stage.querySelector('[data-panel-button=' + state.panel + ']').focus({preventScroll: true});
    setPanel('grid');
    mobileToolsOpen = false;
  },
  share: openShare,
  remove: deleteSelected,
  restore: restoreRemoved,
  focusMask: () => {
    const canvas = stage.querySelector('[data-image]');
    canvas.focus({preventScroll: true, focusVisible: true});
    syncBrushPosition(true);
  },
  export: exportImage,
  original: () => {
    const original = !state.original;
    setPanel('grid');
    state.original = original;
  },
  finish: () => {
    stage.querySelector('[data-panel-button=grid]').focus({preventScroll: true});
    setPanel('grid');
  },
  add: () => { finishStroke(); state.brush = 'add'; },
  erase: () => { finishStroke(); state.brush = 'erase'; },
  undo: () => {
    finishStroke();
    const snapshot = undoStack.pop();
    if (snapshot) {
      mask.getContext('2d').putImageData(snapshot, 0, 0);
      commitMask();
    }
  },
  reset: () => {
    setPanel('grid');
    Object.assign(state, defaults);
    saveSettings();
  },
};
stage.addEventListener('click', event => {
  const pressed = event.target.closest('[data-action], [data-axis], [data-panel-button], [data-photo], [data-history-step]');
  if (!pressed) return;
  const {action, axis, step, panelButton, historyStep, photo: id} = pressed.dataset;
  if (action) {
    if (moreMenu.contains(pressed)) closeMoreMenu(true);
    actions[action]();
  }
  if (historyStep) {
    historyPage += Number(historyStep);
    refreshHistory();
  }
  if (id) {
    historyOpen = false;
    stage.querySelector('.more-button').focus({preventScroll: true});
    if (id !== selectedID) openPhoto(id);
  }
  if (panelButton) {
    if (phone.matches && mobileToolsOpen && state.panel === panelButton) {
      actions.collapse();
    } else {
      setPanel(panelButton);
      mobileToolsOpen = true;
    }
  }
  if (axis) {
    setPanel('grid');
    state[axis] += Number(step);
    saveSettings();
  }
  sync();
});
stage.addEventListener('input', event => {
  const key = event.target.dataset.range;
  if (!key) return;
  state.original = false;
  state[key] = Number(event.target.value);
  sync();
});
stage.addEventListener('change', event => {
  if (event.target.dataset.range) saveSettings();
});
guideImport.addEventListener('click', () => {
  guide.close();
  fileInput.click();
});
fileInput.addEventListener('change', async () => {
  const files = Array.from(fileInput.files);
  fileInput.value = '';
  if (!files.length || importing) return;
  importing = true;
  importProgress = {current: 1, total: files.length};
  sync();
  await catalog;
  let failed = 0;
  let persisted = true;
  let first;
  const stamp = Date.now();
  for (const [index, file] of files.entries()) {
    importProgress.current = index + 1;
    sync();
    try {
      const image = await loadBlob(file);
      const id = crypto.randomUUID();
      const entry = {id, name: file.name, createdAt: stamp + files.length - index, thumbnail: await thumbnailFor(image), settings: {...defaults}};
      persisted = await addPhoto(entry, file) && persisted;
      entries.set(id, entry);
      first ??= id;
    } catch {
      failed++;
    }
  }
  importing = false;
  importProgress = undefined;
  if (first) historyPage = 0;
  refreshHistory();
  if (first) {
    openPhoto(first, true);
    stage.querySelector('[data-filmstrip]').scrollLeft = 0;
  } else if (!selectedID && !showingSample) openSample();
  else sync();
  if (failed) showStatus(failed + ' 张照片打不开，请尝试 JPG、PNG 或 WebP');
  if (!persisted) warnStorage(false);
});
function endComparison() {
  if (!comparePointer) return;
  clearTimeout(comparePointer.timer);
  comparePointer = undefined;
  queueRender();
}
function startComparison(event, canvas) {
  if (comparePointer || !event.isPrimary || state.original || !photo.dataset.ready ||
    state.maskStatus === 'preparing') return;
  canvas.setPointerCapture(event.pointerId);
  const pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, held: false};
  pointer.timer = setTimeout(() => {
    pointer.held = true;
    queueRender();
  }, 260);
  comparePointer = pointer;
}
function point(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * mask.width / rect.width,
    y: (event.clientY - rect.top) * mask.height / rect.height,
  };
}
function paint(start, end) {
  const ctx = mask.getContext('2d');
  const size = Math.min(mask.width, mask.height) * .038;
  ctx.save();
  if (state.brush === 'erase') ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineWidth = size;
  ctx.beginPath();
  ctx.arc(end.x, end.y, size / 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.restore();
}
function rememberStroke() {
  undoStack.push(mask.getContext('2d').getImageData(0, 0, mask.width, mask.height));
  if (undoStack.length > 8) undoStack.shift();
}
stage.addEventListener('keydown', event => {
  if (!state.brush || removing || activePointer || event.target.dataset.image !== 'result') return;
  const directions = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]};
  const direction = directions[event.key];
  if (direction) {
    event.preventDefault();
    const step = event.shiftKey ? .06 : .018;
    const [dx, dy] = direction;
    brushPosition.x = Math.max(.018, Math.min(.982, brushPosition.x + dx * step));
    brushPosition.y = Math.max(.018, Math.min(.982, brushPosition.y + dy * step));
    syncBrushPosition(true);
    return;
  }
  if (event.code !== 'Space') return;
  event.preventDefault();
  if (event.repeat) return;
  const spot = {x: brushPosition.x * mask.width, y: brushPosition.y * mask.height};
  rememberStroke();
  paint(spot, spot);
  commitMask();
  sync();
});
stage.addEventListener('pointerdown', event => {
  const canvas = event.target;
  if (removing || canvas.dataset.image !== 'result' || event.button !== 0 || activePointer) return;
  if (!state.brush) return startComparison(event, canvas);
  event.preventDefault();
  const start = point(event, canvas);
  activePointer = {id: event.pointerId, canvas, last: start};
  canvas.setPointerCapture(event.pointerId);
  rememberStroke();
  paint(start, start);
  sync();
});
stage.addEventListener('pointermove', event => {
  if (comparePointer?.id === event.pointerId &&
    Math.hypot(event.clientX - comparePointer.x, event.clientY - comparePointer.y) > 10) endComparison();
  const drag = activePointer;
  if (!drag || drag.id !== event.pointerId || !state.brush) return;
  const end = point(event, drag.canvas);
  paint(drag.last, end);
  drag.last = end;
  queueRender();
});
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => {
  stage.addEventListener(type, event => {
    if (activePointer?.id === event.pointerId) finishStroke();
    if (comparePointer?.id === event.pointerId) endComparison();
  });
});

function updateLayout() {
  stage.firstElementChild.classList.toggle('mobile', phone.matches);
  refreshHistory({showSelected: true});
  sync();
}
stage.innerHTML = editor();
const moreMenu = stage.querySelector('#editor-more');
const moreTrigger = stage.querySelector('.more-button');
const nativePopover = typeof moreMenu.showPopover === 'function';

function closeMoreMenu(returnFocus = false) {
  if (nativePopover) {
    if (moreMenu.matches(':popover-open')) moreMenu.hidePopover();
  } else {
    moreMenu.hidden = true;
    moreTrigger.setAttribute('aria-expanded', 'false');
  }
  if (returnFocus) moreTrigger.focus({preventScroll: true});
}

if (!nativePopover) {
  moreMenu.hidden = true;
  moreMenu.removeAttribute('popover');
  moreTrigger.setAttribute('aria-expanded', 'false');
  moreTrigger.addEventListener('click', () => {
    moreMenu.hidden = !moreMenu.hidden;
    moreTrigger.setAttribute('aria-expanded', String(!moreMenu.hidden));
  });
  document.addEventListener('pointerdown', event => {
    if (!moreMenu.hidden && !moreMenu.contains(event.target) && !moreTrigger.contains(event.target)) closeMoreMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !moreMenu.hidden) closeMoreMenu(true);
  });
}
phone.addEventListener('change', updateLayout);
updateLayout();
const catalog = listPhotos().then(photos => {
  for (const entry of photos) {
    if (entry.removedAt) scheduleRemoval(entry);
    else entries.set(entry.id, entry);
  }
  refreshHistory();
  let last;
  try { last = localStorage.getItem(lastPhotoKey); } catch { /* Use the latest photo. */ }
  const id = entries.has(last) ? last : stage.querySelector('[data-photo]')?.dataset.photo;
  if (importing) return sync();
  if (id) openPhoto(id);
  else openSample();
});
