/**
 * Live clocks. One timer drives every `[data-clock]` on the page.
 * Each node declares its zone with `data-tz`; the time is written into `[data-clock-time]`.
 * While a clock is hovered it runs backwards, three times as fast. It snaps back on leave.
 */

const REWIND_RATE = 3;

const formatters = new Map<string, Intl.DateTimeFormat>();

const formatterFor = (tz: string) => {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    formatters.set(tz, f);
  }
  return f;
};

let started = false;

export function initClocks(): void {
  if (started) return;
  started = true;

  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-clock]'));
  if (!nodes.length) return;

  const targets = nodes
    .map((node) => ({
      node,
      tz: node.dataset.tz ?? 'UTC',
      out: node.querySelector<HTMLElement>('[data-clock-time]') ?? node,
      /** Timestamp at which a hover started; 0 when running forward. */
      rewindFrom: 0,
    }))
    .filter((t) => {
      try {
        formatterFor(t.tz);
        return true;
      } catch {
        return false;
      }
    });

  let timer = 0;

  const tick = () => {
    const now = Date.now();
    let rewinding = false;
    for (const t of targets) {
      const shown = t.rewindFrom ? t.rewindFrom - (now - t.rewindFrom) * REWIND_RATE : now;
      if (t.rewindFrom) rewinding = true;
      const text = formatterFor(t.tz).format(new Date(shown));
      if (t.out.textContent !== text) t.out.textContent = text;
    }
    // Align the next tick to the next whole second so the display never stutters.
    timer = window.setTimeout(tick, rewinding ? 1000 / REWIND_RATE : 1000 - (now % 1000));
  };

  for (const t of targets) {
    t.node.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      t.rewindFrom = Date.now();
      t.node.setAttribute('data-rewind', '');
      window.clearTimeout(timer);
      tick();
    });
    t.node.addEventListener('pointerleave', () => {
      t.rewindFrom = 0;
      t.node.removeAttribute('data-rewind');
      window.clearTimeout(timer);
      tick();
    });
  }

  const start = () => {
    if (!timer) tick();
  };
  const stop = () => {
    window.clearTimeout(timer);
    timer = 0;
  };

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}
