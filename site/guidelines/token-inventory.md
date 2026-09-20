# Token inventory

Every colour token from `src/index.css` `@theme`, with its consumers in `src/lib/ui.tsx`, `src/screens/*` and `src/lib/Keyboard.tsx`. Values verbatim.

| Token | Value | Used by |
|---|---|---|
| `--color-ink` | `#251f1b` | StatusSpacer, TopBar title, UserBubble text, SuggestionRow, AllocationCard rows, HeroNumberCard title/badge, AnswerChip primary/selected label, Chip check glyph, FilterChip selected, CanvasHeader title/⋯, DataTableCard title, Composer input, MoneyComposer input, MoveCard title, ExplainerSheet title, Dumbbell label, DecisionsStrip (none), ProgressTrace "Working", DrawnCheck (bg no), Drawer wordmark, Portfolio/Proposal/FundExplorer names, Keyboard keys & return, scrims `ink/20` `ink/40`, HomeIndicator dark `ink/80`, IconPlus, IconMenu |
| `--color-ink-soft` | `#3d3630` | SentinelText, HeroNumberCard copy, ConstraintCallout body, DisclosureBlock body, ExplainerSheet body, ProgressTrace step labels, Chat success copy, ConfirmSheet/Offer disclosure body, Portfolio callout body |
| `--color-muted` | `#605954` | Eyebrow, SentinelBlock label, Provenance, DemoFooter, QAPair question, ParseNote, KindTag, DetourBanner label, ProgressTrace collapsed/reasoning/chevron, ConcentrationBar caption, Dumbbell "now", AttributionChart notes/sub, HeroNumberCard non-binding labels, DataTableCard description/footer, MoveCard body, Composer placeholder, IconAttach, Drawer section labels, FundExplorer meta, Keyboard "space" & suggestions |
| `--color-bronze` | `#b69377` | HomeIndicator, IconChevronRight, SentinelThinking dots, AnswerChip selected ring, Chip active ring, FilterChip selected ring, ConcentrationBar fill, Dumbbell dots/connector, AttributionChart bars, HeroNumberCard binding bar (hardcoded hex), ProgressTrace done/active circles, DrawnCheck bg, ProgressRail gradient mid-stop, Composer focus border (hardcoded), aura wash, Keyboard return key bg, `--surface-avatar` (bronze 20%) client initials discs, `bronze/60` tertiary dashed border, `bronze/06` SuggestionRow press |
| `--color-bronze-deep` | `#715035` | IconSparkle, Chip label, AnswerChip outline/smart/tertiary/muted label, ActionCard label, FilterChip label, DecisionsStrip label, HeroNumberCard numeral & binding value, MoveCard numeral, AttributionChart total & values, GreetingDivider text, ConstraintCallout/DisclosureBlock eyebrow, CanvasHeader back, ScrollToBottomButton arrow, DetourBanner Resume, Dumbbell target label, DataTableCard showAll, MoneyComposer ₹, ProgressRail gradient start, ChipGlyph strokes, Keyboard special keys, "Open ›" links, Drawer/Portfolio initials |
| `--color-bronze-edge` | `#a07d5f` | Keyboard return key ring only |
| `--color-canvas` | `#f6f4f1` | ScreenBackdrop, PhoneFrame, Drawer, ConfirmSheet & OnePager sheet bg, Dumbbell hollow dot fill, ProgressTrace active circle fill, Keyboard suggestions bar |
| `--color-line` | `#e1deda` | TopBar pill ring, Composer border (hardcoded hex), MoneyComposer ring, attach disc ring, HeroNumberCard/DataTableCard meta pill ring, KindTag ring, DecisionsStrip ring & separators, DetourBanner ring, CanvasHeader back ring, ProgressRail track, ProgressTrace rail & pending circle, EyebrowDivider lines, ExplainerSheet grabber, FilterChip ring, ScrollToBottomButton ring, DataTableCard showAll ring, Drawer + button ring, FundExplorer pills, Keyboard key rings |
| `--color-line-soft` | `#e9e6e2` (was `#e7e7e7` — warmed 2026-09-16; used only for 0.5px dividers on white cards, nothing depended on its coolness) | 0.5px row dividers: SuggestionRow, AllocationCard, DataTableCard rows/header, Home jump rows, Drawer rows, Portfolio holdings, ConfirmSheet rows, Offer matches, CompareCanvas, ArtifactCard footer rule |
| `--color-bubble` | `#f9eee6` | UserBubble, QAPair bubble, AnswerChip smart & card variant, ConstraintCallout, DisclosureBlock, ConfirmSheet/Offer "Before you…" callouts, Portfolio mandate callout, FundExplorer shelf pill on, Offer "Fits" pill |
| `--color-bubble-edge` | `#ebd4c3` | Ring on: UserBubble, QAPair, Chip, AnswerChip (all pill variants), ActionCard, ConstraintCallout, DisclosureBlock, HeroNumberCard badge, avatars, FundExplorer shortlist pill |
| `--color-chip` | `#fbf6f1` | Chip, AnswerChip outline/muted, ActionCard, FilterChip, KindTag, DecisionsStrip pills, DetourBanner, HeroNumberCard/DataTableCard meta pill, DataTableCard showAll, DeltaPill under, ActionConfirm "Would run" card, LockedFigure, FundExplorer pills |
| `--color-alloc-debt` | `#d9bb9e` | AllocationCard middle segment — the only allocation-specific token (`alloc-equity`/`alloc-cash` deleted as duplicates of `bronze`/`bubble-edge`, 2026-09-16) |
| `--color-selected` | `#ebd4c3` | Pill selected + primary, AnswerChip card selected, HeroNumberCard badge. Semantic interactive fill — no chart token does this job |
| `--color-cta` / `-top` / `-bottom` | `#1a1614` / `#3b3531` / `#111111` | The one dark gradient — a **surface**, not a text colour. All four source usages: DarkButton, Composer send, Composer Stop, MoneyComposer send |
| `--color-desk` | `#dedbd6` | The page behind the phone frame (UI kit only) |
| `--color-surface` | `#ffffff` | Every card, sheet, composer, pill-ring disc and check stroke — white in this product is always a surface on `--color-canvas` (was `--color-white`; renamed for role) |
| `--surface-avatar` | `rgba(182,147,119,.20)` | Client-initials discs only (Portfolio header, Drawer client rows). Was `--tint-bronze-20`; its other consumer, Chip-active, died with Chip |
| `--scrim` | `var(--color-ink)` | The only scrim. Opacity at the point of use: 0.25 behind the drawer, 0.4 behind sheets. Modal layers only — the canvas that used to be the "no scrim" case was removed from the product (v5 Part 1). Replaced `--scrim-ink-40`, `--scrim-ink-20` (deleted, unused) and `--scrim-black-25` (deleted, off-system black) |
| `--ring-frame` / `--ring-frame-soft` | `rgba(0,0,0,.10)` / `.08` | PhoneFrame ring, specimen-card frames |
| `--tint-bronze-dashed` | `rgba(182,147,119,.6)` | Pill tertiary dashed outline (the source's own value) |
| `--color-track` | `#edebe7` | Every bar track: AllocationCard, HeroNumberCard meters, ConcentrationBar, Dumbbell rail, AttributionChart (was `alloc-track`; `data-track` removed — decision 2026-09-16) |
| `--color-danger` | `#b4552f` | DeltaPill over text, "Over ceiling" pill text, ConfirmSheet "Required", Offer "Check", Portfolio conflict note — text only |
| `--color-status-over-bg/fg` | `#f3e2da` / danger | DeltaPill over, Portfolio "Over ceiling" (now DeltaPill) |
| `--color-status-under-bg/fg` | chip / bronze-deep | DeltaPill under |
| `--color-status-ok-bg/fg` | `#e4ecdf` / `#4b6141` | DeltaPill ok only. vs-benchmark numbers use `--color-muted` + sign |
| `--color-data-deemph` | `#a39a91` | StandingDisclosure only |

## Non-token values found in the code (candidates, not tokens)

| Value | Where |
|---|---|
| `#8a7a6a` | Pill × stroke (Chat FundsTurn, FundExplorer), LockedFigure lock stroke |
| `#fefcfa`, `#ebd9cc`, `#d9c5b3`, `#ede9e4`, `#e2ddd8` | Keyboard key, special key, special ring, keyboard bg, key-area bg |
| `rgba(17,17,17,0.06)` | Top-right aura wash |
| `rgba(182,147,119,0.24)` | Composer focus ring |
| `rgba(37,31,27,0.045)` | Paper texture dot |

## Type, radius, shadow, motion tokens

Sizes 10 · 11 · 11.5 · 12 · 13 · 14 · 15 · 16 · 18 (Urbanist); 24 · 27 · 40 · 64 (Darker Grotesque). Radii 6 · 8 · 10 · 12 · 16 · 20 · 22 · 24 · 44 · full. Shadows: card 5%/4%, composer, float, bar, drawer, phone, key. Ease `[0.2,0.8,0.2,1]`; durations 150 · 200 · 240 · 250 · 260 · 280 · 300 · 320 · 380 · 400 · 480 · 500 · 600ms. See `tokens/*.css` for names.
