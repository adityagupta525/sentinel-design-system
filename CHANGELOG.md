# Changelog

Notable changes to the Sentinel design system. Dates are day-first, as everywhere else in this product.

## Unreleased

### Added
- **`--h-row-2l: 72px`** — the two-line `ListRow` (every client, thread and fund row), the most common row
  in the product and until now the only one without a token (F-21). `--h-row-lg` stays 46px; the name
  clash is contradiction 57, and the reason it was not renamed is recorded there.
- **`ds-screen-in` / `ds-screen-out`** in `tokens/effects.css` — the screen transition `readme.md` has
  specified since v1 and no keyframe carried, with its reduced-motion redefinitions.
- **`guidelines/motion-screens.html`** — both keyframes running live, beside the artifact that
  deliberately does not use them, and the statement that this system has no shared-element transition.
- **`SentinelThinking` takes `verb`** — "Reading his Q3 statement…" in place of the "Sentinel" label.
  The motion is unchanged; omitting it renders exactly as before. The verb must name the source the
  answer will cite.
- Spec pages for **MoneyComposer, SentinelThinking, UserBubble, QAPair, SentinelText, ProgressTrace,
  List, ListRow, HeroNumberCard, AllocationCard, MoveCard, ConstraintCallout, DisclosureBlock, TopBar,
  ExplainerSheet, Composer, SentinelBlock, MessageActions, ParseNote, DetourBanner** — 41 of 85
  components now have one, and **Tier 1 is complete**: every component that carries one of the four
  rules, or that the chat spine is built from, has a page.
- **`--color-alloc-equity` · `--color-alloc-cash` · `--color-alloc-track`** — three tokens the
  contracts named and the token layer never defined. Aliased to the values the app already used.

### Fixed
- **Five raw row heights in `ui_kits` now read the tokens written for them** — three `46`s on `--h-row-lg`,
  two `52`s on `--h-row-xl` — and `ListRow` reads `--h-row-md` / `--h-row-2l` instead of `56` / `72` (F-21,
  closing the half of F-24 that waited on it). Proven a no-op: 73 pages hashed before and after, the
  differing ones pixel-diffed to animation phase, and the drawer's 16 rows measured at 46px in a browser.
- **`MoneyComposer` had no focus indicator at all** (F-17). It now takes `Composer`'s treatment, on the
  box-shadow rather than a border so the card does not change size.
- **A pasted scheme code escaped the bubble** (F-18). `overflowWrap` on `UserBubble` and `QAPair`.
- `guidelines/motion.html` advertised `canvas · 380ms`, deleted in v11 for a surface removed in v5 (F-13).
- `SentinelThinking.prompt.md` described dots "bouncing 3px" at half the real duration — the opposite of
  what the spec says and the component does (F-15).
- `Composer` and `MoneyComposer` each carried the same placeholder stylesheet inside themselves (F-14).
- **The allocation bar was drawing Equity and Cash invisibly** on the cards board, because two of the
  three tokens its own contract names did not exist (F-19).
- `AllocationCard` hardcoded `42` where `--h-row: 42px` exists and names it in its comment (F-20),
  and three more of the same: `MoveCard` and `AttributionChart` spelled out a display **type role** by
  hand, `SuggestionRow` hardcoded `--h-row`, `TopBar` hardcoded `--h-topbar` (F-24). Proven a no-op by
  hashing five board screenshots before and after — all five byte-identical.
- **`ExplainerSheet` was not a dialog.** No role, no `aria-modal`, no label; Escape did nothing; focus
  stayed outside the scrim, and the scrim is a `<div onClick>` so it was not a keyboard exit either.
  Now a labelled `role="dialog"` that Escape closes, with focus moving in and back out to the opener,
  and **Tab trapped, wrapping at the boundary** — it could walk out behind the scrim while `aria-modal`
  said there was nothing there. Measured before and after with a keyboard in Playwright (F-25).
- **`ProgressTrace` printed `Thought for 4s · 4s`** whenever a finished trace was reopened — live in
  the product, not only in a specimen — and a frozen trace could not reach the done state at all, so
  no page had ever shown that header (F-22).
- The first five pages above shipped a **duplicated `<body>` and a second `<div id="root">`**, from a
  shared head fragment cut one line too long. They rendered clean here and came up blank once
  published (F-23). `check-previews` now counts `<body>`, `#root` and the page-kit script statically,
  before the browser starts — verified against a fixture carrying the exact duplication.

- Repository scaffolding around the imported design system: preview server, barrel generator, index
  runner, integrity check, CI, contribution rules.
- `design-system/index.js` and `index.d.ts` — the public entry point `_adherence.oxlintrc.json`
  already pointed consumers at and exempted from its own import rule, but which the bundle did not
  ship. Generated from disk by `tools/build-barrel.mjs`; 83 modules, 103 exports.
- `baseline/design-system.sha256` — 338 file hashes pinning the imported tree.
- `docs/FINDINGS.md` — the craft and correctness backlog.

### Imported
- The **Sentinel Design System** project from Claude Design, verbatim: 82 components across ten
  groups with `.d.ts` contracts, the five-file token layer, 16 guideline pages, 17 component spec
  pages, three UI kits, the icon set, and the 43 KB system specification (`design-system/readme.md`).
- `docs/specs/` — the v2 → v11 specification history, component request specs and pattern plates that
  the system was built from.
