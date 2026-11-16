import {estimatePortrait} from './segment.js';
import {addPhoto, listPhotos, readFile, readMask, removePhoto, saveMask, savePhoto} from './history.js';
import {downloadBlob} from './download.js';
import {openShare} from './share.js';
import {clamp, cropDefaults, cropRect, dimensions, orientedCenter, ratios, resizeCrop, sourcePoint} from './geometry.js';
import {drawGrid, gridModes} from './grid.js';
import {adjustTone, drawCrop, drawOriented, resizeCanvas} from './picture.js';

const icons = {
  logo: '<path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/><path d="m14 13 5-5" stroke-width="3"/>',
  share: '<path d="M12 16V3m-4 4 4-4 4 4M5 11H3v10h18V11h-2"/>',
  folder: '<path d="M3 19V5h6l2 2h10v12z"/>',
  save: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
  eye: '<path d="M2 12c4-7 16-7 20 0-4 7-16 7-20 0Z"/><circle cx="12" cy="12" r="2.5"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  crop: '<path d="M7 2v15h15M2 7h15v15"/>',
  rotateLeft: '<path d="M3 4v6h6M3.5 10a8.5 8.5 0 1 1 1 7"/>',
  rotateRight: '<path d="M21 4v6h-6m5.5 0a8.5 8.5 0 1 0-1 7"/>',
  mirror: '<path d="M12 3v18M9 5 3 18h6zm6 0 6 13h-6z"/>',
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
function header() {
  return '<header class="app-head"><div class="brand"><div class="mark">' + icon('logo') + '</div><h1>破框</h1></div>' +
    '<div class="head-actions">' + button('open', '打开照片', 'folder') + button('share', '分享工具', 'share', 'icon-only share-button') + button('export', '导出 PNG', 'save', 'primary') + '</div></header>';
}
function options(values, key, label) {
  return '<div class="option-row" role="group" aria-label="' + label + '">' +
    Object.entries(values).map(([value, text]) => '<button type="button" class="btn" data-' + key +
      '="' + value + '">' + text + '</button>').join('') + '</div>';
}
function stepper(axis, label) {
  return '<div class="layout-row"><span class="control-label">' + label + '</span><div class="stepper" role="group" aria-label="' + label + '格数">' +
    '<button type="button" data-axis="' + axis + '" data-step="-1" aria-label="减少' + label + '格数">−</button>' +
    '<output data-count="' + axis + '" aria-live="polite"></output>' +
    '<button type="button" data-axis="' + axis + '" data-step="1" aria-label="增加' + label + '格数">+</button></div></div>';
}
function field(key, label, min, max, step) {
  return '<div class="field"><div class="range-label"><label for="' + key + '">' + label +
    '</label><output data-value="' + key + '" for="' + key + '"></output></div>' +
    '<input data-range="' + key + '" id="' + key + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '"></div>';
}
const widthControl = () => field('width', '线宽', .3, 4, .1);
const insetControl = () => field('inset', '外框内缩', 1, 18, .5);
const cropHandles = {nw: '左上', ne: '右上', sw: '左下', se: '右下', n: '上边', s: '下边', w: '左边', e: '右边'};
function cropOverlay() {
  return '<div class="crop-overlay" data-crop-overlay hidden><div class="crop-box" data-handle="move" tabindex="0" aria-label="裁切框，方向键移动">' +
    Object.entries(cropHandles).map(([key, label]) =>
      '<button type="button" class="crop-handle" data-handle="' + key + '" aria-label="调整裁切框' + label + '"></button>'
    ).join('') + '</div></div>';
}
const fileName = () => '<div class="filename">' + icon('folder') + '<span data-filename></span></div>';
function brushTools() {
  return button('add', '保留', null) + button('erase', '擦除', null) +
    button('undo', '撤销', 'reset', 'icon-only') + button('finish', '完成', null, 'primary');
}
function preview() {
  return '<section class="workstage" aria-label="照片预览"><div class="worktop" data-worktop hidden>' + fileName() +
    button('original', '原图', 'eye') + '</div>' +
    '<div class="main-image"><div class="image-wrap" data-photo-wrap hidden><canvas data-image="result" role="img" aria-label="照片预览"></canvas>' + cropOverlay() + '</div>' +
    '<div class="empty-photo" data-empty>' + icon('folder') + button('open', '打开照片', null, 'primary') +
    '<span class="subtle">可一次选择多张</span></div></div>' +
    '<section class="history" aria-label="编辑历史" data-history hidden><div class="history-head">' +
    '<h2>历史</h2>' + button('remove', '移除当前照片', null, 'text') + '</div><div class="filmstrip" data-filmstrip></div></section></section>';
}
function footer() {
  return '<footer class="editor-footer subtle"><span><span class="dot"></span>照片在本机处理</span>' +
    '<a href="https://github.com/holynova/photo-breakout">GitHub</a><span class="numbers">' + stage.dataset.version + '</span></footer>';
}
function subject() {
  return '<div class="subject-card"><span class="subject-icon">' + icon('person') + '</span>' +
    '<strong>人物蒙版</strong><span class="subtle" role="status" data-mask-status></span></div>';
}
const tools = {grid: ['网格', 'grid'], compose: ['构图', 'crop'], mask: ['蒙版', 'brush']};
function gridTools() {
  return options(gridModes, 'grid-mode', '网格样式') +
    '<div class="layout-controls" data-grid-group="rect perspective">' + stepper('rows', '横向') + stepper('columns', '纵向') + '</div>' +
    '<div class="layout-controls" data-grid-group="diagonal diamond" hidden>' + stepper('bands', '斜向') + '</div>' +
    '<div data-grid-group="diagonal" hidden>' + field('angle', '斜线角度', -75, 75, 1) + '</div>' +
    '<div data-grid-group="perspective" hidden>' + field('vanishing', '消失点位置', 10, 90, 1) + '</div>' +
    '<div class="tool-sliders">' + widthControl() + insetControl() + '</div>';
}
function compositionTools() {
  return '<div class="layout-controls">' + options(ratios, 'ratio', '裁切比例') +
    '<div class="compose-actions"><div class="option-row" role="group" aria-label="方向">' +
    button('rotateLeft', '向左旋转 90°', 'rotateLeft', 'icon-only') +
    button('rotateRight', '向右旋转 90°', 'rotateRight', 'icon-only') +
    button('mirror', '水平镜像', 'mirror', 'icon-only') + '</div>' +
    button('editFree', '调整裁切框', null) + button('applyFree', '应用裁切', null, 'primary') + '</div>' +
    field('zoom', '缩放', 100, 400, 1) +
    '<div class="tool-sliders">' + field('brightness', '亮度', -60, 60, 1) +
    field('contrast', '对比度', -60, 60, 1) + '</div>' +
    '<p class="subtle compose-hint" data-compose-hint>拖动照片调整位置 · 双指缩放</p></div>';
}
function editor() {
  return '<div class="app work">' + header() + '<main class="workbody">' + preview() +
    '<aside class="inspector" aria-label="调整面板">' +
    '<div class="tool-head"><div class="tool-switch" role="group" aria-label="编辑工具">' +
    Object.entries(tools).map(([key, [label, symbol]]) =>
      '<button type="button" data-panel-button="' + key + '" aria-controls="tool-' + key + '">' + icon(symbol) + label + '</button>'
    ).join('') + '</div>' + button('reset', '重置', 'reset', 'text') + '</div>' +
    '<div id="tool-grid" class="tool-panel" data-panel="grid">' + gridTools() + '</div>' +
    '<div id="tool-compose" class="tool-panel" data-panel="compose" hidden>' + compositionTools() + '</div>' +
    '<div id="tool-mask" class="tool-panel" data-panel="mask" hidden>' + subject() +
    '<div class="mobile-brush" data-brush-tools hidden>' + brushTools() + '</div>' +
    '<p class="subtle mask-instruction" data-brush-tools hidden>在照片上涂抹，标记挡住白线的区域。</p></div>' +
    footer() + '</aside></main></div>';
}

const stage = document.getElementById('stage');
const phone = matchMedia('(max-width: 700px)');
const gridDefaults = {
  rows: 3, columns: 3, bands: 5, width: 1.4, inset: 6, gridMode: 'rect', angle: 30, vanishing: 50,
};
const compositionDefaults = {...cropDefaults, brightness: 0, contrast: 0};
const defaults = {...gridDefaults, ...compositionDefaults};
const state = {...defaults, original: false, brush: null, panel: 'grid', maskStatus: 'empty', filename: ''};
const photo = document.createElement('canvas');
const mask = document.createElement('canvas');
const orientedPhoto = document.createElement('canvas');
const orientedMask = document.createElement('canvas');
const maskView = document.createElement('canvas');
const foreground = document.createElement('canvas');
const lines = document.createElement('canvas');
const result = document.createElement('canvas');
const undoStack = [];
const statusBar = document.getElementById('status');
const fileInput = document.getElementById('local-file');
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
const lastPhotoKey = 'photo-breakout-active-photo';
let selectedID;
let photoRevision = 0;
let statusTimer;
let drawFrame;
let activePointer;
let freeEditing = false;
let pictureKey;
let maskKey;
let maskRevision = 0;
const cropPointers = new Map();
let cropGesture;
let importing = false;
let removing = false;
let warnedStorage = false;

async function loadBlob(blob) {
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.src = url;
  try {
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}
function setPhoto(image) {
  const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
  const w = Math.max(1, Math.round(image.naturalWidth * scale));
  const h = Math.max(1, Math.round(image.naturalHeight * scale));
  resizeCanvas(photo, w, h);
  photo.getContext('2d').clearRect(0, 0, w, h);
  const maskScale = Math.min(1, 1024 / Math.max(w, h));
  resizeCanvas(mask, Math.max(1, Math.round(w * maskScale)), Math.max(1, Math.round(h * maskScale)));
  mask.getContext('2d').clearRect(0, 0, mask.width, mask.height);
  maskRevision++;
  photo.getContext('2d').drawImage(image, 0, 0, w, h);
  photo.dataset.ready = 'true';
  undoStack.length = 0;
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
  maskRevision++;
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
  entry.settings = Object.fromEntries(Object.keys(defaults).map(key => [key, state[key]]));
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
  finishStroke();
  endCropGesture();
  freeEditing = false;
  state.panel = panel;
  state.original = false;
  state.brush = panel === 'mask' && photo.dataset.ready && state.maskStatus !== 'preparing' ? 'add' : null;
}
async function openPhoto(id, showMask = false) {
  const entry = entries.get(id);
  if (!entry) return;
  finishStroke();
  endCropGesture();
  const revision = ++photoRevision;
  selectedID = id;
  rememberPhoto(id);
  delete photo.dataset.ready;
  Object.assign(state, defaults, entry.settings, {filename: entry.name, maskStatus: 'preparing'});
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
function thumbnailFor(image) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const size = Math.min(image.naturalWidth, image.naturalHeight);
  canvas.getContext('2d').drawImage(image, (image.naturalWidth-size)/2, (image.naturalHeight-size)/2, size, size, 0, 0, 128, 128);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .79));
}
function refreshHistory() {
  const strip = stage.querySelector('[data-filmstrip]');
  if (!strip) return;
  const scroll = strip.scrollLeft;
  const items = [...entries.values()].sort((a,b) => b.createdAt - a.createdAt).map(entry => {
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
async function deleteSelected() {
  if (importing || removing || !selectedID) return;
  finishStroke();
  endCropGesture();
  removing = true;
  const id = selectedID;
  ++photoRevision;
  sync();
  await Promise.all([pendingMasks.get(id), pendingSettings.get(id)]);
  const removed = await removePhoto(id);
  removing = false;
  if (!removed) {
    showStatus('无法移除此照片，请重试');
    return openPhoto(id);
  }
  entries.delete(id);
  if (thumbnailUrls.has(id)) URL.revokeObjectURL(thumbnailUrls.get(id));
  thumbnailUrls.delete(id);
  refreshHistory();
  const next = stage.querySelector('[data-photo]')?.dataset.photo;
  if (next) return openPhoto(next);
  selectedID = undefined;
  rememberPhoto();
  delete photo.dataset.ready;
  Object.assign(state, defaults, {filename: '', maskStatus: 'empty'});
  setPanel('grid');
  sync();
}
function layout() {
  const {width, height} = dimensions(photo.width, photo.height, state.rotation);
  return {width, height, crop: cropRect(width, height, state)};
}
function refreshPicture() {
  const key = [photoRevision, state.rotation, state.mirrored, state.brightness, state.contrast].join();
  if (pictureKey === key) return;
  drawOriented(orientedPhoto, photo, state);
  adjustTone(orientedPhoto.getContext('2d'), state.brightness, state.contrast);
  pictureKey = key;
}
function refreshMask() {
  const key = [maskRevision, state.rotation, state.mirrored].join();
  if (maskKey === key) return;
  drawOriented(orientedMask, mask, state);
  maskKey = key;
}
function composite(view) {
  refreshPicture();
  refreshMask();
  const width = Math.max(1, Math.round(view.crop.w));
  const height = Math.max(1, Math.round(view.crop.h));
  for (const canvas of [result, lines, foreground]) resizeCanvas(canvas, width, height);
  const pad = Math.min(width, height) * state.inset / 100;
  const box = {x: pad, y: pad, w: width - pad * 2, h: height - pad * 2};
  const out = result.getContext('2d');
  const grid = lines.getContext('2d');
  const front = foreground.getContext('2d');

  grid.clearRect(0, 0, width, height);
  drawGrid(grid, box, state);
  grid.globalCompositeOperation = 'destination-out';
  drawCrop(grid, orientedMask, view.crop, view.width, view.height);
  grid.globalCompositeOperation = 'source-over';

  front.clearRect(0, 0, width, height);
  drawCrop(front, orientedPhoto, view.crop, view.width, view.height);
  front.globalCompositeOperation = 'destination-in';
  drawCrop(front, orientedMask, view.crop, view.width, view.height);
  front.globalCompositeOperation = 'source-over';

  out.fillStyle = '#fff';
  out.fillRect(0, 0, width, height);
  out.drawImage(foreground, 0, 0);
  out.save();
  out.beginPath();
  out.rect(box.x, box.y, box.w, box.h);
  out.clip();
  drawCrop(out, orientedPhoto, view.crop, view.width, view.height);
  out.restore();
  out.drawImage(lines, 0, 0);
}
function render() {
  if (!photo.dataset.ready) return;
  const canvas = stage.querySelector('[data-image]');
  const ctx = canvas.getContext('2d');
  if (state.original) {
    resizeCanvas(canvas, photo.width, photo.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(photo, 0, 0);
    return;
  }

  const view = layout();
  refreshPicture();
  if (freeEditing) {
    resizeCanvas(canvas, view.width, view.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(orientedPhoto, 0, 0);
    return;
  }

  resizeCanvas(canvas, Math.max(1, Math.round(view.crop.w)), Math.max(1, Math.round(view.crop.h)));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!state.brush && state.maskStatus !== 'preparing') {
    composite(view);
    ctx.drawImage(result, 0, 0);
    return;
  }

  drawCrop(ctx, orientedPhoto, view.crop, view.width, view.height);
  if (!state.brush) return;
  refreshMask();
  resizeCanvas(maskView, canvas.width, canvas.height);
  const visual = maskView.getContext('2d');
  visual.clearRect(0, 0, maskView.width, maskView.height);
  drawCrop(visual, orientedMask, view.crop, view.width, view.height);
  visual.globalCompositeOperation = 'source-in';
  visual.fillStyle = 'rgba(119, 245, 157, .42)';
  visual.fillRect(0, 0, maskView.width, maskView.height);
  visual.globalCompositeOperation = 'source-over';
  ctx.drawImage(maskView, 0, 0);
}
function queueRender() {
  if (drawFrame) return;
  drawFrame = requestAnimationFrame(() => {
    drawFrame = undefined;
    render();
  });
}
function sync() {
  const app = stage.querySelector('.app');
  if (!app) return;
  const ready = Boolean(photo.dataset.ready);
  const view = layout();
  const aspect = state.original ? photo.width / photo.height
    : freeEditing ? view.width / view.height : view.crop.w / view.crop.h;
  app.style.setProperty('--photo-ratio', ready ? aspect : 1);
  app.dataset.panelView = state.panel;
  const overlay = app.querySelector('[data-crop-overlay]');
  overlay.hidden = !ready || !freeEditing || removing;
  if (!overlay.hidden) {
    const box = overlay.firstElementChild;
    box.style.setProperty('--left', view.crop.x * 100 / view.width + '%');
    box.style.setProperty('--top', view.crop.y * 100 / view.height + '%');
    box.style.setProperty('--width', view.crop.w * 100 / view.width + '%');
    box.style.setProperty('--height', view.crop.h * 100 / view.height + '%');
  }
  app.querySelector('[data-worktop]').hidden = !selectedID;
  app.querySelector('[data-photo-wrap]').hidden = !ready;
  app.querySelector('[data-empty]').hidden = ready || !!selectedID;
  app.querySelector('[data-history]').hidden = entries.size === 0;
  app.querySelectorAll('[data-photo]').forEach(node => {
    node.disabled = removing;
    node.setAttribute('aria-pressed', node.dataset.photo === selectedID);
  });
  app.querySelectorAll('[data-filename]').forEach(node => node.textContent = state.filename);
  app.querySelectorAll('[data-mask-status]').forEach(node => node.textContent = maskStatusText[state.maskStatus]);
  app.querySelectorAll('[data-panel-button]').forEach(node => node.setAttribute('aria-pressed', node.dataset.panelButton === state.panel));
  app.querySelectorAll('[data-panel]').forEach(node => node.hidden = node.dataset.panel !== state.panel);
  app.querySelectorAll('[data-grid-group]').forEach(node => node.hidden = !node.dataset.gridGroup.split(' ').includes(state.gridMode));
  app.querySelectorAll('[data-grid-mode], [data-ratio]').forEach(node => {
    const {gridMode, ratio} = node.dataset;
    node.disabled = !ready || removing;
    node.setAttribute('aria-pressed', gridMode ? gridMode === state.gridMode : ratio === state.cropMode);
  });
  app.querySelectorAll('[data-count]').forEach(node => node.value = state[node.dataset.count] + ' 格');
  app.querySelectorAll('[data-axis]').forEach(node => {
    const next = state[node.dataset.axis] + Number(node.dataset.step);
    node.disabled = !ready || removing || next < 1 || next > 12;
  });
  app.querySelectorAll('[data-range]').forEach(node => {
    node.value = state[node.dataset.range];
    node.disabled = !ready || removing || (node.dataset.range === 'zoom' && freeEditing);
    node.style.setProperty('--fill', (node.valueAsNumber - Number(node.min)) * 100 / (Number(node.max) - Number(node.min)) + '%');
  });
  app.querySelectorAll('[data-value]').forEach(node => {
    const key = node.dataset.value;
    const value = Number(state[key].toFixed(2));
    const prefix = ['brightness', 'contrast'].includes(key) && value > 0 ? '+' : '';
    node.value = prefix + value + (key === 'angle' ? '°' : '%');
  });
  app.querySelector('[data-action=original]').setAttribute('aria-pressed', state.original);
  app.querySelectorAll('[data-action=open]').forEach(node => node.disabled = importing || removing);
  app.querySelectorAll('[data-action=original], [data-action=reset], [data-action=mirror], [data-action=rotateLeft], [data-action=rotateRight], [data-action=editFree]').forEach(node => node.disabled = !ready || removing);
  app.querySelector('[data-action=reset]').hidden = state.panel === 'mask';
  app.querySelector('[data-action=remove]').disabled = importing || removing || !selectedID;
  app.querySelector('[data-action=export]').disabled = !ready || removing || state.maskStatus === 'preparing';
  app.querySelector('[data-action=mirror]').setAttribute('aria-pressed', state.mirrored);
  app.querySelector('[data-action=editFree]').hidden = state.cropMode !== 'free' || freeEditing;
  app.querySelector('[data-action=applyFree]').hidden = !freeEditing;
  app.querySelector('[data-compose-hint]').textContent = freeEditing ? '拖动裁切框的边或角来调整范围'
    : phone.matches ? '拖动照片调整位置 · 双指缩放' : '拖动照片调整位置';
  app.querySelectorAll('[data-action=add], [data-action=erase]').forEach(node => node.setAttribute('aria-pressed', state.brush === node.dataset.action));
  app.querySelectorAll('[data-action=undo]').forEach(node => node.disabled = removing || !undoStack.length);
  app.querySelectorAll('[data-brush-tools]').forEach(node => node.hidden = !state.brush);
  app.querySelectorAll('[data-image=result]').forEach(node => {
    node.dataset.edit = Boolean(state.brush);
    const canPan = ready && state.panel === 'compose' && !freeEditing && !removing;
    node.dataset.pan = canPan;
    node.tabIndex = canPan ? 0 : -1;
    node.setAttribute('aria-label', state.brush ? '照片和已选中的人物蒙版' : '照片预览');
  });
  queueRender();
}
function exportImage() {
  if (!photo.dataset.ready) return;
  const name = state.filename.replace(/\.[^.]+$/, '') + ' · 破框.png';
  composite(layout());
  result.toBlob(blob => {
    if (!blob) return showStatus('无法生成 PNG');
    downloadBlob(blob, name);
    showStatus('已生成 PNG');
  });
}
const actions = {
  open: () => fileInput.click(),
  share: openShare,
  remove: deleteSelected,
  export: exportImage,
  original: () => {
    const original = !state.original;
    setPanel('grid');
    state.original = original;
  },
  rotateLeft: () => rotate(false),
  rotateRight: () => rotate(true),
  mirror: () => {
    endCropGesture();
    const view = layout();
    state.cropX = 1 - (view.crop.x + view.crop.w / 2) / view.width;
    state.mirrored = !state.mirrored;
    saveSettings();
  },
  editFree: () => beginFree(),
  applyFree: () => {
    endCropGesture();
    freeEditing = false;
    saveSettings();
  },
  finish: () => setPanel('grid'),
  add: () => { finishStroke(); state.brush = 'add'; },
  erase: () => { finishStroke(); state.brush = 'erase'; },
  undo: () => {
    finishStroke();
    const snapshot = undoStack.pop();
    if (snapshot) {
      mask.getContext('2d').putImageData(snapshot, 0, 0);
      maskRevision++;
      commitMask();
    }
  },
  reset: () => {
    setPanel(state.panel);
    Object.assign(state, state.panel === 'compose' ? compositionDefaults : gridDefaults);
    saveSettings();
  },
};
stage.addEventListener('click', event => {
  const pressed = event.target.closest('[data-action], [data-axis], [data-panel-button], [data-photo], [data-grid-mode], [data-ratio]');
  if (!pressed) return;
  const {action, axis, step, panelButton, gridMode, ratio, photo: id} = pressed.dataset;
  if (action) actions[action]();
  if (id && id !== selectedID) openPhoto(id);
  if (panelButton) setPanel(panelButton);
  if (gridMode) {
    state.original = false;
    state.gridMode = gridMode;
    saveSettings();
  }
  if (ratio) {
    endCropGesture();
    state.cropMode = ratio;
    freeEditing = false;
    if (ratio === 'free') beginFree();
    else saveSettings();
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
  if (key === 'zoom') normalizeCropCenter();
  sync();
});
stage.addEventListener('change', event => {
  if (event.target.dataset.range) saveSettings();
});
fileInput.addEventListener('change', async () => {
  const files = Array.from(fileInput.files);
  fileInput.value = '';
  if (!files.length || importing) return;
  importing = true;
  sync();
  await catalog;
  let failed = 0;
  let persisted = true;
  let first;
  const stamp = Date.now();
  for (const [index, file] of files.entries()) {
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
  refreshHistory();
  if (first) {
    openPhoto(first, true);
    stage.querySelector('[data-filmstrip]').scrollLeft = 0;
  } else sync();
  if (failed) showStatus(failed + ' 张照片打不开，请尝试 JPG、PNG 或 WebP');
  if (!persisted) warnStorage(false);
});
function point(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height,
  };
}
function maskPoint(event, canvas) {
  const pointOnCanvas = point(event, canvas);
  const view = layout();
  const x = (view.crop.x + pointOnCanvas.x * view.crop.w) / view.width;
  const y = (view.crop.y + pointOnCanvas.y * view.crop.h) / view.height;
  const unrotated = sourcePoint(x, y, state.rotation, state.mirrored);
  return {x: unrotated.x * mask.width, y: unrotated.y * mask.height};
}
function setCropCenter(x, y, view) {
  state.cropX = x / view.width;
  state.cropY = y / view.height;
  normalizeCropCenter();
}
function normalizeCropCenter() {
  const {width, height, crop} = layout();
  state.cropX = (crop.x + crop.w / 2) / width;
  state.cropY = (crop.y + crop.h / 2) / height;
}
function setFreeRect(rect, view) {
  state.zoom = 100;
  state.freeWidth = rect.w / view.width;
  state.freeHeight = rect.h / view.height;
  setCropCenter(rect.x + rect.w / 2, rect.y + rect.h / 2, view);
}
function beginFree() {
  const view = layout();
  setFreeRect(view.crop, view);
  freeEditing = true;
  saveSettings();
}
function rotate(clockwise) {
  endCropGesture();
  normalizeCropCenter();
  const center = orientedCenter(state.cropX, state.cropY, clockwise);
  state.cropX = center.x;
  state.cropY = center.y;
  [state.freeWidth, state.freeHeight] = [state.freeHeight, state.freeWidth];
  const turn = clockwise !== state.mirrored ? 90 : 270;
  state.rotation = (state.rotation + turn) % 360;
  normalizeCropCenter();
  saveSettings();
}
function endCropGesture() {
  if (!cropGesture) return;
  cropPointers.clear();
  if (cropGesture.changed) saveSettings();
  cropGesture = undefined;
}
function gestureBaseline(canvas, handle, changed) {
  const points = [...cropPointers.values()];
  const center = points.length === 2 ? {
    x: (points[0].x + points[1].x) / 2,
    y: (points[0].y + points[1].y) / 2,
  } : points[0];
  const distance = points.length === 2 ? Math.hypot(
    points[0].clientX - points[1].clientX, points[0].clientY - points[1].clientY,
  ) : 0;
  return {canvas, handle, center, distance, view: layout(), zoom: state.zoom, changed};
}
function cropPointer(event, canvas) {
  return {...point(event, canvas), clientX: event.clientX, clientY: event.clientY};
}
stage.addEventListener('pointerdown', event => {
  if (removing || !photo.dataset.ready || state.panel !== 'compose' || event.button !== 0) return;
  const target = event.target.closest('[data-handle], [data-pan=true]');
  if (!target || cropPointers.size >= 2 || (freeEditing && cropPointers.size)) return;
  const canvas = stage.querySelector('[data-image]');
  cropPointers.set(event.pointerId, cropPointer(event, canvas));
  cropGesture = gestureBaseline(canvas, target.dataset.handle, cropGesture?.changed ?? false);
  target.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointermove', event => {
  if (!cropGesture || !cropPointers.has(event.pointerId)) return;
  const {canvas, handle, center, distance, view, zoom} = cropGesture;
  const {crop, width, height} = view;
  const current = cropPointer(event, canvas);
  cropPointers.set(event.pointerId, current);
  if (handle) {
    const resized = resizeCrop(crop, handle, (current.x - center.x) * width, (current.y - center.y) * height, width, height);
    setFreeRect(resized, view);
  } else if (distance > 0 && cropPointers.size === 2) {
    const update = gestureBaseline(canvas, undefined, true);
    state.zoom = Math.round(clamp(zoom * update.distance / distance, 100, 400));
    const next = layout().crop;
    const anchorX = crop.x + center.x * crop.w;
    const anchorY = crop.y + center.y * crop.h;
    setCropCenter(anchorX + (.5 - update.center.x) * next.w, anchorY + (.5 - update.center.y) * next.h, view);
  } else {
    setCropCenter(crop.x + (.5 + center.x - current.x) * crop.w, crop.y + (.5 + center.y - current.y) * crop.h, view);
  }
  cropGesture.changed = true;
  sync();
});
function releaseCropPointer(event) {
  if (!cropPointers.delete(event.pointerId) || !cropGesture) return;
  if (cropPointers.size) {
    const {canvas, handle, changed} = cropGesture;
    cropGesture = gestureBaseline(canvas, handle, changed);
  } else {
    endCropGesture();
  }
}
stage.addEventListener('keydown', event => {
  const target = event.target.closest('[data-handle], [data-pan=true]');
  if (!target) return;
  const directions = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]};
  const direction = directions[event.key];
  if (!direction) return;
  event.preventDefault();
  const view = layout();
  const step = event.shiftKey ? .05 : .01;
  const [dx, dy] = direction;
  if (target.dataset.handle) {
    setFreeRect(resizeCrop(view.crop, target.dataset.handle, dx * step * view.width, dy * step * view.height, view.width, view.height), view);
  } else {
    setCropCenter(view.crop.x + view.crop.w * (.5 + dx * step), view.crop.y + view.crop.h * (.5 + dy * step), view);
  }
  saveSettings();
  sync();
});

function paint(start, end) {
  const ctx = mask.getContext('2d');
  const {width, height, crop} = layout();
  const size = Math.min(mask.width, mask.height) * Math.min(crop.w, crop.h) / Math.min(width, height) * .038;
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
  maskRevision++;
}
stage.addEventListener('pointerdown', event => {
  const canvas = event.target;
  if (removing || !state.brush || canvas.dataset.image !== 'result' || event.button !== 0 || activePointer) return;
  const start = maskPoint(event, canvas);
  activePointer = {id: event.pointerId, canvas, last: start};
  canvas.setPointerCapture(event.pointerId);
  undoStack.push(mask.getContext('2d').getImageData(0, 0, mask.width, mask.height));
  if (undoStack.length > 8) undoStack.shift();
  paint(start, start);
  sync();
});
stage.addEventListener('pointermove', event => {
  const drag = activePointer;
  if (!drag || drag.id !== event.pointerId || !state.brush) return;
  const end = maskPoint(event, drag.canvas);
  paint(drag.last, end);
  drag.last = end;
  queueRender();
});
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => {
  stage.addEventListener(type, event => {
    if (activePointer?.id === event.pointerId) finishStroke();
    releaseCropPointer(event);
  });
});

function updateLayout() {
  stage.firstElementChild.classList.toggle('mobile', phone.matches);
  sync();
}
stage.innerHTML = editor();
phone.addEventListener('change', updateLayout);
updateLayout();
const catalog = listPhotos().then(photos => {
  for (const entry of photos) entries.set(entry.id, entry);
  refreshHistory();
  let last;
  try { last = localStorage.getItem(lastPhotoKey); } catch { /* Use the latest photo. */ }
  const id = entries.has(last) ? last : stage.querySelector('[data-photo]')?.dataset.photo;
  if (id && !importing) openPhoto(id);
  else sync();
});
