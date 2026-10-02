// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // site: 'https://example.com', // PLACEHOLDER — set the production URL before launch (canonical URLs, sitemap).
  output: 'static',
  compressHTML: true,
  devToolbar: { enabled: false },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // Lightning CSS folds `animation-timeline` into the `animation` shorthand, which
      // browsers reject, silently killing every scroll-driven animation. esbuild does not.
      cssMinify: 'esbuild',
    },
  },
});
