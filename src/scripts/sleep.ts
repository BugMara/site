import { prefersReducedMotion } from './motion';

/**
 * The page falls asleep. After SLEEP_MS without input everything goes dark except the
 * elements marked `data-awake` (the status line, the clock). Any input wakes it.
 */
const SLEEP_MS = 45000;

export function initSleep(): void {
  if (prefersReducedMotion()) return;

  const html = document.documentElement;
  let timer = 0;

  const sleep = () => {
    if (document.hidden) return;
    html.dataset.asleep = '';
  };

  const arm = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(sleep, SLEEP_MS);
  };

  const wake = () => {
    if ('asleep' in html.dataset) delete html.dataset.asleep;
    arm();
  };

  for (const type of ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart']) {
    window.addEventListener(type, wake, { passive: true });
  }
  window.addEventListener('scroll', wake, { passive: true });
  document.addEventListener('visibilitychange', () =>
    document.hidden ? window.clearTimeout(timer) : wake(),
  );

  arm();
}
