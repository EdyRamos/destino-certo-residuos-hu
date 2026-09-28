import sharp from 'sharp';

// Removes a flat light background connected to the image border (flood fill from the edges).
// Images that already carry transparency are left untouched.
export async function cutout(source) {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let see = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250 && ++see > w) return null;
  const sample = [];
  for (const [x0, y0] of [[0, 0], [w - 8, 0], [0, h - 8], [w - 8, h - 8]])
    for (let y = y0; y < y0 + 8; y++) for (let x = x0; x < x0 + 8; x++) sample.push((y * w + x) * 4);
  const bg = [0, 1, 2].map(c => sample.reduce((n, i) => n + data[i + c], 0) / sample.length);
  const dist = i => Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]));
  const HARD = 16, SOFT = 44, seen = new Uint8Array(w * h), stack = [];
  const push = p => { if (!seen[p]) { seen[p] = 1; stack.push(p); } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (stack.length) {
    const p = stack.pop(), i = p * 4, d = dist(i);
    if (d >= SOFT) continue;
    data[i + 3] = d <= HARD ? 0 : Math.round(255 * (d - HARD) / (SOFT - HARD));
    if (d > HARD) continue; // Soft edge pixels are feathered but do not spread the fill into the object.
    const x = p % w, y = (p - x) / w;
    if (x > 0) push(p - 1); if (x < w - 1) push(p + 1); if (y > 0) push(p - w); if (y < h - 1) push(p + w);
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}
