export function enablePointerDrag(card: HTMLElement, onDrop: (id: string) => void, onStart?: () => void) {
  let pointer: number | null = null, startX = 0, startY = 0;
  let ghost: HTMLElement | null = null;
  const clear = () => { ghost?.remove(); ghost = null; pointer = null; document.querySelectorAll('.drop-hover').forEach(e => e.classList.remove('drop-hover')); };
  card.addEventListener('pointerdown', ev => {
    if (pointer !== null || ev.button !== 0) return;
    pointer = ev.pointerId; startX = ev.clientX; startY = ev.clientY;
    card.setPointerCapture(ev.pointerId);
  });
  card.addEventListener('pointermove', ev => {
    if (ev.pointerId !== pointer) return;
    if (!ghost && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 10) {
      ghost = card.cloneNode(true) as HTMLElement; ghost.removeAttribute('id'); ghost.setAttribute('aria-hidden', 'true'); ghost.classList.add('drag-ghost'); document.body.append(ghost); onStart?.();
    }
    if (!ghost) return;
    ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
    document.querySelectorAll('.drop-hover').forEach(e => e.classList.remove('drop-hover'));
    document.elementFromPoint(ev.clientX, ev.clientY)?.closest<HTMLButtonElement>('[data-destination]:not(:disabled)')?.classList.add('drop-hover');
  });
  card.addEventListener('pointerup', ev => {
    if (ev.pointerId !== pointer) return;
    const moved = !!ghost;
    const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest<HTMLButtonElement>('[data-destination]:not(:disabled)');
    clear();
    if (card.hasPointerCapture(ev.pointerId)) card.releasePointerCapture(ev.pointerId);
    if (moved && target?.dataset.destination) onDrop(target.dataset.destination);
  });
  card.addEventListener('pointercancel', clear);
  card.addEventListener('lostpointercapture', clear);
}
