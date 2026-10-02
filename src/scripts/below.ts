/**
 * Scroll past the end and the page answers. Two attempts to scroll below the footer reveal
 * a single line: THERE IS NOTHING BELOW THIS.
 */
const ATTEMPTS = 2;

export function initBelow(line: HTMLElement): void {
  let attempts = 0;
  let touchY = 0;

  const atBottom = () =>
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

  const attempt = () => {
    if (!atBottom()) return;
    attempts += 1;
    if (attempts >= ATTEMPTS) line.classList.add('is-on');
  };

  window.addEventListener('wheel', (e) => e.deltaY > 0 && attempt(), { passive: true });
  window.addEventListener('touchstart', (e) => (touchY = e.touches[0]?.clientY ?? 0), {
    passive: true,
  });
  window.addEventListener(
    'touchmove',
    (e) => {
      const y = e.touches[0]?.clientY ?? 0;
      if (touchY - y > 40) {
        attempt();
        touchY = y;
      }
    },
    { passive: true },
  );
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'End' || e.key === ' ')
      attempt();
  });
}
