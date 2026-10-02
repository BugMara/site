'use client';

import { SplitText } from '@/components/SplitText';
import { Clock } from '@/components/Clock';
import { formatCoordinate, site } from '@/config/site';
import { initHero } from '@/scripts/hero';
import { useInit } from '@/scripts/useInit';
import styles from './Hero.module.css';

export function Hero() {
  const ref = useInit<HTMLElement>(initHero);
  const { location } = site;

  return (
    <section className={`${styles.hero} wrap`} id="top" aria-labelledby="hero-title" ref={ref}>
      <div className={styles.top}>
        <p className="meta">EXP. {site.experiment}</p>
        <p className={`${styles.status} meta`}>
          <i className="dot dot--live" aria-hidden="true" />
          <span>System active</span>
        </p>
      </div>

      <div className={`${styles.stage} grid`}>
        <p className={`${styles.idx} meta`} aria-hidden="true">
          01
        </p>

        <SplitText
          as="h1"
          id="hero-title"
          className={`display ${styles.title}`}
          lines={['WE BUILD', 'THINGS.']}
          data-breathe=""
        />

        <div className={`${styles.coords} micro`} data-proximity>
          <p>{formatCoordinate(location.lat, 'lat')}</p>
          <p>{formatCoordinate(location.lng, 'lng')}</p>
          <p className={styles.elev}>Elev. {location.elevationM} m</p>
          <span className={styles.clock}>
            <Clock className="micro" />
          </span>
        </div>
      </div>

      <div className={styles.foot}>
        <p className="meta">{site.tagline}</p>
      </div>
    </section>
  );
}
