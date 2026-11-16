import {downloadBlob} from './download.js';

const url = document.querySelector('link[rel=canonical]').href;
const card = {
  title: '破框',
  description: '让人物跃出白色网格',
  details: '照片本地抠像 · 多种网格和裁切',
  url,
  brand: '#294b35',
  qr: new URL('../share-qr.png', import.meta.url).href,
};
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
async function makeCard() {
  const qr = new Image();
  qr.src = card.qr;
  await Promise.all([qr.decode(), document.fonts.ready]);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e8eee4';
  ctx.fillRect(0, 0, 1080, 1160);
  ctx.fillStyle = card.brand;
  ctx.fillRect(40, 40, 1000, 760);

  ctx.save();
  ctx.beginPath();
  ctx.rect(40, 40, 1000, 760);
  ctx.clip();
  ctx.translate(803, 502);
  ctx.rotate(-.14);
  ctx.strokeStyle = '#cbd8bd';
  ctx.lineWidth = 8;
  ctx.strokeRect(-113, -151, 430, 430);
  for (const i of [1, 2]) {
    const offset = i * 430 / 3;
    ctx.beginPath();
    ctx.moveTo(-113 + offset, -151);
    ctx.lineTo(-113 + offset, 279);
    ctx.moveTo(-113, -151 + offset);
    ctx.lineTo(317, -151 + offset);
    ctx.stroke();
  }
  ctx.fillStyle = '#e4a770';
  ctx.beginPath();
  ctx.ellipse(71, 92, 137, 86, -.52, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  text(ctx, 'PHOTO BREAKOUT', 25, 650, '#d6e3cc', 104, 139);
  text(ctx, card.title, 150, 770, '#fffef8', 88, 340);
  text(ctx, card.description, 50, 680, '#fffef8', 104, 461);
  text(ctx, card.details, 32, 450, '#d6e3cc', 104, 530);
  text(ctx, '扫码打开破框', 46, 700, '#233e2a', 104, 933);
  text(ctx, card.url, 29, 530, '#334c39', 105, 999);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(qr, 754, 832, 240, 240);
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
