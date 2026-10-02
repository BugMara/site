/** The tab notices when you leave. */
export function initTitle(): void {
  const original = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'STILL HERE. — BUGMARA' : original;
  });
}
