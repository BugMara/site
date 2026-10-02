'use client';

import { site } from '@/config/site';
import { initNav } from '@/scripts/nav';
import { useInit } from '@/scripts/useInit';
import styles from './Nav.module.css';

export function Nav() {
  const ref = useInit<HTMLElement>(initNav);
  return (
    <header className={styles.nav} ref={ref} data-nav>
      <a className={styles.brand} href="#top" aria-label={`${site.name} — top of page`}>
        {site.name}
      </a>

      <nav aria-label="Primary">
        <button
          className={`${styles.toggle} meta`}
          type="button"
          aria-expanded="false"
          aria-controls="nav-list"
          data-nav-toggle
        >
          MENU
        </button>
        <ul className={styles.list} id="nav-list">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a className={`${styles.link} meta`} href={item.href} data-nav-link>
                <span className={styles.idx}>{item.index}</span>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
