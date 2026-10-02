import { emit, on } from './bus';
import { prefersReducedMotion } from './motion';

/**
 * The page decays the longer you stay. After ONSET_MS, every INTERVAL a random letter
 * somewhere on the page slips a little; the interval shrinks each time. BUILD repairs it.
 */
const ONSET_MS = 75000;
const INTERVAL_START = 9000;
const INTERVAL_MIN = 2500;
const ACCELERATION = 0.94;

export function initEntropy(root: HTMLElement): void {
  if (prefersReducedMotion()) return;

  const pool = () =>
    Array.from(root.querySelectorAll<HTMLElement>('.ch')).filter(
      (el) => !el.closest('[data-breathe]') && !el.hasAttribute('data-decayed'),
    );

  let interval = INTERVAL_START;
  let timer = 0;
  let decayed = 0;

  const step = () => {
    if (!document.hidden) {
      const candidates = pool();
      const el = candidates[Math.floor(Math.random() * candidates.length)];
      if (el) {
        el.setAttribute('data-decayed', '');
        decayed += 1;
        document.documentElement.dataset.entropy = String(decayed);
      }
    }
    interval = Math.max(INTERVAL_MIN, interval * ACCELERATION);
    timer = window.setTimeout(step, interval);
  };

  const repair = () => {
    root.querySelectorAll('[data-decayed]').forEach((el) => el.removeAttribute('data-decayed'));
    decayed = 0;
    delete document.documentElement.dataset.entropy;
    interval = INTERVAL_START;
    window.clearTimeout(timer);
    timer = window.setTimeout(step, ONSET_MS);
  };

  on('rebuilt', repair);
  on('repair', repair);
  timer = window.setTimeout(step, ONSET_MS);

  // Expose for the console API.
  on('break-all', () => void 0);
  void emit;
}
