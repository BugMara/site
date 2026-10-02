/**
 * Print the page and you get an incident report. The report block exists only in the print
 * stylesheet; this fills in the numbers right before printing.
 */
export function initReport(report: HTMLElement): void {
  const started = Date.now();
  const fill = () => {
    const set = (key: string, value: string) => {
      const el = report.querySelector<HTMLElement>(`[data-report="${key}"]`);
      if (el) el.textContent = value;
    };
    const visits = (() => {
      try {
        return JSON.parse(localStorage.getItem('bugmara:visits') ?? 'null') as {
          count?: number;
        } | null;
      } catch {
        return null;
      }
    })();
    set('printed', new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    set('visit', String(visits?.count ?? 1).padStart(3, '0'));
    set('exp', String(Number(localStorage.getItem('bugmara:exp') ?? 0)).padStart(3, '0'));
    set('time', `${Math.round((Date.now() - started) / 1000)} s`);
    set('viewport', `${window.innerWidth} × ${window.innerHeight}`);
    set('fallen', String(document.querySelectorAll('.ghost[data-fallen]').length).padStart(2, '0'));
    set('decayed', String(document.querySelectorAll('[data-decayed]').length).padStart(2, '0'));
    set('status', document.querySelector('[data-status-text]')?.textContent ?? '');
  };
  window.addEventListener('beforeprint', fill);
  fill();
}
