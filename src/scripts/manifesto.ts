import { prefersReducedMotion } from './motion';

/**
 * The manifesto reads in the direction you scroll. Scroll up through it and its lines
 * reorder themselves (animated) so you read it backwards; scroll down and it returns.
 */
const FLIP_MS = 640;
const HYSTERESIS = 48;
const COOLDOWN = 900;

export function initManifesto(root: HTMLElement): void {
  if (prefersReducedMotion()) return;

  const lines = Array.from(root.children) as HTMLElement[];
  if (lines.length < 2) return;

  let lastY = window.scrollY;
  let anchor = lastY;
  let reversed = false;
  let lastFlip = 0;

  const onScreen = () => {
    const r = root.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };

  const flip = (toReversed: boolean) => {
    const before = lines.map((l) => l.getBoundingClientRect().top);
    root.classList.toggle('is-reversed', toReversed);
    const after = lines.map((l) => l.getBoundingClientRect().top);
    lines.forEach((l, i) => {
      const dy = (before[i] ?? 0) - (after[i] ?? 0);
      l.style.transition = 'none';
      l.style.translate = `0 ${dy}px`;
    });
    // Force layout, then let them travel to their new places.
    void root.offsetHeight;
    lines.forEach((l) => {
      l.style.transition = `translate ${FLIP_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      l.style.translate = '0 0';
    });
    reversed = toReversed;
    lastFlip = performance.now();
  };

  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      const dir = y > lastY ? 1 : y < lastY ? -1 : 0;
      lastY = y;
      if (!dir || !onScreen()) {
        anchor = y;
        return;
      }
      const wantReversed = dir < 0;
      if (wantReversed === reversed) {
        anchor = y;
        return;
      }
      if (Math.abs(y - anchor) < HYSTERESIS) return;
      if (performance.now() - lastFlip < COOLDOWN) return;
      flip(wantReversed);
      anchor = y;
    },
    { passive: true },
  );
}
