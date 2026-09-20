# Sentinel Design System · 2026.09

**Sentinel** is the chat-led wealth-management assistant for financial advisors (mutual-fund distributors and partners) at **Centricity WealthTech**. An advisor talks to Sentinel about a client, a fund or a plan; Sentinel answers in a thread, asks one question at a time, and turns the answers into artifacts — a risk number, a proposal, a holdings review, a two-move rebalance. Mobile-first at 375 × 812. One product surface: the iOS-style mobile app.

## Sources

- Codebase `src/` (mounted, read-only) — a Figma Make React 19 + Vite + Tailwind v4 prototype. Read: `src/index.css` (token layer, `@theme`), `src/lib/ui.tsx` (component inventory, ~1,500 lines), `src/lib/icons.tsx`, `src/lib/Keyboard.tsx`, `src/lib/router.ts`, `src/journeys.tsx`, `src/screens/{Home,Chat,Journey,Portfolio,Proposal,FundExplorer,Drawer}.tsx`, `src/App.tsx`.
- Codebase `Mobile App Screen Reproduction/` — the same repo one level up (`AGENTS.md`, `index.html`, `package.json`). Identical `src/`.
- `src/imports/` — **ignored on instruction** (stale Figma import artefacts and old spec .docx files). Only the six SVG path strings referenced by `src/lib/icons.tsx` were lifted from it.
- No Figma link, no logo file, no image assets were provided.

## Products represented

One: the Sentinel mobile app. Its surfaces — Home, the thread (Chat), the guided Journey (risk → proposal → review → rebalance), bottom sheets, and a left Drawer. **Artifacts have no surface of their own:** a risk number, a proposal, a review or a rebalance lives in the thread as an `ArtifactCard` that expands and collapses in place. The three artifact canvases and the Diwali-offer canvas were removed from the product (v5 Part 1) — there is no `‹ Back to chat`, because there is nowhere to go back from.

---

## Content fundamentals

**Voice.** Sentinel speaks in first person as a careful colleague ("I read that as a fund search", "I have not applied it", "I won't invent a rate"). The advisor is "you"; the client is named in the third person ("Meera", "Sharma", "Mr. Amit Aggrawal"). Never "we" on behalf of the product except in reasoning ("We look at three things and go with the lowest").

**Honesty is the register.** Copy states limits plainly instead of guessing: "I did not follow that", "data to supply", "[PLACEHOLDER — offer terms to supply]", "Anything outside these I'll say I can't do rather than guess." Failure disclosure over invention, every time.

**Short declaratives, numbers first.** "Two moves, not seven." "Six is the smallest number that works here." "You did not cause it, and selling into it has a cost." One idea per sentence; the number carries the sentence.

**Casing.** Sentence case everywhere — chips ("Use her KYC age — 38"), CTAs ("Rebalance to his mandate"), titles ("Client review"). Only the 11px Eyebrow and 10px DeltaPill are uppercase (CSS transform, not typed).

**Punctuation.** Em dash with spaces (" — ") for the pivot; middle dot (" · ") for meta chains ("Locked · 15 Sep 2026", "HDFC · Flexi cap · on your shelf"); "›" for open affordances ("Open ›"); "→" for consequence ("→ 60%", "Build her a portfolio →"). Curly quotes in sheet copy.

**Money and dates.** Indian grouping always: ₹1,85,000, ₹25 L, ₹4.2 Cr, ₹18.4 L. Dates day-first, short month: "15 Sep", "Placed 16 Sep, 9:41 · settles T+2". Percentages tight: "71%" in tables, "71 %" appears once in prose (a contradiction, see below).

**Provenance under every figure.** "As of 30 Sep · from his Q3 statement and mandate on file."

**No emoji. No exclamation marks.** The only "✓" is a text glyph inside "Shortlisted ✓" / "On your shelf ✓".

**Eyebrow vocabulary.** "Cannot build this" · "That does not fit" · "Before you approve" · "Required disclosure · locked" · "Would run" · "Jump back in" · "Saved work".

---

## Visual foundations

**Colour.** Warm cream canvas `#f6f4f1` under white cards; every neutral is warm (ink `#251f1b` → ink-soft → muted `#605954`). One accent hue, bronze, in three depths (`#b69377`, `#715035`, `#a07d5f`) plus three sand tints (`#d9bb9e`, `#ebd4c3`, `#f9eee6`). **Rule 1 — colour never encodes identity.** Bronze carries magnitude (bars, meters), the three-pair status family carries state (`--color-status-{over|under|ok}-{bg|fg}` — over = danger on peach `#f3e2da`, under = bronze-deep on chip, ok = `#4b6141` on `#e4ecdf`; reserved, never a series colour, always paired with a word), warm grey `#a39a91` carries de-emphasis, and identity is always a direct label — tables and labelled bars, never pies, donuts or multi-hue stacks. **Rule 2 — the peach bubble `#f9eee6` (and the status-over peach `#f3e2da`) carries bad news;** danger is text/eyebrow colour only, never a fill. Bar tracks are one opaque token, `--color-track` `#edebe7`. The allocation family is one token (`--color-alloc-debt`); largest and smallest segments use `bronze` and `bubble-edge` directly. Interactive fills use `--color-selected`, never a chart token. The dark CTA surface is `--color-cta` / `-top` / `-bottom`. White is `--color-surface` — in this product white is always a card, sheet or composer sitting on the canvas. Token names describe role, never appearance: opacity variants are applied at the point of use, not named (`--ink-80`, `--ink-40`, `--tint-bronze-deep-60` were deleted for that reason), and the alpha tints that survive state a role: `--surface-avatar` (client-initials discs), `--scrim` (bottom sheets), `--tint-bronze-focus`, `--tint-bronze-dashed`, `--tint-bronze-06` (row press).

