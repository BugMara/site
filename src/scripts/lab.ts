import { clamp, createLoop, hasFinePointer, lerp, pad, prefersReducedMotion } from './motion';

/**
 * The Lab measures the pointer.
 * Fine pointer: two hairlines track the cursor across the section and a mono readout gives
 * X / Y in pixels from the section's origin. The row under the horizontal hairline is "hit".
 * Coarse pointer: the readout reports how far the section has scrolled through the viewport.
 */
export function initLab(section: HTMLElement): void {
  const readX = section.querySelector<HTMLElement>('[data-lab-x]');
  const readY = section.querySelector<HTMLElement>('[data-lab-y]');
  const hairX = section.querySelector<HTMLElement>('[data-lab-hx]');
  const hairY = section.querySelector<HTMLElement>('[data-lab-hy]');
  const rows = Array.from(section.querySelectorAll<HTMLElement>('[data-lab-row]'));
  if (!readX || !readY || !hairX || !hairY) return;

  section.classList.add('is-live');

  // ---- coarse pointer: scroll-progress readout ----------------------------
  if (!hasFinePointer()) {
    section.dataset.mode = 'scroll';
    readX.textContent = '----';
    const update = () => {
      const r = section.getBoundingClientRect();
      const travelled = clamp(window.innerHeight - r.top, 0, r.height + window.innerHeight);
      readY.textContent = pad(travelled, 4);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return;
  }

  if (prefersReducedMotion()) {
    // Hairlines without easing, readout still live.
    section.dataset.mode = 'static';
  }

  const eased = section.dataset.mode !== 'static';
  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;
  let inside = false;

  const hit = (localY: number) => {
    for (const row of rows) {
      const top = row.offsetTop;
      const on = localY >= top && localY < top + row.offsetHeight;
      row.toggleAttribute('data-hit', on);
    }
  };

  const loop = createLoop(() => {
    if (eased) {
      x = lerp(x, tx, 0.3);
      y = lerp(y, ty, 0.3);
    } else {
      x = tx;
      y = ty;
    }
    hairY.style.translate = `${x.toFixed(1)}px 0`;
    hairX.style.translate = `0 ${y.toFixed(1)}px`;
    readX.textContent = pad(clamp(x, 0, 9999), 4);
    readY.textContent = pad(clamp(y, 0, 9999), 4);
    return Math.abs(x - tx) + Math.abs(y - ty) > 0.2;
  });

  section.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      const r = section.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!inside) {
        inside = true;
        x = tx;
        y = ty;
        section.dataset.on = '';
      }
      hit(ty);
      loop.wake();
    },
    { passive: true },
  );

  section.addEventListener('pointerleave', () => {
    inside = false;
    delete section.dataset.on;
    rows.forEach((row) => row.removeAttribute('data-hit'));
  });
}
