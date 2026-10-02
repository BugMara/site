/**
 * Navigation: mobile disclosure + active-section tracking.
 * The active link gets `aria-current="location"`; CSS turns its index yellow.
 */
export function initNav(header: HTMLElement): void {
  const toggle = header.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const links = Array.from(header.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));

  // ---- mobile disclosure -------------------------------------------------
  const isOpen = () => header.hasAttribute('data-open');
  const setOpen = (open: boolean) => {
    header.toggleAttribute('data-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'CLOSE' : 'MENU';
    }
  };

  toggle?.addEventListener('click', () => setOpen(!isOpen()));
  links.forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle?.focus();
    }
  });

  // ---- active section ----------------------------------------------------
  if (!('IntersectionObserver' in window)) return;

  const sections = links
    .map((link) => {
      const id = link.hash.slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter((el): el is HTMLElement => el !== null);

  if (!sections.length) return;

  const intersecting = new Set<string>();

  const apply = () => {
    // The observed band is thin, so at most one section is normally inside it.
    const current = sections.find((s) => intersecting.has(s.id))?.id ?? null;
    for (const link of links) {
      if (current && link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) intersecting.add(entry.target.id);
        else intersecting.delete(entry.target.id);
      }
      apply();
    },
    // A 2% tall band sitting 45% down the viewport.
    { rootMargin: '-45% 0px -53% 0px', threshold: 0 },
  );

  sections.forEach((s) => io.observe(s));
}
