/**
 * Live clocks. One timer drives every `[data-clock]` on the page.
 * Each node declares its zone with `data-tz`; the time is written into `[data-clock-time]`.
 */

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
      tz: node.dataset.tz ?? 'UTC',
      out: node.querySelector<HTMLElement>('[data-clock-time]') ?? node,
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
    const now = new Date();
    for (const t of targets) {
      const text = formatterFor(t.tz).format(now);
      if (t.out.textContent !== text) t.out.textContent = text;
    }
    // Align the next tick to the next whole second so the display never stutters.
    timer = window.setTimeout(tick, 1000 - (Date.now() % 1000));
  };

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
