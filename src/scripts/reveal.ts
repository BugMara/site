import { prefersReducedMotion } from './motion';

/**
 * Enter-once reveals for `[data-reveal]`. Without JS the elements are simply visible
 * (see base.css: the hidden state is gated on html[data-js]).
 */
let started = false;

export function initReveal(): void {
  if (started) return;
  started = true;

  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!items.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.05, rootMargin: '0px 0px -6% 0px' },
  );

  items.forEach((el) => io.observe(el));
}
