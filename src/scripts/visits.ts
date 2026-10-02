import { pad } from './motion';

/**
 * The site remembers you. Visit count and last-seen time live in localStorage; a returning
 * visitor gets one extra line of hero metadata. A first visit says nothing.
 */
const KEY = 'bugmara:visits';

interface Record {
  count: number;
  last: number;
}

const read = (): Record | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Record>;
    return typeof v.count === 'number' && typeof v.last === 'number'
      ? { count: v.count, last: v.last }
      : null;
  } catch {
    return null;
  }
};

const write = (r: Record) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
  } catch {
    /* no persistence available */
  }
};

const ago = (ms: number): string => {
  const m = Math.round(ms / 60000);
  if (m < 1) return 'moments ago';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
};

export function initVisits(line: HTMLElement): void {
  const prev = read();
  const now = Date.now();
  write({ count: (prev?.count ?? 0) + 1, last: now });
  if (!prev) return;

  line.textContent = `Visit ${pad(prev.count + 1, 3)} · last ${ago(now - prev.last)}`;
  line.hidden = false;
}
