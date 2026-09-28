import type { WasteItem, Destination } from '../types';
import crops from '../data/reference-crops.json';
import destinationImages from '../data/destination-art.json';
import manifest from '../data/art-manifest.json';
export const base = import.meta.env.BASE_URL;
export const esc = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function logo() { return '<img class="hu-logo" src="' + base + 'brand/hu-horizontal.png" alt="Hospital Universitário UEL — Londrina">'; }
export function icon(name: string, size = 24) {
  const shapes: Record<string,string> = {
    play:'<path d="m9 5 11 7-11 7Z"/>', back:'<path d="m14 6-6 6 6 6M8 12h13"/>',
    arrow:'<path d="m9 5 7 7-7 7"/>', check:'<path d="m5 12 4 4L19 6"/>',
    settings:'<path d="m9 3-1 3-3 1v4l2 1-2 2 2 4h3l2 3 3-1 1-3 3-1v-4l-2-1 1-3-3-2-3 1Z"/><circle cx="12" cy="12" r="3"/>',
    book:'<path d="M12 6C7 3 3 4 3 4v15s4-1 9 2c5-3 9-2 9-2V4s-4-1-9 2Zm0 0v15"/>',
    trophy:'<path d="M8 3h8v7a4 4 0 0 1-8 0ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 1h8"/>',
    bars:'<path d="M4 20v-5h3v5Zm7 0V9h3v11Zm7 0V3h3v17Z"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    pause:'<path d="M8 5v14M16 5v14"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
    star:'<path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
    leaf:'<path d="M20 3C6 2 1 8 5 16c7 6 15-1 15-13ZM5 20l11-12"/>',
    home:'<path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
    bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3Z"/>',
    flame:'<path d="M12 21c-4 0-6-2.7-6-6 0-4 3-5.5 3-9 3 1.5 4.5 4 4.5 6 1-1 1.5-2 1.5-3 2 1.5 3 4 3 6 0 3.3-2 6-6 6Z"/>',
    gem:'<path d="M6 4h12l3 5-9 11L3 9Z"/><path d="M3 9h18M9 4l3 16 3-16"/>',
    search:'<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'
  };
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(shapes[name] ?? shapes.leaf)+'</svg>';
}
export function itemArt(item: WasteItem) {
  if (item.image) return '<img class="item-art" src="'+base+esc(item.image)+'" alt="" draggable="false">';
  const crop = (crops as Record<string, number[]>)[item.id];
  if (!crop) return '<div class="item-art text-art">'+esc(item.name)+'</div>';
  const [page,x,y,w,h] = crop;
  return '<svg class="item-art reference-art" viewBox="'+[x,y,w,h].join(' ')+'" aria-hidden="true"><image href="'+base+'reference/gabarito-'+page+'.png" width="1400" height="990"/></svg>';
}
export function destinationArt(d: Destination) {
  return '<img class="destination-art" src="'+base+(destinationImages as Record<string,string>)[d.id]+'" alt="" draggable="false">';
}
const art = manifest as Record<string, string>;
export const artUrl = (key: string) => art[key] ? base + art[key] : null;
export type Pose = 'welcome' | 'wave' | 'celebrate' | 'thinking' | 'encourage' | 'explain' | 'trophy';
/** Nery in a given pose; until that pose is delivered, the welcome art is reused with a CSS gesture. */
export function neryImg(pose: Pose = 'welcome', extra = '') {
  const url = artUrl('nery-' + pose);
  return '<img class="nery-portrait pose-'+pose+(url ? '' : ' pose-fallback')+(extra ? ' '+extra : '')+'" src="'+(url ?? artUrl('nery-welcome'))+'" alt="Nery, sua guia no jogo" draggable="false">';
}
export const nery = () => neryImg('welcome');
/** Round face crop of Nery for HUD and map markers. */
export function neryAvatar(pose: Pose = 'welcome') {
  const url = artUrl('nery-' + pose) ?? artUrl('nery-welcome');
  return `<span class="nery-avatar pose-${pose}" style="background-image:url('${url}')" aria-hidden="true"></span>`;
}
export type MedalKey = 'cap1' | 'cap2' | 'cap3' | 'career' | 'perfect' | 'streak' | 'learn';
const medals: Record<MedalKey, [string, string, boolean]> = {
  cap1: ['#1f9a62', 'search', false], cap2: ['#15858a', 'eye', false], cap3: ['#2f9a55', 'heart', true],
  career: ['#0c7651', 'trophy', true], perfect: ['#3b76c9', 'gem', true], streak: ['#159866', 'flame', true], learn: ['#d49a1c', 'bulb', false]
};
let medalId = 0;
/** Leonardo badge art when delivered, otherwise a vector medal in the same palette. */
export function medal(key: MedalKey) {
  const url = artUrl('badge-' + key);
  if (url) return '<img class="medal-art" src="'+url+'" alt="" draggable="false">';
  const [enamel, glyph, gold] = medals[key], id = 'medal' + (++medalId), rim = gold ? ['#ffe9a3', '#c8912a'] : ['#f4f7f6', '#9aaba4'];
  return '<svg class="medal-art" viewBox="0 0 100 120" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+rim[0]+'"/><stop offset="1" stop-color="'+rim[1]+'"/></linearGradient></defs>'
    +'<path d="M31 64 22 116l16-11 12 11-3-46Z" fill="'+enamel+'" opacity=".85"/><path d="M69 64l9 52-16-11-12 11 3-46Z" fill="'+enamel+'"/>'
    +'<circle cx="50" cy="50" r="41" fill="url(#'+id+')"/><circle cx="50" cy="50" r="32" fill="'+enamel+'"/><circle cx="50" cy="50" r="32" fill="none" stroke="#0002" stroke-width="3"/>'
    +'<ellipse cx="38" cy="30" rx="16" ry="7" fill="#fff" opacity=".22" transform="rotate(-25 38 30)"/>'
    +'<g transform="translate(31 31) scale(1.6)" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+icon(glyph).replace(/^<svg[^>]*>/, '').replace('</svg>', '')+'</g></svg>';
}
