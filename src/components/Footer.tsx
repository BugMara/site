import { site } from '@/config/site';
import { Clock } from './Clock';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={`${styles.footer} wrap`} id="footer">
      <div className={styles.top}>
        <p className={styles.brand}>{site.name}</p>
        <div className={styles.desc}>
          <p className="meta">{site.tagline}</p>
          <p className={`${styles.place} meta`}>{site.location.country}</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className="meta">
          © {year} {site.name}
        </p>
        <ul className={styles.links}>
          <li>
            <a className={`${styles.link} meta`} href={`mailto:${site.email}`}>
              Email
            </a>
          </li>
          {site.links.map((l) => (
            <li key={l.href}>
              <a className={`${styles.link} meta`} href={l.href} rel="noopener">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <span className={styles.clock}>
          <Clock />
        </span>
        <a className={`${styles.link} ${styles.topLink} meta`} href="#top">
          Top ↑
        </a>
      </div>

      <p className={`${styles.below} micro`} data-below aria-hidden="true">
        There is nothing below this.
      </p>
    </footer>
  );
}
