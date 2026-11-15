const vendorDirectory = new URL('../vendor/', import.meta.url);
const modelPath = new URL('../model/selfie-multiclass.tflite', import.meta.url);
let segmenterPromise;

async function loadSegmenter() {
  const runtime = await import(new URL('vision_bundle.mjs', vendorDirectory));
  const wasm = await runtime.FilesetResolver.forVisionTasks(vendorDirectory.href.replace(/\/$/, ''));
  return runtime.ImageSegmenter.createFromOptions(wasm, {
    baseOptions: {modelAssetPath: modelPath.href, delegate: 'CPU'},
    runningMode: 'IMAGE',
    outputCategoryMask: false,
    outputConfidenceMasks: true,
  });
}

export async function estimatePortrait(image) {
  segmenterPromise ??= loadSegmenter().catch(error => {
    segmenterPromise = undefined;
    throw error;
  });
  const segmenter = await segmenterPromise;
  const working = document.createElement('canvas');
  const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
  working.width = Math.max(1, Math.round(image.naturalWidth * scale));
  working.height = Math.max(1, Math.round(image.naturalHeight * scale));
  working.getContext('2d').drawImage(image, 0, 0, working.width, working.height);

  let matte = null;
  // Hair, skin, clothing, and accessories are all foreground in the multiclass model.
  segmenter.segment(working, result => {
    const background = result.confidenceMasks?.[0];
    if (!background) throw new Error('Missing background confidence mask');
    const confidence = background.getAsFloat32Array();
    const canvas = document.createElement('canvas');
    canvas.width = background.width;
    canvas.height = background.height;
    const ctx = canvas.getContext('2d');
    const pixels = ctx.createImageData(canvas.width, canvas.height);
    let solidPixels = 0;
    for (let i = 0; i < confidence.length; i++) {
      const person = 1 - confidence[i];
      const alpha = Math.max(0, Math.min(1, (person - 0.30) / 0.40));
      pixels.data[i * 4 + 3] = Math.round(255 * alpha);
      if (person >= 0.70) solidPixels++;
    }
    if (solidPixels < confidence.length * 0.002) return;
    ctx.putImageData(pixels, 0, 0);
    matte = canvas;
  });
  return matte;
}
