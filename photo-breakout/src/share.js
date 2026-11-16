import {downloadBlob} from './download.js';

const url = document.querySelector('link[rel=canonical]').href;
const card = {
  title: '破框',
  description: '让人物跃出白色网格',
  url,
  brand: '#294b35',
  qr: new URL('../share-qr.png', import.meta.url).href,
};
const steps = [
  {image: 'snow.jpg', title: '1. 导入照片', lines: ['选择人像照片', '可一次导入多张']},
  {image: 'guide-mask.webp', title: '2. 自动抠图', lines: ['绿色标出选中的人物', '用画笔修整人物边缘']},
  {image: 'guide-result.webp', title: '3. 网格与导出', lines: ['独立调整横纵格数', '保存成品 PNG']},
];
const dialog = document.getElementById('share-dialog');
const canvas = dialog.querySelector('canvas');
const download = dialog.querySelector('[data-share=download]');
const native = dialog.querySelector('[data-share=native]');
const input = dialog.querySelector('input');
const status = dialog.querySelector('[role=status]');
const filename = '破框 · 分享卡片.png';
let blob;
let pending;
input.value = card.url;

function track(event) {
  window.umami?.track?.(event, {scope: 'site', format: 'png'});
}
function text(ctx, value, size, weight, color, x, y) {
  ctx.fillStyle = color;
  ctx.font = weight + ' ' + size + 'px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(value, x, y);
}
async function loadImage(source) {
  const image = new Image();
  image.src = source;
  await image.decode();
  return image;
}
async function makeCard() {
  const [qr, pictures] = await Promise.all([
    loadImage(card.qr),
    Promise.all(steps.map(step => loadImage(new URL('../sample/' + step.image, import.meta.url)))),
    document.fonts.ready,
  ]);
  const ctx = canvas.getContext('2d');
  const ink = '#203126';
  const muted = '#4f6254';
  ctx.fillStyle = '#e8eee4';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fffef9';
  ctx.fillRect(36, 36, 1008, 1088);
  ctx.fillStyle = card.brand;
  ctx.fillRect(36, 36, 1008, 238);

  text(ctx, card.title, 102, 760, '#fffef9', 76, 161);
  text(ctx, card.description, 42, 620, '#e7f0df', 81, 226);
  text(ctx, '三步做一张破框图', 40, 720, ink, 76, 346);

  const imageSize = 288;
  for (const [index, step] of steps.entries()) {
    const x = 76 + index * 320;
    ctx.drawImage(pictures[index], x, 382, imageSize, imageSize);
    text(ctx, step.title, 34, 700, ink, x, 729);
    for (const [line, label] of step.lines.entries()) {
      text(ctx, label, 26, 450, muted, x, 779 + line * 35);
    }
  }

  ctx.fillStyle = '#e4eddf';
  ctx.fillRect(36, 854, 1008, 270);
  text(ctx, '扫码打开破框', 44, 720, ink, 76, 965);
  text(ctx, card.url, 31, 500, muted, 76, 1025);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(qr, 758, 875, 228, 228);
  const output = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!output) throw new Error('Could not render share card');
  return output;
}

export async function openShare() {
  dialog.showModal();
  track('share_card_open');
  if (blob) return;
  status.textContent = '正在生成卡片…';
  try {
    pending ??= makeCard();
    blob = await pending;
    canvas.hidden = false;
    download.disabled = false;
    const file = new File([blob], filename, {type: 'image/png'});
    native.hidden = !(navigator.share && navigator.canShare?.({files: [file]}));
    status.textContent = '';
  } catch {
    pending = undefined;
    status.textContent = '卡片生成失败，仍可复制链接。';
  }
}

dialog.addEventListener('click', async event => {
  if (event.target === dialog) {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    return;
  }
  switch (event.target.closest('[data-share]')?.dataset.share) {
    case 'download':
      if (!blob) return;
      downloadBlob(blob, filename);
      track('share_card_download');
      status.textContent = '已下载分享卡片';
      break;
    case 'copy':
      try {
        await navigator.clipboard.writeText(card.url);
        track('share_link_copy');
        status.textContent = '已复制链接';
      } catch {
        input.focus();
        input.select();
        status.textContent = '请复制选中的链接';
      }
      break;
    case 'native':
      if (!blob) return;
      try {
        await navigator.share({title: card.title, text: card.description, url: card.url, files: [new File([blob], filename, {type: 'image/png'})]});
        track('share_card_native');
        status.textContent = '已分享';
      } catch (error) {
        if (error.name !== 'AbortError') status.textContent = '可下载卡片或复制链接';
      }
      break;
  }
});
