# BUGMARA — site

Official website for BugMara, a technology and engineering collective from Nepal.

Minimal. Quiet. Precise. Then, occasionally, something moves that shouldn't.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, React 19), exported as a fully static site (`output: 'export'`).
- CSS Modules per component; every colour, size, space and duration is a token in `src/styles/tokens.css`.
- One small vanilla TypeScript module per interaction in `src/scripts/`, each gating itself on `prefers-reduced-motion` and pointer type, mounted through a single `useInit` hook.
- Self-hosted fonts through `next/font/local`: Archivo (variable, width axis) and JetBrains Mono.

The design system is documented in [`docs/DESIGN.md`](docs/DESIGN.md).

## Develop

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # static output in out/
npm run preview    # serve out/
npm run typecheck  # tsc --noEmit
```

Node 22.12 or newer.

`dev` and `build` use the webpack bundler, which also runs on the WebAssembly SWC fallback.
That matters on locked-down Windows machines where an Application Control policy blocks the
native `@next/swc-win32-x64-msvc` binary: Turbopack refuses to start there, webpack does not.
`npm run dev:turbo` and `npm run build:turbo` use Turbopack where native bindings load.

## Structure

```
src/
  app/layout.tsx            document shell: fonts, nav, footer, cursor, rail, enhancement gate
  app/page.tsx              composition only; loads content at build time
  app/fonts.ts              next/font/local declarations
  config/site.ts            facts about the organisation: name, tagline, location, email, links, nav
  content/schema.ts         zod schemas: projects, lab
  content/load.ts           Markdown + frontmatter loader (server only)
  styles/tokens.css         design tokens
  styles/base.css           reset, type classes, utilities, reduced-motion and no-JS gates
  components/               Nav, Footer, Cursor, Clock, Rail, SectionHead, SplitText, Effects
  components/sections/      Hero, Work, About, Lab, Contact (+ CSS Modules)
  scripts/                  motion primitives + one module per interaction + useInit hook
  fonts/                    woff2 files (OFL licences alongside)
content/projects/*.md       one file per project (placeholders in v1)
content/lab/*.md            one file per lab entry (template only in v1)
docs/DESIGN.md              the design system
```

## Adding content

**A project** — add `content/projects/05-name.md`:

```yaml
---
title: PROJECT NAME
order: 5
type: SOFTWARE # optional, short, uppercase
year: '2026' # optional
status: shipped # placeholder | in-progress | shipped | archived
href: /work/name # optional; the row becomes a link when present
---
```

**A lab entry** — copy `content/lab/example-entry.md`, set `draft: false`. Category counts on the homepage update automatically.

**Individual pages** — not built yet. When they are, `src/app/work/[slug]/page.tsx` and `src/app/lab/[slug]/page.tsx` read from the same loader (`generateStaticParams` over the collection); nothing on the homepage needs to change.

## Placeholders to replace before launch

| Where                               | What                                       |
| ----------------------------------- | ------------------------------------------ |
| `src/config/site.ts`                | `email`                                    |
| `src/app/layout.tsx`                | `metadataBase` (production URL) once known |
| `src/content/projects/`             | the four placeholder projects              |
| `src/components/sections/About.tsx` | `Est.` and `Team` facts                    |

## Interactions

The headline is destructible (click letters; type BREAK / BUILD anywhere), rewrites itself when
you stop moving, the clock runs backwards under the pointer, the tab notices when you leave,
and the site remembers what you did. All of them are discoverable, none are announced. The list, with their touch and keyboard equivalents, is in `docs/DESIGN.md` §5. Everything degrades: the page is complete with JavaScript disabled, and under `prefers-reduced-motion` the cursor, proximity and measuring modules do not start.

## Performance

No images, no WebGL, no animation libraries. Beyond the React runtime the site's own JavaScript is a few kilobytes; fonts are about 110 KB for both latin subsets. All cursor-driven work runs in `requestAnimationFrame` loops that stop the moment values settle.
