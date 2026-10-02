import { createLoop } from './motion';

/**
 * Fallen letters obey physics outside the page.
 * Drag the browser window across the screen and the debris on the hero's rule slides the
 * other way, bounces off the ends of the headline, and settles. On a phone, tilt it.
 */
const POLL_MS = 80;
const FRICTION = 0.9;
const MOVE_GAIN = 0.55;
const TILT_GAIN = 0.045;
const REST = 0.04;

export function initDebris(hero: HTMLElement): void {
  const title = hero.querySelector<HTMLElement>('[data-breathe]');
  if (!title) return;

  const velocity = new Map<HTMLElement, number>();

  const ghosts = () => Array.from(title.querySelectorAll<HTMLElement>('.ghost[data-fallen]'));

  const loop = createLoop(() => {
    const list = ghosts();
    if (!list.length) {
      velocity.clear();
      return false;
    }
    const width = title.clientWidth;
    let busy = false;
    for (const g of list) {
      let v = velocity.get(g) ?? 0;
      if (Math.abs(v) < REST) {
        velocity.set(g, 0);
        continue;
      }
      const base = parseFloat(g.style.left) + parseFloat(g.style.getPropertyValue('--dx') || '0');
      let slide = parseFloat(g.style.getPropertyValue('--slide') || '0') + v;
      const w = parseFloat(g.style.width) || 0;
      // Walls at the ends of the headline.
      if (base + slide < 0) {
        slide = -base;
        v = -v * 0.5;
      } else if (base + slide + w > width) {
        slide = width - w - base;
        v = -v * 0.5;
      }
      g.style.setProperty('--slide', `${slide.toFixed(1)}px`);
      velocity.set(g, v * FRICTION);
      busy = true;
    }
    return busy;
  });

  const impulse = (dv: number) => {
    const list = ghosts();
    if (!list.length) return;
    for (const g of list) {
      const sy = Number(g.style.getPropertyValue('--sy')) || 0.5;
      velocity.set(g, (velocity.get(g) ?? 0) + dv * (0.7 + sy * 0.6));
    }
    loop.wake();
  };

  // ---- window dragged across the screen ------------------------------------
  let sx = window.screenX;
  let sy = window.screenY;
  window.setInterval(() => {
    const dx = window.screenX - sx;
    sx = window.screenX;
    sy = window.screenY;
    if (dx && Math.abs(dx) < 800) impulse(-dx * MOVE_GAIN);
  }, POLL_MS);

  // ---- device tilt (where no permission prompt is needed) --------------------
  const DOE = window.DeviceOrientationEvent as
    (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> }) | undefined;
  if (DOE && typeof DOE.requestPermission !== 'function') {
    window.addEventListener(
      'deviceorientation',
      (e) => {
        const gamma = e.gamma ?? 0; // left/right tilt, −90..90
        if (Math.abs(gamma) > 4 && ghosts().length) impulse(gamma * TILT_GAIN);
      },
      { passive: true },
    );
  }

  // Fresh debris starts at rest.
  new MutationObserver(() => loop.wake()).observe(title, { childList: true });
}
