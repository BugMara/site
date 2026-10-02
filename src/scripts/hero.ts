import { createLoop, hasFinePointer, lerp, prefersReducedMotion, smoothstep } from './motion';

/**
 * Hero proximity field.
 *
 * Every `.ch` inside `[data-breathe]` and every `[data-proximity]` element receives a
 * custom property `--p` in [0, 1]: 1 when the pointer is on it, 0 beyond its radius.
 * CSS decides what `--p` means (letter width, opacity). The loop runs only while
 * values are still settling, so an idle page costs nothing.
 */
interface Field {
  el: HTMLElement;
  radius: number;
  p: number;
}

const LETTER_RADIUS = 220;
const BLOCK_RADIUS = 280;
const DAMPING = 0.16;
const EPS = 0.001;

export function initHero(hero: HTMLElement): void {
  if (prefersReducedMotion() || !hasFinePointer()) return;

  const fields: Field[] = [
    ...Array.from(hero.querySelectorAll<HTMLElement>('[data-breathe] .ch')).map((el) => ({
      el,
      radius: LETTER_RADIUS,
      p: 0,
    })),
    ...Array.from(hero.querySelectorAll<HTMLElement>('[data-proximity]')).map((el) => ({
      el,
      radius: BLOCK_RADIUS,
      p: 0,
    })),
  ];
  if (!fields.length) return;

  hero.classList.add('is-live');

  let px = -1e5;
  let py = -1e5;

  const loop = createLoop(() => {
    // Off-screen: relax everything to rest in one pass and stop.
    if (hero.getBoundingClientRect().bottom <= 0) {
      for (const f of fields) {
        if (f.p !== 0) {
          f.p = 0;
          f.el.style.setProperty('--p', '0');
        }
      }
      return false;
    }

    // Read phase (one layout), then write phase.
    const rects = fields.map((f) => f.el.getBoundingClientRect());
    let busy = false;

    fields.forEach((f, i) => {
      const r = rects[i]!;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(px - cx, py - cy);
      const goal = 1 - smoothstep(0, f.radius, d);
      let next = lerp(f.p, goal, DAMPING);
      if (Math.abs(next - goal) > EPS) busy = true;
      else next = goal;
      if (next !== f.p) {
        f.p = next;
        f.el.style.setProperty('--p', next.toFixed(3));
      }
    });

    return busy;
  });

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      px = e.clientX;
      py = e.clientY;
      loop.wake();
    },
    { passive: true },
  );
  window.addEventListener('scroll', () => loop.wake(), { passive: true });
  document.documentElement.addEventListener('mouseleave', () => {
    px = -1e5;
    py = -1e5;
    loop.wake();
  });
}
