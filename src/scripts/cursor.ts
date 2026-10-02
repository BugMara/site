import { createLoop, hasFinePointer, lerp, prefersReducedMotion } from './motion';

/**
 * Custom cursor: a precise dot, plus a ring that appears over interactive elements.
 * Position uses the `translate` property so the ring's `scale` never multiplies it.
 * Pointer-only, reduced-motion-aware. The native cursor is hidden only while this is active,
 * and returns the moment the pointer leaves the window or a touch is detected.
 *
 * Targets opt in with `data-cursor="<state>"` and optionally `data-cursor-label="TEXT"`.
 * Plain links and buttons get the default "link" state automatically.
 */
export function initCursor(root: HTMLElement): void {
  if (!hasFinePointer() || prefersReducedMotion()) return;

  const dot = root.querySelector<HTMLElement>('[data-cursor-dot]');
  const ring = root.querySelector<HTMLElement>('[data-cursor-ring]');
  const label = root.querySelector<HTMLElement>('[data-cursor-label]');
  const twin = root.querySelector<HTMLElement>('[data-cursor-twin]');
  if (!dot || !ring || !label) return;

  const html = document.documentElement;
  let x = -100;
  let y = -100;
  let rx = x;
  let ry = y;
  let visible = false;

  const loop = createLoop(() => {
    rx = lerp(rx, x, 0.35);
    ry = lerp(ry, y, 0.35);
    dot.style.translate = `${x}px ${y}px`;
    ring.style.translate = `${rx}px ${ry}px`;
    // The twin: the pointer reflected through the centre of the viewport.
    if (twin) twin.style.translate = `${window.innerWidth - rx}px ${window.innerHeight - ry}px`;
    return Math.abs(rx - x) + Math.abs(ry - y) > 0.05;
  });

  const show = () => {
    if (visible) return;
    visible = true;
    root.dataset.visible = '';
    html.dataset.cursorOn = '';
  };

  const hide = () => {
    if (!visible) return;
    visible = false;
    delete root.dataset.visible;
    delete html.dataset.cursorOn;
  };

  const retarget = (from: EventTarget | null) => {
    const el =
      from instanceof Element ? from.closest<HTMLElement>('a, button, [data-cursor]') : null;
    if (!el) {
      root.dataset.state = '';
      label.textContent = '';
      return;
    }
    root.dataset.state = el.dataset.cursor || 'link';
    label.textContent = el.dataset.cursorLabel ?? '';
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') {
        hide();
        return;
      }
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        rx = x;
        ry = y;
        show();
      }
      loop.wake();
    },
    { passive: true },
  );

  window.addEventListener('pointerover', (e) => retarget(e.target), { passive: true });
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    root.dataset.down = '';
  });
  window.addEventListener('pointerup', () => delete root.dataset.down);
  html.addEventListener('mouseleave', hide);
  window.addEventListener('blur', hide);
}
