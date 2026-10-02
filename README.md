# BUGMARA — site

Official website for BugMara, a technology and engineering collective from Nepal.

Minimal. Quiet. Precise. Then, occasionally, something moves that shouldn't.

## Stack

- [Astro](https://astro.build) 7, static output, no client framework.
- Scoped CSS per component; every colour, size, space and duration is a token in `src/styles/tokens.css`.
- One small vanilla TypeScript module per interaction in `src/scripts/`, each gating itself on `prefers-reduced-motion` and pointer type.
- Self-hosted fonts via Fontsource: Archivo (variable, width axis) and JetBrains Mono.

The design system is documented in [`docs/DESIGN.md`](docs/DESIGN.md).

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/
npm run check      # type-check .astro and .ts
```

Node 22.12 or newer.

## Structure

```
src/
  config/site.ts            facts about the organisation: name, tagline, location, email, links, nav
  content.config.ts         content collections: projects, lab
  content/projects/*.md     one file per project (placeholders in v1)
  content/lab/*.md          one file per lab entry (template only in v1)
  styles/tokens.css         design tokens
  styles/base.css           reset, type classes, utilities, reduced-motion and no-JS gates
  layouts/Base.astro        document shell: head, fonts, nav, footer, cursor, rail
  components/               Nav, Footer, Cursor, Clock, Rail, SectionHead, SplitText
  components/sections/      Hero, Work, About, Lab, Contact
  scripts/                  motion primitives + one module per interaction
  pages/index.astro         composition only
docs/DESIGN.md              the design system
```

## Adding content

**A project** — add `src/content/projects/05-name.md`:

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

**A lab entry** — copy `src/content/lab/example-entry.md`, set `draft: false`. Category counts on the homepage update automatically.

**Individual pages** — not built yet. When they are, `src/pages/work/[slug].astro` and `src/pages/lab/[slug].astro` read from the same collections; nothing on the homepage needs to change.

## Placeholders to replace before launch

| Where                                 | What                          |
| ------------------------------------- | ----------------------------- |
| `src/config/site.ts`                  | `email`                       |
| `astro.config.mjs`                    | `site` (production URL)       |
| `src/content/projects/`               | the four placeholder projects |
| `src/components/sections/About.astro` | `Est.` and `Team` facts       |

## Interactions

All of them are discoverable, none are announced. The list, with their touch and keyboard equivalents, is in `docs/DESIGN.md` §5. Everything degrades: the page is complete with JavaScript disabled, and under `prefers-reduced-motion` the cursor, proximity and measuring modules do not start.

## Performance

No client framework, no images, no WebGL. Fonts are the largest asset (about 110 KB for both latin subsets). All cursor-driven work runs in a single `requestAnimationFrame` loop that stops the moment values settle.
