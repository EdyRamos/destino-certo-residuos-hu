import { describe, it, expect } from 'vitest';
import sharp from 'sharp';
// @ts-expect-error plain ESM build script without type declarations
import { cutout } from '../scripts/cutout.mjs';
const size = 60;
// White square background with a grey ring (an outlined white object) in the middle.
async function outlined() {
  const px = Buffer.alloc(size * size * 3, 255);
  for (let y = 15; y < 45; y++) for (let x = 15; x < 45; x++) if (x < 18 || x > 41 || y < 18 || y > 41) px.fill(120, (y * size + x) * 3, (y * size + x) * 3 + 3);
  return sharp(px, { raw: { width: size, height: size, channels: 3 } }).png().toBuffer();
}
const alpha = async (png: Buffer, x: number, y: number) => { const { data } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); return data[(y * size + x) * 4 + 3]; };
describe('recorte de fundo liso das artes', () => {
  it('remove o fundo ligado à borda e preserva o objeto, inclusive o branco interno', async () => {
    const out = await cutout(await outlined());
    expect(await alpha(out, 2, 2)).toBe(0);
    expect(await alpha(out, 16, 30)).toBe(255);
    expect(await alpha(out, 30, 30)).toBe(255);
  });
  it('não apaga o branco interno quando o contorno tem falhas (jaleco branco no fundo branco)', async () => {
    const px = Buffer.alloc(size * size * 3, 255);
    for (let y = 15; y < 45; y++) for (let x = 15; x < 45; x++) {
      const ring = x < 18 || x > 41 || y < 18 || y > 41, gap = x > 41 && y >= 27 && y <= 33;
      if (ring && !gap) px.fill(120, (y * size + x) * 3, (y * size + x) * 3 + 3);
    }
    const out = await cutout(await sharp(px, { raw: { width: size, height: size, channels: 3 } }).png().toBuffer());
    expect(await alpha(out, 30, 30)).toBe(255);
    expect(await alpha(out, 40, 30)).toBe(255);
    expect(await alpha(out, 2, 30)).toBe(0);
  });
  it('não altera imagens que já têm transparência', async () => {
    const png = await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).png().toBuffer();
    expect(await cutout(png)).toBeNull();
  });
});
