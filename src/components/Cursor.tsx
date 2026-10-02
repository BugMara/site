'use client';

import { initCursor } from '@/scripts/cursor';
import { useInit } from '@/scripts/useInit';
import styles from './Cursor.module.css';

/**
 * Custom cursor. Decorative; hidden from assistive tech. scripts/cursor.ts activates it
 * only on fine-pointer devices without a reduced-motion preference.
 */
export function Cursor() {
  const ref = useInit<HTMLDivElement>(initCursor);
  return (
    <div className={styles.cursor} ref={ref} aria-hidden="true" data-cursor-root>
      <div className={styles.dot} data-cursor-dot />
      <div className={styles.ring} data-cursor-ring>
        <span className={`${styles.label} micro`} data-cursor-label />
      </div>
      <div className={styles.twin} data-cursor-twin />
    </div>
  );
}
