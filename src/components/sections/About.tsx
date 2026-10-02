import type { CSSProperties } from 'react';
import { SectionHead } from '@/components/SectionHead';
import { SplitText } from '@/components/SplitText';
import { site } from '@/config/site';
import styles from './About.module.css';

export function About() {
  return (
    <section className={`${styles.about} wrap`} id="about" aria-labelledby="about-title">
      <SectionHead index="02" label="About" id="about-title" />

      <div className={`${styles.body} grid`}>
        <div className={`${styles.manifesto} h1`} data-reveal data-manifesto>
          <SplitText as="p" lines={['WE ARE BUGMARA.']} />
          <SplitText as="p" lines={['WE BUILD.']} />
          <SplitText as="p" className={styles.break} lines={['WE BREAK.']} data-fracture="" />
          <SplitText as="p" lines={['WE LEARN.']} />
          <SplitText as="p" className={`${styles.again} again`} lines={['WE BUILD AGAIN.']} />
        </div>

        <div className={styles.text} data-reveal style={{ '--delay': '120ms' } as CSSProperties}>
          <p className="body">
            BugMara is a technology and engineering collective from {site.location.country}. We
            build software and systems, take them apart to understand them, and build them again.
            Most of what we make starts as an experiment in the lab.
          </p>

          <dl className={`${styles.facts} meta`}>
            <div className={styles.fact}>
              <dt>Base</dt>
              <dd>
                {site.location.city}, {site.location.country}
              </dd>
            </div>
            <div className={styles.fact}>
              <dt>Est.</dt>
              <dd>—</dd>
            </div>
            <div className={styles.fact}>
              <dt>Team</dt>
              <dd>—</dd>
            </div>
            <div className={styles.fact}>
              <dt>Status</dt>
              <dd>
                <i className="dot" aria-hidden="true" /> Active
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
