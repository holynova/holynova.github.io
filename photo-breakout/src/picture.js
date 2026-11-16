import {dimensions} from './geometry.js';

export function resizeCanvas(canvas, width, height) {
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

export function drawOriented(target, source, {rotation, mirrored}) {
  const {width, height} = dimensions(source.width, source.height, rotation);
  resizeCanvas(target, width, height);
  const ctx = target.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  if (mirrored) ctx.scale(-1, 1);
  ctx.rotate(rotation * Math.PI / 180);
  ctx.drawImage(source, -source.width / 2, -source.height / 2);
  ctx.restore();
}

export function adjustTone(ctx, brightness, contrast) {
  if (!brightness && !contrast) return;
  const factors = new Uint8ClampedArray(256);
  const exposure = Math.pow(2, brightness / 100);
  const gain = Math.pow(2, contrast / 100);
  for (let i = 0; i < factors.length; i++) {
    factors[i] = ((i * exposure) - 128) * gain + 128;
  }
  const pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = factors[pixels.data[i]];
    pixels.data[i + 1] = factors[pixels.data[i + 1]];
    pixels.data[i + 2] = factors[pixels.data[i + 2]];
  }
  ctx.putImageData(pixels, 0, 0);
}

export function drawCrop(ctx, source, crop, viewWidth, viewHeight) {
  const sx = source.width / viewWidth;
  const sy = source.height / viewHeight;
  ctx.drawImage(source, crop.x * sx, crop.y * sy, crop.w * sx, crop.h * sy, 0, 0, ctx.canvas.width, ctx.canvas.height);
}
