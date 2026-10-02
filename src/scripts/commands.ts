import { emit } from './bus';

/**
 * The page listens. Type anywhere (no input field) and the last letters are echoed in a
 * tiny mono readout; a recognised word runs:
 *   BREAK   drop every letter of the headline
 *   BUILD   put it back
 *   WORK / ABOUT / LAB / CONTACT   go there
 */
const COMMANDS: Record<string, () => void> = {
  BREAK: () => emit('break-all'),
  BUILD: () => emit('rebuild'),
  WORK: () => go('work'),
  ABOUT: () => go('about'),
  LAB: () => go('lab'),
  CONTACT: () => go('contact'),
};

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ block: 'start' });
const MAX = 12;
const ECHO_MS = 1400;

export function initCommands(echo: HTMLElement): void {
  let buffer = '';
  let fade = 0;

  const show = (text: string, hit = false) => {
    echo.textContent = text;
    echo.classList.toggle('is-hit', hit);
    echo.classList.add('is-on');
    window.clearTimeout(fade);
    fade = window.setTimeout(() => echo.classList.remove('is-on'), hit ? ECHO_MS * 1.5 : ECHO_MS);
  };

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (!/^[a-z]$/i.test(e.key)) return;

    buffer = (buffer + e.key.toUpperCase()).slice(-MAX);
    const word = Object.keys(COMMANDS).find((w) => buffer.endsWith(w));
    if (word) {
      buffer = '';
      show(`> ${word}`, true);
      COMMANDS[word]?.();
      return;
    }
    show(`> ${buffer}`);
  });
}
