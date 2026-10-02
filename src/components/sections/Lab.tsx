'use client';

import type { CSSProperties } from 'react';
import { SectionHead } from '@/components/SectionHead';
import { initLab } from '@/scripts/lab';
import { useInit } from '@/scripts/useInit';
import styles from './Lab.module.css';

export interface LabCategory {
  key: string;
  index: string;
  label: string;
  count: number;
}

interface Props {
  categories: LabCategory[];
}

const pad = (n: number) => String(n).padStart(2, '0');

export function Lab({ categories }: Props) {
  const ref = useInit<HTMLElement>(initLab);

  return (
    <section className={`${styles.lab} wrap`} id="lab" aria-labelledby="lab-title" ref={ref}>
      <SectionHead
        index="03"
        label="Lab"
        id="lab-title"
        aside={
          <span className={styles.readout} aria-hidden="true">
            <span>X</span>
            <span className={styles.value} data-lab-x>
              0000
            </span>
            <span>Y</span>
            <span className={styles.value} data-lab-y>
              0000
            </span>
          </span>
        }
      />

      <div className={`${styles.body} grid`}>
        <p className={`${styles.statement} h1`} data-reveal>
          The Lab
        </p>
        <p
          className={`${styles.intro} small`}
          data-reveal
          style={{ '--delay': '100ms' } as CSSProperties}
        >
          Experiments, prototypes, research, failed ideas, technical notes, build logs. Published
          when they are ready, including the ones that did not work.
        </p>
      </div>

      <ol className={styles.list}>
        {categories.map((c, i) => (
          <li
            key={c.key}
            className={styles.item}
            style={{ '--delay': `${i * 70}ms` } as CSSProperties}
            data-reveal
            data-lab-row
          >
            <span className={`${styles.idx} meta`}>{c.index}</span>
            <span className={`${styles.name} h2`}>{c.label}</span>
            <span className={`${styles.count} meta`}>
              <span className={styles.n}>{pad(c.count)}</span> entries
            </span>
          </li>
        ))}
      </ol>

      {/* Measuring hairlines (scripts/lab.ts). Decorative. */}
      <span className={`${styles.hair} ${styles.hairX}`} aria-hidden="true" data-lab-hx />
      <span className={`${styles.hair} ${styles.hairY}`} aria-hidden="true" data-lab-hy />
    </section>
  );
}
