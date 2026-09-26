import type { WasteItem, Destination } from '../types';
import crops from '../data/reference-crops.json';
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
    home:'<path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10"/>'
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
  if (d.id === 'hamper') return '<img class="destination-art" src="'+base+'reference/hamper.png" alt="" draggable="false">';
  return '<span class="receptacle receptacle-'+d.colorToken+'" aria-hidden="true"><span>'+esc(d.symbol)+'</span></span>';
}
export function nery() {
  return '<svg class="nery-portrait" viewBox="348 80 186 186" role="img" aria-label="Nery, guia do jogo, retrato de referência"><image href="'+base+'reference/telas.png" width="1672" height="941"/></svg>';
}
