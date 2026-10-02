import { emit } from './bus';

/**
 * Violence breaks it. A hard flick of the scroll wheel through the hero knocks letters off
 * the headline. Shaking a phone (where no permission prompt is needed) does the same.
 */
const FLICK_PX_PER_S = 3800;
const SHAKE_MS2 = 22;
const COOLDOWN = 900;

export function initShake(hero: HTMLElement): void {
  let last = 0;

  const knock = (count: number) => {
    const now = performance.now();
    if (now - last < COOLDOWN) return;
    const r = hero.getBoundingClientRect();
    if (r.bottom < window.innerHeight * 0.3) return;
    last = now;
    emit('drop', { count });
  };

  // ---- scroll velocity -------------------------------------------------------
  let y = window.scrollY;
  let t = performance.now();
  window.addEventListener(
    'scroll',
    () => {
      const now = performance.now();
      const dt = now - t;
      if (dt > 0) {
        const v = (Math.abs(window.scrollY - y) / dt) * 1000;
        if (v > FLICK_PX_PER_S) knock(1 + Math.floor(Math.random() * 2));
      }
      y = window.scrollY;
      t = now;
    },
    { passive: true },
  );

  // ---- device shake ----------------------------------------------------------
  const DME = window.DeviceMotionEvent as
    (typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> }) | undefined;
  if (DME && typeof DME.requestPermission !== 'function') {
    window.addEventListener(
      'devicemotion',
      (e) => {
        const a = e.acceleration;
        if (!a) return;
        const m = Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0);
        if (m > SHAKE_MS2) knock(2);
      },
      { passive: true },
    );
  }
}
