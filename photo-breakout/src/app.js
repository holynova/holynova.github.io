import {estimatePortrait} from './segment.js';

const icons = {
  logo: '<path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/><path d="m14 13 5-5" stroke-width="3"/>',
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
    '<div class="head-actions">' + button('open', '打开照片', 'folder') + button('export', '导出 PNG', 'save', 'primary') + '</div></header>';
}
function layouts() {
  return '<div class="layout-controls">' +
    '<div class="layout-row"><span class="control-label">布局</span><div class="seg" role="group" aria-label="布局">' +
    '<button type="button" class="choice" data-mode="grid">网格</button>' +
    '<button type="button" class="choice" data-mode="stripes">竖格</button></div></div>' +
    '<div class="layout-row" data-layout="grid"><span class="control-label">格数</span><div class="seg" role="group" aria-label="网格行列数">' +
    [2,3,4].map(n => '<button type="button" class="choice" data-grid="' + n + '">' + n + ' × ' + n + '</button>').join('') +
    '</div></div>' +
    '<div class="layout-row" data-layout="stripes" hidden><span class="control-label">条数</span><div class="stepper" role="group" aria-label="竖格条数">' +
    '<button type="button" data-stripe-step="-1" aria-label="减少一条">−</button>' +
    '<output data-stripe-count aria-live="polite"></output>' +
    '<button type="button" data-stripe-step="1" aria-label="增加一条">+</button></div></div>' +
    '</div>';
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
    button('undo', '撤销', 'reset', 'icon-only') + button('refine', '完成', null, 'primary');
}
function imagePane(mobile) {
  return '<div class="image-wrap"><canvas data-image="result" role="img" aria-label="白色网格效果预览"></canvas>' +
    (mobile ? '' : '<div class="brush-bar" data-brush-tools hidden>' + brushTools() + '</div>') + '</div>';
}
function preview(mobile) {
  return '<section class="workstage" aria-label="照片预览"><div class="worktop">' + fileName() +
    button('original', mobile ? '原图' : '查看原图', 'eye') + '</div>' +
    '<div class="main-image">' + imagePane(mobile) + '</div>' +
    (mobile ? '' : '<div class="workfoot subtle"><span class="numbers" data-dims></span></div>') + '</section>';
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
    '<section aria-label="人物蒙版">' + subject() + button('refine', '修正蒙版', 'brush', 'refine') + '</section>' +
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
    button('refine', '修正蒙版', 'brush', 'refine') +
    '<div class="mobile-brush" data-brush-tools hidden>' + brushTools() + '</div>' +
    '<p class="subtle mask-instruction" data-brush-tools hidden>在照片上涂抹，标记挡住白线的区域。</p></div>' + footer() + '</section></main></div>';
}

const stage = document.getElementById('stage');
const phone = matchMedia('(max-width: 700px)');
const stripeBounds = {min: 2, max: 12};
const defaults = {mode: 'grid', grid: 3, stripes: 5, width: 1.4, inset: 6};
const state = {...defaults, original: false, brush: null, panel: 'grid', maskStatus: 'sample', filename: '雪山示例.jpg'};
const photo = document.createElement('canvas');
const mask = document.createElement('canvas');
const maskView = document.createElement('canvas');
const foreground = document.createElement('canvas');
const lines = document.createElement('canvas');
const result = document.createElement('canvas');
const undoStack = [];
const statusBar = document.getElementById('status');
const dialog = document.getElementById('choose');
const fileInput = document.getElementById('local-file');
const chooseNote = document.getElementById('choose-note');
const choosePrompt = '选择一张照片，在本机自动识别人像。';
const maskStatusText = {
  sample: '已载入示例蒙版',
  preparing: '正在识别人像',
  ready: '已自动识别人像',
  manual: '可以用画笔修正前景',
};
let photoRevision = 0;
let statusTimer;
let drawFrame;
let sampleImages;
let activePointer;

