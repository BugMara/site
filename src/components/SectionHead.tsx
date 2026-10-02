import type { ReactNode } from 'react';
import styles from './SectionHead.module.css';

interface Props {
  index: string;
  label: string;
  id: string;
  aside?: ReactNode;
}

/**
 * Tiny technical section header: "01 / WORK" with an optional right-aligned aside.
 * The label is the section's real heading (h2); the large statements below it are prose.
 */
export function SectionHead({ index, label, id, aside }: Props) {
  return (
    <header className={styles.head} data-reveal>
      <span className="meta">{index}</span>
      <span className="meta" aria-hidden="true">
        /
      </span>
      <h2 className={`${styles.label} meta`} id={id}>
        {label}
      </h2>
      {aside ? <div className={`${styles.aside} meta`}>{aside}</div> : null}
    </header>
  );
}
