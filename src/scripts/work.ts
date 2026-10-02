import { createLoop, hasFinePointer, lerp, prefersReducedMotion } from './motion';

/**
 * Work list: a typographic plate trails the pointer while a row is hovered.
 * Row hover/focus states themselves are pure CSS; this module only moves the plate.
 */
const OFFSET = 24;
const DAMPING = 0.18;

export function initWork(section: HTMLElement): void {
  if (!hasFinePointer() || prefersReducedMotion()) return;

  const plate = section.querySelector<HTMLElement>('[data-work-plate]');
  const plateIdx = section.querySelector<HTMLElement>('[data-work-plate-idx]');
  const plateTitle = section.querySelector<HTMLElement>('[data-work-plate-title]');
  const rows = Array.from(section.querySelectorAll<HTMLElement>('[data-work-row]'));
  if (!plate || !plateIdx || !plateTitle || !rows.length) return;

  let x = 0;
  let y = 0;
  let cx = 0;
  let cy = 0;
  let on = false;

  const place = (e: PointerEvent) => {
    const w = plate.offsetWidth;
    const h = plate.offsetHeight;
    // Keep the plate inside the viewport: flip to the other side of the pointer near edges.
    x = e.clientX + OFFSET + w > window.innerWidth ? e.clientX - OFFSET - w : e.clientX + OFFSET;
    y = e.clientY + OFFSET + h > window.innerHeight ? e.clientY - OFFSET - h : e.clientY + OFFSET;
  };

  const loop = createLoop(() => {
    cx = lerp(cx, x, DAMPING);
    cy = lerp(cy, y, DAMPING);
    plate.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    return Math.abs(cx - x) + Math.abs(cy - y) > 0.1;
  });

  for (const row of rows) {
    row.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      plateIdx.textContent = row.dataset.index ?? '';
      plateTitle.textContent = row.dataset.title ?? '';
      place(e);
      if (!on) {
        // Arrive in place rather than flying in from the last position.
        cx = x;
        cy = y;
        on = true;
      }
      plate.dataset.on = '';
      loop.wake();
    });
    row.addEventListener('pointerleave', () => {
      on = false;
      delete plate.dataset.on;
    });
  }

  section.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      place(e);
      loop.wake();
    },
    { passive: true },
  );
}
