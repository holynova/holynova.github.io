#!/usr/bin/env python3
"""Generate the WebP screenshots already requested by detail-app.js."""
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'data/repos.json').read_text())
paths = sorted({repo.get('screenshot', '') for category in data['categories'] for repo in category['repos']})
inputs = [ROOT / name for name in paths if name and not name.startswith(('https://', 'http://')) and Path(name).suffix.lower() in ('.png', '.jpg', '.jpeg')]
missing = [str(source.relative_to(ROOT)) for source in inputs if not source.is_file()]
if missing:
    raise RuntimeError(f'Missing committed screenshots: {missing}')

def convert(source):
    with Image.open(source) as image:
        width = min(800, image.width)
    destination = source.with_suffix('.webp')
    subprocess.run(['cwebp', '-quiet', '-q', '82', '-m', '4', '-resize', str(width), '0', str(source), '-o', str(destination)], check=True)
    return str(destination.relative_to(ROOT))

with ThreadPoolExecutor(max_workers=4) as pool:
    outputs = list(pool.map(convert, inputs))
print(json.dumps(outputs, ensure_ascii=False))
