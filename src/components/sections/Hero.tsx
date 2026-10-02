'use client';

import { useCallback } from 'react';
import { SplitText } from '@/components/SplitText';
import { Clock } from '@/components/Clock';
import { formatCoordinate, site } from '@/config/site';
import { initHero } from '@/scripts/hero';
import { initFall } from '@/scripts/fall';
import { initIdle } from '@/scripts/idle';
import { useInit } from '@/scripts/useInit';
import styles from './Hero.module.css';

export function Hero() {
  const init = useCallback((el: HTMLElement) => {
    initHero(el);
    initFall(el);
    initIdle(el);
  }, []);
  const ref = useInit<HTMLElement>(init);
  const { location } = site;

  return (
    <section className={`${styles.hero} wrap`} id="top" aria-labelledby="hero-title" ref={ref}>
      <div className={styles.top} data-awake>
        <p className="meta">
          EXP. <span data-exp>{site.experiment}</span>
        </p>
        <p className={`${styles.status} meta`}>
          <i className="dot dot--live" aria-hidden="true" data-status-dot />
          <span data-status-text>System active</span>
          <span data-sleep-text hidden>
            System idle
          </span>
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
          data-cursor="link"
        />

        <div className={`${styles.coords} micro`} data-proximity data-awake>
          <p>{formatCoordinate(location.lat, 'lat')}</p>
          <p>{formatCoordinate(location.lng, 'lng')}</p>
          <p className={styles.elev}>Elev. {location.elevationM} m</p>
          <span className={styles.clock}>
            <Clock className="micro" />
          </span>
          <p className={styles.visit} data-visit hidden />
        </div>
      </div>

      <div className={styles.foot} data-floor>
        <p className="meta">{site.tagline}</p>
        <button className={`${styles.rebuild} meta`} type="button" data-rebuild hidden>
          ↺ Rebuild
        </button>
      </div>
    </section>
  );
}
