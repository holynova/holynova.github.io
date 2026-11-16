export const gridModes = {
  rect: '方格',
  diagonal: '斜格',
  diamond: '菱形',
  perspective: '透视',
};

function path(ctx, x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

function slanted(ctx, box, degrees, count) {
  const angle = degrees * Math.PI / 180;
  const dx = Math.cos(angle);
  const dy = -Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  const span = Math.abs(nx) * box.w + Math.abs(ny) * box.h;
  const length = Math.hypot(box.w, box.h);
  for (let i = 1; i < count; i++) {
    const offset = (i / count - .5) * span;
    const x = box.x + box.w / 2 + nx * offset;
    const y = box.y + box.h / 2 + ny * offset;
    path(ctx, x - dx * length, y - dy * length, x + dx * length, y + dy * length);
  }
}

export function drawGrid(ctx, box, styles) {
  const {gridMode, rows, columns, bands, angle, vanishing, width} = styles;
  ctx.save();
  ctx.beginPath();
  ctx.rect(box.x, box.y, box.w, box.h);
  ctx.clip();
  ctx.beginPath();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = Math.min(ctx.canvas.width, ctx.canvas.height) * width / 100;

  if (gridMode === 'diagonal') {
    slanted(ctx, box, angle, bands);
  } else if (gridMode === 'diamond') {
    slanted(ctx, box, 45, bands);
    slanted(ctx, box, -45, bands);
  } else if (gridMode === 'perspective') {
    const vx = box.x + box.w * vanishing / 100;
    const vy = box.y + box.h * .10;
    const bottom = box.y + box.h;
    for (let i = 0; i <= columns; i++) {
      path(ctx, vx, vy, box.x + box.w * i / columns, bottom);
    }
    for (let i = 1; i < rows; i++) {
      const depth = Math.pow(i / rows, 1.75);
      const y = vy + (bottom - vy) * depth;
      path(ctx, vx + (box.x - vx) * depth, y, vx + (box.x + box.w - vx) * depth, y);
    }
  } else {
    for (let i = 1; i < columns; i++) {
      const x = box.x + box.w * i / columns;
      path(ctx, x, box.y, x, box.y + box.h);
    }
    for (let i = 1; i < rows; i++) {
      const y = box.y + box.h * i / rows;
      path(ctx, box.x, y, box.x + box.w, y);
    }
  }
  ctx.stroke();
  ctx.restore();
}
