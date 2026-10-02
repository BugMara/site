# BUGMARA — Design System

Working document. Every value here maps 1:1 to a token in `src/styles/tokens.css`.
Change the token, the site follows.

---

## 0. Reading of the brief

The site has two states and the whole design is the distance between them.

| Untouched                                                                 | Touched                                                                                            |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Still. Monochrome. Enormous type, microscopic metadata, a lot of nothing. | Something moves that should not. Width breathes. A line fractures. A section starts measuring you. |

Rules derived from this:

1. Nothing animates without a cause. The only idle motion is a 1-pixel status indicator and a clock, both of which are real.
2. Every interaction is discoverable, never announced. No "hover here".
3. Yellow is a signal, not a colour. It appears where something is _live_: the active section, the status dot, the cursor's target, a measured value.
4. Type carries the design. There are no images in v1. The "preview" on project hover is a typographic plate, not a card.
5. Mobile is recomposed, not shrunk. Pointer-only effects are replaced, not removed.
6. All motion is gated on `prefers-reduced-motion` and `pointer: fine`. The site is complete with JavaScript disabled.

---

## 1. Colour

| Token        | Value      | Use                                           |
| ------------ | ---------- | --------------------------------------------- |
| `--c-bg`     | `#0A0A0A`  | Page                                          |
| `--c-fg`     | `#F4F3EE`  | Primary text, strong rules                    |
| `--c-fg-2`   | `fg @ 64%` | Body copy, secondary text (≈ 8.4:1)           |
| `--c-fg-3`   | `fg @ 50%` | Metadata, labels (≈ 4.9:1, passes AA at 11px) |
| `--c-rule`   | `fg @ 12%` | Hairlines                                     |
| `--c-rule-2` | `fg @ 28%` | Hairlines, emphasised                         |
| `--c-accent` | `#FDB614`  | Signal only. Never fills, never large.        |

Accent budget on the homepage at rest: one 4px dot. Everything else yellow is a response to the user.

Selection: yellow background, black text. The one place yellow gets to be a surface, because the user caused it.

---

## 2. Typography

Two families. Both self-hosted, latin subset, `font-display: swap`.

**Display / UI — Archivo (variable: wght 100–900, wdth 62–125)**
Squared grotesk, confident at 200px, neutral at 16px. The width axis is the hero interaction: letters widen under the cursor. Uppercase for all display sizes, tracked tight.

**Metadata — JetBrains Mono 400**
Everything that reads like an instrument: indices, coordinates, time, status, labels. Always uppercase, tracked +0.08em, always small.

| Token         | Size                            | Line | Tracking | Role                                                |
| ------------- | ------------------------------- | ---- | -------- | --------------------------------------------------- |
| `--t-display` | `clamp(3.5rem, 15.5vw, 17rem)`  | 0.86 | −0.04em  | Hero statement only                                 |
| `--t-h1`      | `clamp(2.75rem, 8vw, 8.5rem)`   | 0.9  | −0.035em | Section statements (manifesto, THE LAB, SAY HELLO)  |
| `--t-h2`      | `clamp(1.5rem, 3.6vw, 3.75rem)` | 1.0  | −0.025em | Project names, lab categories                       |
| `--t-body`    | `1.0625rem`                     | 1.5  | 0        | Prose, max 52ch                                     |
| `--t-small`   | `0.8125rem`                     | 1.45 | 0        | Secondary prose                                     |
| `--t-meta`    | `0.6875rem` (11px)              | 1.4  | +0.08em  | Mono labels                                         |
| `--t-micro`   | `0.625rem` (10px)               | 1.3  | +0.1em   | Mono, coordinates only, never for essential content |

Weight: display and headings at 600. Body at 400. Nothing bolder than 600 anywhere.

The contrast the brief asks for is produced by distance on this scale: `--t-display` sits next to `--t-micro`, 27× apart, with nothing in between.

---

## 3. Space & layout

Base unit 4px. Named steps, not a numeric scale, so usage is semantic:

