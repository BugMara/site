import styles from './Rail.module.css';

/**
 * Scroll rail: a 1px hairline on the right edge carrying a short yellow segment at the
 * current scroll position. Pure CSS (scroll-driven animation); absent where unsupported.
 */
export function Rail() {
  return (
    <div className={styles.rail} aria-hidden="true">
      <div className={styles.pos} />
    </div>
  );
}
