# Sentinel Design System — working notes

## What this repo is

The design system for Sentinel, Centricity WealthTech's chat-led wealth-management assistant for
advisors. `design-system/` is a Claude Design project imported verbatim; the repository is the
scaffolding around it.

## Start here

**What real advisors complain about: `docs/RESEARCH.md`** — 60 linked verbatims from two advisor-facing
apps and one investor app, coded and ranked, with what each theme means for this product. The raw file is
`studio/research/verbatims.csv`.

**The data, the fields, the words and the visual DNA: `docs/DNA.md`.** What a screen may render, what
the product calls it, and the copy rules — extracted from the repository rather than proposed. The data
itself is one file, `screens/data/book.jsx`.

**Building the product? Read `docs/APP-PLAN.md`.** It is the plan for the app end to end — the five
surfaces, the four questions an advisor asks that a chat UI answers by default (what can I do · what
happens next · how do I go back · what if), the build order, and the honest note on what research it rests
on. `docs/SCREENS-PLAN.md` remains the inventory of what the archive had.

**New session, or a different account? Read `docs/CONTINUE-HERE.md` first.** It carries the state of
the work, the rulings that were made in conversation and are not visible in the code, what is open, and
what is deliberately not in this repository.


**Load the `sentinel-craft` skill before touching anything in `design-system/`, and before judging
whether spacing, alignment or craft is wrong.** It carries this system's own scale — generated from
`tokens/*.css`, so it cannot drift — its four hard rules, its real motion values, and the record of
which outside advice was rejected and why. Auditing Sentinel against a generic 4/8pt grid flags
11.5px type, 42px rows and 14px card padding, all three of which are the product.

## Standing instructions

- **Never restyle.** The visual language is settled. Fix gaps, spacing, correctness and consistency;
  do not change colour, type, radii, shadow or motion character. See CONTRIBUTING.md.
- **`design-system/readme.md` is the specification** (43 KB). Read the relevant section before
  changing a component — most surprising choices are deliberate and explained there.
- **`design-system/guidelines/contradictions.md`** is the system's own list of known inconsistencies.
  Check it before reporting something as new.
- **Every change under `design-system/` needs `npm run check:integrity -- --update` in the same
  commit.** That is the mechanism that keeps "imported verbatim" honest and every later edit visible.
- **Look at the work — at the scope of the change.** Load the `sentinel-scope` skill. `--only a,b` renders
  just the affected pages and `node tools/phone-shot.mjs <page> <n> out.png` returns one 375×812 phone
  instead of a 1.5 MB board. `npm run preview`, then render it. `node tools/check-previews.mjs --shots <dir>`
  renders all 82 pages at their declared `@dsCard` viewport and reports console errors, 404s
  and pages that mount nothing. A finding you did not see did not happen.
- **Never report a visual finding from source alone, or a code finding from a screenshot alone.**
  `DownloadAction` was blamed for a nested `<button>` from a stack trace; the wrapper was
  `ArtifactCard`, four frames down.

## Architecture worth knowing

- Components are ESM `.jsx` with explicit `.jsx` extensions in relative imports, each with a
  hand-written `.d.ts`. `design-system/index.js` is the generated barrel and the only public entry.
- The preview pages do **not** import the source. They load `_ds_bundle.js`, which publishes
  everything onto `window.SentinelDesignSystem_0682a2`, and compile inline JSX with Babel standalone
  from a CDN. **So a source change is invisible in the pages until the bundle is rebuilt — run
  `npm run build:bundle` after every component change, before looking at anything.** The bundle was
  built upstream by Claude Design; `tools/build-bundle.mjs` now builds it here, and its output renders
  the app pixel-for-pixel identically to the imported one.
- The dev server rewrites CDN URLs to `node_modules` copies in flight when the CDN is unreachable.
  Files on disk are never rewritten.

## Roadmap

1. **Import** — done.
2. **Audit and polish** — close the gaps in `docs/FINDINGS.md` without touching the visual language.
   F-1 … F-49 recorded; **none open** (F-27 … F-30 closed 18 Sep; F-31 locked row dimming its own selection and F-32 a stopped trace still saying "Working", both found by the review agent, F-33 integrity failing on the date stamp rather than on a change, and F-39 the app bar's two icon buttons with no accessible name — found by driving the end-to-end prototype, which is the only thing that could see it — all closed 19 Sep). `_index.json` reports `literals` — how many raw
   style values each component still hardcodes — so adherence is measurable per component:
   **35 of 88** are fully clean.
3. **The four components the request spec named and nobody built** — done.
   `ResultCard` · `DataTable` · `OverlapView` · `InfoCard kind='manager'`, each with its contract and
   a spec page. `pages/_index.json` reports **0 specified**: the backlog the system carried since v9
   is empty.
3b. **Spec pages, Tier 1** — done. **45 of 88 shipped**, 43 building, 95/95 pages render clean.
   Tier 1 = every component that carries one of the four rules, or that the chat spine is built from.
   Tier 2 is the remaining 44: chips, buttons, marks, icons, shells.
4. **Screens** — rebuild the Figma Make screens and their journeys on this system: full hi-fi flows,
   researched, with every state and keyframe accounted for. **Journeys A, B and C built** (a state of a screen is not a screen), plus the shell
   drawer, the ledger, the refusals, the going-back layer, **Journey D (the proposal)**, **Journey E (the rebalance)**, **Journey F (the review)** and **the end-to-end prototype** — one phone whose
   router decides which journey a sentence enters. Build order #7 is the last row, and it is done. The owner's standing rule since 18 Sep: **nothing in the system that is on
   no screen** — `npm run report:parallel` measures it (75 of 88 today, counted transitively).
