import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { cutout } from './cutout.mjs';

// Originals live in docs/art as "<key>-v<N>.png|jpg|webp" (Leonardo, image_gen...).
// This script only converts: the highest version of each key becomes public/art/<key>-v<N>.webp,
// opaque flat backgrounds are cut out, and items/destinations/manifest are linked to what exists.
const SRC = 'docs/art', OUT = 'public/art';
// `--force <prefixo>` reconverte as artes cuja chave começa pelo prefixo (ex.: após mudar o recorte).
const forceAt = process.argv.indexOf('--force'), force = forceAt > 0 ? (process.argv[forceAt + 1] ?? '') : null;
const NAME = /^(.+)-v(\d+)\.(png|jpe?g|webp)$/i;
fs.mkdirSync(OUT, { recursive: true });

const kind = key => key.startsWith('nery') ? 'nery' : key.startsWith('bg-') ? 'bg' : key.startsWith('badge-') ? 'badge' : 'item';
const edge = { nery: 1100, bg: 1920, badge: 420, item: 600 };

function latestVersions(dir, ext) {
  const latest = new Map();
  if (!fs.existsSync(dir)) return latest;
  for (const file of fs.readdirSync(dir)) {
    const m = NAME.exec(file);
    if (!m || (ext && !file.endsWith(ext))) continue;
    const version = Number(m[2]), previous = latest.get(m[1]);
    if (!previous || version > previous.version) latest.set(m[1], { version, file });
  }
  return latest;
}

for (const [key, { version, file }] of latestVersions(SRC)) {
  const source = path.join(SRC, file), target = path.join(OUT, `${key}-v${version}.webp`), k = kind(key);
  if (!(force && key.startsWith(force)) && fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(source).mtimeMs) continue;
  const input = k === 'bg' ? source : (await cutout(source)) ?? source;
  await sharp(input).resize({ width: edge[k], height: edge[k], fit: 'inside', withoutEnlargement: true })
    .webp({ quality: k === 'bg' ? 78 : 86, alphaQuality: 100 }).toFile(target);
  console.log(`${file} -> ${path.basename(target)} (${Math.round(fs.statSync(target).size / 1024)} KB)`);
}

// The manifest comes from public/art, so it also works on clones without the heavy originals.
const published = latestVersions(OUT, '.webp');
for (const file of fs.readdirSync(OUT)) {
  const m = NAME.exec(file);
  if (m && published.get(m[1])?.file !== file) { fs.unlinkSync(path.join(OUT, file)); console.log(`Removida versão antiga: ${file}`); }
}
const manifest = Object.fromEntries([...published].sort().map(([key, { file }]) => [key, `art/${file}`]));
fs.writeFileSync('src/data/art-manifest.json', JSON.stringify(manifest, null, 2) + '\n');

// Clean paper questions intentionally share one illustration.
const shared = { green_04: 'green_05' };
const items = JSON.parse(fs.readFileSync('src/data/items.json', 'utf8'));
for (const item of items) item.image = manifest[shared[item.id] ?? item.id] ?? null;
fs.writeFileSync('src/data/items.json', JSON.stringify(items, null, 2) + '\n');

const destinations = JSON.parse(fs.readFileSync('src/data/destinations.json', 'utf8'));
const destinationArt = Object.fromEntries(destinations.map(d => [d.id, manifest[d.id.replace('_', '-')]]));
const missing = Object.entries(destinationArt).filter(([, file]) => !file).map(([id]) => id);
if (missing.length) throw new Error('Destinos sem arte: ' + missing.join(', '));
fs.writeFileSync('src/data/destination-art.json', JSON.stringify(destinationArt, null, 2) + '\n');

const itemsWithArt = items.filter(i => i.enabled && i.image).length, enabled = items.filter(i => i.enabled).length;
console.log(`Artes publicadas: ${Object.keys(manifest).length} · itens do jogo com arte: ${itemsWithArt}/${enabled}`);
