// Game-feel effects. Every effect is decorative and becomes instant under reduced motion.
export const reduced = () => document.documentElement.classList.contains('reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;
export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, reduced() ? 0 : ms));
const center = (r: DOMRect) => [r.left + r.width / 2, r.top + r.height / 2];

/** Flies a copy of the item into a destination ('in') or bumps it and brings it back ('bounce'). */
export async function flyItem(from: Element, to: Element, mode: 'in' | 'bounce') {
  if (reduced() || typeof (from as HTMLElement).animate !== 'function') return;
  const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  const [ax, ay] = center(a), [bx] = center(b), by = b.top + b.height * .38;
  const dx = bx - ax, dy = by - ay, lift = Math.min(160, Math.abs(dx) * .35 + 70);
  const ghost = from.cloneNode(true) as HTMLElement;
  ghost.removeAttribute('id'); ghost.setAttribute('aria-hidden', 'true'); ghost.classList.add('fly-ghost');
  Object.assign(ghost.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
  document.body.append(ghost);
  const frames = mode === 'in'
    ? [{ transform: 'translate(0,0) scale(1) rotate(0)' }, { transform: `translate(${dx * .5}px,${dy * .5 - lift}px) scale(.75) rotate(-10deg)`, offset: .5 }, { transform: `translate(${dx}px,${dy}px) scale(.18) rotate(12deg)`, opacity: .4 }]
    : [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${dx * .5}px,${dy * .5 - lift * .6}px) scale(.7) rotate(-6deg)`, offset: .4 }, { transform: `translate(${dx * .78}px,${dy * .7}px) scale(.45) rotate(10deg)`, offset: .55 }, { transform: 'translate(0,0) scale(1) rotate(0)' }];
  try { await ghost.animate(frames, { duration: mode === 'in' ? 560 : 640, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' }).finished; }
  catch { /* An interrupted animation must not block the answer. */ }
  ghost.remove();
}
/** Restarts a CSS keyframe class on an element (gulp, shake, pop...). */
export function pulse(el: Element, name: string) {
  if (reduced()) return;
  el.classList.remove(name); void (el as HTMLElement).offsetWidth; el.classList.add(name);
  setTimeout(() => el.classList.remove(name), 900);
}
export function floatText(text: string, at: Element, cls = '') {
  if (reduced()) return;
  const [x, y] = center(at.getBoundingClientRect()), el = document.createElement('span');
  el.className = 'float-text ' + cls; el.textContent = text; el.setAttribute('aria-hidden', 'true');
  Object.assign(el.style, { left: x + 'px', top: y + 'px' });
  document.body.append(el); setTimeout(() => el.remove(), 1200);
}
export function sparkle(at: Element, count = 12) {
  if (reduced()) return;
  const [x, y] = center(at.getBoundingClientRect()), layer = document.createElement('div');
  layer.className = 'sparkles'; layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { left: x + 'px', top: y + 'px' });
  for (let i = 0; i < count; i++) {
    const s = document.createElement('i'), angle = (i / count) * Math.PI * 2, r = 45 + Math.random() * 45;
    s.style.setProperty('--x', Math.cos(angle) * r + 'px'); s.style.setProperty('--y', Math.sin(angle) * r + 'px');
    layer.append(s);
  }
  document.body.append(layer); setTimeout(() => layer.remove(), 900);
}
/** Animated counter; returns a cancel function that jumps to the final value. */
export function countUp(el: HTMLElement, from: number, to: number, ms = 700, tick?: () => void, format = (n: number) => String(n)) {
  if (reduced() || from === to) { el.textContent = format(to); return () => {}; }
  let frame = 0; const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms), value = Math.round(from + (to - from) * (1 - (1 - t) ** 3));
    if (el.textContent !== format(value)) { el.textContent = format(value); tick?.(); }
    if (t < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => { cancelAnimationFrame(frame); el.textContent = format(to); };
}
/** Types a line of dialogue; returns a cancel function that shows the full text. */
export function typewriter(el: HTMLElement, text: string, cps = 48) {
  el.setAttribute('aria-label', text);
  if (reduced()) { el.textContent = text; return () => {}; }
  let n = 0; el.textContent = '';
  const timer = setInterval(() => { n += 1; el.textContent = text.slice(0, n); if (n >= text.length) clearInterval(timer); }, 1000 / cps);
  return () => { clearInterval(timer); el.textContent = text; };
}
export function confettiRain(host: HTMLElement, pieces = 70) {
  if (reduced()) return;
  const layer = document.createElement('div');
  layer.className = 'confetti-rain'; layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < pieces; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.setProperty('--d', (Math.random() * 1.8).toFixed(2) + 's');
    p.style.setProperty('--t', (2.2 + Math.random() * 1.6).toFixed(2) + 's');
    p.style.setProperty('--r', Math.round(Math.random() * 720 - 360) + 'deg');
    layer.append(p);
  }
  host.append(layer); setTimeout(() => layer.remove(), 4200);
}
