# Sentinel Design System — working notes

## What this repo is

The design system for Sentinel, Centricity WealthTech's chat-led wealth-management assistant for
advisors. `design-system/` is a Claude Design project imported verbatim; the repository is the
scaffolding around it.

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
  and pages that mount nothing.

## Architecture worth knowing

- Components are ESM `.jsx` with explicit `.jsx` extensions in relative imports, each with a
  hand-written `.d.ts`. `design-system/index.js` is the generated barrel and the only public entry.
- The preview pages do **not** import the source. They load `_ds_bundle.js`, which publishes
  everything onto `window.SentinelDesignSystem_0682a2`, and compile inline JSX with Babel standalone
  from a CDN. So a source change is not visible in a page until the bundle is rebuilt — and the
  bundle is built by Claude Design, not by this repo. Treat that as a known constraint.
- The dev server rewrites CDN URLs to `node_modules` copies in flight when the CDN is unreachable.
  Files on disk are never rewritten.

## Roadmap

1. **Import** — done.
2. **Audit and polish** — close the gaps in `docs/FINDINGS.md` without touching the visual language.
3. **Screens** — rebuild the Figma Make screens and their journeys on this system: full hi-fi flows,
   researched, with every state and keyframe accounted for.
