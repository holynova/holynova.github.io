import {estimatePortrait} from './segment.js';
import {addPhoto, listPhotos, readFile, readMask, removePhoto, saveMask, savePhoto} from './history.js';
import {downloadBlob} from './download.js';
import {openShare} from './share.js';

const icons = {
  logo: '<path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/><path d="m14 13 5-5" stroke-width="3"/>',
  share: '<path d="M12 16V3m-4 4 4-4 4 4M5 11H3v10h18V11h-2"/>',
  folder: '<path d="M3 19V5h6l2 2h10v12z"/>',
  save: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
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
function header() {
  return '<header class="app-head"><div class="brand"><div class="mark">' + icon('logo') + '</div><h1>破框</h1></div>' +
    '<div class="head-actions">' + button('open', '打开照片', 'folder') + button('share', '分享工具', 'share', 'icon-only share-button') + button('export', '导出 PNG', 'save', 'primary') + '</div></header>';
}
function layouts() {
  return '<div class="layout-controls">' + [['rows', '横向'], ['columns', '纵向']].map(([axis,label]) =>
    '<div class="layout-row"><span class="control-label">' + label + '</span><div class="stepper" role="group" aria-label="' + label + '格数">' +
    '<button type="button" data-axis="' + axis + '" data-step="-1" aria-label="减少' + label + '格数">−</button>' +
    '<output data-count="' + axis + '" aria-live="polite"></output>' +
    '<button type="button" data-axis="' + axis + '" data-step="1" aria-label="增加' + label + '格数">+</button></div></div>'
  ).join('') + '</div>';
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
    button('undo', '撤销', 'reset', 'icon-only') + button('finish', '完成', null, 'primary');
}
function preview(mobile) {
  return '<section class="workstage" aria-label="照片预览"><div class="worktop" data-worktop hidden>' + fileName() +
    button('original', mobile ? '原图' : '查看原图', 'eye') + '</div>' +
    '<div class="main-image"><div class="image-wrap" data-photo-wrap hidden><canvas data-image="result" role="img" aria-label="照片预览"></canvas></div>' +
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
function desktopEditor() {
  return '<div class="app work">' + header() + '<main class="workbody">' + preview(false) +
    '<aside class="inspector" aria-label="调整面板"><div class="inspector-title"><h2>调整</h2>' +
    button('reset', '重置', 'reset', 'text') + '</div>' +
    '<section aria-label="网格设置">' + layouts() + widthControl() + insetControl() + '</section>' +
    '<section aria-label="人物蒙版">' + subject() + button('refine', '查看蒙版', 'brush', 'refine') +
    '<div class="mobile-brush" data-brush-tools hidden>' + brushTools() + '</div></section>' +
    footer() + '</aside></main></div>';
}
function mobileEditor() {
  return '<div class="app work mobile">' + header() + '<main class="workbody">' + preview(true) +
    '<section class="mobile-tools" aria-label="调整面板">' +
    '<div class="tool-head"><div class="tool-switch" role="group" aria-label="编辑工具">' +
    '<button type="button" data-panel-button="grid" aria-controls="mobile-grid">' + icon('grid') + '网格</button>' +
    '<button type="button" data-panel-button="mask" aria-controls="mobile-mask">' + icon('brush') + '蒙版</button></div>' +
    button('reset', '重置', 'reset', 'text') + '</div>' +
    '<div id="mobile-grid" class="tool-panel" data-panel="grid">' + layouts() +
    '<div class="tool-sliders">' + widthControl() + insetControl() + '</div></div>' +
    '<div id="mobile-mask" class="tool-panel" data-panel="mask" hidden>' + subject() +
    '<div class="mobile-brush" data-brush-tools hidden>' + brushTools() + '</div>' +
    '<p class="subtle mask-instruction" data-brush-tools hidden>在照片上涂抹，标记挡住白线的区域。</p></div>' + footer() + '</section></main></div>';
}

const stage = document.getElementById('stage');
const phone = matchMedia('(max-width: 700px)');
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
  const showOriginal = state.original || state.brush || state.maskStatus === 'preparing';
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
function sync() {
  const app = stage.querySelector('.app');
  if (!app) return;
  const ready = Boolean(photo.dataset.ready);
  app.style.setProperty('--photo-ratio', ready ? photo.width / photo.height : 1);
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
  app.querySelectorAll('[data-value]').forEach(node => { node.value = Number(state[node.dataset.value].toFixed(2)) + '%'; });
  app.querySelector('[data-action=original]').setAttribute('aria-pressed', state.original);
  app.querySelectorAll('[data-action=open]').forEach(node => node.disabled = importing || removing);
  app.querySelectorAll('[data-action=original], [data-action=reset]').forEach(node => node.disabled = !ready || removing);
  app.querySelector('[data-action=remove]').disabled = importing || removing || !selectedID;
  app.querySelector('[data-action=export]').disabled = !ready || removing || state.maskStatus === 'preparing';
  app.querySelectorAll('.refine').forEach(node => {
    node.disabled = !ready || removing || state.maskStatus === 'preparing';
    node.hidden = !!state.brush;
  });
  app.querySelectorAll('[data-action=add], [data-action=erase]').forEach(node => node.setAttribute('aria-pressed', state.brush === node.dataset.action));
  app.querySelectorAll('[data-action=undo]').forEach(node => node.disabled = removing || !undoStack.length);
  app.querySelectorAll('[data-brush-tools]').forEach(node => node.hidden = !state.brush);
  app.querySelectorAll('[data-image=result]').forEach(node => {
    node.dataset.edit = Boolean(state.brush);
    node.setAttribute('aria-label', state.brush ? '照片和已选中的人物蒙版' : '照片预览');
  });
  queueRender();
}
function exportImage() {
  if (!photo.dataset.ready) return;
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
  share: openShare,
  remove: deleteSelected,
  export: exportImage,
  original: () => {
    const original = !state.original;
    setPanel('grid');
    state.original = original;
  },
  refine: () => setPanel('mask'),
  finish: () => setPanel('grid'),
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
  reset: () => { setPanel('grid'); Object.assign(state, defaults); saveSettings(); },
};
stage.addEventListener('click', event => {
  const pressed = event.target.closest('[data-action], [data-axis], [data-panel-button], [data-photo]');
  if (!pressed) return;
  const {action, axis, step, panelButton, photo: id} = pressed.dataset;
  if (action) actions[action]();
  if (id && id !== selectedID) openPhoto(id);
  if (panelButton) setPanel(panelButton);
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
  setPanel('grid');
  state[key] = Number(event.target.value);
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
stage.addEventListener('pointerdown', event => {
  const canvas = event.target;
  if (removing || !state.brush || canvas.dataset.image !== 'result' || event.button !== 0 || activePointer) return;
  const start = point(event, canvas);
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
  const end = point(event, drag.canvas);
  paint(drag.last, end);
  drag.last = end;
  queueRender();
});
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => {
  stage.addEventListener(type, event => {
    if (activePointer?.id === event.pointerId) finishStroke();
  });
});

function mount() {
  finishStroke();
  stage.innerHTML = phone.matches ? mobileEditor() : desktopEditor();
  refreshHistory();
  sync();
}
phone.addEventListener('change', mount);
mount();
const catalog = listPhotos().then(photos => {
  for (const entry of photos) entries.set(entry.id, entry);
  refreshHistory();
  let last;
  try { last = localStorage.getItem(lastPhotoKey); } catch { /* Use the latest photo. */ }
  const id = entries.has(last) ? last : stage.querySelector('[data-photo]')?.dataset.photo;
  if (id && !importing) openPhoto(id);
  else sync();
});
