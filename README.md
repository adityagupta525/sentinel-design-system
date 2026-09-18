# Sentinel Design System

The design system for **Sentinel** — the chat-led wealth-management assistant for financial advisors
(mutual-fund distributors and partners) at **Centricity WealthTech**. An advisor talks to Sentinel about
a client, a fund or a plan; Sentinel answers in a thread, asks one question at a time, and turns the
answers into artifacts — a risk number, a proposal, a holdings review, a two-move rebalance.

> **Picking this up in a new session?** Read **`docs/CONTINUE-HERE.md`** — the state of the work,
> the rulings made in conversation, what is open, and what is deliberately not in this repository.

One product surface: the iOS-style mobile app, mobile-first at **375 × 812**.

> **Provenance.** `design-system/` is the Claude Design project *Sentinel Design System* imported
> verbatim. `baseline/design-system.sha256` pins every one of those files; `npm run check:integrity`
> fails if any of them drifts without the baseline being updated in the same commit. The only files
> added to that tree are the generated `index.js` / `index.d.ts` barrel.

---

## Quick start

```bash
npm install
npm run preview
```

| | |
|---|---|
| Component pages | http://localhost:4321/pages/00-Index.html |
| The app, end to end | http://localhost:4321/ui_kits/sentinel-app/index.html |
| Risk journey | http://localhost:4321/ui_kits/journey-a-risk/index.html |
| Proposal journey | http://localhost:4321/ui_kits/journey-b/index.html |
| Foundations | http://localhost:4321/guidelines/spacing.html · `colors-*.html` · `type-*.html` · `motion.html` |

The previews load React, ReactDOM, Babel and d3 from public CDNs. Where those are unreachable the dev
server swaps in the copies under `node_modules` **as it serves** — the HTML on disk is never rewritten,
so the pages keep working unmodified wherever they are hosted.

The pages read components from `_ds_bundle.js`, not from source, so **`npm run build:bundle` after every
component change** — otherwise you are looking at the previous build.

## Using it in a product

```jsx
import { Pill, ArtifactCard, HeroNumberCard } from '@centricity/sentinel-design-system';
import '@centricity/sentinel-design-system/styles.css';
```

`index.js` is the only supported entry. `design-system/_adherence.oxlintrc.json` enforces that, plus the
token discipline the system depends on — it warns on raw hex, raw `px` and raw `font-family` in a
consuming codebase. Point your linter at it:

```bash
oxlint --config node_modules/@centricity/sentinel-design-system/design-system/_adherence.oxlintrc.json src
```

## What is in it

**82 components** across ten groups, each with a hand-written `.d.ts` contract:

| Group | Components |
|---|---|
| `text` | Eyebrow, EyebrowDivider, Provenance, StandingDisclosure, DemoFooter |
| `icons` | 10 stroke glyphs — six from the source set, four from Lucide |
| `shell` | TopBar, Dock, Phone, CanvasHeader, StatusBar, HomeIndicator, ScrollToBottomButton, MotionGuard … |
| `actions` | Pill, AnswerChip, ChipRow, ClientChip, DarkButton, StickyCTA, SuggestionRow, RangePills … |
| `forms` | SearchField, SelectionMark, FileUpload … |
| `lists` | ListRow, ListCard … |
| `cards` | ArtifactCard, HeroNumberCard, AllocationCard, DataTableCard, MoveCard, ExplainerSheet … |
| `chat` | UserBubble, SentinelText, SentinelThinking, StepTrace, QAPair, VersionRow, ProgressTrace … |
| `composer` | Composer, MoneyComposer |
| `data` | ChartLine, ChartBar, ChartShare, AttributionChart, StatTile, ConcentrationBar, Dumbbell … |

Plus `tokens/` (five CSS files, the whole vocabulary), `guidelines/` (16 rendered specimen pages),
`pages/` (per-component specs), `ui_kits/` (three runnable prototypes) and `assets/icons/`.

`design-system/readme.md` is the real specification — 43 KB covering voice, colour, type, motion,
layout and every ruling behind them. **Read it before changing anything.**

### Status

`design-system/pages/_index.json` is generated from disk, so it cannot claim a component exists when it
does not. A row is `shipped` only when `<Name>.jsx`, `<Name>.d.ts` **and** `pages/<Name>.html` all exist.

| | |
|---|---|
| shipped | 16 |
| building | 66 |
| specified, not built | 3 — `ResultCard`, `DataTable`, `OverlapView` |

Open craft debt is tracked in [`docs/FINDINGS.md`](docs/FINDINGS.md) and, by the system's own hand, in
`design-system/guidelines/contradictions.md`.

## The four hard rules

Carried into every output. From `design-system/SKILL.md`:

1. **Colour never encodes identity** — one bronze hue for magnitude, labels for identity. No pies,
   donuts or multi-hue stacked bars.
2. **Bad news sits on the peach bubble surface**; `--color-danger` is text/eyebrow colour only.
3. **The composer is on every screen.** A CTA stacks above it in the Dock; nothing replaces it.
4. **Indian number grouping** (₹1,85,000 · ₹25 L · ₹4.2 Cr), day-first dates, sentence case, no emoji.

## Scripts

| | |
|---|---|
| `npm run preview` | Serve the design system at `localhost:4321` |
| `npm run build:barrel` | Regenerate `index.js` / `index.d.ts` from the components on disk |
| `npm run build:bundle` | Rebuild `_ds_bundle.js` — **required before a source change shows in any preview** |
| `npm run build:index` | Regenerate `pages/_index.json` |
| `npm run check:integrity` | Verify `design-system/` against the recorded baseline |
| `npm run lint:adherence` | Run the token/import rules over the system itself |
| `npm run check` | All of the above |

## Repository layout

```
design-system/     The imported project, verbatim (+ the generated barrel)
baseline/          sha256 of every imported file
docs/specs/        v2 → v11 spec history, component request specs, pattern plates
docs/FINDINGS.md   Craft and correctness backlog
tools/             Node runners: preview server, barrel, index, integrity
```

## Licence

Proprietary — © Centricity WealthTech. See [LICENSE](LICENSE) and [NOTICE](NOTICE) for the third-party
fonts and icons it builds on.
