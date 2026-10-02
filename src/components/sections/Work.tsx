'use client';

import type { CSSProperties } from 'react';
import { SectionHead } from '@/components/SectionHead';
import { SplitText } from '@/components/SplitText';
import type { ProjectData } from '@/content/schema';
import { initWork } from '@/scripts/work';
import { useInit } from '@/scripts/useInit';
import styles from './Work.module.css';

export type ProjectItem = ProjectData & { slug: string };

interface Props {
  projects: ProjectItem[];
}

const pad = (n: number) => String(n).padStart(2, '0');
const statusLabel: Record<ProjectData['status'], string> = {
  placeholder: 'TBD',
  'in-progress': 'In progress',
  shipped: 'Shipped',
  archived: 'Archived',
};

export function Work({ projects }: Props) {
  const ref = useInit<HTMLElement>(initWork);

  return (
    <section className={`${styles.work} wrap`} id="work" aria-labelledby="work-title" ref={ref}>
      <SectionHead
        index="01"
        label="Work"
        id="work-title"
        aside={`${pad(projects.length)} entries`}
      />

      <ol className={styles.list}>
        {projects.map((p, i) => {
          const index = pad(p.order);
          const rowProps = {
            className: styles.row,
            'data-work-row': '',
            'data-index': index,
            'data-title': p.title,
            'data-cursor': 'view',
            'data-cursor-label': p.href ? 'View' : 'Soon',
          };
          const inner = (
            <>
              <span className={`${styles.idx} meta`}>{index}</span>
              <SplitText as="span" className={`${styles.name} h2`} lines={[p.title]} />
              <span className={`${styles.meta} meta`}>
                <span className={styles.cell}>{p.type ?? '—'}</span>
                <span className={styles.cell}>{p.year ?? '—'}</span>
                <span className={styles.cell}>{statusLabel[p.status]}</span>
              </span>
            </>
          );
          return (
            <li
              key={p.slug}
              className={styles.item}
              style={{ '--delay': `${i * 70}ms` } as CSSProperties}
              data-reveal
            >
              {p.href ? (
                <a href={p.href} {...rowProps}>
                  {inner}
                </a>
              ) : (
                <div {...rowProps}>{inner}</div>
              )}
            </li>
          );
        })}
      </ol>

      {/*
        Preview plate. Trails the pointer over a hovered row (scripts/work.ts).
        Typographic for now; when projects have artwork, render it inside .media.
      */}
      <div className={styles.plate} aria-hidden="true" data-work-plate>
        <div className={styles.media}>
          <span className={`${styles.plateIdx} h1`} data-work-plate-idx>
            01
          </span>
        </div>
        <span className={`${styles.plateTitle} micro`} data-work-plate-title>
          Project one
        </span>
      </div>
    </section>
  );
}