**Type.** Urbanist for all UI, four weights each mapped to a job: 400 follow-on prose and footers · 500 body, rows, inputs · 600 bubbles, titles, CTA · 700 chips, eyebrows, labels. Sizes are literal: 10, 11, 11.5, 12, 13, 14, 15, 16, 18. Darker Grotesque Medium — a **condensed sans** — is the display face, always bronze-deep, at 24 / 27 / 40 / 64px for numerals and the greeting. Line-heights are set explicitly per size (19px on 14px bubbles, 20px on body).

**Backgrounds.** Flat cream with a 3px dotted paper texture (`radial-gradient` at 4.5% ink) and two soft radial auras (bronze top-left, shadow top-right). No photography, no illustration, no patterns beyond the dots. The body behind the phone is `#dedbd6`.

**Cards.** White, radius 16, padding 14–16, shadow `0 1px 2px rgba(37,31,27,.05)` or a 1px `line` ring — never both heavy. Rows inside cards are 42 / 46 / 52px with 0.5px `line-soft` dividers and no padding-x beyond the card's 12px. Peach callouts use `bubble` fill + `bubble-edge` ring.

**Pills and chips.** Fully rounded. Chip surface `#fbf6f1` with `bubble-edge` ring and bronze-deep bold 12px label; selected/primary = sand `#ebd4c3` fill, ink label, bronze ring. Tertiary "?" chips are dashed bronze at 60%.

**The dark element.** One vertical gradient `#3b3531 → #1a1614 → #111` on the composer send disc, the Stop button and the 48px radius-16 DarkButton. Nothing else is dark.

**Borders.** Two line tokens, both warm: `--color-line` `#e1deda` for 1px rings (box-shadow spread) on cards, chips, composer, and `--color-line-soft` `#e9e6e2` for 0.5px row hairlines. The greeting's dashed rules use `--color-line` too — a dash pattern is distinction enough without a second hue.

**Shadows.** Almost none: cards 5% ink at 1/2px. Depth only on the composer (`0 16px 30px -18px` 24%), the floating scroll disc, the drawer (`24px 0 60px -24px` 40%) and the phone (`0 40px 80px -24px` 45%).

**Corner radii.** 6 (bubble tail) · 8 (keys) · 10 (detour banner) · 12 (show-all, locked figure) · 16 (cards, CTA) · 20 (composer, bubble) · 24 (sheet top) · 44 (phone) · full (pills).

**Motion.** One easing `[0.2, 0.8, 0.2, 1]`. Press = scale 0.98 over 150ms (0.94 on 42px discs; send arrow rotates −15°). Enter = fade + 8–12px rise, 240–320ms, 60ms stagger. Screens slide 100% in / −30% out at 320ms; an artifact card expands in place (height to natural, 300ms, the thread scrolling its header under the app bar) rather than pushing a canvas; sheets slide up 280–300ms. Bars fill by `scaleX` from the left (480–500ms), never by width. Numbers count up 600ms cubic-out. **Waiting is opacity only** — the thinking dots pulse 0.28 → 1 across 1.2s, staggered 150ms; no bounce, because a 6px dot hopping beside text reads as jitter and the delight budget is spent on data arriving. Success is a drawn check, not confetti.

**Reduced motion — implemented, not asserted (2026-09-17).** `@media (prefers-reduced-motion: reduce)` lives in **three** places by design: `tokens/effects.css` for the global keyframes, each component's own `<style>` for the five component-local ones (those sheets append after the stylesheet and would otherwise win), and **`MotionGuard` inside the bundle**, which installs the whole block on evaluation — so a consuming project that loads `_ds_bundle.js` with its own page styles honours it too. Until that third place existed, every motion row in this document was a promise the build did not keep. Keyframes are **redefined, not cancelled**, so nothing is left stranded mid-transform: every looping or entrance animation resolves to its final state with an opacity fade and nothing else. Specifically — `ds-rise` drops its 8px translate, `ds-artifact` its 0.96 scale, `ds-sheet` its 100% slide, `ds-tip-up`/`ds-tip-down` their 4px offsets (keeping the centring translate), `ds-grow` holds the bar full, `ds-draw` holds the check drawn, `ds-spin` stops the spinner, `sentinel-shimmer` and `dot-pulse` hold at full opacity, and the kit's `kit-slide` / `kit-drawer` become fades. Transitions everywhere collapse to 1ms. Count-ups jump.

**Hover.** None — touch product. **Press.** Scale only; SuggestionRow also tints bronze 6%. **Disabled.** 40% opacity. **Focus.** Composer: bronze 1px border + 3px 24% bronze ring, 150ms.

**Transparency and blur.** No blur anywhere. Scrims: ink 40% (sheets), black 25% → now ink 25% (drawer). Modal layers only. Bronze at 20% for avatars/active chips, 6% for row press.

