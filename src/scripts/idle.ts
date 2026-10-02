import { prefersReducedMotion } from './motion';

/**
 * The headline rewrites itself when nobody is touching the page.
 * After IDLE_MS without input, "WE BUILD THINGS." becomes "WE BREAK THINGS." one letter at a
 * time. Any input puts it back. Only while the hero is on screen and the tab is visible.
 */
const IDLE_MS = 8000;
const STEP_MS = 380;

/** `.ch` index → replacement glyph. BUILD → BREAK: B stays, U I L D become R E A K. */
const SWAP: Array<[number, string]> = [
  [3, 'R'],
  [4, 'E'],
  [5, 'A'],
  [6, 'K'],
];

export function initIdle(hero: HTMLElement): void {
  if (prefersReducedMotion()) return;

  const letters = Array.from(hero.querySelectorAll<HTMLElement>('[data-breathe] .ch'));
  const targets = SWAP.map(([i, glyph]) => ({
    el: letters[i],
    glyph,
    original: letters[i]?.textContent ?? '',
  })).filter((t): t is { el: HTMLElement; glyph: string; original: string } => !!t.el);
  if (targets.length !== SWAP.length) return;

  let timer = 0;
  let rewritten = false;
  let pending: number[] = [];

  const swap = (el: HTMLElement, glyph: string) => {
    el.classList.add('is-swapping');
    pending.push(
      window.setTimeout(() => {
        el.textContent = glyph;
        el.classList.remove('is-swapping');
      }, 140),
    );
  };

  const cancelPending = () => {
    pending.forEach((id) => clearTimeout(id));
    pending = [];
  };

  const heroVisible = () => {
    const r = hero.getBoundingClientRect();
    return r.bottom > window.innerHeight * 0.4 && document.visibilityState === 'visible';
  };

  const rewrite = () => {
    if (rewritten || !heroVisible() || hero.hasAttribute('data-broken')) return;
    rewritten = true;
    targets.forEach((t, i) => {
      pending.push(window.setTimeout(() => swap(t.el, t.glyph), i * STEP_MS));
    });
  };

  const revert = () => {
    if (!rewritten) return;
    cancelPending();
    rewritten = false;
    // Faster on the way back: it is caught in the act.
    [...targets].reverse().forEach((t, i) => {
      pending.push(window.setTimeout(() => swap(t.el, t.original), i * 90));
    });
  };

  const arm = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(rewrite, IDLE_MS);
  };

  const input = () => {
    revert();
    arm();
  };

  for (const type of ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart']) {
    window.addEventListener(type, input, { passive: true });
  }
  window.addEventListener('scroll', input, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? revert() : arm()));

  arm();
}
