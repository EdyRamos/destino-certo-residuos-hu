import sharp from 'sharp';

// Removes a flat light background connected to the image border. Images that already carry
// transparency are left untouched (returns null).
// White objects on white backgrounds (lab coats!) have no colour boundary, so a plain flood fill
// leaks into them. The object's outline is therefore sealed first: pixels that differ from the
// background are dilated by SEAL px, the background is flood-filled outside that sealed shape,
// and only then is the ring created by the dilation given back to the background where it is
// background-coloured. Gaps in the outline up to 2·SEAL px stay closed.
export async function cutout(source, { seal = 6 } = {}) {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info, n = w * h;
  let see = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250 && ++see > w) return null;
  const sample = [];
  for (const [x0, y0] of [[0, 0], [w - 8, 0], [0, h - 8], [w - 8, h - 8]])
    for (let y = y0; y < y0 + 8; y++) for (let x = x0; x < x0 + 8; x++) sample.push((y * w + x) * 4);
  const bg = [0, 1, 2].map(c => sample.reduce((s, i) => s + data[i + c], 0) / sample.length);
  const dist = new Uint8Array(n);
  for (let p = 0; p < n; p++) { const i = p * 4; dist[p] = Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2])); }
  const HARD = 10, SOFT = 40;
  // 1. Sealed object mask: separable square dilation of "differs from background".
  const object = new Uint8Array(n), rows = new Uint8Array(n), sealed = new Uint8Array(n);
  for (let p = 0; p < n; p++) object[p] = dist[p] > HARD ? 1 : 0;
  for (let y = 0; y < h; y++) {
    let last = -Infinity;
    for (let x = 0; x < w; x++) { if (object[y * w + x]) last = x; if (x - last <= seal) rows[y * w + x] = 1; }
    last = Infinity;
    for (let x = w - 1; x >= 0; x--) { if (object[y * w + x]) last = x; if (last - x <= seal) rows[y * w + x] = 1; }
  }
  for (let x = 0; x < w; x++) {
    let last = -Infinity;
    for (let y = 0; y < h; y++) { if (rows[y * w + x]) last = y; if (y - last <= seal) sealed[y * w + x] = 1; }
    last = Infinity;
    for (let y = h - 1; y >= 0; y--) { if (rows[y * w + x]) last = y; if (last - y <= seal) sealed[y * w + x] = 1; }
  }
  // 2. Background = border-connected pixels outside the sealed shape.
  const background = new Uint8Array(n);
  let frontier = [];
  const add = p => { if (!background[p] && !sealed[p]) { background[p] = 1; frontier.push(p); } };
  for (let x = 0; x < w; x++) { add(x); add((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { add(y * w); add(y * w + w - 1); }
  const neighbours = p => { const x = p % w, out = []; if (x > 0) out.push(p - 1); if (x < w - 1) out.push(p + 1); if (p >= w) out.push(p - w); if (p < n - w) out.push(p + w); return out; };
  while (frontier.length) { const p = frontier.pop(); for (const q of neighbours(p)) add(q); }
  // 3. Give back the dilation ring, one pixel layer at a time, only through background-coloured pixels.
  frontier = [];
  for (let p = 0; p < n; p++) if (background[p]) frontier.push(p);
  for (let layer = 0; layer < seal + 1; layer++) {
    const next = [];
    for (const p of frontier) for (const q of neighbours(p)) if (!background[q] && dist[q] <= HARD) { background[q] = 1; next.push(q); }
    frontier = next;
  }
  // 4. Alpha: background is cleared; object pixels touching it are feathered by their contrast.
  for (let p = 0; p < n; p++) {
    const i = p * 4;
    if (background[p]) { data[i + 3] = 0; continue; }
    if (dist[p] < SOFT && neighbours(p).some(q => background[q])) data[i + 3] = Math.round(255 * Math.max(.35, dist[p] / SOFT));
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}
