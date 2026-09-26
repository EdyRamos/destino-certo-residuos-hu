export function burstConfetti(host: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('i');
    p.style.setProperty('--x', `${Math.random() * 180 - 90}px`);
    p.style.setProperty('--r', `${Math.random() * 360}deg`);
    p.style.setProperty('--d', `${Math.random() * 0.2}s`);
    layer.appendChild(p);
  }
  host.appendChild(layer);
  setTimeout(() => layer.remove(), 800);
}
