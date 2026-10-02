/**
 * Shared motion primitives. Every interaction module imports from here so the
 * gating rules (reduced motion, pointer type) live in exactly one place.
 */

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True for mouse / trackpad / pen setups where hover and precise pointing exist. */
export const hasFinePointer = (): boolean =>
  window.matchMedia('(pointer: fine) and (hover: hover)').matches;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));

export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const pad = (n: number, width = 2): string => String(Math.trunc(n)).padStart(width, '0');

export interface Loop {
  /** Schedule a frame if the loop is idle. Safe to call every event. */
  wake(): void;
  stop(): void;
  readonly running: boolean;
}

/**
 * A requestAnimationFrame loop that runs only while there is work.
 * `step` returns true to request another frame, false to settle.
 * This is what keeps the page calm when nothing is happening.
 */
export function createLoop(step: (dt: number) => boolean): Loop {
  let id = 0;
  let last = 0;

  const frame = (now: number) => {
    const dt = last ? Math.min(64, now - last) : 16;
    last = now;
    if (step(dt)) {
      id = requestAnimationFrame(frame);
    } else {
      id = 0;
      last = 0;
    }
  };

  return {
    wake() {
      if (!id) id = requestAnimationFrame(frame);
    },
    stop() {
      if (id) cancelAnimationFrame(id);
      id = 0;
      last = 0;
    },
    get running() {
      return id !== 0;
    },
  };
}