function loadImage(source) {
  const image = new Image();
  image.src = source;
  return image.decode().then(() => image);
}
function setPhoto(image, alphaImage, filename) {
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
  if (alphaImage) setMask(alphaImage);
  Object.assign(state, {filename, original: false, brush: null, panel: 'grid', maskStatus: alphaImage ? 'sample' : 'preparing'});
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
async function prepareSample() {
  const revision = ++photoRevision;
  sampleImages ??= Promise.all([
    loadImage(new URL('../sample/snow.jpg', import.meta.url)),
    loadImage(new URL('../sample/snow-mask.png', import.meta.url)),
  ]).catch(error => {
    sampleImages = undefined;
    throw error;
  });
  const [image, alpha] = await sampleImages;
  if (revision === photoRevision) {
    clearTimeout(statusTimer);
    statusBar.hidden = true;
    setPhoto(image, alpha, '雪山示例.jpg');
  }
}
async function autoMask(image, revision) {
  showStatus('正在本机识别人像…', 0);
  try {
    const matte = await estimatePortrait(image);
    if (revision !== photoRevision) return;
    if (matte) {
      setMask(matte);
      state.maskStatus = 'ready';
      showStatus('已识别人像');
    } else {
      state.maskStatus = 'manual';
      showStatus('没找到清晰的人像，可以用画笔标记');
    }
  } catch {
    if (revision !== photoRevision) return;
    state.maskStatus = 'manual';
    showStatus('自动识别暂不可用，可以用画笔标记');
  }
  if (state.maskStatus === 'manual') state.panel = 'mask';
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
  const columns = state.mode === 'stripes' ? state.stripes : state.grid;
  for (let step = 1; step < columns; step++) {
    const x = box.pad + box.w * step / columns;
    grid.fillRect(x - thick / 2, box.pad, thick, box.h);
  }
  if (state.mode === 'grid') {
    for (let step = 1; step < state.grid; step++) {
      const y = box.pad + box.h * step / state.grid;
      grid.fillRect(box.pad, y - thick / 2, box.w, thick);
    }
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
  app.style.setProperty('--photo-ratio', photo.width / photo.height);
  app.querySelectorAll('[data-filename]').forEach(node => node.textContent = state.filename);
  app.querySelectorAll('[data-dims]').forEach(node => node.textContent = photo.dataset.ready ? photo.width + ' × ' + photo.height + ' px' : '');
  app.querySelectorAll('[data-mask-status]').forEach(node => node.textContent = maskStatusText[state.maskStatus]);
  app.querySelectorAll('[data-grid]').forEach(node => node.setAttribute('aria-pressed', Number(node.dataset.grid) === state.grid));
  app.querySelectorAll('[data-mode]').forEach(node => node.setAttribute('aria-pressed', node.dataset.mode === state.mode));
  app.querySelectorAll('[data-layout]').forEach(node => node.hidden = node.dataset.layout !== state.mode);
  app.querySelectorAll('[data-panel-button]').forEach(node => node.setAttribute('aria-pressed', node.dataset.panelButton === state.panel));
  app.querySelectorAll('[data-panel]').forEach(node => node.hidden = node.dataset.panel !== state.panel);
  app.querySelectorAll('[data-stripe-count]').forEach(node => node.value = state.stripes + ' 条');
  app.querySelectorAll('[data-stripe-step]').forEach(node => {
    const next = state.stripes + Number(node.dataset.stripeStep);
    node.disabled = next < stripeBounds.min || next > stripeBounds.max;
  });
  app.querySelectorAll('[data-range]').forEach(node => {
    node.value = state[node.dataset.range];
    node.style.setProperty('--fill', (node.valueAsNumber - Number(node.min)) * 100 / (Number(node.max) - Number(node.min)) + '%');
  });
  app.querySelectorAll('[data-value]').forEach(node => { node.value = Number(state[node.dataset.value].toFixed(2)) + '%'; });
  app.querySelectorAll('[data-action=original]').forEach(node => node.setAttribute('aria-pressed', state.original));
  app.querySelectorAll('[data-action=export], .refine').forEach(node => {
    node.disabled = !photo.dataset.ready || state.maskStatus === 'preparing';
  });
  app.querySelectorAll('.refine').forEach(node => {
    node.setAttribute('aria-pressed', !!state.brush);
    if (app.classList.contains('mobile')) node.hidden = !!state.brush;
  });
  app.querySelectorAll('[data-action=add], [data-action=erase]').forEach(node => node.setAttribute('aria-pressed', state.brush === node.dataset.action));
  app.querySelectorAll('[data-action=undo]').forEach(node => node.disabled = !undoStack.length);
  app.querySelectorAll('[data-brush-tools]').forEach(node => node.hidden = !state.brush);
  app.querySelectorAll('[data-image=result]').forEach(node => node.dataset.edit = Boolean(state.brush));
  queueRender();
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
function exportImage() {
  if (!photo.dataset.ready) return;
  composite();
  result.toBlob(blob => {
    if (!blob) return showStatus('无法生成 PNG');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = state.filename.replace(/\.[^.]+$/, '') + ' · 破框.png';
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showStatus('已生成 PNG');
  });
}
const actions = {
  open: () => { chooseNote.textContent = choosePrompt; dialog.showModal(); },
  export: exportImage,
  original: () => { state.original = !state.original; state.brush = null; },
  refine: () => { state.brush = state.brush ? null : 'add'; state.original = false; state.panel = 'mask'; },
  add: () => { state.brush = 'add'; },
  erase: () => { state.brush = 'erase'; },
  undo: () => {
    const snapshot = undoStack.pop();
    if (snapshot) mask.getContext('2d').putImageData(snapshot, 0, 0);
  },
  reset: () => { Object.assign(state, defaults, {original: false, brush: null, panel: 'grid'}); },
};
stage.addEventListener('click', event => {
  const pressed = event.target.closest('[data-action], [data-grid], [data-mode], [data-stripe-step], [data-panel-button]');
  if (!pressed) return;
  const {action, grid, mode, stripeStep, panelButton} = pressed.dataset;
  if (action) {
    actions[action]();
  } else {
    state.original = false;
    state.brush = null;
    if (grid) state.grid = Number(grid);
    if (mode) state.mode = mode;
    if (stripeStep) state.stripes = clamp(state.stripes + Number(stripeStep), stripeBounds.min, stripeBounds.max);
    if (panelButton) state.panel = panelButton;
  }
  sync();
});
stage.addEventListener('input', event => {
  const key = event.target.dataset.range;
  if (!key) return;
  state[key] = Number(event.target.value);
  state.original = false;
  state.brush = null;
  sync();
});
document.getElementById('sample-choice').addEventListener('click', () => {
  dialog.close();
  prepareSample().catch(() => showStatus('无法打开示例照片'));
});
document.getElementById('browse-choice').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  fileInput.value = '';
  if (!file) return;
  const url = URL.createObjectURL(file);
  const revision = ++photoRevision;
  chooseNote.textContent = '正在读取照片…';
  const previousStatus = state.maskStatus;
  try {
    const loaded = await loadImage(url);
    if (revision !== photoRevision) return;
    setPhoto(loaded, null, file.name);
    if (dialog.open) dialog.close();
    await autoMask(loaded, revision);
  } catch {
    if (revision !== photoRevision) return;
    chooseNote.textContent = '打不开这张图片，请尝试 JPG、PNG 或 WebP。';
    if (previousStatus === 'preparing') {
      state.maskStatus = 'manual';
      showStatus('可以用画笔编辑上一张照片的蒙版');
      sync();
    }
  } finally {
    URL.revokeObjectURL(url);
  }
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
  if (!state.brush || canvas.dataset.image !== 'result' || event.button !== 0 || activePointer) return;
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
    if (activePointer?.id === event.pointerId) activePointer = undefined;
  });
});

function mount() {
  activePointer = undefined;
  stage.innerHTML = phone.matches ? mobileEditor() : desktopEditor();
  sync();
}
phone.addEventListener('change', mount);
mount();
prepareSample().catch(() => showStatus('无法打开示例照片'));
