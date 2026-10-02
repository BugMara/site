/**
 * Tiny event bus on `document` so interaction modules can react to each other
 * without importing each other. Commands dispatch; the hero listens; About listens.
 */
export type BusEvent = 'break-all' | 'rebuild' | 'broken' | 'rebuilt';

export const emit = (name: BusEvent, detail?: unknown) =>
  document.dispatchEvent(new CustomEvent(`bugmara:${name}`, { detail }));

export const on = (name: BusEvent, fn: (detail: unknown) => void) =>
  document.addEventListener(`bugmara:${name}`, (e) => fn((e as CustomEvent).detail));
