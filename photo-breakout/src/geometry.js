export const ratios = {
  original: '原比例',
  free: '自由',
  '1:1': '1:1',
  '4:5': '4:5',
  '9:16': '9:16',
  '16:9': '16:9',
};

export const cropDefaults = {
  cropMode: 'original', cropX: .5, cropY: .5, freeWidth: .8, freeHeight: .8,
  zoom: 100, rotation: 0, mirrored: false,
};

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function dimensions(width, height, rotation) {
  return rotation % 180 === 0 ? {width, height} : {width: height, height: width};
}

export function cropRect(width, height, settings) {
  const {cropMode, cropX, cropY, freeWidth, freeHeight, zoom} = settings;
  let w = width;
  let h = height;
  if (cropMode === 'free') {
    w *= freeWidth;
    h *= freeHeight;
  } else if (cropMode !== 'original') {
    const [rw, rh] = cropMode.split(':').map(Number);
    const aspect = rw / rh;
    w = Math.min(width, height * aspect);
    h = w / aspect;
  }
  w /= zoom / 100;
  h /= zoom / 100;
  return {
    x: clamp(cropX * width - w / 2, 0, width - w),
    y: clamp(cropY * height - h / 2, 0, height - h),
    w,
    h,
  };
}

export function sourcePoint(x, y, rotation, mirrored) {
  if (mirrored) x = 1 - x;
  switch (rotation) {
    case 90: return {x: y, y: 1 - x};
    case 180: return {x: 1 - x, y: 1 - y};
    case 270: return {x: 1 - y, y: x};
    default: return {x, y};
  }
}

export function orientedCenter(x, y, clockwise) {
  return clockwise ? {x: 1 - y, y: x} : {x: y, y: 1 - x};
}

export function resizeCrop(rect, handle, dx, dy, width, height) {
  let {x, y, w, h} = rect;
  if (handle === 'move') {
    x = clamp(x + dx, 0, width - w);
    y = clamp(y + dy, 0, height - h);
    return {x, y, w, h};
  }

  // Leave enough room to grab the handles again on a small screen.
  const minW = Math.min(w, width * .08);
  const minH = Math.min(h, height * .08);
  if (handle.includes('w')) {
    const left = clamp(x + dx, 0, x + w - minW);
    w += x - left;
    x = left;
  } else if (handle.includes('e')) {
    w = clamp(w + dx, minW, width - x);
  }
  if (handle.includes('n')) {
    const top = clamp(y + dy, 0, y + h - minH);
    h += y - top;
    y = top;
  } else if (handle.includes('s')) {
    h = clamp(h + dy, minH, height - y);
  }
  return {x, y, w, h};
}
