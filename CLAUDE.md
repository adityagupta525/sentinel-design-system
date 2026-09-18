# Sentinel Design System — working notes

## What this repo is

The design system for Sentinel, Centricity WealthTech's chat-led wealth-management assistant for
advisors. `design-system/` is a Claude Design project imported verbatim; the repository is the
scaffolding around it.

## Start here

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
- **Look at the work.** `npm run preview`, then render it. `node tools/check-previews.mjs --shots <dir>`
  renders all 47 preview pages at their declared `@dsCard` viewport and reports console errors, 404s
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
   F-1 … F-30 recorded; **none open** (F-27 scrim, F-28 unnamed Stop/Send, F-29 half wifi glyph, F-30 peek dead space + bar right edge, all closed 18 Sep). `_index.json` reports `literals` — how many raw
   style values each component still hardcodes — so adherence is measurable per component:
   **33 of 86** are fully clean.
3. **The four components the request spec named and nobody built** — done.
   `ResultCard` · `DataTable` · `OverlapView` · `InfoCard kind='manager'`, each with its contract and
   a spec page. `pages/_index.json` reports **0 specified**: the backlog the system carried since v9
   is empty.
3b. **Spec pages, Tier 1** — done. **43 of 86 shipped**, 43 building, 82/82 pages render clean (75 system + 7 screens).
   Tier 1 = every component that carries one of the four rules, or that the chat spine is built from.
   Tier 2 is the remaining 44: chips, buttons, marks, icons, shells.
4. **Screens** — rebuild the Figma Make screens and their journeys on this system: full hi-fi flows,
   researched, with every state and keyframe accounted for. **5 of 7 of Journey B built on 4 pages** (a state of a screen is not a screen), plus the shell
   drawer and a live prototype. The owner's standing rule since 18 Sep: **nothing in the system that is on
   no screen** — `npm run report:parallel` measures it (44 of 86 today, counted transitively).
