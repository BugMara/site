import localFont from 'next/font/local';

/** Archivo, variable: weight 100–900, width 62–125%. The width axis drives the hero. */
export const sans = localFont({
  src: '../fonts/archivo-latin-wdth-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-sans',
  declarations: [{ prop: 'font-stretch', value: '62% 125%' }],
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
});

/** JetBrains Mono 400: every piece of metadata on the site. */
export const mono = localFont({
  src: '../fonts/jetbrains-mono-latin-400-normal.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-mono',
  fallback: ['ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
});