**Layout rules.** 16px gutter; 12px thread stack; status 44 / top bar 44 / home indicator 24. The **composer is present on every screen** (home, thread, journey, the drawer — including while an artifact card is expanded, where its placeholder becomes "Ask about this") inside the three-row Dock: chips → CTA → composer → standing disclosure. **A CTA stacks above the composer, never replaces it.** The confirm sheet is the single exception — see the confirm-sheet exception below. Sentinel's turns sit directly on the canvas with a sparkle label; only the advisor gets a bubble (right-aligned, peach, 6px tail corner).

**Imagery.** None in the source — no photos, no illustrations. Avatars are initials in a bronze-20% disc.

---

## Iconography

- **Source icons:** six stroke glyphs exported from Figma — menu, plus, chevron-right, attach (paperclip), arrow (send), sparkle (Sentinel mark). Copied verbatim to `assets/icons/*.svg` and wrapped as `Icon*` components. Stroke 1.33–1.5px, round caps/joins, coloured ink / bronze / bronze-deep / muted / white.
- **Inline glyphs:** a handful of tiny inline SVGs in `ui.tsx` (check, chevron-down, lock, "?" as text, ⋯ dots, keyboard shift/delete/globe). Reproduced inline in the matching components.
- **Additions adopt [Lucide](https://lucide.dev) (ISC licence — free for commercial use, attribution in this file).** Four glyphs imported verbatim: `file`, `circle-check`, `download`, `loader-circle`. **Stroke 1.5 on the 24px grid, rendered at 20px** — Lucide's 2px default is too heavy beside a 1px hairline divider. Geometry is never modified.
- **The source six are not Lucide-compatible and were kept as they are — an interim state, logged as open debt (contradiction 38), not the intended end state.** At the app's next visual refresh they get redrawn onto the 24px grid at 1.5px and the set collapses to one origin. They sit on six different grids (17.33 / 18 / 15 / 12.37 / 13.33 / 12.58) with 1.33–1.5px strokes, which normalises to 1.8–2.0px at 24px — heavier than Lucide at 1.5. Redrawing them from Lucide would change every screen in the product, so the set has two documented origins rather than one forced one.
- **Text before a glyph.** Remove, Download PDF / Download PPTX, filter labels and Send on WhatsApp are text. Sort carets are the existing chevron rotated. `↔` and `·` are characters. Radio and checkbox are drawn inside `SelectionMark`, not shipped as icons.
- **No third-party brand marks.** The WhatsApp mark is not drawn or approximated — an approximation is a trademark problem, not a style choice. Outreach actions read **"Send on WhatsApp"** in text alone; use WhatsApp's official asset under their brand guidelines if a mark is ever required.
- **No icon font, no PNGs, no emoji.** Unicode used as glyph: "›", "→", "✓", "‹", "·", "—".
- **No logo file exists.** The brand mark is the word "Sentinel" in Urbanist (700 at 16px in the drawer; 600 at 14px in the TopBar pill) beside the sparkle glyph. Nothing was drawn or reconstructed.

---

## Components (from `src/lib/ui.tsx` + `icons.tsx`, one-to-one)

Namespace `window.SentinelDesignSystem_0682a2`. Every component binds to tokens; raw hex appears only where the source has no token (flagged below).

- **icons/** — IconMenu, IconPlus, IconChevronRight, IconAttach, IconArrow, IconSparkle (source set) · IconFile, IconCheckCircle, IconDownload, IconSpinner, **IconInfo** (Lucide)
- **forms/** — SelectionMark (radio / checkbox forms — drawn inside their row, not an icon), SearchField (what a `searchable` List renders), **FileUpload** (the file in the thread, parsing in stages)
- **text/** — Eyebrow, EyebrowDivider, Provenance, StandingDisclosure
- **shell/** — PhoneFrame, ScreenBackdrop, StatusSpacer, HomeIndicator, TopBar, **MotionGuard** (installs the reduced-motion block from the bundle), CanvasHeader (**deprecated — the canvas is gone; its title and ⋯ moved onto ArtifactCard's expanded header, and its back pill is repurposed as the detour-resume and sheet-dismiss pill**), Dock, ScrollToBottomButton
- **actions/** — Pressable (**the operable base: ≥44pt hit expansion + a `:focus-visible` ring, inherited by everything under it**), **Pill** (md 36 / sm 32 — replaces Chip, AnswerChip-pill, FilterChip, ActionCard's button), AnswerChip (card-with-subtitle form; pill form aliases Pill), ChipRow, **InlineActionRow** (was ActionCard), DarkButton, SuggestionRow, DecisionsStrip (its own thing: radius-10 row, each token reopens a question), **ClientChip** (the bound client, composer-resident and removable), **RangePills** (the time range for a performance series), **DownloadAction** (a thin Pill wrapper; confirmation lands on the control), **InfoDot** (the ⓘ that takes a figure to its explanation)
- **lists/** — **ListRow** (legal pairings enforced in the component: nav→chevron|meta, select→radio, multi→checkbox, action→menu, static→badge|meta|none), **List** (header, dividers, footer, groupBy, **required** emptyState, loading)
- **composer/** — Composer, MoneyComposer (+ `formatINR`)
- **chat/** — UserBubble, SentinelBlock, SentinelText, SentinelThinking, QAPair, ParseNote, DetourBanner, GreetingDivider, ProgressTrace, MessageActions, **StepTrace** (what the assistant did, per-step state), **VersionRow** (every revision, with a revert), **ResponseFeedback** (marking an answer wrong)
- **cards/** — AllocationCard, ArtifactCard (peek / expanded / filling — the artifact's only surface), HeroNumberCard (+ `useCountUp`), MoveCard, ConstraintCallout, RejectCallout, DisclosureBlock, **Badge** (status / meta — replaces DeltaPill, KindTag and inline meta pills), DataTableCard, ExplainerSheet, **InfoCard** (fund detail: figure → chart → range → stat pair with an ⓘ on each)
- **data/** — ProgressRail, ConcentrationBar, Dumbbell, AttributionChart (V3), StatTile (+ `Sparkline`), **ChartLine** (+ `ChartLineMultiples`), **ChartBar**, **ChartShare**, **ChartLegend** (+ `CHART_RAMP`), **ChartReadout**, ChartTooltip, `chartMath` (scales and paths over d3-scale / d3-shape), DrawnCheck

Not ported (hooks / non-visual): `useStickyScroll`, `useInlineAsk`, `COMPOSER_PLACEHOLDER` (documented on Composer), `EASE` (→ `--ease`). Screen-local components in `src/screens` (ArtifactCard, JourneyCard, FundsTurn, OfferTurn, SuccessBlock, ConfirmSheet, LockedFigure, OnePager, CompareCanvas, Keyboard) are recreated inside the UI kit, not as primitives — they are not in the `ui.tsx` inventory.

**Added for Journey B (2026-09-16):** `ArtifactCard` (A1, named in v2 spec §2.1), `StatTile` + `Sparkline` (C21 / V5, named in §3.2 and §4.2). `AttributionChart` was rewritten from a generic bar list to the V3 diverging spec. No other component was added.

**Consolidations (decided 2026-09-16):** Pill and Badge are the two rounded-full families. **Pill** is tappable: visual 36 (surface) or 32 (in-card), and its tap target is always ≥44px through an invisible vertical extension — no caller can under-size it. **Badge** is never tappable, has no `onClick`, one padding (8×3), and is therefore **exempt from the 44px touch-target rule** — that exemption is the whole reason the two are separate components. Chip, FilterChip, DeltaPill and KindTag were removed. **ActionCard → InlineActionRow:** it was never a card (no background, radius or padding), so it survives as a thin row wrapper of Pills; the 34px height was drift and is now 36. Entrances live on the rows (ChipRow, InlineActionRow — fade + rise, 60ms stagger); Pill owns only the press state.

**Added 2026-09-17 (v11 · the audit pass).** Nothing in this pass changed the palette, the two faces, the radii or the look. What changed is **where a value is allowed to be used**.

`StepTrace`, `VersionRow`, `RangePills`, `FollowUpRow`, `ResponseFeedback`, `FileUpload`, `DownloadAction`, `InfoCard`, `InfoDot`, `IconInfo` — each with its page except `InfoDot` and `IconInfo`, documented on the `InfoCard` page and the Iconography card.

### Perceivability — the palette carries one chart mark, not four

WCAG 1.4.11 asks a graphical object for 3.0:1 against adjacent colour. Recomputed against `--color-canvas` #f6f4f1 and `--color-surface` #ffffff:

| Mark | on canvas | on surface | |
|---|---|---|---|
| ramp 1 `bronze-deep` #715035 | **6.59** | **7.24** | passes |
| ramp 2 `bronze` #b69377 | 2.57 | 2.83 | fails |
| ramp 3 `alloc-debt` #d9bb9e | 1.66 | 1.82 | fails |
| ramp 4 `bubble-edge` #ebd4c3 | 1.30 | 1.42 | fails |
| `muted` tone — was `data-deemph` #a39a91 | 2.52 | 2.77 | fails |
| `muted` tone — now `--color-muted` #605954 | **6.26** | **6.88** | passes |
| `--color-track` #edebe7 | 1.08 | 1.19 | a track, not a mark — takes the hairline |
| focus halo — bronze @24% composites to #e7ddd4 | 1.22 | 1.25 | fails as an indicator |
| solid `--border-focus` → `bronze-deep` | **6.59** | **7.24** | passes |

Adjacent ramp separation is 2.56 / 1.56 / 1.28. So:

- **A mark that must separate from the background uses ramp 1 only** — `markColor()`. Lines, bars, crosshairs, sparklines. `ChartBar` is therefore **one colour**, and that is a gain: rank in a bar chart is carried by **length**, and the ramp was encoding it a second time in a channel three quarters of which nobody can see.
- **A mark that must separate from its neighbour** — stacked segments — gets a `--space-2` gap of the card's own background, a `--border-hairline` edge on the bar, and **a label on every segment**. Measured, *no* colour in this palette clears 3:1 against all four ramp steps (`line` 1.06, `surface` 1.42, `muted` 1.05, `ink` 2.25 at worst), so a hairline cannot be the compliance mechanism. **The label is** — 1.4.11 exempts a graphic whose information is also present as text — and the gap is the perceptual aid. A segment with no label is a violation, not a style choice, so **above two segments `ChartShare` ignores `legend={false}` and forces the legend on**: the guard is in the code, not only in the contract.
- `--color-track` takes `inset 0 0 0 var(--border-hairline) var(--color-line)` everywhere, not just in `HeroNumberCard`.

### Operability — focus was removed, not forgotten

`:focus-visible` appeared **0 times** in the tree and `Pressable` set `outline: none` with nothing in its place. It now carries **both** of `Pill`'s guarantees, so everything beneath it becomes operable without being edited: a **≥44pt tap target** measured off the rendered box, and a **`:focus-visible` ring**. The ring is a solid `--border-focus` at `--border-focus-width` **plus** the `--focus-ring` halo — the halo alone measures 1.22:1 and fails WCAG 2.4.13, and `--border-focus` was pointed at `--color-bronze` (2.57), which also fails; it now points at `--color-bronze-deep`. Same family, a value already in the palette; the alias was aimed at the wrong member of it.

`Pressable` also takes `label`, `role`, `pressed`, `expanded` and `controls`, so a glyph-only control is named where it is built rather than at every call site.

**The ring is an `outline`, not a `box-shadow`, and that is load-bearing.** The first build of it used `box-shadow`, which an inline `style.boxShadow` from a caller beats every time — measured, a chip passing its own 1px ring returned `rgb(225,222,218) 0 0 0 1px` on focus and no ring at all. Four callers did exactly that (`RangePills`, `ResponseFeedback`, `CanvasHeader`, `ScrollToBottomButton`), so the guarantee held for most components and failed silently for the rest, which is the one failure mode a base component may not have. **Callers may pass `boxShadow` freely; they must never pass `outline`.**

**`--border-hairline` is for row dividers and card edges, not chart data-ink.** A baseline or a track rail stays at `--border-1`: `--color-line` measures 1.22:1, and halving a chart axis during a perceivability pass is the opposite of the point. The blanket `height: 1` conversion did that to `ChartBar`'s baseline and `Dumbbell`'s rail before it was caught.

### The type ramp is bound

Twelve roles that already existed in practice, each binding size · leading · weight · tracking and named for the job rather than the value: **display · total · greeting · figure · sheet-title · title · body · body-strong · row · label · caption · eyebrow**. Each publishes a `-font` shorthand, so a component asks for `font: var(--type-row-font)` instead of four numbers. **No value changed** — every number in the ramp was already in the product; what changed is that nothing can now pair 14/22 in one card and 14/20 in another.

**Spacing is a scale again:** 4 / 8 / 12 / 16 / 20 / 24, with 6 and 10 as tolerated in-betweens and **2, 3, 5, 13, 14 labelled as exceptions that must be justified on the page that uses them**. `--border-hairline` is bound at last — the system said hairline and the components drew `height: 1`; that is the one visible change in this pass, and it is the system's own stated intent. `--dur-canvas` is deleted; the canvas went two passes ago.

### Two copy rules, from Monzo

**A caveat sits at the number, not in a global footer** — a `caveat` prop on `ChartBar`, `ChartShare`, `StatTile` and `InfoCard`, so the rounding note sits under the bars and the past-performance line sits *above* the chart. **Any figure an advisor must defend carries an ⓘ to its explanation** — `InfoDot`, opening the `ExplainerSheet` the system already had. Never a tooltip: a tooltip cannot hold a formula, a date range and a source, and at 375pt the next tap kills it.

**Added 2026-09-17 (v10 · pass one):** `pages/00-Index.html` and the nine-block page template (`pages/page-kit.jsx`), `Pill`'s **loading** state (`DownloadAction`, `FileUpload`'s retry and `ResultCard`'s primary were all waiting on it), `MotionGuard` (reduced motion now ships **in the bundle**, not only in the stylesheet), and the chart family: `ChartLine` (+ `ChartLineMultiples`), `ChartBar`, `ChartShare`, `ChartLegend`, `ChartReadout`, `ChartTooltip`, on `chartMath` over `d3-scale` / `d3-shape`. `Legend` was replaced by `ChartLegend` (contradiction 45). No token was added for any of it.

## Component pages

**A component with no page is not in the system.** Not shipped, not half-shipped — not in it. Specimens used to live inside journey artboards and kit files, so a component was only visible where it happened to be used; that is backwards, and it is why nobody could find where anything was designed.

- **`pages/00-Index.html` is the first page.** One row per component: name, group, status, the page it lives on, and the tokens it consumes. It is **generated from the tree** by `scripts/build-index.js` — a row exists because `<Name>.jsx` and `<Name>.d.ts` both exist on disk, `shipped` requires `pages/<Name>.html` to exist too, and the token column is the `var(--…)` names read out of the source. Page links are fetched on load, so a row whose page has gone reads `page missing`. The index cannot tell you something is there when it isn't.
- **Status:** `shipped` (source + page) · `building` (source in the bundle, page not drawn yet) · `specified` (a document only).
- **Groups:** Foundations (tokens, type, motion) · Chat (thread, composer, dock, artifact card) · Data (charts, table, overlap, stat tiles) · Input (pill, chip, search, upload) · Navigation (drawer, sheet, rail).
- **Nine blocks, always in this order** (`pages/page-kit.jsx` supplies each): **1** Specimen — the component alone, at real size, on the product background, nothing else in frame. **2** Anatomy — the same specimen with dimensions annotated *outside* the frame, per B/05. **3** Variants — the cross-product, labelled, in a grid. **4** States — only the ones that genuinely exist; no invented disabled state for something that cannot be disabled. **5** In context — inside a 375pt thread fragment, the block that catches a component that only works in isolation. **6** Tokens — by name, resolved live against the stylesheet, so a value that is not a token renders `MISSING`. **7** Props — the `.d.ts`, fetched and printed, never retyped. **8** Do / Don't — one pair, the sharpest one; a page of eight don'ts teaches nothing. **9** Motion — the rows that apply, each with its reduced-motion behaviour.

**Backlog reconciliation.** v10 counted sixteen components specified and not built. Three were built in the v7 pass (`List`/`ListRow`, `SearchField`, `ClientChip`) — what they were missing was pages. Seven were built in pass one (Pill loading + the six charts). Six remain `specified`: `FileUpload`, `DownloadAction`, `ResultCard`, `InfoCard`, `DataTable`, `OverlapView`. The sixty-five `building` rows are the same debt in its other form — real components whose pages have not been drawn.

## Charts

**No charting library renders a Sentinel chart.** A library may compute a scale or generate a path, and that is all. `d3-scale` and `d3-shape` (or the same two behind `@visx/scale` / `@visx/shape`) are peer dependencies, read through `window.d3` by `components/data/chartMath.jsx`: `nice()` and `ticks()` for honest axes, `scaleBand` for correct bar rhythm, `line()`/`area()` with `curveMonotoneX` for paths that don't wobble or overshoot a data point. What reads as amateur in a chart is unrounded ticks and baselines off the grid — scale discipline, not a missing renderer. Chart.js is out on token grounds (canvas cannot take a CSS custom property, so every token becomes a hex string in a config, and the whole chart is one unreadable node); Recharts is viable but ~370KB largely spent switching off a grid we don't draw, a legend we place ourselves and a floating tooltip this system ruled out on a phone. `chartMath` falls back to d3's own 1/2/5 tick algorithm when d3 is absent, so a page without it still lands on the grid; it loses monotone curves and time scales.

**Sizes.** At peek the card is 96px fixed, so the chart is a **sparkline strip**: plot 72, one 14px end-label row, no axes, no legend, no readout — **86 measured**. Expanded is plot 180 + a 14px axis band — **194 measured**, inside v6's ≤ 208 budget, and the end label carries the series name as well as the value so there is no second label row to pay for. Two honest limits found while drawing the pages: a **peek bar chart caps at four rows** (3 rows = 62, 4 = 84, 5 = 106 — the fifth row's route is the table view, not a smaller font), and **a peek share carries at most two segments** — `ChartShare density="peek"` collapses the tail into one `Other`, so leader + Other are direct-labelled at the bar's ends and `legend` defaults off there (8 + 6 + 15 = **29 measured**). That last one was a correction: forcing the legend on for label compliance first produced a 99px block inside a 96px card, and the resolution is fewer segments, not smaller type. Neither raises the card.

**Colour is a data role, never a prop.** `tone="ramp"` — the client's own money, the four-step bronze ramp, ordinal by rank. `tone="muted"` — benchmark, target, prior period; dashed 4-2, drawn behind. `tone="status"` — a crossed limit and nothing else, one mark or one segment, never a whole series. **`tone` never accepts a colour and no chart takes a `color` prop.** A fourth tone is the pie question wearing a hat; the answer is the ΔE table in contradiction 39.

**Direct labels first.** One series is end-labelled; two series are end-labelled; three or more is **small multiples** — one chart per series, same scale, stacked down the card. `ChartLegend` exists only where a direct label cannot go (`ChartShare`, the overlap bars), is left-aligned to the plot's left edge, and is **ordered by value descending, always**, so it doubles as the ranking and reads with no colour at all.

**Two interactions, two components.** Tap a mark → `ChartTooltip` (above the mark, flips below near the top edge, 44pt of target, dismisses on the next tap, 1px leader line instead of a tail — a tail clips at the plot edge). Drag along the plot → `ChartReadout` (a fixed row *above* the plot, reserved even when idle, with a 1px crosshair; during a scrub the finger covers the mark, so a floating box shows the advisor nothing). **And every chart offers a table view from the card's ⋯** — no value is ever reachable only by touching a coloured shape.

**Added 2026-09-17 (v7):** `List` + `ListRow` and `ClientChip`, pulled forward from the team's nine because the drawer cannot be built without them — the remaining seven stay in their own pass. `SearchField` (v5) is the fourth piece the drawer needs and already existed. Same pass: the artifact peek ruling below, and reduced motion actually implemented. No token was added for any of it.

**The artifact peek is 96px, fixed.** v6's 132/156 collapsed chart budget is withdrawn: the thread is 463–497px, so a 156px chart block plus card chrome is roughly 250px — one artifact eating half the thread, two filling it. The peek's job is **recognition, not reading**. What renders there is a **sparkline strip** (plot 72, one 14px end-label row, no axis ticks, no gridlines, no legend), a single stat row, or a table's top three rows plus `+40 more` — **never a chart with axes**. Expanded is plot 180 + a 14px axis band, block ≤ 208. The prop is `state: 'peek' | 'expanded' | 'filling'`, and charts will take `density: 'peek' | 'expanded'`; `'collapsed'` is **not** an alias, deliberately — nobody should read "collapsed" and go looking for 132px again (migration tracked as contradiction 44).

**Added 2026-09-16 (v5):** `Legend` + `CHART_RAMP` and `ChartTooltip` (Part 6), `MessageActions` (Part 5), `SearchField` (Part 4). `ArtifactCard` gained its expanded state (Part 1). No token was added for any of them.

**Pill placement rule (load-bearing — the two pills are visually identical, so position carries the meaning). Two contexts, restated 2026-09-16 for the canvas removal; this wording supersedes both earlier ones.**

- **Dock pills act on the current state of the conversation, and they persist.** **Inline pills belong to one message, and they scroll away with it.**
- When a **question is pending**, the current state *is* that question — dock pills answer it and advance the journey.
- When a **result is on screen**, the current state *is* that result — dock pills act on it (expand it, share it, start the next journey).
- A **follow-up attached to an older message stays inline.**

There are now **two contexts, not three** — nothing is "in a canvas" any more, which is a gain. The first restatement fixed a phrasing that tied dock pills to a pending question and so failed on a result screen, where no question is pending yet the chips correctly sit in the dock. Persistence, not question-answering, is the thing position encodes.

### The three layout rules

Consuming projects inline these three patterns rather than importing a component, so the written rule is the only thing preventing drift. Twenty-seven docks across the two journeys resolved to one computed variant because the rule existed — keep it that way.

**1 · The three-row dock.** One container: `flex-direction: column`, `gap: 8`, `padding: 6px 16px 8px`, `position: relative`, `z-index: 10`. Row order is fixed and rows are omitted, never reordered: **chips → CTA → composer → standing disclosure.** Chips are one `ChipRow` of Pills (no wrapping to a second row). The CTA is one 48px radius-16 `DarkButton` and **stacks above the composer, never replaces it** (`StickyCTA`, which sat alone, was deleted for exactly this — contradiction 19). The composer is the last interactive row and is present on every screen but the confirm sheet. The standing disclosure is **one line** — `Sentinel assists an advisor · not investment advice` (`[PLACEHOLDER — compliance to supply]`; replacement copy must also fit one line) — and **nothing comes after it.**

**2 · The compliance status rows.** Status is **stated as a row, never implied.** One card, 1px `line` ring and no shadow, `padding: 0 14px`; each row `min-height: 52` with `padding: 8px 0`, a `0.5px line-soft` divider between rows and **none after the last**. Label 13/18 weight 500 on the left, value 13 weight 700 on the right, both vertically centred; an optional 11/15 `data-deemph` note sits under the label. A breached row turns its **value** `--color-status-over-fg` and still carries the word — colour never signals alone, and the surface never fills with danger.

**3 · The trace-rail breakdown.** One structure serves the reasoning trace and the cost breakdown. A 1px `line` spine at `left: 9`, inset 8px top and bottom, behind a 12px-gap column of rows. Each row: a 16px circle on the spine — `canvas` fill + bronze ring when active or pending-with-content, bronze fill + white 1.3px check when done, 1px `line` ring when pending — then a 13/18 `ink-soft` label, then an optional right-aligned value (13, weight 700 `bronze-deep` for the total row, 500 `ink` otherwise). **Only the current row is at full opacity; every other row sits at 40%.** A header row above the spine names the state ("Working · 3s", "Thought for 4s", "What this costs") and takes a chevron only if it collapses.

**The confirm-sheet exception to the composer law.** A confirm sheet is the one surface that carries no composer. It is a commit-or-dismiss decision; a composer there offers a third path that does not exist and implies the sheet is negotiable. Explainer sheets keep theirs, because a follow-up question is a real thing to want. The advisor retains the thread behind the sheet either way.

**Sheets get a scrim. There is no second case.** A bottom sheet is modal — it blocks interaction and the layer behind it stays visible, so it carries `--scrim` at 40%. The drawer is modal too, at 25%. One scrim token, opacity at the point of use, on modal layers only.

This rule used to have two cases, and the second one was correct while a canvas existed: an artifact canvas was a *push*, not a modal — full-bleed, with `‹ Back to chat`, its own ⋯ and its own docked composer — so a scrim would have been invisible at rest and, during the 380ms shared-element transition, would have read as "a modal is opening" and fought the continuity the transition existed to create. **The canvas was removed from the product (v5 Part 1), so the exception it described no longer has a subject.** Recorded rather than deleted, because the reasoning still governs any future push surface.

**No nested scroll (the rule that replaces the canvas).** An expanded `ArtifactCard` takes its content's natural height and **the thread carries the scroll** — never the card. A scroller inside a scrolling thread is the pattern the full-bleed canvas existed to avoid, and it is the one way the expand-in-place model stops feeling good. Two behaviours follow, and they belong to the screen: on expand, scroll the thread so the card's **header** sits just below the app bar, so the advisor starts at the top of what they opened; on collapse, scroll back to the card's position, so they are not stranded three screens down in older turns. The composer stays docked throughout; its placeholder becomes "Ask about this" while a card is expanded and returns to "Ask Sentinel" on collapse, from the existing context-keyed map.

---

## Charts and graphs

**One palette: the four-step bronze ramp.** `--color-bronze-deep` → `--color-bronze` → `--color-alloc-debt` → `--color-bubble-edge`, exported as `CHART_RAMP`, step 1 being the largest magnitude. It encodes **magnitude only**. Identity is carried by a direct label, every time. There is no categorical palette, and "colour themes" plural is a request for one — the same question as the pie, with the same answer.

**Line and bar are fine.** Bars: sequential ramp, direct labels, ≤24px thick, 4px rounded data-end, square at the baseline. Lines: 2px, round caps, endpoint labelled only. One series is the safe case; **two is the practical maximum**, both end-labelled. At three or more the identity problem below applies and the answer is **small multiples** — one small chart per series at a shared scale — not three lines in three colours.

**Pie and donut charts are not available, and the reason is measured rather than preferred.** A pie encodes identity by colour by definition; this palette cannot. Tested with a contrast validator, not by eye:

| Candidate | Result |
|---|---|
| The bronze→sand ramp `#A9743F · #C9A77C · #E0CDB6` | Adjacent pair ΔE **11.4** for normal vision against a floor of 15; all three below the chroma floor |
| Muted earthy trio `#B45F3C · #6E7B4B · #4A6072` | ΔE **3.8** under protanopia — olive and terracotta are the same colour to a red-weak reader |
| Four muted hues | ΔE **1.5** under protanopia |
| A set that passes | Requires `#C2410C / #0F766E / #4F46E5` saturation, which is not this brand |

So a pie in this palette is either unreadable for colourblind users or it is a different brand. Those are the only two outcomes, and neither is available. **The substitute already ships and a shipped finance app uses it for the same job:** Copilot Money renders allocation as a direct-labelled single-hue bar (`Mutual Fund ──── 85.4%`, `ETF ── 14.59%`) with no donut and no categorical hues. Sentinel's own allocation bar is that same form and it is the strongest component in the system. The answer to "we need a pie chart" is **the stacked bar with a `Legend`** — same job, reads at 375pt, survives greyscale and print, needs no second palette. If a *ring* is genuinely needed for a dashboard tile, the **two-segment meter** is available: one ratio against a limit, one hue.

**A legend is required at two or more series, not optional** — colour is never the only identity channel. 8px dot on the ramp step, label in `--color-ink`, optional value right-aligned in `--color-muted`, 11.5px, wrapping rather than truncating. **Text never wears the data colour.**

**"Hover box" is tap-to-inspect.** Hover does not exist at 375pt. `ChartTooltip` appears on tap, sits above the mark (flipping below near the top edge), carries label / value / the provenance line for that point, keeps a 2px surface ring so it stays legible over a line, and dismisses on the next tap anywhere. **The tap target is at least 44pt around the mark** — larger than the mark itself — per the touch-target rule.

**And the escape hatch that makes the whole ruling accessible: every chart offers a table view from the card's ⋯.** No value in this product is ever reachable only by touching a coloured shape.

---

## Index

- `styles.css` — entry; imports `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`
- `tokens/` — base + semantic custom properties; `@font-face` (Google Fonts CDN, same URLs as the source)
- `components/<group>/` — `.jsx` + `.d.ts` + `.prompt.md` per component, one `*.card.html` per group
- `guidelines/` — foundation cards (Colors ×5, Type ×3, Spacing ×3, Effects ×2, Brand ×3); `token-inventory.md`; `contradictions.md`
- `ui_kits/sentinel-app/` — click-through app (`index.html`, `app.jsx`, `home/chat/journey/portfolio/proposal/drawer.jsx`, `data.jsx`, `README.md`)
- `ui_kits/journey-b/` — Journey B artboards B/01–11 (Sharma drift → artifact → rebalance → confirm → success → share). **Documentation vs narrative:** four artboards document a pattern that no component card covers — **B/05 Artifact** (ArtifactCard anatomy, collapsed), **B/06 Expanded** (the expanded card: its own header row with ⋯, `Collapse ⌃`, the V3 chart and stat tiles in situ, and the no-nested-scroll contract), **B/09 Confirm** (the modal case: scrim, disclosure above numbers, compliance as rows) and **B/11 Share** (the message draft as an expanded artifact in the thread). B/06, B/07 and B/11 were redrawn out of the removed canvas frame. **Standing kit rule: a kit never ships an artboard or screen that contradicts the current component set — redraw it or delete it; "superseded" is not a state an artboard may be in.** Its companion, added 2026-09-17: **the design system holds tokens, components and states — it does not hold product screens.** A product screen in the system's kit is stale by construction, because the product moves and the vitrine does not. That is what closed contradiction 43, by deletion rather than redraw. The other seven prove sequence, not definition; they are reference source for copy and artboard order, and journeys are rebuilt in consuming projects rather than stored here.
- `ui_kits/journey-a-risk/` — Journey A artboards A/01–16 (Meera risk profile), same status: reference source, not documentation
- `assets/icons/` — six SVGs + `paths.json`
- `thumbnail.html` — homepage tile
- `SKILL.md` — Agent Skills entry point

---

## Caveats

- Fonts are **CDN-hosted** (fonts.gstatic.com) exactly as in the source; no `.ttf` binaries exist in the repo, so none were copied. Supply the files if consumers must work offline.
- Motion is CSS-only here (the source uses `motion/react`); timings and easing match, spring physics do not apply (none used).
- The UI kit shows **states, not product screens**: Home, the thread, the artifact at peek and expanded, the risk journey, the drawer. The client-review and proposal canvases were deleted 2026-09-17 (contradiction 43, closed by deletion) — they duplicated Journey A and B artboards the project owns and keeps current. The Fund explorer, confirm sheet and on-screen keyboard were never recreated.
- `--dur-canvas` (380ms) is now unused — the canvas it timed is gone. Left in place rather than silently changing the token count; delete it in the next token pass.