| Token           | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| `--s-1 … --s-6` | 4, 8, 12, 16, 24, 32px                                      |
| `--s-7 … --s-9` | 48, 64, 96px                                                |
| `--s-block`     | `clamp(4rem, 10vh, 8rem)` — between groups inside a section |
| `--s-section`   | `clamp(9rem, 22vh, 18rem)` — between sections               |
| `--margin`      | `clamp(1.25rem, 5vw, 6rem)` — page inset                    |
| `--max`         | `1760px` — page width cap                                   |

Grid: 12 columns, `--gutter: clamp(1rem, 2.5vw, 2.5rem)`. Used for asymmetry, not for cards. Typical placements:

- Hero statement: columns 4–12 (desktop), shifted right so the empty left third is a deliberate void.
- Prose: columns 7–11.
- Section head: index at column 1, label at column 2, right-side meta at column 12.

Rules: 1px, `--c-rule`. Rules are the only "container". No boxes, no backgrounds, no radius.

---

## 4. Motion

| Token        | Value                            | Use                         |
| ------------ | -------------------------------- | --------------------------- |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)`  | Anything that arrives       |
| `--ease-io`  | `cubic-bezier(0.65, 0, 0.35, 1)` | Anything that changes state |
| `--d-1`      | 160ms                            | Colour, opacity on hover    |
| `--d-2`      | 360ms                            | Position shifts             |
| `--d-3`      | 720ms                            | Reveals                     |

Physical motion means damped interpolation in JS (`lerp` at 0.14–0.2 per frame) for anything cursor-driven, and `--ease-out` for anything state-driven. No bounce, no overshoot, no spring libraries.

Scroll-linked work uses CSS scroll-driven animations (`animation-timeline`) behind `@supports`. Where unsupported, the static state is the design.

`prefers-reduced-motion: reduce` → all durations 1ms, all cursor-driven modules do not initialise, the status dot stops pulsing.

---

## 5. Interaction language

A small set. Each one has a _cause_, a _response_ and a _rest state_. Nothing is on a loop.

| #   | Where         | Cause                            | Response                                                                                   | Touch / keyboard equivalent                                          |
| --- | ------------- | -------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| 1   | Hero          | Cursor within ~220px of a letter | That letter's width eases toward +10%; the word breathes                                   | Width is tied to scroll instead (compresses as the hero leaves)      |
| 2   | Hero          | Cursor near the coordinates      | A third line (elevation) fades in                                                          | Always visible                                                       |
| 3   | Hero / footer | Time passes                      | Kathmandu clock ticks (UTC+5:45)                                                           | Same                                                                 |
| 4   | Nav           | Scrolling into a section         | That section's index turns yellow                                                          | Same                                                                 |
| 5   | Work          | Hover / focus on a row           | Name shifts 12px, index turns yellow, siblings dim, a typographic plate follows the cursor | Plate off; meta always visible; `:focus-within` drives the row state |
| 6   | About         | Hover "WE BREAK."                | Its letters displace ±2px / ±1.5° and hold; snap back on leave                             | `:active` on tap                                                     |
| 7   | Lab           | Cursor enters the section        | Two hairlines track the cursor; a mono readout gives X/Y in px                             | Readout shows section scroll progress                                |
| 8   | Global        | Interactive element under cursor | Dot cursor becomes a 32px ring; on project rows the ring carries a label                   | Native cursor, untouched                                             |
| 9   | Global        | Scroll                           | A 1px rail on the right edge carries a short yellow segment at the scroll position         | Hidden under 64em                                                    |
| 10  | Global        | Text selection                   | Yellow / black                                                                             | Same                                                                 |

What is deliberately _not_ here: parallax, marquee, text scramble, magnetic buttons, page transitions, preloaders, sound.

---

## 6. Homepage composition

```
┌───────────────────────────────────────────────────────────────────────┐
│ BUGMARA                        01 / WORK  02 / ABOUT  03 / LAB  04 / CONTACT │
│                                                                       │
│ EXP. 001                                                              │
│ ● SYSTEM ACTIVE                                                       │
│                                   01                                  │
│                         WE BUILD                                      │
│                         THINGS.                                       │
│                                                        27.7017° N     │
│                                                        85.3206° E     │
│                                                        KTM 14:32:07   │
│ TECHNOLOGY / ENGINEERING / EXPERIMENTATION                            │
├───────────────────────────────────────────────────────────────────────┤
│ 01 / WORK                                            SELECTED         │
│ ──────────────────────────────────────────────────────────────────── │
│ 01  PROJECT ONE                                 TYPE — · YEAR —       │
│ ──────────────────────────────────────────────────────────────────── │
│ 02  PROJECT TWO                                                       │
│ …                                                                     │
├───────────────────────────────────────────────────────────────────────┤
│ 02 / ABOUT                                                            │
│ WE ARE BUGMARA.                                                       │
│ WE BUILD.                                                             │
│ WE BREAK.                              ┌ short paragraph, 52ch ┐      │
│ WE LEARN.                              │ base / est. / team    │      │
│ WE BUILD AGAIN.                        └───────────────────────┘      │
├───────────────────────────────────────────────────────────────────────┤
│ 03 / LAB                                          X 0412   Y 0288     │
│ THE LAB                                                               │
│ A  EXPERIMENTS                                        00 ENTRIES      │
│ B  RESEARCH                                           00 ENTRIES      │
│ C  PROTOTYPES                                         00 ENTRIES      │
│ D  FAILURES                                           00 ENTRIES      │
├───────────────────────────────────────────────────────────────────────┤
│ 04 / CONTACT                                                          │
│ SAY                                                                   │
│ HELLO.                                 hello@…  ·  GITHUB             │
├───────────────────────────────────────────────────────────────────────┤
│ BUGMARA                                                               │
│ TECHNOLOGY / ENGINEERING / EXPERIMENTATION · Nepal                    │
│ © 2026 BUGMARA                                       KTM 14:32:07  ↑  │
└───────────────────────────────────────────────────────────────────────┘
```

Mobile recomposition: single column; hero statement left-aligned at 15.5vw; hero metadata collapses to a two-column mono block under the statement; nav becomes wordmark + MENU (plain fade); project meta always visible under the name; lab readout becomes scroll progress; rail hidden.

---

## 7. Hierarchy review

Reading order on first paint, desktop:

1. WE BUILD THINGS. (display, 60% of the viewport's visual weight)
2. The void to its left
3. BUGMARA (wordmark, top-left)
4. Status dot (the only colour)
5. Metadata (found, not read)

Checks:

- At rest, is there anything moving? Only the dot and the clock. Both are facts.
- Remove all JS: does the page still look designed? Yes; every reveal defaults to visible.
- Remove colour: does the hierarchy survive? Yes; yellow carries state, never structure.
- Is any section a rectangle? No; sections are separated by rules and space.

---

## 8. Architecture

```
src/
  styles/tokens.css          every value in this document
  styles/base.css            reset, type classes, focus, selection, reveal, reduced motion
  config/site.ts             name, tagline, location, coordinates, email, links, nav
  content/schema.ts          zod schemas for projects and lab entries
  content/load.ts            reads content/*.md at build time (server components only)
  app/layout.tsx             document shell: fonts, nav, footer, cursor, rail, enhancement gate
  app/page.tsx               composition only
  app/fonts.ts               next/font/local: Archivo (variable, width axis), JetBrains Mono
  components/                Nav, Footer, Cursor, Clock, Rail, SectionHead, SplitText, Effects
  components/sections/       Hero, Work, About, Lab, Contact (each with a CSS Module)
  scripts/                   one module per interaction, each self-gating on motion/pointer
content/projects/*.md        placeholder entries
content/lab/*.md             template entry (draft)
```

Later additions slot in without touching the homepage: `app/work/[slug]/page.tsx`, `app/lab/[slug]/page.tsx`, a `team` collection, more `scripts/` modules.
