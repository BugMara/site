import { emit } from './bus';
import { site } from '@/config/site';

/**
 * It talks to engineers. A signed banner in the console and a `bugmara` object on window.
 */
declare global {
  interface Window {
    bugmara?: Record<string, unknown>;
  }
}

export function initConsole(): void {
  const brand = 'background:#fdb614;color:#0a0a0a;padding:2px 6px;font-weight:600;';
  const mono = 'color:#8e8d89;font-family:ui-monospace,Menlo,monospace;';
  const accent = 'color:#fdb614;font-family:ui-monospace,Menlo,monospace;';

  const api = {
    help() {
      console.log(
        `%c${site.name}%c  type one of these, or just type the word anywhere on the page.\n\n` +
          `%cbugmara.break()%c   drop every letter of the headline\n` +
          `%cbugmara.build()%c   put it back, and repair the decay\n` +
          `%cbugmara.sleep()%c   lights out\n` +
          `%cbugmara.wake()%c    lights on\n` +
          `%cbugmara.status%c    what the system thinks it is doing\n` +
          `%cbugmara.visits%c    what the system remembers about you`,
        brand,
        mono,
        accent,
        mono,
        accent,
        mono,
        accent,
        mono,
        accent,
        mono,
        accent,
        mono,
        accent,
        mono,
      );
    },
    break: () => emit('break-all'),
    build: () => {
      emit('rebuild');
      emit('repair');
    },
    sleep: () => {
      document.documentElement.dataset.asleep = '';
    },
    wake: () => {
      delete document.documentElement.dataset.asleep;
    },
    get status() {
      return document.querySelector('[data-status-text]')?.textContent ?? 'unknown';
    },
    get visits() {
      try {
        return JSON.parse(localStorage.getItem('bugmara:visits') ?? 'null');
      } catch {
        return null;
      }
    },
    get exp() {
      return Number(localStorage.getItem('bugmara:exp') ?? 0);
    },
  };

  window.bugmara = api;

  console.log(
    `%c${site.name}%c SYSTEM ACTIVE · ${site.location.lat}° N ${site.location.lng}° E · ${site.location.city}\n%ctype bugmara.help()`,
    brand,
    mono,
    accent,
  );
}
