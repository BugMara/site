import type { CSSProperties, HTMLAttributes } from 'react';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

interface Props extends HTMLAttributes<HTMLElement> {
  lines: string[];
  as?: Tag;
}

/** Deterministic hash → [0, 1). Stable between server and client renders. */
const seed = (n: number, k: number) => {
  const x = Math.sin(n * 12.9898 + k * 78.233) * 43758.5453;
  return (x - Math.floor(x)).toFixed(3);
};

/**
 * Splits text into per-character spans so CSS/JS can address letters individually.
 * The accessible name is the plain text; the spans are hidden from assistive tech.
 * Each `.ch` carries `--i` (index) and two stable seeds `--sx`, `--sy` in [0, 1).
 */
export function SplitText({ lines, as: Tag = 'p', ...rest }: Props) {
  let i = 0;
  return (
    <Tag aria-label={lines.join(' ')} {...rest}>
      {lines.map((line, li) => (
        <span key={li} className="line" aria-hidden="true">
          {[...line].map((ch, ci) => {
            if (ch === ' ') {
              return (
                <span key={ci} className="sp">
                  {' '}
                </span>
              );
            }
            const style = { '--i': i, '--sx': seed(i, 1), '--sy': seed(i, 2) } as CSSProperties;
            i += 1;
            return (
              <span key={ci} className="ch" style={style}>
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
