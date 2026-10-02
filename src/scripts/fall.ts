import { emit, on } from './bus';
import { pad } from './motion';

/**
 * The headline is destructible.
 *
 * Click a letter and it falls off the sentence onto the hero's bottom rule; the word closes
 * the gap. The status line degrades as letters go. A REBUILD control appears only once the
 * sentence is broken. The experiment counter counts breaks and remembers them (localStorage).
 *
 * Mechanics: the letter in the line is hidden and its advance width collapses (animated); a
 * clone, absolutely positioned where the letter stood, does the falling. On rebuild the clone
 * flies home while the gap reopens, then hands back to the original.
 *
 * Works with mouse, touch and the BREAK / BUILD keyboard commands (scripts/commands.ts).
 */
const STORE_KEY = 'bugmara:exp';
const RETURN_MS = 720;

const readExp = (): number => {
  try {
    const v = Number(localStorage.getItem(STORE_KEY));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
};

const writeExp = (n: number) => {
  try {
    localStorage.setItem(STORE_KEY, String(n));
  } catch {
    /* private mode, quota: the counter simply does not persist */
  }
};

export function initFall(hero: HTMLElement): void {
  const title = hero.querySelector<HTMLElement>('[data-breathe]');
  const letters = Array.from(hero.querySelectorAll<HTMLElement>('[data-breathe] .ch'));
  const floor = hero.querySelector<HTMLElement>('[data-floor]');
  const status = hero.querySelector<HTMLElement>('[data-status-text]');
  const dot = hero.querySelector<HTMLElement>('[data-status-dot]');
  const exp = hero.querySelector<HTMLElement>('[data-exp]');
  const rebuildBtn = hero.querySelector<HTMLButtonElement>('[data-rebuild]');
  if (!title || !letters.length || !floor || !status || !dot || !exp || !rebuildBtn) return;

  const ghosts = new Map<HTMLElement, HTMLElement>();
  let breaks = readExp();
  let brokenThisRound = false;
  let returning = false;
  if (breaks) exp.textContent = pad(breaks + 1, 3);

  const fallen = () => ghosts.size;

  const setStatus = () => {
    const n = fallen();
    const text = n === 0 ? 'System active' : n < letters.length ? 'System degraded' : 'System down';
    if (status.textContent !== text) status.textContent = text;
    dot.classList.toggle('dot--fast', n > 0 && n < letters.length);
    dot.classList.toggle('dot--dead', n === letters.length);
    hero.toggleAttribute('data-broken', n > 0);
    rebuildBtn.hidden = n === 0;
  };

  const drop = (el: HTMLElement) => {
    if (ghosts.has(el) || returning) return;
    const r = el.getBoundingClientRect();
    const t = title.getBoundingClientRect();
    const floorY = floor.getBoundingClientRect().top;
    const sx = Number(el.style.getPropertyValue('--sx')) || 0.5;
    const sy = Number(el.style.getPropertyValue('--sy')) || 0.5;

    const ghost = el.cloneNode(true) as HTMLElement;
    ghost.classList.add('ghost');
    ghost.style.left = `${(r.left - t.left).toFixed(1)}px`;
    ghost.style.top = `${(r.top - t.top).toFixed(1)}px`;
    ghost.style.width = `${r.width.toFixed(1)}px`;
    ghost.style.height = `${r.height.toFixed(1)}px`;
    title.appendChild(ghost);
    ghosts.set(el, ghost);

    // Next frame, so the transition starts from the resting position.
    requestAnimationFrame(() => {
      ghost.style.setProperty('--fall', `${Math.max(0, floorY - r.bottom - 1).toFixed(1)}px`);
      ghost.style.setProperty('--dx', `${((sx - 0.5) * r.width * 0.5).toFixed(1)}px`);
      ghost.style.setProperty('--rot', `${((sy - 0.5) * 50).toFixed(1)}deg`);
      ghost.setAttribute('data-fallen', '');
    });

    el.style.setProperty('--w', `${r.width.toFixed(1)}px`);
    el.setAttribute('data-gone', '');

    if (!brokenThisRound) {
      brokenThisRound = true;
      breaks += 1;
      writeExp(breaks);
      exp.textContent = pad(breaks + 1, 3);
      emit('broken');
    }
    setStatus();
  };

  const rebuild = () => {
    if (!ghosts.size || returning) return;
    returning = true;
    let i = 0;
    for (const [el, ghost] of ghosts) {
      ghost.style.setProperty('--delay', `${i * 30}ms`);
      ghost.removeAttribute('data-fallen');
      el.removeAttribute('data-gone');
      i += 1;
    }
    window.setTimeout(
      () => {
        for (const ghost of ghosts.values()) ghost.remove();
        ghosts.clear();
        returning = false;
        brokenThisRound = false;
        document.documentElement.dataset.rebuilt = '';
        setStatus();
        emit('rebuilt');
      },
      RETURN_MS + i * 30 + 40,
    );
    hero.removeAttribute('data-broken');
    rebuildBtn.hidden = true;
  };

  const breakAll = () => {
    const standing = letters.filter((l) => !ghosts.has(l));
    // Random order, staggered: a collapse, not a curtain.
    standing
      .map((el) => ({ el, k: Math.random() }))
      .sort((a, b) => a.k - b.k)
      .forEach(({ el }, i) => window.setTimeout(() => drop(el), i * 45));
  };

  letters.forEach((el) => el.addEventListener('click', () => drop(el)));
  rebuildBtn.addEventListener('click', rebuild);
  on('break-all', breakAll);
  on('rebuild', rebuild);

  setStatus();
}
