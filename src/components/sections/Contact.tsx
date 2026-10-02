import type { CSSProperties } from 'react';
import { SectionHead } from '@/components/SectionHead';
import { SplitText } from '@/components/SplitText';
import { Clock } from '@/components/Clock';
import { site } from '@/config/site';
import styles from './Contact.module.css';

export function Contact() {
  return (
    <section className={`${styles.contact} wrap`} id="contact" aria-labelledby="contact-title">
      <SectionHead index="04" label="Contact" id="contact-title" />

      <div className={`${styles.body} grid`}>
        <SplitText
          as="p"
          className={`${styles.statement} h1`}
          lines={['SAY', 'HELLO.']}
          data-reveal=""
        />

        <div
          className={styles.channels}
          data-reveal
          style={{ '--delay': '120ms' } as CSSProperties}
        >
          <a className={`${styles.mail} h2`} href={`mailto:${site.email}`}>
            {site.email}
          </a>

          <ul className={`${styles.links} meta`}>
            {site.links.map((l) => (
              <li key={l.href}>
                <a className={styles.link} href={l.href} rel="noopener">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>

          <p className={`${styles.where} meta`}>
            <span>
              {site.location.city}, {site.location.country}
            </span>
            <Clock />
          </p>
        </div>
      </div>
    </section>
  );
}
