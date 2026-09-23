/* EVERY COMPONENT CONTRACT IN THE SENTINEL DESIGN SYSTEM — 112 of them, in one file.
   Each is the hand-written .d.ts that ships beside its .jsx, and the doc comments carry the
   reasoning, which is the half of this system a rendered page cannot show you. Every component's
   own page already has its contract inlined; this is the copy you can read end to end. In the
   repository they are separate files at design-system/components/<group>/<Name>.d.ts. */

/* ==============================================================================================
   components/actions/AnswerChip.d.ts
   ============================================================================================== */

export type ChipVariant = 'outline' | 'smart' | 'tertiary' | 'muted' | 'primary';
export interface AnswerChipProps { label: string; /** Turns the chip into a full-width card-with-subtitle (used only where the wording changes the meaning). */ subtitle?: string; variant?: ChipVariant; selected?: boolean; onClick?: () => void; }
export function AnswerChip(props: AnswerChipProps): JSX.Element;


/* ==============================================================================================
   components/actions/ChipRow.d.ts
   ============================================================================================== */

export interface ChipRowProps { children: React.ReactNode; animate?: boolean; }
export function ChipRow(props: ChipRowProps): JSX.Element;


/* ==============================================================================================
   components/actions/ClientChip.d.ts
   ============================================================================================== */

import * as React from 'react';
/** The bound client, composer-resident and always removable. Tapping a client does not navigate — it
 *  binds the next thread to that client, and this chip is what "bound" looks like. The drawer's client
 *  tap and a journey's client picker produce the same chip in the same place; typing a name resolves to
 *  the same state, so selection and typing are one flow, not two. */
export interface ClientChipProps {
  name: string;
  /** Avatar letter. Defaults to the first letter of `name`. */
  initial?: string;
  /** A node drawn in the 20pt disc instead of the initial — an illustration, usually. The initial is
   *  the honest default: derived from the name, it cannot be wrong about the person. This exists
   *  because eight clients that are all a bronze disc with a letter is a list the eye cannot hold.
   *  Clipped to the same disc either way, so a row keeps one rhythm whichever it is given. */
  avatar?: React.ReactNode;
  /** Omit to render a non-removable chip (inside a list row, for instance). In the composer it is always present. */
  onRemove?: () => void;
  disabled?: boolean;
}
export function ClientChip(props: ClientChipProps): JSX.Element;


/* ==============================================================================================
   components/actions/DarkButton.d.ts
   ============================================================================================== */

export interface DarkButtonProps { label: string; onClick?: () => void; full?: boolean; arrow?: boolean; }
export function DarkButton(props: DarkButtonProps): JSX.Element;


/* ==============================================================================================
   components/actions/DownloadAction.d.ts
   ============================================================================================== */

export interface DownloadActionProps {
  /** Defaults to `Download ${format}`. */
  label?: string;
  format?: 'PDF' | 'PPTX' | 'CSV' | string;
  /** May return a promise — the pill holds its loading state until it settles. */
  onDownload?: (format: string) => void | Promise<void>;
  size?: 'md' | 'sm';
  tone?: 'outline' | 'smart' | 'tertiary' | 'muted' | 'primary' | 'filter';
  disabled?: boolean;
}
/** A deliberately thin Pill wrapper: "download" as one decision in one place instead of a loading flag
 *  wired by hand at every call site. Confirmation lands ON the control ("Saved to Files", 2s) because
 *  this product has no toasts; failure says what to do next, not what broke. */
/** What the control says once it has finished. Default "Saved to Files", which is right for a build
 *  that writes one. THIS COMPONENT CANNOT CHECK — a caller that does not write a file must say so
 *  here, because a control that states a false outcome is worse than one that states none. */
// doneLabel?: string;
export function DownloadAction(props: DownloadActionProps): JSX.Element;


/* ==============================================================================================
   components/actions/InfoDot.d.ts
   ============================================================================================== */

export interface InfoDotProps {
  /** The figure's name, used to build the accessible label — "CAGR 1Y" → "How is CAGR 1Y worked out?".
   *  Names the figure, never the icon. */
  figure: string;
  /** Opens the ExplainerSheet. Never a tooltip: a tooltip cannot hold a formula, a date range and a
   *  source, and at 375pt it is dismissed by the next tap. */
  onOpen?: () => void;
  size?: number;
  stroke?: string;
}
/** THE RULE as a component: any figure an advisor must defend carries an ⓘ to its explanation.
 *  44pt target around a 14px glyph, inherited from Pressable. */
export function InfoDot(props: InfoDotProps): JSX.Element;


/* ==============================================================================================
   components/actions/InlineActionRow.d.ts
   ============================================================================================== */

import type { PillTone } from './Pill';
export interface InlineAction { label: string; onClick?: () => void; /** Defaults to 'outline'. */ tone?: PillTone; }
export interface InlineActionRowProps {
  actions: InlineAction[];
  /** 60ms staggered fade + rise, matching ChipRow. */
  animate?: boolean;
}
/** Pills placed INLINE IN A MESSAGE BODY — they act on the answer just given (open a canvas, start a branch).
 *  Pills in the Dock answer the pending question instead. Placement is what distinguishes them. */
export function InlineActionRow(props: InlineActionRowProps): JSX.Element;


/* ==============================================================================================
   components/actions/Pill.d.ts
   ============================================================================================== */

export type PillSize = 'md' | 'sm';
export type PillTone = 'outline' | 'smart' | 'tertiary' | 'muted' | 'primary' | 'filter';
export interface PillProps {
  label: string;
  /** md = 36px, chips in the thread and the Dock · sm = 32px, chips inside a card. No third size. */
  size?: PillSize;
  /** outline (default) · smart (peach, prefilled) · tertiary (dashed "?") · muted · primary (sand, ink) · filter (line ring, inside DataTableCard). */
  tone?: PillTone;
  /** sand fill + bronze ring + check. */
  selected?: boolean;
  /** A filter chip that takes itself out of the query. The pill stays the ONLY control — there is no
   *  nested ✕ button, because a control inside a control is a defect this system has shipped once
   *  already. It draws the ✕ in a trailing slot and names itself "Remove <label>"; before this existed
   *  the fund screen typed "  ✕" into the label, so a screen reader read the glyph as part of the name
   *  and there was nothing to tell a remove chip from a select chip. Pairs with tone="filter". */
  removable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  /** Working, not unavailable: the label HOLDS, the glyph slot becomes a 13px spinner, the label drops
   *  to 60%, the width and the press target do not change, and the press is inert. Not dimmed like
   *  `disabled` — a pill waiting on the network is doing something. `DownloadAction`, `FileUpload`'s
   *  retry and `ResultCard`'s primary all wait on this state. */
  loading?: boolean;
}
/** Tappable. Visual height 32/36; hit area always ≥44px via an invisible vertical extension. */
export function Pill(props: PillProps): JSX.Element;


/* ==============================================================================================
   components/actions/Pressable.d.ts
   ============================================================================================== */

export interface PressableProps {
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  /** Press scale. 0.98 default; 0.94 on 42px icon discs. */
  pressScale?: number;
  /** Accessible name — REQUIRED when the child is a glyph, a numeral or anything not self-describing. */
  label?: string;
  /** Override the implicit button role (e.g. 'tab', 'switch'). */
  role?: string;
  /** For toggles: paints aria-pressed. */
  pressed?: boolean;
  /** For disclosures: paints aria-expanded. Pair with `controls`. */
  expanded?: boolean;
  /** id of the region this control expands. */
  controls?: string;
  tabIndex?: number;
  /** Renders INERT rather than disabled: announced as unavailable, but WITHOUT the 0.4 dimming `disabled`
   *  carries. For a control whose current value must stay readable while it cannot be changed —
   *  SegmentedRow's locked row. Pair it with `onClick={undefined}` and `tabIndex={-1}`. */
  'aria-disabled'?: boolean;
  /** 'auto' (default) measures the rendered box and extends the tap target to 44pt.
   *  'none' opts out — only for a control already ≥44 in both axes, or one nested inside a larger target. */
  expand?: 'auto' | 'none';
  /** Anything except `outline`, which the focus ring owns. `boxShadow` is safe to pass. */
  style?: React.CSSProperties;
}
/** The operable base. Every component built on it inherits two guarantees it cannot get wrong:
 *  a ≥44pt tap target (measured, not declared) and a :focus-visible ring that clears 3:1.
 *  The ring is a solid --border-focus OUTLINE at --border-focus-width plus the --focus-ring halo. It is
 *  an outline rather than a box-shadow on purpose: an inline `style.boxShadow` from a caller beats a
 *  stylesheet rule, so a box-shadow ring vanished on every chip that passed its own ring (measured).
 *  Callers may pass `boxShadow` freely; they must not pass `outline`. The halo alone measures 1.22:1
 *  and would fail WCAG 2.4.13. */
export function Pressable(props: PressableProps): JSX.Element;


/* ==============================================================================================
   components/actions/RangePills.d.ts
   ============================================================================================== */

export interface RangePillsProps {
  /** Default ['1M','3M','1Y','3Y','ALL']. Add 'YTD' / '5Y' where the data supports them. */
  ranges?: string[];
  value?: string;
  onChange?: (range: string) => void;
  label?: string;
  /** True when the fund performance source is unconfirmed — one of the three locked decisions. The row
   *  renders inert and says why, rather than offering ranges over a number nobody owns. */
  locked?: boolean;
  lockedNote?: string;
}
/** The time range for a performance series — a number with no period attached is not a number an
 *  advisor can defend. A single-select filter over one panel, so a group of aria-pressed buttons, not
 *  a tablist. The row scrolls horizontally when the ranges overflow 343: horizontal inside vertical is
 *  orthogonal and allowed. */
export function RangePills(props: RangePillsProps): JSX.Element;


/* ==============================================================================================
   components/actions/SegmentedRow.d.ts
   ============================================================================================== */

export interface SegmentedRowProps {
  /** Two to five short labels. Sentence case; the row wraps rather than scrolling. */
  options: string[];
  /** The selected option. Defaults to the first — a segmented row is never in no state. */
  value?: string;
  onChange?: (option: string) => void;
  /** The group's accessible name — "Appearance", "Time range". Required. */
  label: string;
  /** The whole row renders inert and `lockedNote` appears beneath it. Use it when the choice exists
   *  but cannot be taken yet; never hide the option instead. OverlapView's rule: the cap is stated
   *  when reached, never enforced by a disabled button with no explanation. */
  locked?: boolean;
  /** One line, in the product's voice, on why the row is locked. */
  lockedNote?: string;
}
/** One of a set, as filter-tone pills at 32px — the selection vocabulary RangePills established. A
 *  group of aria-pressed buttons, not a tablist: tabs change what you look at, this changes one value
 *  about the same thing. Every pill answers to a 44pt target through Pressable. */
export function SegmentedRow(props: SegmentedRowProps): JSX.Element;


/* ==============================================================================================
   components/actions/SuggestionRow.d.ts
   ============================================================================================== */

export interface SuggestionRowProps { label: string; onClick?: () => void; /** Drops the hairline under the last row. */ last?: boolean; }
export function SuggestionRow(props: SuggestionRowProps): JSX.Element;


/* ==============================================================================================
   components/brand/ClientAvatar.d.ts
   ============================================================================================== */

import * as React from 'react';

/**
 * The client, as a person rather than as a letter.
 *
 * Eight flat illustrations in this product's palette, varying by age and gender, with no facial
 * features beyond an accessory — so that none of them is a portrait of anybody. They exist because a
 * column of bronze discs each carrying one capital is a list the eye cannot hold, which is what the
 * drawer, the client picker and Home all were.
 *
 * THE FACE IS A FUNCTION OF THE NAME. The same client is the same person on every screen, and no
 * screen has to carry a mapping. The book has no avatar field, so this is presentation rather than a
 * record: two clients can share a face and neither is claimed to look like it.
 *
 * The eight images are data URIs inside the component, not files beside it. The system ships no image
 * directory, and both publishing builds break a relative path — the artifact serves its page at a URL
 * with no trailing slash, and the app is one HTML document with nothing next to it.
 */
export interface ClientAvatarProps {
  /** The client's name. Gender is read from an honorific or the given name; everything else hashes. */
  name?: string;
  /**
   * The client's age, when the caller has it. Nothing in a name carries one, so without this the face's
   * age band is hashed and a 38-year-old can come out grey. `book.jsx` records it on every client, and
   * the two surfaces built from the book — the picker and the drawer — pass it. Bands: under 35, 35–55,
   * over 55. Ignored when gender could not be determined, because guessing the band and drawing the
   * wrong gender would be two wrong answers rather than one.
   */
  age?: number;
  /** Disc diameter in points. 32 matches `ListRow`'s avatar leading, 20 matches `ClientChip`. */
  size?: number;
  /** Shown instead of the derived letter when there is no name — for a placeholder row. */
  initial?: React.ReactNode;
}

export function ClientAvatar(props: ClientAvatarProps): JSX.Element;

/**
 * The face for a name, as a data URI — for a caller that needs the image itself rather than the disc
 * (an `<img>` inside another component's own frame, which is what `ListRow` and `ClientChip` do).
 * `null` when there is no name to derive one from.
 */
export function clientFaceFor(name?: string, age?: number): string | null;

/** The chosen face's key — `'f-mid'`, `'m-turban'` — for a specimen, or a test that asserts a pairing. */
export function clientFaceKey(name?: string, age?: number): string | null;

/** All eight faces by key, as data URIs. For a specimen that shows the set rather than eight names. */
export const CLIENT_FACES: Record<string, string>;


/* ==============================================================================================
   components/brand/DotField.d.ts
   ============================================================================================== */

export interface DotFieldProps {
  /** Canvas side in px; the mascot's geometry is laid into 78% of it. 168 is the splash. */
  size?: number;
  /** How long the dots take to travel from their orbits onto the mascot. Defaults to
   *  --dur-enter + --dur-bar read from the tokens, so the field and SplashScreen agree without being told. */
  settleMs?: number;
  /** Delay before the settle begins, in ms. The orbits run meanwhile. */
  delayMs?: number;
  /** Settled dots breathe on opacity at SentinelThinking's 1.2s rhythm while this is true — the field's
   *  `working` state. Off, a settled field is still. */
  working?: boolean;
  /** Accessible name; the canvas is role="img". */
  label?: string;
  /** Fires once, when the last dot has landed. SplashScreen swaps the solid Mascot in on it. */
  onSettled?: () => void;
}
/** Bronze dots on tilted orbits that settle onto the mascot's own geometry — eyes first, then plate,
 *  then head — so the eyes open before the face exists. One colour, read from --color-bronze at mount;
 *  depth is alpha alone. Method from thinking-orbs (MIT), no dependency; see
 *  sentinel-craft/references/borrowed.md. Reduced motion draws the settled frame once. */
export function DotField(props: DotFieldProps): JSX.Element;


/* ==============================================================================================
   components/brand/Mascot.d.ts
   ============================================================================================== */

export interface MascotProps {
  /** Width in px. Height follows at 0.74 — the head is 1.38 : 1, read off the 3D model's front view.
   *  The signature in a turn is 13–18; the splash uses 168. Below about 40 the eyes' offset stops
   *  reading and the mark becomes a plate with two dots, which is still the character but no longer
   *  its expression — measure before using it small. */
  size?: number;
  /** What the mascot is doing, and the only three things it may claim to be doing.
   *  `waking` — eyes off. Cold start only; the moment before the product exists.
   *  `attentive` — eyes on, still. The resting face, and the default.
   *  `working` — eyes pulse on opacity, 1.2s, the second trailing by 150ms: SentinelThinking's own
   *  rhythm, so a waiting mascot and a waiting thread are one behaviour.
   *  There is deliberately no `happy`, `confused` or `empathetic`. A state is a claim about what the
   *  product is doing, and a wealth-management tool should not claim a mood about a figure it is about
   *  to show. */
  state?: 'waking' | 'attentive' | 'working';
  /** Which neutral is the shell and which is the plate. `light` (desk shell, ink plate) for dark
   *  grounds — the splash; `dark` (ink shell, desk plate) for the canvas. The eyes are bronze in both.
   *  No colour is introduced by either; rule 1 holds. */
  tone?: 'light' | 'dark';
  /** Accessible name. The svg is role="img"; a decorative use should still name what it depicts. */
  label?: string;
}
/** The product's character, as one SVG from tokens — the 3D model's front view at any size. Head
 *  only: the body is noise at every size this is used at. `ds-mascot-shell` and `ds-mascot-eyes` are
 *  hooks for a caller that needs to reveal the two separately, which is what SplashScreen does; they
 *  are not styled by anything in this system. */
export function Mascot(props: MascotProps): JSX.Element;


/* ==============================================================================================
   components/brand/SplashScreen.d.ts
   ============================================================================================== */

export interface SplashScreenProps {
  /** The work this screen covers — fonts, the book, a restored thread. It leaves when this settles,
   *  resolved or rejected alike; a splash is not where a failure is reported. Pass something that is
   *  genuinely pending: `document.fonts.ready` is honest, `new Promise(r => setTimeout(r, 2000))` is
   *  the tax this component exists to refuse. */
  until: Promise<unknown>;
  /** Called once the exit has finished and the screen has unmounted itself. */
  onDone?: () => void;
  /** The mascot's width. 168 fills a 375pt phone the way the splash was designed; do not go small
   *  here — small is the signature's job. */
  mascotSize?: number;
  /** Accessible status text. The screen is role="status" so a screen reader hears that something is
   *  starting rather than meeting silence. */
  label?: string;
}
/** Covers real work with the mascot arriving as dots and resolving into itself, and leaves when the
 *  work does. The floor is DotField's settle (--dur-enter + --dur-bar), the crossfade to the solid
 *  Mascot (--dur-enter) and the exit (--dur-screen), because the eyes cannot half-open; the hold is
 *  only what `until` adds. Positioned absolute, so it fills whatever frame it is mounted in — the
 *  phone stage in app.html, a PhoneFrame on a spec page. */
export function SplashScreen(props: SplashScreenProps): JSX.Element | null;


/* ==============================================================================================
   components/cards/AllocationCard.d.ts
   ============================================================================================== */

export interface AllocSeg { label: string; value: number; /** Use var(--color-alloc-equity) / -debt / -cash — never a new hue. */ color: string; }
export interface AllocationCardProps { segments: AllocSeg[]; animate?: boolean; }
export function AllocationCard(props: AllocationCardProps): JSX.Element;


/* ==============================================================================================
   components/cards/ArtifactCard.d.ts
   ============================================================================================== */

export type ArtifactState = 'peek' | 'expanded' | 'filling';
/** A result as an object in the conversation — and the artifact's only surface. There is no canvas.
 *
 *  CONTRACT — no nested scroll. An expanded card takes its content's natural height; the thread
 *  carries the scroll. Callers must not pass `children` that scroll, and must not wrap the card in a
 *  fixed height or `overflow: auto`. Peek clips its preview AT 96px — a CAP, not a reserved block, so a
 *  preview that measures less takes its own height and the card closes under it; expanded clips nothing.
 *  The caller owns the two thread scrolls: on expand, bring the card's header just under the app bar;
 *  on collapse, return to the card's position. */
export interface ArtifactCardProps {
  /** `peek` (default) — preview capped at 96px (a shorter one keeps its own height); footer reads "Expand ⌄". `expanded` — natural height, title
   *  and ⋯ in the card's own header row, footer reads "Collapse ⌃". `filling` — skeleton-first, actions inert.
   *  There is no `'collapsed'`: the 96px peek is recognition, not reading, and the old name invited a
   *  taller preview. A caller still passing `'collapsed'` falls to the `peek` default — it is not an alias. */
  state?: ArtifactState;
  /** Eyebrow row, e.g. "Drift attribution · Q2 → Q3". Moves into the card header when expanded. */
  eyebrow: string;
  /** 16/24 medium title — the finding, not the noun: "62% → 71%, mostly the market". */
  title: string;
  /** The artifact. At `peek`: a sparkline strip (plot 72 + one 14px end-label row, no ticks, no gridlines,
   *  no legend), a single stat row, or a table's top three rows with a "+40 more" line — never a chart with
   *  axes. At `expanded`: plot 180 + a 14px axis band, block ≤ 208. Must never scroll. */
  children: React.ReactNode;
  /** Required on every artifact — "As of 30 Sep · from his Q3 statement". */
  provenance?: string;
  /** Toggles collapsed ⇄ expanded in place. The chevron rotates 180°. */
  onToggle?: () => void;
  /** Opens the explainer sheet without leaving the thread. */
  onWhy?: () => void;
  onShare?: () => void;
  /** The ⋯ menu in the expanded header — carries the table view every chart is required to offer. */
  onMenu?: () => void;
  expandLabel?: string;
  collapseLabel?: string;
}
/** THE FOOTER IS OPTIONAL AND IT IS DRIVEN BY THE HANDLERS. Supply none of `onToggle`, `onWhy` or
 *  `onShare` and the card ends after its content: no rule, no 44pt row, and no empty buttons. Until
 *  F-42 (19 Sep 2026) it rendered regardless, so every `ResultCard` ended in three unnamed `<button>`s
 *  that a keyboard could reach — 56px of dead space was the lesser half of it. */
export function ArtifactCard(props: ArtifactCardProps): JSX.Element;


/* ==============================================================================================
   components/cards/Badge.d.ts
   ============================================================================================== */

export interface BadgeProps {
  children: React.ReactNode;
  /** status = 10px uppercase bold on the status token pairs · meta = 11px medium, chip bg, line ring. */
  variant?: 'status' | 'meta';
  /** status only. Always ships with a word — colour never signals alone. */
  tone?: 'over' | 'under' | 'ok';
}
/** Not interactive — no onClick. Exempt from the 44px touch-target rule for that reason. If it must be a target, use Pill. */
export function Badge(props: BadgeProps): JSX.Element;


/* ==============================================================================================
   components/cards/ConfirmSheet.d.ts
   ============================================================================================== */

export interface ComplianceRow {
  /** "Compliance shelf", "Single-fund ceiling", "Client consent". */
  label: string;
  /** The status, stated: "Passed", "No fund over 25%", "Required". Never a tick on its own. */
  value: React.ReactNode;
  /** 'required' renders the value in --color-danger as TEXT — rule 2, never a fill. */
  tone?: 'ok' | 'required';
}
export interface ConfirmSheetProps {
  open: boolean;
  /** Also the dialog's accessible name. Name what is being approved and for whom — "Approve · R. Sharma". */
  title: string;
  /** REQUIRED, and it renders ABOVE the numbers. What this will do, in the advisor's world: whose
   *  authority it runs under, who is told, and what does not change. A confirm sheet whose small print
   *  sits under the numbers is one that was read after the decision was made. */
  disclosure: React.ReactNode;
  /** Default "Before you approve". */
  disclosureEyebrow?: string;
  /** REQUIRED in practice: compliance is STATED as rows, never implied by silence. An empty array is
   *  accepted only for a confirm step where nothing is checked, which in this product does not exist yet. */
  rows: ComplianceRow[];
  /** What is being approved — the MoveCards, the amount, the document. It scrolls; the commit row does not. */
  children?: React.ReactNode;
  commitLabel?: string;
  /** The dismiss is a WORD beside the commit, not only the scrim. The archive showed one visible control
   *  and it said Approve; a commit-or-dismiss decision has to show both halves. */
  dismissLabel?: string;
  onCommit?: () => void;
  /** Called by the scrim, by the dismiss and by Escape. The caller owns `open`, so a sheet never half-closes. */
  onClose?: () => void;
  /** Between commit and outcome: the commit button says what it is doing and stops accepting taps. No
   *  spinner — this product's waits are named, not spun. */
  busy?: boolean;
  busyLabel?: string;
}
/** The decision surface, and THE ONE SURFACE IN THE PRODUCT WITH NO COMPOSER — rule 3's single documented
 *  exception (`readme.md:204`). It takes no composer prop, so the exception lives in the type rather than
 *  in a caller's discipline.
 *
 *  The order is fixed: title → disclosure → compliance rows → what is being approved → commit. `disclosure`
 *  and `rows` are required because a sheet missing either is the defect this component exists to prevent.
 *
 *  It may scroll inside itself and that is NOT the no-nested-scroll rule, which governs the thread and the
 *  artifact. This is the top layer over an inert thread; it caps at 88% and scrolls its body, with the
 *  commit row pinned outside the scroller so the decision never scrolls away from what it decides.
 *
 *  role="dialog" aria-modal, labelled by `title`; Escape closes; focus moves in and Tab is trapped, armed by
 *  the false → true transition only — never for a sheet mounted already open (F-25). */
export function ConfirmSheet(props: ConfirmSheetProps): JSX.Element | null;


/* ==============================================================================================
   components/cards/ConstraintCallout.d.ts
   ============================================================================================== */

export interface ConstraintCalloutProps { /** "Cannot build this", "That does not fit", "Before you approve" */ eyebrow: string; body: React.ReactNode; }
export function ConstraintCallout(props: ConstraintCalloutProps): JSX.Element;


/* ==============================================================================================
   components/cards/DataTable.d.ts
   ============================================================================================== */

export type ColumnKind = 'text' | 'number' | 'percent' | 'currency' | 'badge' | 'bar' | 'sparkline';
export type ColumnAlign = 'start' | 'end';
export type SortDir = 'asc' | 'desc' | 'none';
export type Density = 'compact' | 'default';
export type TableOverflow = 'fold' | 'scroll';

export interface DataTableColumn {
  key: string;
  label: string;
  kind: ColumnKind;
  /** `kind='sparkline'` only: the tone the line takes — 'ramp' (default) the row's own series,
   *  'muted' a benchmark or prior period, 'status' a crossed limit. Never a colour. */
  tone?: 'ramp' | 'muted' | 'status';
  /** `kind='sparkline'` only: the accessible name each spark takes. Defaults to the point count and
   *  the final value. Pass it when the column header does not say what the series is. */
  sparkLabel?: string;
  /** `kind='bar'` only: the low end of the bar's scale. **Default 0**, so every bar column written
   *  before this draws what it drew — a holding weight, where 0% is a real position. Pass it when the
   *  zero is not meaningful for the quantity: ten fund scores between 58 and 80 scaled from zero are
   *  ten bars within a quarter of each other's length, and the column reads as no signal. Same
   *  reasoning and same safeguard as `Dumbbell.min` — the figure is the cell's content and the bar
   *  sits behind it, so a baseline can never leave a number unreadable. */
  min?: number;
  /** Derived from `kind` — text and badge start, every figure ends. Override only when the derivation
   *  is wrong for a specific column, never as a style preference: a column of figures that does not
   *  share a right edge cannot be compared down. */
  align?: ColumnAlign;
  /** Fixed px. Omit to share the remaining width. The sticky column defaults to 132 when scrolling. */
  width?: number;
  /** EXACTLY ONE column may be sticky, and it is the entity name. Without it the table is unreadable
   *  the moment it scrolls sideways. TypeScript cannot express "exactly one" over an array, so the
   *  rule lives here and the component warns once and uses the first rather than rendering two sticky
   *  cells that fight over the same offset. Omit it entirely and the first column is used. */
  sticky?: boolean;
  sortable?: boolean;
}

export type DataTableRow = Record<string, React.ReactNode> & {
  /** Stable key. Falls back to the index, which is wrong the moment rows re-sort. */
  id?: string;
};

export interface DataTableEmptyState {
  /** One line in the product's voice. Never "No data" — "Nothing matches every filter". */
  title: string;
  body?: string;
  /** One pill, at most — usually the way out of the filter that emptied it. */
  action?: React.ReactNode;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  /** Title above the table. */
  title?: string;
  /** Default 'default'. 'compact' tightens the row inset only; it never changes type or alignment. */
  density?: Density;
  /** Default 'fold' — `maxRows` then a ghost "Show all 43", the pattern the review journey already
   *  uses. A 43-row table inside a chat thread is not a good idea. 'scroll' shows every row. */
  overflow?: TableOverflow;
  /** The active sort. One column at a time: multi-column sort is unusable on a phone. */
  sort?: { key: string; dir: SortDir };
  /** Called with the next state in the cycle none → desc → asc. Omit and no header is pressable. */
  onSort?: (key: string, dir: SortDir) => void;
  /** A row of filter Pills (tone="filter"), above the header. */
  filters?: React.ReactNode;
  /** Return a node and the row becomes expandable IN PLACE — never a modal. The chevron lives in the
   *  sticky column and the detail pushes the rows below it down, so the row you opened does not move
   *  under your thumb. Return null for rows with nothing to show. */
  expandable?: (row: DataTableRow) => React.ReactNode;
  /** Which row index starts expanded. Null (default) means all closed, which is every product call site.
   *  It exists because the expansion was internal state with no way in, so a frozen specimen could not
   *  show a row opened in place — the state this component's whole no-modal rule is about. Same gap and
   *  the same fix as `ProgressTrace.initialCollapsed`. */
  defaultOpen?: number | null;
  /** 'fold' only. Default 5. */
  maxRows?: number;
  onShowAll?: () => void;
  /** REQUIRED — every table in this product is empty on someone's first day, or one filter away. */
  emptyState: DataTableEmptyState;
  /** Skeleton rows on --color-track, not a spinner. */
  loading?: boolean;
  /** The live label the first skeleton row carries — "Reading her September statement". A skeleton
   *  that says what it is doing is the difference between waiting and wondering. */
  loadingLabel?: string;
}

/** The full table: sorting, filters, expand-in-place, horizontal scroll with a fade and a one-time
 *  nudge. `DataTableCard` remains the three-column card for a thread; this is its widening.
 *
 *  A `kind='bar'` column reads its magnitude from `<key>Value` when present, otherwise by parsing the
 *  displayed string. The bar is drawn behind the figure in `--tint-bronze-06` — one hue, magnitude
 *  only. Never a categorical colour in a table. */
export function DataTable(props: DataTableProps): JSX.Element;


/* ==============================================================================================
   components/cards/DataTableCard.d.ts
   ============================================================================================== */

export interface TableCol { key: string; header: string; align?: 'left' | 'right'; }
export type TableRow = Record<string, React.ReactNode>;
export interface DataTableCardProps { title: string; meta?: string; description?: string; columns: TableCol[]; rows: TableRow[]; footer?: string; /** Row of Pill size="sm" tone="filter" */ filters?: React.ReactNode; /** ConcentrationBar */ bar?: React.ReactNode; /** Label of the chip-surface "Show all" button */ showAll?: string; onShowAll?: () => void; }
export function DataTableCard(props: DataTableCardProps): JSX.Element;


/* ==============================================================================================
   components/cards/DisclosureBlock.d.ts
   ============================================================================================== */

export interface DisclosureBlockProps { text?: string; eyebrow?: string; }
export function DisclosureBlock(props: DisclosureBlockProps): JSX.Element;


/* ==============================================================================================
   components/cards/ExplainerSheet.d.ts
   ============================================================================================== */

export interface ExplainerSheetProps {
  open: boolean;
  /** Also the dialog's accessible name — it is what a screen reader announces when the sheet opens,
   *  so it must name the term being explained, never "Info" or "Details". */
  title: string;
  /** One paragraph per entry. An array rather than a string so a sheet cannot smuggle in a heading,
   *  a list or a link; two paragraphs is the working limit, and a third belongs in the thread. */
  body: string[];
  /** Called by the scrim, by "Got it" and by Escape. The caller owns `open`, so a sheet never
   *  half-closes. */
  onClose: () => void;
}
/** The definition, on demand. role="dialog" aria-modal, labelled by `title`; Escape closes it; focus
 *  moves into the sheet when it opens and returns to whatever opened it when it closes.
 *
 *  Tab is trapped and wraps at the boundary: Tab on the last control goes to the first, Shift+Tab on
 *  the first goes to the last, so with one control both keys keep "Got it". The trap is armed by the
 *  same `false → true` transition that moves focus in, and never for a sheet mounted already open —
 *  a spec page's static specimens are pictures of a dialog, not dialogs, and must not take the page's
 *  keyboard. Until F-25 was closed, aria-modal said there was nothing outside while a keyboard could
 *  still walk out behind the scrim.
 *
 *  Never put a decision in it. "Got it" is the only way out besides the scrim, and it is not a word
 *  anyone should tap to approve money — a decision belongs in the Dock's CTA (rule 3). */
export function ExplainerSheet(props: ExplainerSheetProps): JSX.Element | null;


/* ==============================================================================================
   components/cards/FilterSheet.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface FilterOption {
  /** The value stored in `value[group.key]`. */
  value: string;
  /** What the advisor reads: a BAND, not a number — "Under 0.7%", "AA and above", "1–3 years". */
  label: string;
  /** How many rows this option would leave. Rendered beside the label, because a count beside each
   *  option is one of the two highest-impact things a filter interface can carry. `0` renders the
   *  option inert — an option that leads nowhere should not be tappable. */
  count?: number | null;
}

export interface FilterGroup {
  key: string;
  /** The facet's name, shown as an eyebrow: "Expense ratio", "Risk". */
  label: string;
  /** One line under the label where the facet needs a word of explanation. */
  note?: string;
  /** 'single' clears on re-tap; 'multi' accumulates into an array. Default 'single'. */
  mode?: 'single' | 'multi';
  options: FilterOption[];
}

export interface FilterSheetProps {
  open: boolean;
  title?: string;
  groups: FilterGroup[];
  /** Selections, keyed by group. A string for 'single', an array for 'multi'. The applied-chip row is
   *  DERIVED from this — never pass applied filters separately, or the chips and the list can disagree. */
  value?: Record<string, string | string[] | null>;
  onChange?: (groupKey: string, next: string | string[] | null) => void;
  /** How many rows the current selection leaves. Rides the commit button. `null` when not yet known;
   *  `0` turns the button into a sentence that says so and offers the fix. */
  resultCount?: number | null;
  /** What `resultCount` counts. Defaults to 'funds'. */
  unit?: string;
  onApply?: () => void;
  onClose?: () => void;
  onClearAll?: () => void;
}

/**
 * A batch filter sheet: selections are held and committed once, with the result count on the commit.
 *
 * Batch rather than live because a phone should not spend a page load per tap; bands rather than
 * sliders because an advisor mid-call thinks in "under 0.7", not in 0.63 — and a band can carry its
 * own count where a slider cannot. Applied filters stay visible as removable chips, because an
 * advisor has to be able to read them aloud to a client.
 *
 * MUST be mounted closed and opened by a state change. The Tab trap arms on the false → true
 * transition only (F-25); a sheet rendered already open takes the page's keyboard.
 *
 * Zero matches is a sentence on the button, not a dead control: the sheet still closes, so the
 * advisor can see what they asked for and relax one filter.
 */
export function FilterSheet(props: FilterSheetProps): JSX.Element | null;


/* ==============================================================================================
   components/cards/FundCard.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface FundHeadline {
  /** The figure, already formatted — '9.76%', '₹1,04,318', '8.75%'. The card never formats, because
   *  what a figure means differs per family and the caller is the one that knows. */
  value: string;
  /** What it is, in the advisor's words: '3Y return', 'Coupon', 'Current value'. */
  label: string;
}

export interface FundFact {
  label: string;
  /** Already formatted, Indian grouping applied. */
  value: string;
}

export interface FundCardProps {
  /** The instrument, as the catalogue names it. */
  name: string;
  /** One line under it: category, plan, sub-type. */
  sub?: string;
  /** One or two letters for the AMC disc — 'CR', 'UTI'. A letter, not a logo image: this system ships
   *  no images and a remote 24px logo is a request that can fail on a card. */
  logo?: string;
  /** 'On your shelf', 'New'. Takes the top-right corner, unless `selectable` needs it — then it moves
   *  down to the chip row rather than sitting on top of the checkbox. */
  badge?: string;
  badgeTone?: 'over' | 'under' | 'ok';
  /** Short facts that are labels rather than figures: 'Direct', 'Very high risk', 'Open ended'. */
  chips?: string[];
  /** The one number the advisor came for, shown in a rail on the RIGHT of the name rather than in a
   *  row below it — the figure and the fund's name are the two things read together.
   *  **Optional, and its absence is not a gap.** Four of the
   *  eight families in the catalogue have no return at all; a bond's card is carried by `facts`. Never
   *  pass a placeholder — an em dash where the headline goes reads as "we do not know this fund". */
  headline?: FundHeadline;
  /** The series behind the headline, oldest first. Drawn at the right end of the FACTS row, not in a
   *  row of its own — that is where the card found the vertical room to come down from 173pt to
   *  123pt. Drawn only when it exists: there is no empty state, because a blank box beside a number
   *  reads as a chart that failed to load. Two funds on the same three-year return are not the same
   *  fund, and this is what says so. */
  spark?: number[];
  /** The facts this KIND of instrument has: AUM and TER for a fund, maturity and frequency for a
   *  bond. Divided by a hairline from the headline, and by middots from each other. */
  facts?: FundFact[];
  /** Show a checkbox for multi-select comparison. It is a SIBLING of the card's own control, never
   *  nested inside it — a control inside a control is invalid, and this repository has shipped that
   *  bug before. */
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  /** The one-pager, open. Controlled by the list, because opening one closes the others. */
  open?: boolean;
  onToggle?: () => void;
  /** The one-pager itself. When present the card becomes its own control and grows into the page in
   *  place — the same `0fr → 1fr` StepBlock uses, deliberately: two expansions in one funnel would
   *  teach the advisor two behaviours for one gesture. */
  children?: React.ReactNode;
  id?: string;
}

/**
 * An instrument, as a card that opens into its own page.
 *
 * The card is not a fund card with fields missing. Of the catalogue's eight families only two carry
 * a return and a NAV series; a bond has a coupon, a yield, a face value, a maturity and a payment
 * frequency instead, and those are different facts rather than worse ones. So the card takes one
 * `headline` and a row of `facts`, and the caller — which has already asked `shapeOf(id)` — decides
 * what they are.
 *
 * It opens in place: the one-pager is not a screen, the card grows into it and shrinks back, in the
 * same thread, with the scroll position kept.
 */
export function FundCard(props: FundCardProps): JSX.Element;


/* ==============================================================================================
   components/cards/HeroNumberCard.d.ts
   ============================================================================================== */

export interface MeterRow {
  label: string;
  value: number;
  /** The binding (lowest) score — bronze fill, bold ink label, bronze-deep value. Every row is drawn; this one is only distinguished. */
  binding?: boolean;
}
export interface HeroNumberCardProps { title: string; meta: string; value: number; badge: string; copy: React.ReactNode; rows: MeterRow[]; }
export function HeroNumberCard(props: HeroNumberCardProps): JSX.Element;
export function useCountUp(target: number, ms: number, run?: boolean): number;


/* ==============================================================================================
   components/cards/InfoCard.d.ts
   ============================================================================================== */

import type { ChartSeries } from '../data/ChartLine';
/** THE FOOTNOTE STAT — the quiet one, and contradiction 62's ruling of 20 Sep 2026 is which.
 *
 *  Canvas ground, INSET ring, `--space-10` padding, `--type-caption-font` label, 13px ink value, an
 *  `InfoDot` always. It is a fact ABOUT the thing this card is already about: riskometer, expense
 *  ratio, exit load, fund size under a fund's name. It is internal to `InfoCard` — not exported, and
 *  it never appears alone.
 *
 *  Its loud counterpart is `StatTile`, THE FIGURE TILE: surface ground, outset ring, 24px display
 *  bronze, used when the figure IS the point of the turn. Rendered side by side on
 *  `screens/journey-f/review.html`, four StatTiles are the loudest thing on the screen and these read
 *  as a footer — which is right in both places, and was a trap while neither had a name.
 *
 *  The test, in one line: **if the reader came for this number, it is a figure tile; if they came for
 *  the thing and this number qualifies it, it is a footnote stat.** */
export interface InfoCardStat {
  /** "CAGR 1Y", "Max drawdown 1Y" — named so the ⓘ's label reads "How is CAGR 1Y worked out?". */
  label: string;
  value: string;
  /** This one figure has no confirmed owner — renders as —— while the rest of the card works. */
  locked?: boolean;
}
export type InfoCardKind = 'fund' | 'manager';
export type ShelfStatus = 'on-shelf' | 'not-on-shelf' | 'under-review';

export interface ManagerTenure {
  /** Years this manager has run the fund. */
  managerYears: number;
  /** Years of track record the fund has in total. */
  fundYears: number;
  /** "Mar 2021". Rendered as "Managing since Mar 2021." */
  since?: string;
}

export interface InfoCardProps {
  /** Default 'fund'. 'manager' replaces the figure, chart and range row with the TENURE BAR and
   *  nothing else — the spec is blunt that without the bar the card is decorative and should not be
   *  built, because a three-year record under a manager who arrived last year is not that manager's
   *  record and a number alone leaves the advisor doing that arithmetic in front of a client. */
  kind?: InfoCardKind;
  /** Fund only. Renders the compliance shelf as a Badge on the over / under / ok tones. A manager has
   *  no shelf status: the compliance shelf holds no opinion about a person. */
  shelf?: ShelfStatus;
  /** 'manager' only, and effectively required for it — the card has no reason to exist without it.
   *  Two segments of one hue plus the track: the manager's years in bronze, the rest in --color-track.
   *  Both are labelled directly. Below a third of the record it also says so in words. */
  tenure?: ManagerTenure;
  /** "As of 30 Sep · from the scheme information document". Required in practice for any figure an
   *  advisor may have to defend — which on this card is all of them. */
  provenance?: string;
  name: string;
  meta?: string;
  /** The headline figure, in the display face. */
  figure?: string;
  figureNote?: string;
  /** WHAT THE FIGURE SITS AGAINST — one line under it, naming the reference and the gap. A return with
   *  nothing beside it is a claim; every reference screen that does this well quotes the benchmark in
   *  the same breath. Set a step above the caption in weight, because an advisor reads it out loud and
   *  it carries two numbers a client will hear.
   *  The WORDS "ahead" and "behind" belong to this component, not to the caller — six screens must not
   *  phrase one comparison six ways. The caller supplies the figures already formatted, because it owns
   *  the currency; the component supplies the sentence.
   *  `{ label: 'Nifty Smallcap 250 TRI', value: '₹29,435', gap: '₹14,092' }` renders
   *  "Nifty Smallcap 250 TRI would be ₹29,435 — ₹14,092 ahead." */
  compare?: { label: string; value: string; gap?: string; behind?: boolean };
  series?: ChartSeries[];
  /** How the chart labels a VALUE. Passed to `ChartLine`, whose default is a percentage — hand this
   *  card a rupee series without it and the end label reads "21368.0%" over a five-year NAV curve.
   *  A card that composes a chart owns the chart's labels too. */
  valueFormat?: (v: number) => string;
  /** How the chart labels the x axis. Same reason: the default prints the raw number, so sixty monthly
   *  points read "0 … 60" instead of "5 years ago … today". */
  xFormat?: (x: number) => string;
  range?: string;
  /** Which periods this card's data actually has. Passed straight to `RangePills`, whose default is
   *  1M · 3M · 1Y · 3Y · ALL — offer that over a figure that only exists for three of them and the
   *  card is lying in the place it was `locked` to protect. */
  ranges?: string[];
  onRange?: (range: string) => void;
  /** A stat pair, each carrying its own InfoDot. Two per row. */
  stats?: InfoCardStat[];
  onExplain?: (label: string) => void;
  /** The past-performance line. Sits ABOVE the chart, not in a page footer — Monzo's rule. */
  caveat?: string;
  /** True while the fund performance source is unconfirmed — one of the three decisions that are not
   *  ours. The card renders visually locked and says why rather than drawing a plausible line. */
  locked?: boolean;
  lockReason?: string;
}
/** Fund detail: figure → chart → range row → stat pair with an ⓘ on each. Shopee's anatomy, in our
 *  language; reading it is what surfaced both gaps (no range control, no per-figure explanation). */
export function InfoCard(props: InfoCardProps): JSX.Element;


/* ==============================================================================================
   components/cards/IntentTile.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface IntentTileProps {
  /** What the filter set is called, in the advisor's words: "Equity", "Maturing within 3 years". */
  label: string;
  /** How many rows the set holds. Omit only when the number is genuinely unknown — a tile with no
   *  count asks the advisor to tap and find out, which is the tap this component exists to save. */
  count?: number | null;
  /** What `count` counts. Defaults to 'funds'; a bond tile says 'bonds'. */
  unit?: string;
  /** One line under the count: what is inside the set. Not shown when `unavailable`. */
  note?: string;
  /** A silhouette drawn at 76px in the bottom-right corner, at 7% ink, clipped by the tile's own
   *  radius. It is TEXTURE, never meaning: every tile states its class in words, so a tile with no
   *  mark is not a tile missing information, and rule 1 — colour and shape never carry a meaning
   *  alone — holds. Pass an `AssetMark`, or any 24-viewBox glyph sized up. */
  mark?: React.ReactNode;
  /** How the mark is drawn. `'texture'` (default) tints it in the accent at a tenth of an ink so it
   *  never competes with the label — that is what the four `AssetMark` glyphs are for. `'art'` leaves
   *  it at full strength and lets it carry its own colour, for a mark that IS the contrast rather
   *  than a hint of it. Only the caller knows which it handed over, so only the caller can say. */
  markKind?: 'texture' | 'art';
  /** The set is the one currently applied. */
  selected?: boolean;
  /** No feed for this asset class yet. The tile stays visible and legible and loses only its
   *  affordance — an advisor needs to know the class exists. Never render `count={0}` for this. */
  unavailable?: boolean;
  /** Why it is unavailable, in words. Defaults to a line that says a feed is missing rather than
   *  implying the shelf is empty. */
  unavailableNote?: string;
  onClick?: () => void;
}

/**
 * A pre-filled filter set with a name and a count — the explorer's first screen as a sentence
 * rather than a form.
 *
 * Ten of the eleven guided paths in the Indian market are a separate surface from the screener;
 * GoldenPi's purpose tiles are the exception that lives inside it, and Centricity's own One Digital
 * does the same at asset level ("Equity 612 funds"). The count is load-bearing: option counts are
 * the highest-impact fix to a filter interface, and every funnel that worked carries one.
 *
 * `unavailable` is how an asset class with no feed appears — inert, legible, with the reason in
 * words. Never `count={0}`, which says the shelf is empty rather than that the feed is missing.
 */
export function IntentTile(props: IntentTileProps): JSX.Element;

export interface IntentGridProps {
  children: React.ReactNode;
  /** Tiles per row. Two at 375, which is the widest a label and a count sit on one line. */
  cols?: number;
}

/** The grid the tiles sit in. Here rather than on each screen so the gap cannot drift between the
 *  three explorer variations. */
export function IntentGrid(props: IntentGridProps): JSX.Element;


/* ==============================================================================================
   components/cards/MoveCard.d.ts
   ============================================================================================== */

export interface MoveCardProps { n: number; title: string; body: string; }
export function MoveCard(props: MoveCardProps): JSX.Element;


/* ==============================================================================================
   components/cards/RejectCallout.d.ts
   ============================================================================================== */

export interface RejectCalloutProps { eyebrow: string; body: string; chips?: string[]; onChip?: (label: string) => void; }
export function RejectCallout(props: RejectCalloutProps): JSX.Element;


/* ==============================================================================================
   components/cards/ResultCard.d.ts
   ============================================================================================== */

export type ResultJourney = 'proposal' | 'review' | 'rebalance';
/** draft → saved on Save. saved → sent only after the confirm step completes — never on the primary
 *  press itself, because the press opens the confirm rather than committing. */
export type ResultState = 'draft' | 'saved' | 'sent';

export interface ResultCardProps {
  journey: ResultJourney;
  /** Default 'draft'. */
  state?: ResultState;
  title: string;
  /** REQUIRED — "As of 15 Sep · from her September statement". A result an advisor may have to defend
   *  without a source is a number the client can ask about and the advisor cannot answer. */
  provenance: string;
  /** One or two sentences in the product's voice, above the content. */
  summary?: string;
  /** 'saved' and 'sent' only — renders a Badge variant="meta" reading "Saved · 16 Sep". */
  savedAt?: string;
  /** The table, the chart or the move list. */
  children: React.ReactNode;
}
/** The end state of a proposal, review or rebalance, on the artifact card. Always expanded: the
 *  advisor arrived here to read it, and the thread carries the scroll. */
export function ResultCard(props: ResultCardProps): JSX.Element;

export interface ResultActionsProps {
  state?: ResultState;
  onSave?: () => void;
  /** Receives the format string. Wraps DownloadAction, so the wait, the in-place confirmation and the
   *  "Try again" failure wording are the ones every other download in the product uses. */
  onDownload?: (format: string) => void | Promise<void>;
  /** Default 'PDF'. */
  format?: string;
  /** Default 'Save'. */
  saveLabel?: string;
}
/** The secondary pills — Save and Download. NOT inside the card, and — since the ruling of 18 Sep 2026 —
 *  NOT in the Dock either: they go in the turn, under the card they act on, and scroll away with it.
 *  This doc said "the Dock's `chips` slot" until 19 Sep, when Journey D became this component's first
 *  consumer and the contract was found still describing the pre-ruling dock. Rule 3 is untouched: the
 *  composer stays docked and nothing replaces it. */
/** `doneLabel` is passed through to `DownloadAction`. A caller that does not write a file must say
 *  so — this product does not write one anywhere, and a control that states a false outcome is worse
 *  than one that states none. It belongs to `ResultActions`, which owns the download; `ResultCard`
 *  does not render one. */
export function ResultActions(props: ResultActionsProps): JSX.Element;

export interface ResultPrimaryProps {
  journey: ResultJourney;
  state?: ResultState;
  /** proposal only — the label reads "Send to Mr. Aggrawal". */
  client?: string;
  /** rebalance only — 1 gives "Approve the move", 2 gives "Approve both moves", 3+ "Approve all 3 moves". */
  moves?: number;
  /** Overrides the journey's derived label. Use it when the consequence is more specific than the
   *  default, never to shorten it: the label is what the advisor reads before taking responsibility. */
  label?: string;
  /** Opens the CONFIRM STEP. It does not send, fix or place anything — §4.2. Disclosure above the
   *  numbers, the compliance status rows, then the commit. */
  onPrimary?: () => void;
  /** 'sent' only — appended to the success line. */
  sentAt?: string;
}
/** The one dark CTA — in the TURN, under the card it commits, not in the Dock (ruling, 18 Sep 2026; this
 *  doc said `cta` slot until 19 Sep). At state='sent' it becomes the success state: a drawn check, a
 *  timestamp and a settlement line. Success is a drawn check, never confetti.
 *
 *  THE SUCCESS LINE SAYS THE CLIENT HAS IT, AND NOTHING MORE. What happened to the money differs by
 *  journey — a rebalance placed it, a proposal did not — so the consequence is a sentence the screen
 *  writes in the turn beneath. Journey D does exactly that, and says the opposite of Journey B's. */
export function ResultPrimary(props: ResultPrimaryProps): JSX.Element;


/* ==============================================================================================
   components/cards/ShortlistCard.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface ShortlistStale {
  /** What moved, in words: "Two of these changed category on 26 Feb." A saved list whose data has
   *  moved says so; it does not carry a coloured dot, because nothing is wrong — the world moved. */
  text: string;
}

export interface ShortlistCardProps {
  /** The name the advisor gave it: "Sharma — flexi cap under 0.7%". Not a query string. */
  name: string;
  /** How many rows it holds. */
  count: number;
  /** What `count` counts. Defaults to 'funds'. */
  unit?: string;
  /** Whose it is. Omitted for a shortlist not yet attached to a client. */
  client?: string;
  /** When it was last saved, in words: "22 Sep". */
  savedAt?: string;
  /** How many times it has been saved. Shown only from 2 — "v1" on a first save is noise. */
  version?: number;
  /** The filters that produced it, as labels an advisor can read aloud to a client. On the card's
   *  face, never behind it. */
  filters?: string[];
  /** Set when the underlying data has moved since the save. Renders as text on the peach surface
   *  with the re-run offer beside it (rule 2) — never a badge, never an automatic refresh. */
  stale?: ShortlistStale | null;
  onOpen?: () => void;
  /** Offered beside `stale`. Re-running is the advisor's call: a list that changed silently between
   *  opening it and reading it aloud is the defect this card exists to prevent. */
  onRefresh?: () => void;
  /** Optional preview rows — the first two or three funds, so the card is worth returning to. */
  children?: React.ReactNode;
}

/**
 * A shortlist the advisor keeps: named, dated, versioned, re-runnable.
 *
 * Every serious advisor tool has one and Sentinel had none — Tickertape's saved screens, Wealthy
 * Select's monthly playbook, NJ's Recommended Portfolio. The explorer re-sent a fresh table every
 * turn instead, so an eight-turn session left eight stale tables and nothing to return to.
 *
 * NOT a replacement for `ArtifactCard`. That is a thing Sentinel made in this thread, which peeks,
 * expands and dies with the conversation. This is a thing the advisor kept, with a name they gave
 * it and a client it belongs to. A screen that needs both uses both.
 */
export function ShortlistCard(props: ShortlistCardProps): JSX.Element;


/* ==============================================================================================
   components/cards/Surface.d.ts
   ============================================================================================== */

import * as React from 'react';

/** `raised` the card the thread scrolls past · `soft` a quieter card inside a panel · `ring` a block
 *  INSET into a card · `flat` a box that groups without lifting. Four, because those are the four
 *  things a box means in this product. A fifth is a new visual decision and belongs to the owner. */
export type SurfaceElevation = 'raised' | 'soft' | 'ring' | 'flat';
/** `surface` the card ground · `canvas` a block inset into a card · `bubble` the peach, for a block
 *  that carries bad news as TEXT (rule 2 — never as a fill on its own). */
export type SurfaceTone = 'surface' | 'canvas' | 'bubble';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Default 'raised'. */
  elevation?: SurfaceElevation;
  /** Default 'surface'. */
  tone?: SurfaceTone;
  /** A step on the radius scale: 8 · 12 · 16 · 20 · 24. Default **16**, which 18 of the 38
   *  hand-written surfaces already used. 12 is the one for a block inside a card. A number off the
   *  scale falls back to 16 rather than drawing an off-ramp box. */
  radius?: 8 | 12 | 16 | 20 | 24;
  /** A step on the spacing scale: 6 · 8 · 10 · 12 · 14 · 16 · 20, or 0 to lay the children out
   *  yourself. Default **14**, the repository's own most-used card padding. */
  padding?: 0 | 6 | 8 | 10 | 12 | 14 | 16 | 20;
  /** Fills its flex parent and allows its content to scroll — `flex: 1; min-height: 0`. For a panel
   *  body between a fixed header and a fixed footer, which is the only place this product scrolls
   *  inside a surface. */
  grow?: boolean;
}

/** THE PLAIN CARD, and the reason it exists is a count.
 *
 *  `components/cards/` held fourteen cards and not one of them was simply a card, so nine screens and
 *  six system components hand-wrote the same box. Measured 19 Sep 2026: **38 hand-written surfaces**,
 *  and one intent — a hairline ring — written **three ways**, two inset and one not, one carrying a
 *  raw `1px` where the system has `--border-1`. `moves.jsx:62` was byte-for-byte `InfoCard.jsx:69`.
 *
 *  Every default is the repository's own most-used value rather than a preference, so `<Surface>` with
 *  no props draws the box this system already draws most often. It adds no visual decision: it names
 *  the four that were already being made, and stops the fifth being made by accident.
 *
 *  **It is not a replacement for the cards that mean something.** `ArtifactCard` carries peek/expand
 *  and provenance; `InfoCard` is the fund's page; `ResultCard` is the end of a journey. Reach for
 *  `Surface` when the box is only a box.
 *
 *  **It forwards its ref to the underlying div** (22 Sep 2026), because a card is the thing a screen
 *  scrolls to — a section jump, a focus move after a sheet closes. The alternative was wrapping it in
 *  a bare div, which in a gapped flex column adds a gap nobody asked for. */
export declare const Surface: React.ForwardRefExoticComponent<
  SurfaceProps & React.RefAttributes<HTMLDivElement>
>;


/* ==============================================================================================
   components/chat/AttachmentTurn.d.ts
   ============================================================================================== */

export interface AttachmentFile {
  name: string;
  size?: number;
  /** TRUE when the VIEWER picked it rather than the specimen supplying it. Everything honest about
   *  this component hangs off this flag: a picked file gets no summary, no completed stages, and a
   *  `ParseNote` saying so. */
  picked?: boolean;
}
export interface AttachmentTurnProps {
  /** Null renders nothing — a caller can pass its attachment state straight through. */
  file: AttachmentFile | null;
  /** What the advisor said when they attached it. It is a `UserBubble`, because attaching is saying. */
  caption?: string;
  /** The stages for a SUPPLIED file: completed work with names on it. */
  stages?: unknown;
  /** The stages for a PICKED file: the same steps, pending. Falls back to `stages`. */
  pendingStages?: unknown;
  /** The one-line result — "Read his Q3 statement · 14 pages · 18 holdings". NEVER shown for a picked
   *  file: a holdings count over somebody's own PDF is a fabricated figure. */
  summary?: string;
  /** Overrides the default note shown under a picked file. */
  note?: string;
  onRemove?: () => void;
}
/** A FILE THE ADVISOR ATTACHED, AS A TURN — caption, the file, and the note that keeps it honest.
 *  Promoted from `screens/journey-b/thread.jsx` on 20 Sep 2026, where every screen used the same ten
 *  lines. The paperclip is real on every screen in this product (the owner's ruling, 19 Sep); this is
 *  what it produces. */
export function AttachmentTurn(props: AttachmentTurnProps): JSX.Element | null;


/* ==============================================================================================
   components/chat/DetourBanner.d.ts
   ============================================================================================== */

export interface DetourBannerProps { label: string; onResume: () => void; }
export function DetourBanner(props: DetourBannerProps): JSX.Element;


/* ==============================================================================================
   components/chat/GreetingDivider.d.ts
   ============================================================================================== */

export interface GreetingDividerProps { children: React.ReactNode; }
/** The Home greeting, between two dashed hairlines. The line WRAPS rather than truncating: at 375 a
 *  fifteen-character name already runs past the 343 content box, and this product's clients are named
 *  Ramasubramanian and Lakshminarayanan. Cutting a client's name in half is the one thing a tool built
 *  to treat clients as people may not do. A name that fits is unaffected, and nothing else changes.
 *
 *  The hairlines are flex and yield first: they are 47pt beside "Ashish", 12pt beside "Vishwanathan"
 *  and gone beyond that. Measured, and accepted — the greeting is the content, the rules are not. */
export function GreetingDivider(props: GreetingDividerProps): JSX.Element;


/* ==============================================================================================
   components/chat/MessageActions.d.ts
   ============================================================================================== */

export type MessageAction = 'copy' | 'edit' | 'retry';
/** Actions under the LAST message only — at 375pt, a row under every turn is noise.
 *  Text at 11.5px `--color-muted`, never pills: ghost pills here would compete with the chip row below. */
export interface MessageActionsProps {
  /** 'user' → right-aligned, defaults to ['edit']. 'assistant' → left-aligned, defaults to ['copy','retry']. */
  role: 'user' | 'assistant';
  actions?: MessageAction[];
  /** Receives the action key. `edit` on a journey answer IS Edit on that decision: it must warn what it
   *  costs ("Editing this reopens question 7. The four answers after it will be asked again.") before
   *  discarding anything. Silent data loss is not acceptable in an advisory tool. */
  onAction?: (action: MessageAction) => void;
}
export function MessageActions(props: MessageActionsProps): JSX.Element;


/* ==============================================================================================
   components/chat/ParseNote.d.ts
   ============================================================================================== */

export interface ParseNoteProps { text: string; }
export function ParseNote(props: ParseNoteProps): JSX.Element;


/* ==============================================================================================
   components/chat/ProgressTrace.d.ts
   ============================================================================================== */

export interface ProgressTraceProps { /** Real work, named: "Reading Sharma's holdings — 18 funds". */ steps: string[]; stepMs?: number; /** Shown behind a left hairline once done and expanded. */ reasoning?: string; onDone?: () => void; /** false freezes the trace — and its clock — for specimens and artboards. Freeze it PAST the last
   *  step (initialActive >= steps.length) and it freezes in the FINISHED state instead: the header
   *  reads "Thought for Ns", the chevron appears and `reasoning` renders. That is the state worth
   *  putting on an artboard, and before v12 there was no way to reach it without running the clock. */
  autoplay?: boolean; initialActive?: number; /** Duration shown while frozen (autoplay=false). */ seconds?: number;
  /** Start in the one-line "Thought for Ns ›" resting state. Honoured only for a trace frozen PAST its last
   *  step (autoplay=false, initialActive >= steps.length) — a running trace has nothing to collapse. This is
   *  what a finished trace looks like under a real answer, and the state a screen page needs most. */
  initialCollapsed?: boolean;
  /** The third header state: "Stopped at Ns" instead of "Working · Ns". A stopped trace is neither
   *  working nor finished, and without this a screen showing the abort had to print "Working" directly
   *  above the message saying it had stopped. Use it on any frozen trace whose turn says it did not
   *  finish; pair it with `autoplay={false}` and the step it stopped at. */
  stopped?: boolean; }
export function ProgressTrace(props: ProgressTraceProps): JSX.Element;


/* ==============================================================================================
   components/chat/QAPair.d.ts
   ============================================================================================== */

export interface QAPairProps { /** Short form of the question; omitted for the seed bubble. */ question?: string; answer: string; }
export function QAPair(props: QAPairProps): JSX.Element;


/* ==============================================================================================
   components/chat/RefusalTurn.d.ts
   ============================================================================================== */

export interface RefusalTurnProps {
  /** What it will not do, and why — one sentence or several. Plain English: the advisor may read this
   *  aloud to a client, and "I cannot action that request" is not a sentence anybody says. */
  body: string | string[];
  /** WHAT IT CAN DO INSTEAD, BY NAME. Not optional in practice: a refusal with no chips is a dead end,
   *  and a dead end is the one thing an advisor cannot work around. Never "try again" — each chip is a
   *  route that exists. */
  chips?: string[];
  onChip?: (label: string) => void;
  /** Default false. True when Sentinel already signed the turn above — one signature per turn. */
  continued?: boolean;
  enter?: boolean;
}
/** WHAT SENTINEL SAYS WHEN IT WILL NOT DO SOMETHING, in the shape every refusal in this product
 *  keeps: what it will not do, then what it can do instead, by name. Promoted from
 *  `screens/thread/refusals.jsx` on 20 Sep 2026, where six refusals shared this shape and differed
 *  only in copy.
 *
 *  The six: an instruction that would act · an amount over a ceiling · in the domain but outside this
 *  product · a sentence it could not follow · a name that matches two clients · a figure it cannot
 *  stand behind. */
export function RefusalTurn(props: RefusalTurnProps): JSX.Element;


/* ==============================================================================================
   components/chat/ResponseFeedback.d.ts
   ============================================================================================== */

export interface ResponseFeedbackProps {
  /** Controlled rating. Omit to let the component own it. */
  value?: 'up' | 'down' | null;
  onRate?: (value: 'up' | 'down' | null) => void;
  /** Fires when a reason chip is picked. Down-votes without a reason are the least useful signal there is. */
  onReason?: (reason: string) => void;
  /** Reason chips shown after a down-vote. Four at most — this is a between-meetings interaction. */
  reasons?: string[];
  /** Optional line about where the signal goes. */
  note?: string;
}
/** Marking an answer wrong — the affordance Sentinel had nowhere. Two drawn thumbs at the icon set's
 *  24px grid (no emoji), confirmation ON the control that was pressed (the no-toasts law), and an
 *  asymmetry that is deliberate: up is one tap, down opens a short reason row, because the reason is
 *  the whole value of the signal. Reasons are chips, not a text field. */
export function ResponseFeedback(props: ResponseFeedbackProps): JSX.Element;


/* ==============================================================================================
   components/chat/SentinelBlock.d.ts
   ============================================================================================== */

export interface SentinelBlockProps {
  children: React.ReactNode;
  /** Pulses the label while thinking. */
  shimmer?: boolean;
  label?: string;
  /** Drop the "✦ Sentinel" signature — for every block after the first IN THE SAME TURN. A turn is often
   *  the trace and then the answer, and each block used to sign itself, so the name appeared twice for one
   *  thing Sentinel said. Say it once, at the top of the turn. */
  continued?: boolean;
}
export function SentinelBlock(props: SentinelBlockProps): JSX.Element;


/* ==============================================================================================
   components/chat/SentinelText.d.ts
   ============================================================================================== */

export interface SentinelTextProps { text: string; /** First line Medium, follow-on lines Regular. */ weight?: 'Medium' | 'Regular'; }
export function SentinelText(props: SentinelTextProps): JSX.Element;


/* ==============================================================================================
   components/chat/SentinelThinking.d.ts
   ============================================================================================== */

export interface SentinelThinkingProps {
  /** What Sentinel is doing, in place of the "Sentinel" label — "Reading his Q3 statement…",
   *  "Checking the mandate…", "Pricing 3 moves…".
   *
   *  It must be TRUE and it must be CHECKABLE. The verb names the source the answer will cite, so a
   *  waiting state that says "Reading his Q3 statement…" and then produces a figure from somewhere
   *  else has lied about provenance — which rule 4 exists to prevent, and which costs more here than
   *  a bare pulse ever saves. Never a decorative "Thinking…", never a rotating list of verbs the
   *  system is not actually performing.
   *
   *  Present participle, one clause, an ellipsis at the end. Keep it under about 40 characters: it
   *  sits on one line beside the sparkle and truncation would cut the source name off.
   *
   *  Omit it and the label is "Sentinel" — the behaviour before v12, unchanged. */
  verb?: string;
}
/** The waiting state. Three bronze dots pulsing on opacity, 1.2s, staggered 150ms, under a shimmering
 *  label. No bounce, no spinner, no skeleton of a shape the answer may not take.
 *
 *  `verb` changes the label and NOTHING else. The motion is identical with it and without it — that
 *  is the point: what makes a wait readable is the system saying what it is doing, not the wait
 *  looking busier. */
export function SentinelThinking(props: SentinelThinkingProps): JSX.Element;


/* ==============================================================================================
   components/chat/SentinelTurn.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface SentinelTurnProps {
  /** What Sentinel says. One string, or several — the first carries the statement, the rest carry
   *  the reasoning. Gapped at **--space-10** between sentences, which 5 of the 6 hand-built
   *  multi-sentence turns already used. */
  say?: string | string[];
  /** How the FIRST sentence is set. Default 'Medium'; every later line is Regular, which is the
   *  weight pair `SentinelText` was built around. */
  weight?: 'Medium' | 'Regular';
  /** The one thing the turn carries — a card, a chart, a trace, a list, a search field, a callout.
   *  Gapped at **--space-12**. */
  body?: React.ReactNode;
  /** Put the body ABOVE the sentences. For a turn whose answer IS the artifact and whose sentence
   *  reads it out: the risk result, the execution trace, the placed-moves receipt. */
  bodyFirst?: boolean;
  /** A sentence that follows the body. Set Regular, gapped at **--space-12** — a sentence after
   *  something that is not a sentence takes the part gap, not the sentence gap. Unanimous across the
   *  five hand-built cases. */
  then?: string;
  /** A second thing after `then` — the drafted note under the receipt, the client list under the
   *  search field. Gapped at **--space-12**. */
  tail?: React.ReactNode;
  /** Where the turn's figures came from. Gapped at **--space-10**, the value `InfoCard` and
   *  `OverlapView` both use; the two screens that hand-wrote it disagreed (10 and 8) and the system's
   *  own placements break the tie. */
  provenance?: string;
  /** The answer chips, as a `ChipRow`. Sits BELOW the block at `--stack` (12px) — the same 12px the
   *  seven turns that nested it inside the block were already drawing. */
  chips?: React.ReactNode;
  /** **At most one dark CTA**, and the type is how that survives. Three hand-built action rows paired
   *  a `ChipRow` with a `<DarkButton full arrow>` and three copies can only agree where a type can
   *  enforce — two dark buttons in a turn is two primary actions and the advisor cannot tell which
   *  one the turn was for. Sits under the chips at `--stack`. */
  cta?: { label: string; onClick: () => void; /** Default true. */ arrow?: boolean };
  /** The artifact, `MessageActions` — whatever belongs to this turn but not to the sentence. The dark
   *  CTA does NOT go here; it goes in `cta`, which can only hold one. Also at `--stack`. */
  actions?: React.ReactNode;
  /** The turn is still arriving: renders `SentinelThinking` and NOTHING ELSE. Pass the verb as a
   *  string and it names what is being read. Chips and actions are dropped on purpose — offering an
   *  answer's chips beside the dots lets an advisor answer a question Sentinel has not finished
   *  asking. */
  thinking?: boolean | string;
  /** Drop the "✦ Sentinel" signature, for the second and later blocks of one turn. One label per
   *  turn is a standing ruling (18 Sep 2026). */
  continued?: boolean;
  /** Play `ds-rise` on the whole turn. The live page passes it; a frozen spec page does not. */
  enter?: boolean;
  /** Overrides the "Sentinel" label. Rarely right — see `SentinelBlock`. */
  label?: string;
}

/** ONE THING SENTINEL SAID, AND EVERYTHING THAT BELONGS TO IT.
 *
 *  Thirteen turns were hand-built across nine screen modules, with 35 spacer divs between their
 *  parts. The values were not arbitrary — measured on 20 Sep 2026 they spell a grammar the screens
 *  were already following without it being written down anywhere:
 *
 *  | between                            | value        | vote  |
 *  |------------------------------------|--------------|-------|
 *  | a sentence and the next sentence   | --space-10   | 5 / 6 |
 *  | the lead sentence and the body     | --space-12   | 7 / 8 |
 *  | the body and a sentence after it   | --space-12   | 5 / 5 |
 *  | the block and its chips            | --space-12   | 7 / 7 |
 *  | anything and its provenance        | --space-10   | the system's own two placements |
 *
 *  Three sites dissent and are NOT what this component draws: `proposal.jsx:141` gaps two sentences
 *  at 8, `answer.jsx:127` gaps a card at 8, `answer.jsx:130` gaps provenance at 8. Each is a visible
 *  2–4px and therefore the owner's call, not a migration.
 *
 *  It adds no visual decision. Every gap it draws is one the repository was already drawing most
 *  often. What it adds is that the gap is decided ONCE — so a fourteenth turn cannot quietly
 *  introduce a fifth value for "the next sentence". */
export function SentinelTurn(props: SentinelTurnProps): JSX.Element;


/* ==============================================================================================
   components/chat/StepBlock.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface StepBlockProps {
  /** 1-based position in the funnel. Rendered as a numeral while the step is unanswered and as a
   *  tick once it is — a shape and a figure, never a colour on its own. Omit for a block that is
   *  not part of a numbered sequence. */
  step?: number;
  /** The question, in the advisor's words: "Asset class", "Product", "Category". */
  title: string;
  /** The answer, as the chips the advisor chose. Shown only while collapsed: while the step is open
   *  the selector beneath is already showing them, and printing them twice is noise. Beyond
   *  `maxChips` the remainder becomes `+N` — a count, never a fade, because a count is legible and a
   *  gradient over the fourth chip is a guess. */
  chips?: string[];
  /** The answer when it is a sentence rather than a set — "Parag Parikh Flexi Cap". Ignored when
   *  `chips` is non-empty. */
  summary?: React.ReactNode;
  /** The step has an answer. Drives the tick. A step can be `done` and closed, which is the resting
   *  state of every step above the one being worked on. */
  done?: boolean;
  /** Open. Controlled — the funnel owns which step is open, because opening one closes the others
   *  and a component cannot know that. */
  open?: boolean;
  onToggle?: () => void;
  /** Default 3. */
  maxChips?: number;
  /** How many rows this step's answer yields, shown on the right of the collapsed row: `24 funds`.
   *  This is the count the research found to be the highest-impact element of any filter interface —
   *  it is what saves the advisor a tap to find out. Omit when genuinely unknown; never pass 0 to
   *  mean "no feed", which is a lie about an empty shelf. */
  count?: number;
  /** What `count` counts. Default 'funds'. */
  unit?: string;
  /** The selector, list or panel this step opens. Stays mounted while closed so a half-made
   *  selection survives the advisor glancing at the step above. */
  children?: React.ReactNode;
  /** Base for the generated body id, for pages that need a stable one. */
  id?: string;
}

/**
 * A step of a funnel that collapses into its own answer.
 *
 * The explorer asks four questions in order and the owner's ruling is that all four live on one
 * screen with nothing opening a second. That only works if an answered question stops taking a
 * screenful — so a step collapses to one row carrying the answer, and the row is the control that
 * opens it again. The funnel then reads as a sentence down the screen, and changing any word of it
 * is one tap on that word.
 *
 * It grows from its own row rather than sliding in: `grid-template-rows: 0fr → 1fr`, which needs no
 * measurement and no max-height guess and does not jump when the content changes size. That is the
 * one expansion this system allows — an artifact expands in place, and there is no shared-element
 * transition.
 */
export function StepBlock(props: StepBlockProps): JSX.Element;

export interface StepStackProps { children?: React.ReactNode; }
/** The funnel's own spacing — `--space-8`, because these are steps of one question rather than
 *  separate messages in a thread, which take `--stack`. */
export function StepStack(props: StepStackProps): JSX.Element;


/* ==============================================================================================
   components/chat/StepTrace.d.ts
   ============================================================================================== */

export type StepState = 'pending' | 'running' | 'done' | 'failed';
export interface TraceStep {
  /** What was done, in the advisor's words — "read her holdings", not "fetched portfolio_v2". */
  label: string;
  state: StepState;
  /** Right-aligned, tabular — "12 holdings", "4 pages", "00:16". */
  meta?: string;
  /** One line of reasoning or provenance under the step. */
  detail?: string;
  /** Shown only on a failed step: a Pill that retries just this stage. */
  retry?: React.ReactNode;
}
export interface StepTraceProps {
  steps: TraceStep[];
  /** The collapsed one-liner. Derived when omitted: "Read 3 sources" / the running step / "Could not finish". */
  summary?: string;
  /** Controlled disclosure. Omit to let the component own it. */
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  /** id of the step list, wired to the summary's aria-controls. Unique per instance on a screen. */
  id?: string;
  /** 8px step gap instead of 12 — for the parse checklist inside a file chip. */
  dense?: boolean;
}
/** What the assistant did, as collapsible one-line rows with per-step state. Also serves FileUpload's
 *  staged parse: the stages ARE the success summary arriving progressively. Only the active step is at
 *  full opacity; pending steps sit at 40%. A failed step keeps its place, carries the word, and offers
 *  its retry inline — never disappears. */
export function StepTrace(props: StepTraceProps): JSX.Element;


/* ==============================================================================================
   components/chat/UserBubble.d.ts
   ============================================================================================== */

export interface UserBubbleProps {
  /** The question. While `editing` it is the field's value — this is a CONTROLLED field, so the caller
   *  owns the half-typed text and a re-render cannot silently discard it. */
  text: string;
  /** Edit in place, the way every other assistant does it — not a modal, and not the composer filling up
   *  behind the thread. The bubble becomes the field: same peach, same edge, same 14/19 semibold, corner
   *  un-tailed and width released. This is where `MessageActions role="user"`'s Edit has always led; until
   *  18 Sep 2026 there was no state at the end of it. */
  editing?: boolean;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onSave?: () => void;
  /** Words, never glyphs and never ghost pills — MessageActions' rule, one line up. */
  saveLabel?: string;
  cancelLabel?: string;
  /** What sending the edit will DESTROY, said before it is destroyed — "Sending this replaces the answer
   *  below it." MessageActions' contract has required this warning since v1 and had nowhere to render it.
   *  Silent data loss is not acceptable in an advisory tool. */
  costNote?: string;
  /** Accessible name of the field. Defaults to "Edit your question". */
  editLabel?: string;
}
export function UserBubble(props: UserBubbleProps): JSX.Element;

/* ==============================================================================================
   components/chat/UserTurn.d.ts
   ============================================================================================== */

export interface UserTurnProps {
  /** What the advisor said. */
  text: string;
  /** Default true. False for a turn in the history — an answered question is not re-editable in place. */
  editable?: boolean;
  /** The answer is still arriving. Withdraws the actions: editing a question Sentinel is halfway
   *  through answering would leave the answer below it belonging to a sentence that no longer exists. */
  busy?: boolean;
  /** What re-sending this costs, said BEFORE it is sent — "Sending this replaces the review below it."
   *  A turn that quietly replaces the work under it is the defect this line exists to prevent. */
  costNote?: string;
  /** The edited text, on save. The caller decides what re-sending means; this component only edits. */
  onSave?: (text: string) => void;
  /** A cancelled edit restores the original and discards nothing, because nothing had changed yet. */
  onCancel?: () => void;
  /** Default true. False where the action row would be the only thing on a frozen specimen. */
  actions?: boolean;
}
/** THE USER'S HALF OF A TURN. `UserBubble` and `MessageActions` are the two halves and this is the
 *  pairing, with the edit state that pairing needs. Promoted from `screens/journey-b/thread.jsx` on
 *  20 Sep 2026, where the same twelve lines served every journey in the product.
 *
 *  Sentinel's half is `SentinelTurn`. A thread is those two, alternating, and nothing else. */
export function UserTurn(props: UserTurnProps): JSX.Element;


/* ==============================================================================================
   components/chat/VersionRow.d.ts
   ============================================================================================== */

export interface ArtifactVersion {
  id: string;
  /** Short label — "V1", "V2". Tabular, so the column does not jitter. */
  name: string;
  /** What changed, in the advisor's words — "Swapped the mid-cap for a flexi-cap". */
  summary: string;
  /** When, and by whom if it matters — "Yesterday 4:12 pm". */
  meta?: string;
  /** True for the version the client actually received. The row says so, because that is the one
   *  that matters when the client rings. */
  sent?: boolean;
}
export interface VersionRowProps {
  versions: ArtifactVersion[];
  /** Defaults to the last version. */
  currentId?: string;
  onSelect?: (id: string) => void;
  /** Revert APPENDS the restored version as a new revision — it never destroys the trail. */
  onRevert?: (id: string) => void;
  label?: string;
}
/** Every revision of an artifact, in the thread, with a revert on each. Without it an advisor who has
 *  revised a proposal twice has no way back to the version the client saw. */
export function VersionRow(props: VersionRowProps): JSX.Element;


/* ==============================================================================================
   components/composer/Composer.d.ts
   ============================================================================================== */

export interface ComposerProps { value: string; onChange: (v: string) => void; onFocus?: () => void; onSend?: () => void; /** Context placeholders: home "Ask Sentinel" · thread "Ask Sentinel" · answer "or type your answer" · artifact "Ask about this" · sheet "Ask a follow-up". The artifact case was written "canvas" until v12; that surface was removed from the product in v5 and the placeholder outlived its name (same drift as F-13).
   *  HOME SHORTENED 19 Sep 2026: it read "Ask Sentinel about a client, a fund, or a plan", which is three
   *  examples sitting 55pt under three starter chips that are the same three examples with client names on
   *  them. This map was written before Home had chips. The chips carry the examples; the placeholder names
   *  the product once. */ placeholder?: string;
  /** THE CLIENT THIS THREAD IS ABOUT — a `<ClientChip>`, above the field. `ClientChip` has described
   *  itself as "composer-resident" since v9 and the composer had no slot for it, so the chip was on no
   *  screen and its contract was a promise with nowhere to land. Selection and typing resolve to the
   *  same state: picking from the WHO step and typing "Meera" both end here. Omit it and the composer
   *  renders exactly as before. */
  bound?: React.ReactNode;
  autoFocus?: boolean; /** Send disabled, Stop square in the send slot. */ streaming?: boolean; onStop?: () => void;
  /** THE PAPERCLIP, MADE REAL (18 Sep 2026). Receives the chosen File; the disc becomes a button with a
   *  hidden file input behind it. Omit it and the disc renders exactly as it always has — a control that
   *  is announced and does nothing is worse than a drawing that is honest about being one. What the file
   *  becomes in the thread is `FileUpload`, which has carried the staged parse since v7 with no way in. */
  onAttach?: (file: File) => void;
  /** Accessible name of the attach button. Defaults to "Attach a file". */
  attachLabel?: string;
  /** Passed to the input, e.g. ".pdf,.csv". Omit to accept anything. */
  accept?: string;
}

export function Composer(props: ComposerProps): JSX.Element;


/* ==============================================================================================
   components/composer/MoneyComposer.d.ts
   ============================================================================================== */

export interface MoneyComposerProps { /** Receives the formatted rupee string, e.g. "₹1,80,000". */ onSend: (value: string) => void; placeholder?: string; }
export function MoneyComposer(props: MoneyComposerProps): JSX.Element;
export function formatINR(digits: string): string;


/* ==============================================================================================
   components/composer/StepComposer.d.ts
   ============================================================================================== */

export interface StepComposerProps {
  /** The question asks for an amount. Renders `MoneyComposer`, which reads what is typed AS MONEY —
   *  a text composer under "how much is he putting in?" accepts "two and a half lakh" and hands back
   *  a string nothing can add up. */
  money?: boolean;
  /** Default "or type your answer" — the wording that says the chips are the fast path and typing is
   *  still open. */
  placeholder?: string;
  /** Default "or type the amount". */
  moneyPlaceholder?: string;
  /** The text, or the formatted rupee string from `MoneyComposer`. */
  onSend?: (text: string) => void;
  /** The paperclip. Real on every screen (the owner's ruling, 19 Sep) — `MoneyComposer` has none, and
   *  that is deliberate: an amount is typed, not attached. */
  onAttach?: (file: File) => void;
}
/** THE COMPOSER A QUESTION ASKS FOR, and the other half of rule 3. The composer is always present;
 *  WHICH composer is a property of the step. Promoted from `screens/journey-a/rail.jsx` on
 *  20 Sep 2026, where three journeys were each deciding it again. */
export function StepComposer(props: StepComposerProps): JSX.Element;


/* ==============================================================================================
   components/data/AttributionChart.d.ts
   ============================================================================================== */

export interface Contribution {
  label: string;
  /** Signed contribution in points; magnitude sets bar length. */
  value: number;
  /** One muted line saying what it was. */
  note?: string;
  /** "This one was a decision of yours" — renders in de-emphasis grey with a hairline, never a second hue. */
  intentional?: boolean;
}
export interface AttributionChartProps {
  /** Opening value, e.g. 62. */
  from: number;
  /** Closing value, counted up to. */
  to: number;
  /** The agreed line the chain starts from (defaults to `from`). */
  target?: number;
  targetLabel?: string;
  todayLabel?: string;
  contributions: Contribution[];
  /** Card fills in — never a blank wait. */
  skeleton?: boolean;
  /** false freezes the bars for specimens. */
  run?: boolean;
}
export function AttributionChart(props: AttributionChartProps): JSX.Element;


/* ==============================================================================================
   components/data/ChartBar.d.ts
   ============================================================================================== */

export interface ChartBarDatum {
  label: string;
  value: number;
  /** Per-bar role override — `status` for the one bar that crossed a limit. Never a category colour. */
  tone?: 'ramp' | 'muted' | 'status';
}
export interface ChartBarProps {
  bars: ChartBarDatum[];
  /** 'vertical' for time, 'horizontal' for comparison. Default horizontal. */
  orientation?: 'vertical' | 'horizontal';
  density?: 'peek' | 'expanded';
  tone?: 'ramp' | 'muted' | 'status';
  width?: number;
  valueFormat?: (v: number) => string;
  /** Growth animation: scaleY from the bottom (scaleX from the left when horizontal), 480ms, 60ms stagger. */
  run?: boolean;
  /** A caveat that belongs AT the number — "These percentages are rounded for simplicity". Monzo's rule. */
  caveat?: string;
}
/** Bars are ONE colour (ramp 1), because every bar sits on the page and only ramp 1 clears 3:1 against
 *  it. Rank is carried by length, the strongest channel available. 24px max thickness, 4px rounded at
 *  the data end, square at the baseline, values direct-labelled in tabular figures, track hairlined. */
export function ChartBar(props: ChartBarProps): JSX.Element;


/* ==============================================================================================
   components/data/ChartDonut.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface DonutSlice {
  /** What the segment IS, in the advisor's words. Printed in the legend; never left to colour alone. */
  label: string;
  /** Its share. Must be > 0 — a zero slice is left out, because a zero-width arc that still holds a
   *  legend row states something untrue. A value the product does not know is not passed at all. */
  value: number;
  /** Only where a data role demands it: 'muted' for a benchmark or prior period, 'status' for a
   *  crossed limit. Never a colour, and never to tell one category from another. */
  tone?: 'ramp' | 'muted' | 'status';
}

export interface ChartDonutProps {
  slices: DonutSlice[];
  /** Outer box in px. Default 168 — fits a 343 card with the legend beneath. */
  size?: number;
  /** Ring width in px. Default 22. */
  thickness?: number;
  /** How many segments before the rest fold into one. Default 5: a ring is readable at four to six
   *  and a bar chart beats it past that, because the eye is poor at comparing arcs that do not touch. */
  max?: number;
  /** What the folded segment is called. Default 'Other'; the count is appended. */
  otherLabel?: string;
  /** THE HOLE'S JOB. The figure the reader came for — the total, the headline percentage, the balance.
   *  Every finance app in the reference set does this, and it is what makes a ring worth its space. */
  center?: React.ReactNode;
  /** One line under it: what the figure is of. */
  centerNote?: React.ReactNode;
  /** How a slice's value prints in the legend. Default one decimal and a per-cent sign. */
  valueFormat?: (v: number) => string;
  /** Default true. Turn it off only where the same names are already listed beside the chart. */
  legend?: boolean;
  /** The label of the slice to emphasise — drawn thicker, never recoloured. */
  selected?: string | null;
  /** Makes each legend row a control. Omit it and the legend is static text. */
  onSelect?: (label: string) => void;
  /** Sweep the segments in on mount. Default true; false for a frozen specimen. */
  run?: boolean;
  /** The as-of line, at the chart rather than in a page footer. */
  caveat?: string;
  /** Accessible name for the figure. Default 'Composition'. */
  label?: string;
  /** Park the largest segment's name on the ring itself, outside the arc. A ring in the wild almost
   *  always carries one figure ON it rather than only in a list below. Only one chip is ever drawn,
   *  and only when that segment holds at least a quarter of the ring — two labels on a 168px ring
   *  collide. Default false. */
  leadChip?: boolean;
}

/**
 * Part of a whole, with the whole in the middle — a donut, never a pie.
 *
 * Twenty shipped finance screens were read for this and not one is a solid pie: every one is a ring
 * whose hole carries the thing the reader came for. A pie spends its middle on nothing.
 *
 * Colour is rank from the system's four-step ramp, which is legal HERE and not on a line or a single
 * bar: only ramp step 1 clears 3:1 against the page, so steps 2–4 are allowed exactly where marks
 * separate from EACH OTHER by edge and label rather than from the page. So every segment carries a
 * hairline edge, a gap of the card's own ground shows between them, and the legend names every one
 * with its figure. No segment is ever left to colour alone.
 *
 * Past `max` segments the rest fold into one named "Other". Use `ChartBar` horizontal instead when
 * the job is to compare the parts with each other rather than to see the split.
 */
export function ChartDonut(props: ChartDonutProps): JSX.Element;


/* ==============================================================================================
   components/data/ChartLegend.d.ts
   ============================================================================================== */

export interface ChartLegendItem {
  label: string;
  /** Display figure, right-aligned in muted, tabular. */
  value?: string;
  /** Numeric value used for the descending sort. Falls back to the number parsed out of `value`. */
  amount?: number;
  /** Force a ramp step. Omit and rank decides — which is the point: colour is ordinal, never categorical. */
  step?: 1 | 2 | 3 | 4;
}
export interface ChartLegendProps {
  items: ChartLegendItem[];
  /** 'stacked' (default) — one row per item, value right-aligned. 'inline' wraps. */
  layout?: 'stacked' | 'inline';
  /** Descending by value, always, unless you are passing a deliberately fixed order. */
  sort?: boolean;
}
/** Only where a direct label cannot go: ChartShare and the overlap bars. One series never has a legend;
 *  two series are end-labelled. Left-aligned to the plot's left edge, never centred. */
export function ChartLegend(props: ChartLegendProps): JSX.Element;


/* ==============================================================================================
   components/data/ChartLine.d.ts
   ============================================================================================== */

export interface ChartPoint { x: number; y: number }
export interface ChartSeries {
  /** The end label's name, drawn under its value ON the plot. **Keep it to two short lines** — it is
   *  clamped at two and a third would be a name to shorten, not a layout to stretch. A card that has
   *  already named the benchmark in a sentence above should pass the ROLE here ("Benchmark"), not the
   *  full name again: "Nifty Smallcap 250 TRI" in 10px beside a line is the same fact twice. */
  label: string;
  points: ChartPoint[];
  /** Per-series override. Series 2 is drawn muted and dashed regardless — it is the benchmark role. */
  tone?: 'ramp' | 'muted' | 'status';
}
export interface ChartLineProps {
  /** One or two series. A third is ignored — three or more is `ChartLineMultiples`, not three colours. */
  series: ChartSeries[];
  /** 'peek' — the 96px card's sparkline strip: plot 72, one 14px end-label row, no axes, no readout.
   *  'expanded' — plot 180 + a 14px axis band. */
  density?: 'peek' | 'expanded';
  /** Data role, not a colour: ramp (the client's own money) · muted (benchmark, prior period) · status (a crossed limit). */
  tone?: 'ramp' | 'muted' | 'status';
  /** Draws one dashed reference line. There are no other gridlines. */
  target?: { value: number; label?: string };
  width?: number;
  valueFormat?: (v: number) => string;
  xFormat?: (x: number) => string;
  /** Tap-and-drag scrubbing: adds the reserved ChartReadout row above the plot and a 1px crosshair. Ignored at peek. */
  scrub?: boolean;
  /** First-reveal draw-on. Set false to render the final state (in a card that has already animated). */
  run?: boolean;
  /** Explicit [min, max] — how small multiples share one scale. Omit and the domain is niced from the data. */
  domain?: [number, number];
}
export function ChartLine(props: ChartLineProps): JSX.Element;
/** Three or more series: one chart per series on a shared scale, stacked down the card. */
export function ChartLineMultiples(props: { series: ChartSeries[]; width?: number; valueFormat?: (v: number) => string; xFormat?: (x: number) => string; tone?: 'ramp' | 'muted' | 'status' }): JSX.Element;


/* ==============================================================================================
   components/data/ChartReadout.d.ts
   ============================================================================================== */

export interface ChartReadoutProps {
  /** The x label at the touch position — or the latest x when idle. */
  label: string;
  /** The value, 13px ink, tabular figures. */
  value: string;
  /** True while the finger is down: the value goes ink, the chart draws its crosshair. */
  active?: boolean;
  /** Shown in place of `label` when there is nothing to name yet. */
  idleNote?: string;
}
/** A fixed 22px row above the plot, reserved even when idle — never a floating box under the thumb,
 *  which during a scrub covers the mark being read. */
export function ChartReadout(props: ChartReadoutProps): JSX.Element;


/* ==============================================================================================
   components/data/ChartShare.d.ts
   ============================================================================================== */

export interface ChartShareSegment {
  label: string;
  value: number;
  /** `status` for the one segment that crossed a limit. Never a category colour. */
  tone?: 'ramp' | 'status';
}
export interface ChartShareProps {
  segments: ChartShareSegment[];
  /** 'expanded' (default) — the full ranked bar with its legend.
   *  'peek' — the 96pt card: the tail collapses into one `Other` segment, so the bar is leader + Other,
   *  both DIRECT-labelled at the bar's ends and the legend is unnecessary rather than suppressed.
   *  A PEEK SHARE CARRIES AT MOST TWO SEGMENTS: three legend rows measured a 99px block inside a 96px
   *  card, and the answer to that is fewer segments, not smaller type. Measured at peek: 8 + 6 + 15 = 29. */
  density?: 'peek' | 'expanded';
  /** Bar thickness. Defaults to 10 expanded, 8 at peek. */
  height?: number;
  /** The ranked ChartLegend beneath. It is the COMPLIANCE MECHANISM, not decoration: no colour in this
   *  palette separates adjacent segments at 3:1, so the labels are what make the segments readable.
   *  **Defaults to on when expanded and OFF at peek** — peek's two segments are direct-labelled at the
   *  bar's ends, so a legend there just repeats the row above it.
   *  **Above two segments this prop is IGNORED and the legend is forced on.** Two segments or fewer are
   *  already direct-labelled, so `false` is honoured only there — which is exactly why `density="peek"`
   *  collapses to two. */
  legend?: boolean;
  valueFormat?: (value: number, percent: number) => string;
  run?: boolean;
  /** A caveat that belongs AT the number — "These percentages are rounded for simplicity". Monzo's rule. */
  caveat?: string;
  /** What the collapsed tail is called at peek. Default 'Other'. */
  otherLabel?: string;
}
/** The pie, answered: a 100% stacked bar with a ranked legend. Segments ranked by value descending.
 *  Separation is by shape and word — a --space-2 gap of the card's background between segments, a
 *  --border-hairline edge on the bar, and a label per segment. WCAG 1.4.11 exempts a graphic whose
 *  information is also present as text; that exemption is the only reason this chart is compliant. */
export function ChartShare(props: ChartShareProps): JSX.Element;


/* ==============================================================================================
   components/data/ChartSpark.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface ChartSparkProps {
  /** The series, oldest first. Fewer than two points renders an empty box of the same size, so a
   *  table column does not jump when one row has no history. */
  points: number[];
  /** Default 56 — the width a table cell can spare at 375 without pushing a figure off. */
  width?: number;
  /** Default 18, which sits inside DataTable's compact row without changing its height. */
  height?: number;
  /** 'ramp' (the default) is the fund's own line; 'muted' a benchmark or prior period; 'status' a
   *  crossed limit. Never a colour — a single mark against the page takes `markColor`, which returns
   *  bronze-deep whatever the rank. The series fills are pastels and a pastel clears nothing against
   *  warm paper; they are legible only in the pairing that gives every area its own darker contour,
   *  and a 56px line has no area to contour. */
  tone?: 'ramp' | 'muted' | 'status';
  /** Mark the last point. Default true: "where it ended" is what a reader looks for, and the eye
   *  should not have to hunt along the line for it. */
  endDot?: boolean;
  /** Accessible name. Defaults to the point count and the final value — say what the row is about
   *  where the column header does not. */
  label?: string;
}

/**
 * A line small enough to live in a table row — the component `DataTable`'s `sparkline` column kind
 * has declared since v1 and the system could not draw.
 *
 * No axis, no grid, no label: that is what makes it a spark rather than a chart, and the figure it
 * sits beside is its label. A number says where a fund ENDED; the spark says how it got there, and
 * two funds on the same three-year return with different paths are not the same fund.
 */
export function ChartSpark(props: ChartSparkProps): JSX.Element;


/* ==============================================================================================
   components/data/ChartTooltip.d.ts
   ============================================================================================== */

/** Tap-to-inspect for a single chart mark. Not a hover box — hover does not exist at 375pt — and not a
 *  scrub readout, which is `ChartReadout`.
 *
 *  Two obligations sit with the caller, not this component:
 *  · a tap target of at least 44pt around the mark, larger than the mark itself;
 *  · a table view in the card's ⋯ — no value is ever reachable only by touching a coloured shape.
 *  Dismissal is the next tap anywhere. */
export interface ChartTooltipProps {
  /** 'above' by default; flip to 'below' when the mark is near the top edge. */
  anchor?: 'above' | 'below';
  label: string;
  /** The figure, 13px bold ink, tabular. */
  value: string;
  /** The provenance line for that point. */
  meta?: string;
  /** Length of the 1px leader line to the mark. There is no arrow or tail — a tail clips at the plot edge. */
  leader?: number;
  style?: React.CSSProperties;
}
export function ChartTooltip(props: ChartTooltipProps): JSX.Element;


/* ==============================================================================================
   components/data/CompareTable.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface CompareEntity {
  id: string;
  /** The fund's name, as the advisor reads it. Wraps; the column is at least 104pt wide. */
  name: string;
  /** One line under it — the house and the category. */
  meta?: string;
}

export interface CompareRow {
  /** What is being compared, in the advisor's words: "Expense ratio", not "TER". */
  label: string;
  /** Keyed by entity id. A missing or empty value renders `——`, never a blank cell and never a zero. */
  values: Record<string, React.ReactNode>;
  /** ONLY where direction is a fact. `'low'` for cost — a lower expense ratio is cheaper, which is
   *  arithmetic, not an opinion — `'high'` where more is plainly better. A fund's SIZE has no better,
   *  and a row without this never marks one. The winning cell carries `--type-row-strong-font`: the
   *  same size at one weight up, never a colour (rule 1). */
  better?: 'low' | 'high';
  /** How to read this row's displayed string as a number, when the default (strip everything that is
   *  not a digit) is wrong — "2% within 365 days" is not 2. A row whose values cannot be ranked gets
   *  no mark rather than a wrong one. */
  rank?: (value: React.ReactNode) => number;
}

export interface CompareTableProps {
  /** Two or three. Two is the phone's comfortable answer: 104 + 2×105 fits 375. A third scrolls
   *  sideways with the label column pinned. */
  entities: CompareEntity[];
  rows: CompareRow[];
  /** Default 'Side by side'. */
  title?: string;
  /** Default 3, the PRD's ceiling. STATED when reached via `capNote`, never a disabled button with
   *  no explanation — `OverlapView`'s rule. */
  cap?: number;
  /** Omit and no add control is drawn. Hidden once the cap is reached. */
  onAdd?: () => void;
  /** Default 'Add a third'. */
  addLabel?: string;
  /** Shown once the cap is reached. Say what the cap is and why, in words. */
  capNote?: string;
  /** Rendered with `Provenance`. Every figure here came from somewhere, and a comparison an advisor
   *  reads to a client is the last place to leave that unsaid. */
  footnote?: string;
  /** Drawn on each column only while there are more than two — a comparison of one is not a
   *  comparison, so the second fund has no Remove. */
  onRemove?: (id: string) => void;
}

/** TWO OR THREE FUNDS, READ ACROSS A ROW.
 *
 *  `DataTable` is many entities with one kind per COLUMN, sorted and expandable in place. A comparison
 *  is its transpose: few entities, one kind per ROW, and the read is sideways — an advisor asks "what
 *  does each of these charge", not "sort by cost". Forcing a comparison through `DataTable` makes
 *  every fund column `text`, which throws away the tabular figures and the row's own meaning.
 *  `OverlapView` answers the other comparison question — how much of two funds is the same fund.
 *
 *  **The same value is the information, and it recedes.** The v2 spec says "differences bolded", and
 *  taken literally that bolds almost every cell. Inverted it is useful: a row where every fund says
 *  the same thing is MUTED, so the eye lands where they actually part. A de-emphasis, not a claim.
 *
 *  **`better` is the one claim, and only where direction is a fact.** The verdict that reads the whole
 *  comparison belongs in a sentence in the turn — which is where the spec puts it too: *"a table
 *  anyone can build; the reading is what the advisor is paying for."* */
export function CompareTable(props: CompareTableProps): JSX.Element;


/* ==============================================================================================
   components/data/ConcentrationBar.d.ts
   ============================================================================================== */

export interface ConcentrationBarProps { /** 0–1 */ fraction: number; label: string; }
export function ConcentrationBar(props: ConcentrationBarProps): JSX.Element;


/* ==============================================================================================
   components/data/DrawnCheck.d.ts
   ============================================================================================== */

export interface DrawnCheckProps { size?: number; }
export function DrawnCheck(props: DrawnCheckProps): JSX.Element;


/* ==============================================================================================
   components/data/Dumbbell.d.ts
   ============================================================================================== */

export interface DumbbellProps {
  label?: string;
  /** The hollow dot — what was agreed, or the benchmark. */
  target: number;
  /** The filled dot — what is. */
  actual: number;
  /** The low end of the scale. **Default 0**, so every caller written before this draws what it drew:
   *  the rebalance's equity shares, where 0% equity is a real position. Pass it when the zero is not
   *  meaningful for the quantity — two funds at 23.1% and 21.6% against a 16.8% benchmark put both
   *  dumbbells in the right quarter of a 0–25 track and the difference between the two gaps, which is
   *  the whole reason the chart is there, came out at 19px of 315. The system already scales a series
   *  to its data rather than to zero (`chartMath.niceDomain`, `ChartLine`), and the safeguard is the
   *  same: every figure here is direct-labelled, so the picture never carries a number on its own. */
  min?: number;
  /** The high end. Default 100. */
  max?: number;
  /** Sits BESIDE its value, never instead of it (F-46). Pass the NAME only — the component prints
   *  the number, so `actualLabel="This fund"` renders "This fund 23.1%" and `"This fund 23.1%"`
   *  renders it twice. */
  targetLabel?: string;
  actualLabel?: string;
  /** What the pair means. `'move'` (default) is what this component was built for — from what is to
   *  what was agreed — and prints the target with a leading arrow. `'against'` is the comparison case
   *  the `target` doc above already allows, where the hollow dot is a benchmark or a category average:
   *  two measurements of different things, with nothing travelling between them. It drops the arrow
   *  and changes nothing else. */
  relation?: 'move' | 'against';
}
export function Dumbbell(props: DumbbellProps): JSX.Element;


/* ==============================================================================================
   components/data/FigureRow.d.ts
   ============================================================================================== */

export interface FigureRowSub {
  label: string;
  value: string;
  /** Rule 2 applies here too: `'over'` is TEXT colour, never a fill. */
  tone?: 'ink' | 'over';
}

export interface FigureRowProps {
  /** The thing being measured, on the left. */
  label: string;
  /** The figure, on the right, on the same baseline. **Tabular figures are set here and not by the
   *  caller** — rule 4 asks for them on anything that changes, and four call sites remembering
   *  independently is four chances to forget. Indian grouping and one decimal stay the caller's;
   *  the book's `inr()` does that. */
  value: string;
  /** A second, quieter pair under the first — the rule under the target, the average under the
   *  total. Always `quiet`: a card with two strong rows has not decided what it is saying. */
  sub?: FigureRowSub;
  /** `'strong'` for the row that carries the answer, `'quiet'` for the one that qualifies it.
   *  Default 'strong'. */
  weight?: 'strong' | 'quiet';
  /** Rule 2. A figure the product cannot stand behind — an uncosted move — states its reason in
   *  `--color-status-over-fg` TEXT, on whatever surface it is already on. This component never
   *  paints a background. */
  tone?: 'ink' | 'over';
}

/** A LABEL AND ITS FIGURE, ON ONE BASELINE.
 *
 *  Four hand-written instances across three screens — `moves.jsx:70`, `rebalance.jsx:30` and `:34`,
 *  `review.jsx:46` — all the same declaration (flex, `align-items: baseline`, `space-between`,
 *  `--space-8`), and all four setting `fontVariantNumeric: 'tabular-nums'` on the right-hand span by
 *  hand.
 *
 *  **Not the figure/caption pair.** `InfoCard` sets its figure and `figureNote` on one baseline and
 *  that is a different mark — one number and its period. This is a label and its figure, two things
 *  at the two ends of a row. */
export function FigureRow(props: FigureRowProps): JSX.Element;


/* ==============================================================================================
   components/data/MetricRow.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface MetricPeer {
  /** 'This fund', 'Category', 'Benchmark'. */
  label: string;
  /** Already formatted. */
  value: string;
  /** The fund's own figure — the one the others are read against. Takes the accent surface. The
   *  label still says which is which, so colour is not carrying the meaning alone. */
  self?: boolean;
  /** This peer has no figure on file. The tile STAYS — dropping it would hide that a comparison is
   *  meant to exist — and `value` becomes the words for the gap ('not on file'), set in caption
   *  weight rather than figure weight, so the eye does not compare three things when there are two. */
  missing?: boolean;
}

export interface MetricRowProps {
  /** 'Alpha (3Y)', 'Beta (3Y)', 'Expense ratio'. */
  label: string;
  /** The fund's own figure, already formatted. */
  value: string;
  /** What it is measured against, as tiles. Usually three: this fund, its category, its benchmark —
   *  all of which the catalogue carries. Empty means there is nothing to compare it to, and the row
   *  then has no chevron rather than a chevron that opens an empty panel. */
  peers?: MetricPeer[];
  /** One line under the tiles: what the comparison means here, not what the metric means in general.
   *  "Ahead of its category on both windows" — a reading, not a definition. */
  note?: string;
  open?: boolean;
  onToggle?: () => void;
  /** Set by `MetricList`. The last row drops its rule — a hairline with nothing under it draws the
   *  bottom of a box that is not there. */
  last?: boolean;
  id?: string;
}

/**
 * A figure that opens into what it is measured against.
 *
 * `Alpha 1.64` is only a fact once the reader knows the category did 8.64 and the benchmark 9.12.
 * The catalogue carries all three; printing all three per row makes a wall, so the row prints the
 * fund's own figure and opening it lays the peers beside it.
 *
 * Not `StatTile`, which is a headline figure with a door to a DEFINITION — what the metric means.
 * This is a row with a door to a COMPARISON — what it is here. A one-pager wants both, and a
 * component that did both would put two chevrons on one row.
 */
export function MetricRow(props: MetricRowProps): JSX.Element;

export interface MetricListProps { children?: React.ReactNode; }
/** Applies the divider rule and drops it on the last row. */
export function MetricList(props: MetricListProps): JSX.Element;


/* ==============================================================================================
   components/data/OverlapView.d.ts
   ============================================================================================== */

export type OverlapViewMode = 'pairs' | 'matrix';
export type OverlapProperty = 'top10' | 'all-holdings' | 'sector' | 'market-cap' | 'style';

export interface OverlapFund {
  id: string;
  name: string;
  inComparison: boolean;
}
export interface OverlapPropertyOption {
  id: OverlapProperty | string;
  /** What the advisor reads — "top 10 holdings", "sector". */
  label: string;
  active: boolean;
}
export interface OverlapCell {
  a: string;
  b: string;
  /** null or undefined means the overlap is NOT AVAILABLE, and it renders as an em dash with a
   *  footnote. Never pass 0 for a pair you could not compute: a zero and a missing value are
   *  different facts, and printing 0% states something untrue about the client's money. */
  pct: number | null;
}

export interface OverlapViewProps {
  /** Default 'pairs'. Pairs is the phone answer: five funds make a 25-cell matrix of which only ten
   *  carry information, and at 375pt those ten do not fit legibly. Matrix is for wide viewports and
   *  for export. */
  mode?: OverlapViewMode;
  /** Up to `maxFunds`. Only entries with `inComparison` are compared. */
  funds: OverlapFund[];
  /** The basis of the number, shown as removable chips so an advisor can change it rather than trust
   *  it blind. An overlap figure with no stated basis is one nobody can defend to a client. */
  properties: OverlapPropertyOption[];
  /** Symmetric — pass each pair once. Self-pairs are ignored: a fund against itself is a blank cell,
   *  never 100%. */
  cells: OverlapCell[];
  /** Default 5. The cap is STATED when reached, never enforced by a disabled button with no
   *  explanation. */
  maxFunds?: number;
  onToggleFund?: (id: string) => void;
  onToggleProperty?: (id: OverlapProperty | string) => void;
  /** Opens the picker sheet — `List` with `variant="multi"`. The sheet states the cap. */
  onAddFund?: () => void;
  onAddProperty?: () => void;
  /** Omit and the mode toggle is not rendered; the view stays in whatever `mode` says. */
  onChangeMode?: (mode: OverlapViewMode) => void;
  /** Replaces the default footnote about em dashes. Name WHY a pair is unavailable when you know. */
  footnote?: string;
}

/** Fund overlap: how much two funds are the same fund.
 *
 *  Colour is magnitude only — one sequential bronze ramp in four steps, light for low and dark for
 *  high — and every cell prints its percentage, so colour is never the only carrier. The two dark
 *  steps take surface-coloured text; ink on bronze-deep measures 2.25:1 and does not clear the floor.
 *
 *  Four states are not errors and each reads differently: fewer than two funds asks for a second one;
 *  no active property asks for a basis and renders nothing rather than defaulting to one the advisor
 *  did not choose; a self-pair is blank; an uncomputable pair is an em dash with a footnote. */
export function OverlapView(props: OverlapViewProps): JSX.Element;


/* ==============================================================================================
   components/data/PeerLine.d.ts
   ============================================================================================== */

import * as React from 'react';

/** A real position inside a real category. Pass it only where the denominator is the whole category,
 *  not the rows that happened to match a filter — an invented rank is worse than no rank. */
export interface PeerLineRank {
  /** 1-based position. Rendered as an ordinal: 4 → "4th". */
  n: number;
  /** How many schemes the position is out of. */
  of: number;
}

export interface PeerLineProps {
  /** The fund's own figure, as a number so the gap can be computed here rather than trusted. */
  value: number;
  /** The category's figure for the same period, from the same source. */
  peer: number;
  /** The window both figures cover, in words: "3 years", "1 year". Printed, never parsed. */
  period: string;
  /** What `peer` is the figure OF: "Flexi cap average", "its category". Printed as given. */
  peerLabel: string;
  /** Optional, and never invented — see PeerLineRank. Omitted, the line still reads as a judgement. */
  rank?: PeerLineRank | null;
  /** Unit suffix on both figures. Defaults to '%'; the only unit the explorer currently compares on. */
  unit?: string;
}

/**
 * A fund's figure beside its category's, on one line, with the gap said in words.
 *
 * The row-level half of a pair: `Dumbbell` draws the same comparison as marks on an axis where a
 * fund page has room, and `PeerLine` says it as type where a list row does not. Both read the same
 * two numbers.
 *
 * The gap is COMPUTED from `value` and `peer` — a caller cannot hand in a verdict that disagrees
 * with the two figures printed beside it. Ahead and behind are carried by the word, never by
 * colour: rule 1 says colour never encodes, and an advisor reading this line to a client needs the
 * meaning to survive being spoken.
 */
export function PeerLine(props: PeerLineProps): JSX.Element;


/* ==============================================================================================
   components/data/ProgressRail.d.ts
   ============================================================================================== */

export interface ProgressRailProps {
  n: number;
  total: number;
  /** Detour state — dims the rail to 40%. The label is never dimmed; do not wrap the rail in a parent opacity. */
  dim?: boolean;
}
export function ProgressRail(props: ProgressRailProps): JSX.Element;


/* ==============================================================================================
   components/data/StatTile.d.ts
   ============================================================================================== */

export interface StatTileProps {
  /** Sentence case, 12px muted. */
  label: string;
  /** The headline figure, display face. */
  value: string;
  /** One qualifying line — "in a 20% fall", "exit load + STCG". */
  note?: string;
  /** Optional <Sparkline points={…} />. */
  sparkline?: React.ReactNode;
  /** A figure supplied elsewhere: chip surface, de-emphasis value. Use with [PLACEHOLDER — … to supply]. */
  locked?: boolean;
  /** Puts an `InfoDot` beside the label. **UNDOCUMENTED UNTIL 20 SEP 2026** — it shipped in v11 and
   *  lived only in the .jsx, which is how the review's four figures ended up with no door to an
   *  explanation while the same class of figure on a fund card had one on every stat (contradiction
   *  63). Pass it wherever the figure is one an advisor will be asked about. A locked tile takes it
   *  too: the absence is the thing that most needs explaining. */
  onExplain?: () => void;
  /** The rounding or basis note, AT the number rather than in a page footer — "annualised", "before
   *  tax". Quieter than `note`, which qualifies the figure; this one qualifies the arithmetic. */
  caveat?: string;
}

/** THE FIGURE TILE — the loud one, and contradiction 62's ruling of 20 Sep 2026 is which.
 *
 *  This system has two treatments for "a labelled figure in a rounded box" and nothing said when to
 *  reach for which, which is how a screen author picks the wrong one. They are now named:
 *
 *  - **`StatTile` is the FIGURE TILE.** Surface ground, OUTSET ring, display face, bronze, 24px. Use
 *    it when the figure IS the point of the turn — the review's four facts, the cost of doing nothing
 *    against the cost of fixing it. It is a component, it is exported, and it stands alone.
 *  - **`InfoCard`'s stat box is the FOOTNOTE STAT.** Canvas ground, INSET ring, 13px ink,
 *    `--type-caption-font` label. Use it for a fact ABOUT the thing the card is already about —
 *    riskometer, expense ratio, exit load under a fund's name. It is internal to `InfoCard`, it is
 *    not exported, and it never appears alone.
 *
 *  The test, in one line: **if the reader came for this number, it is a figure tile; if they came for
 *  the thing and this number qualifies it, it is a footnote stat.** Four figure tiles in a row are the
 *  loudest thing on a screen, which is correct when they are the answer and wrong when they are a
 *  footer. */
export function StatTile(props: StatTileProps): JSX.Element;
export interface SparklineProps { points: number[]; width?: number; height?: number }
export function Sparkline(props: SparklineProps): JSX.Element;


/* ==============================================================================================
   components/forms/FileUpload.d.ts
   ============================================================================================== */

import type { TraceStep } from '../chat/StepTrace';
export interface UploadedFile {
  name: string;
  /** "4 pages · 1.2 MB · added just now" — tabular, so the column does not jitter. */
  meta?: string;
}
export interface FileUploadProps {
  file: UploadedFile;
  /** The parse stages. The same TraceStep shape StepTrace takes — because the stages ARE the summary
   *  arriving progressively, there is no separate success state to design. */
  stages: TraceStep[];
  state?: 'parsing' | 'done' | 'failed';
  /** The outcome line, in the advisor's world: "read her September statement · 4 pages · 12 holdings".
   *  Never "uploaded successfully". */
  summary?: string;
  /** Retries ONE stage, so a failed step does not mean re-uploading a 40-page statement. */
  onRetry?: (stageLabel: string) => void;
  onRemove?: () => void;
  /** A follow-up row or chip under the trace — Notion's file-chip-then-follow-up shape. */
  actions?: React.ReactNode;
  /** Whose message this is. Default 'advisor': the advisor attached it, so the card sits on their side of
   *  the thread and is capped like their bubble — a full-width card read as Sentinel's reply, which it is
   *  not. 'sentinel' restores the full width for a file Sentinel produced. */
  side?: 'advisor' | 'sentinel';
}
/** The file as a chip in the thread, parsing in stages. A failed stage keeps its place and carries its
 *  own retry. */
export function FileUpload(props: FileUploadProps): JSX.Element;


/* ==============================================================================================
   components/forms/SearchField.d.ts
   ============================================================================================== */

/** THE FILTER ABOVE A LIST — the composer's visual style at one row and 44px, so it reads as a filter
 *  rather than a second composer. This doc said "what a `List searchable` renders" until 19 Sep 2026;
 *  `List` has no `searchable` prop and never did, so the sentence described a feature that did not
 *  exist. The caller composes it: SearchField above, `List` below, filtered by the caller. Selection is for browsing a 512-client book; typing a name in
 *  the composer stays the path for an advisor who already knows it. */
export interface SearchFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  /** Default 'Search 512 clients' — state the real count. */
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
}
export function SearchField(props: SearchFieldProps): JSX.Element;


/* ==============================================================================================
   components/forms/SelectionMark.d.ts
   ============================================================================================== */

export interface SelectionMarkProps {
  /** radio = one of a set · checkbox = several of a set. Pairing is enforced by the row, not chosen here. */
  kind: 'radio' | 'checkbox';
  selected?: boolean;
  disabled?: boolean;
}
/** Not an icon — drawn inside the component that owns it, and never rendered on its own. */
export function SelectionMark(props: SelectionMarkProps): JSX.Element;


/* ==============================================================================================
   components/icons/AssetMark.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface MarkProps {
  /** Rendered px. The viewBox is 24 and the fill is `currentColor`, so a caller sizes it here and
   *  tints it on the parent — which is how the four stay identical in weight. */
  size?: number;
  /** An accessible name. **Omit it.** These marks are texture drawn under a label that already says
   *  the same word, and naming them makes a screen reader read every asset class twice. Pass a label
   *  only where the mark is genuinely the only thing present, which on a Sentinel screen it never is. */
  label?: string;
}

/** The rising step — four columns of increasing height, the shape a NAV curve makes as bars. */
export function MarkEquity(props: MarkProps): JSX.Element;
/** The coupon ladder — evenly spaced rungs of equal weight. A bond pays the same amount on the same
 *  day, and the flatness against equity's rise is the difference between the classes, as a shape. */
export function MarkDebt(props: MarkProps): JSX.Element;
/** The ingot. Gold is the whole of this class in the catalogue (SGB, gold ETF, gold fund) and a bar
 *  is what it is actually sold as. */
export function MarkCommodity(props: MarkProps): JSX.Element;
/** The elevation — two towers and a floor line, for REITs and InvITs: rent from built things. */
export function MarkProperty(props: MarkProps): JSX.Element;

/** Keyed by the catalogue's own `assetName` strings, so a screen never keeps its own map from asset
 *  to mark and the two cannot drift. */
export const ASSET_MARKS: Record<string, (p: MarkProps) => JSX.Element>;

export interface AssetMarkProps extends MarkProps {
  /** The catalogue's `assetName`: 'Equity' | 'Debt' | 'Commodity' | 'REITs / InvITs'. */
  asset?: string;
}
/** Renders the mark for an asset class, or **nothing** for an unknown one — a wrong shape is worse
 *  than no shape, because the eye learns it anyway. */
export function AssetMark(props: AssetMarkProps): JSX.Element | null;


/* ==============================================================================================
   components/icons/IconArrow.d.ts
   ============================================================================================== */

export interface IconArrowProps { /** Stroke colour; defaults to the token the source uses (var(--color-surface)). */ stroke?: string; /** Box size in px (source: 18). */ size?: number; }
export function IconArrow(props: IconArrowProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconAttach.d.ts
   ============================================================================================== */

export interface IconAttachProps { /** Stroke colour; defaults to the token the source uses (var(--color-muted)). */ stroke?: string; /** Box size in px (source: 18). */ size?: number; }
export function IconAttach(props: IconAttachProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconCheckCircle.d.ts
   ============================================================================================== */

export interface IconCheckCircleProps {
  /** Stroke colour; defaults to var(--color-status-ok-fg). */
  stroke?: string;
  /** Rendered box in px. 20 is the system size; stroke stays 1.5 on the 24px grid. */
  size?: number;
}
export function IconCheckCircle(props: IconCheckCircleProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconChevronRight.d.ts
   ============================================================================================== */

export interface IconChevronRightProps { /** Stroke colour; defaults to the token the source uses (var(--color-bronze)). */ stroke?: string; /** Box size in px (source: 15). */ size?: number; }
export function IconChevronRight(props: IconChevronRightProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconDownload.d.ts
   ============================================================================================== */

export interface IconDownloadProps {
  /** Stroke colour; defaults to var(--color-bronze-deep). */
  stroke?: string;
  /** Rendered box in px. 20 is the system size; stroke stays 1.5 on the 24px grid. */
  size?: number;
}
export function IconDownload(props: IconDownloadProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconFile.d.ts
   ============================================================================================== */

export interface IconFileProps {
  /** Stroke colour; defaults to var(--color-muted). */
  stroke?: string;
  /** Rendered box in px. 20 is the system size; stroke stays 1.5 on the 24px grid. */
  size?: number;
}
export function IconFile(props: IconFileProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconFilter.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface IconFilterProps {
  /** Defaults to `--color-bronze`, which is what the rest of the set takes. */
  stroke?: string;
  /** Default 15 — the set's one size. */
  size?: number;
}

/**
 * Three sliders, not a funnel.
 *
 * A funnel glyph is the common choice and it is wrong here: this product HAS a funnel — four
 * questions down the screen — and using its picture for the thing that narrows the result would name
 * two different mechanics with one shape. Sliders say "adjust", which is what the sheet does.
 */
export function IconFilter(props: IconFilterProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconInfo.d.ts
   ============================================================================================== */

export interface IconInfoProps {
  /** Stroke colour; defaults to var(--color-muted). */
  stroke?: string;
  /** Rendered size. 14 beside a figure, 16 in a row. */
  size?: number;
}
export function IconInfo(props: IconInfoProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconMenu.d.ts
   ============================================================================================== */

export interface IconMenuProps { /** Stroke colour; defaults to the token the source uses (var(--color-ink)). */ stroke?: string; /** Box size in px (source: 18). */ size?: number; }
export function IconMenu(props: IconMenuProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconPlus.d.ts
   ============================================================================================== */

export interface IconPlusProps { /** Stroke colour; defaults to the token the source uses (var(--color-ink)). */ stroke?: string; /** Box size in px (source: 20). */ size?: number; }
export function IconPlus(props: IconPlusProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconSparkle.d.ts
   ============================================================================================== */

export interface IconSparkleProps { /** Stroke colour; defaults to the token the source uses (var(--color-bronze-deep)). */ stroke?: string; /** Box size in px (source: 18). */ size?: number; }
export function IconSparkle(props: IconSparkleProps): JSX.Element;


/* ==============================================================================================
   components/icons/IconSpinner.d.ts
   ============================================================================================== */

export interface IconSpinnerProps {
  /** Stroke colour; defaults to var(--color-bronze-deep). */
  stroke?: string;
  /** Rendered box in px. 20 is the system size; stroke stays 1.5 on the 24px grid. */
  size?: number;
}
export function IconSpinner(props: IconSpinnerProps): JSX.Element;


/* ==============================================================================================
   components/lists/FollowUpRow.d.ts
   ============================================================================================== */

export interface FollowUp {
  /** The question as the advisor would ask it. Wraps to two lines freely — that is the point. */
  question: string;
  /** One line of why it is worth asking. GitHub Copilot's two-line card, in our geometry. */
  note?: string;
  leading?: React.ReactNode;
}
export interface FollowUpRowProps {
  /** Strings or FollowUp objects. */
  items: Array<string | FollowUp>;
  label?: string;
  onAsk?: (question: string) => void;
  /** A leading icon for every row — Agoda's pattern. Per-item `leading` overrides it. */
  leading?: React.ReactNode;
}
/** THE RULE: a follow-up that exceeds one line becomes a row, not a pill. Pill keeps the short ones.
 *  Rows are inline — they belong to the message that produced them and scroll away with it — so they
 *  sit in the thread under the answer, never in the dock, which is for what persists. */
export function FollowUpRow(props: FollowUpRowProps): JSX.Element | null;


/* ==============================================================================================
   components/lists/List.d.ts
   ============================================================================================== */

export type ListDividers = 'none' | 'inset' | 'full';
export interface ListEmptyState {
  /** One line in the product's voice. Never "No data" — "No drift to review — I'll flag it here when a portfolio moves". */
  title: string;
  body?: string;
  /** One pill, at most. */
  action?: React.ReactNode;
}
export interface ListProps {
  /** Row prop objects; each renders a <ListRow>. Omit and pass children to compose rows yourself. */
  items?: Array<Record<string, unknown>>;
  children?: React.ReactNode;
  /** Default 'inset'. */
  dividers?: ListDividers;
  /** Eyebrow above the card. */
  header?: string;
  /** A row under the last divider — the "See all 43" ghost button. A capped list plus a footer is how
   *  this system avoids a nested scroller; never make a List scroll inside a scrolling surface. */
  footer?: React.ReactNode;
  groupBy?: 'none' | 'client' | 'date' | 'journey';
  /** REQUIRED — every list in this product is empty on someone's first day. */
  emptyState: ListEmptyState;
  /** Skeleton rows with a shimmer; under prefers-reduced-motion they hold still. */
  loading?: boolean;
  /** Props merged into every row (e.g. `{variant:'nav', trailing:'chevron'}`). */
  rowProps?: Record<string, unknown>;
  /** Renders a `SearchField` ABOVE the card and filters `items` by `title`, case-insensitively.
   *
   *  An AMENDMENT rather than a `SearchableList`: `SearchField`'s own header has said since v9 that
   *  it is "the search field a `searchable` List renders", and this prop never existed — so
   *  `who.jsx` held the query in state, filtered by hand and rendered the field itself, and the fund
   *  picker was about to do it a second time.
   *
   *  **The pool stays the caller's.** `items` on the who-picker is already "the four most recent",
   *  and a search that silently widens to 512 clients on the first keystroke is a different surface.
   *  This filters what it was given and nothing more.
   *
   *  `emptyState` here is the SEARCH's, not the list's: a list with no rows and a query with no
   *  matches need different words. Omit it and the list's own is used for both. */
  search?: {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
    emptyState?: ListEmptyState;
  };
}
export function List(props: ListProps): JSX.Element;


/* ==============================================================================================
   components/lists/ListRow.d.ts
   ============================================================================================== */

export type ListRowVariant = 'nav' | 'select' | 'multi' | 'action' | 'static';
export type ListRowSize = 'md' | 'lg';
export type ListRowLeading = 'none' | 'avatar' | 'icon' | 'index';
export type ListRowTrailing = 'chevron' | 'radio' | 'checkbox' | 'badge' | 'menu' | 'meta' | 'none';
/** One row, constrained pairings enforced in the component — an illegal `trailing` falls back to the
 *  variant's default and warns once. Legal: nav → chevron|meta · select → radio · multi → checkbox ·
 *  action → menu · static → badge|meta|none. The chevron belongs to `nav` and nowhere else.
 *  `static` takes no `onPress` and is exempt from the touch-target rule, exactly like Badge. */
export interface ListRowProps {
  variant: ListRowVariant;
  /** 56 / 72. Defaults to 'lg' when a subtitle is present, 'md' otherwise. */
  size?: ListRowSize;
  leading?: ListRowLeading;
  /** Icon node for leading='icon'; overrides the derived initial for leading='avatar'. */
  leadingContent?: React.ReactNode;
  /** Number shown for leading='index'. */
  index?: number;
  title: string;
  subtitle?: string;
  /** Right-aligned secondary, 11.5px --color-muted. The drawer's relative time ("2h ago") goes here. */
  meta?: string;
  /** Inline node after the title — the drawer's bound-client variant passes a <ClientChip>. */
  chip?: React.ReactNode;
  trailing?: ListRowTrailing;
  badge?: { variant: 'status' | 'meta'; tone?: 'over' | 'under' | 'ok'; text: string };
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onMenu?: () => void;
}
export function ListRow(props: ListRowProps): JSX.Element;


/* ==============================================================================================
   components/shell/Dock.d.ts
   ============================================================================================== */

export interface DockProps {
  /** DEPRECATED BY A RULING, 18 Sep 2026 — do not use on a screen with a conversation on it. The owner:
   *  what an advisor is offered must live IN the conversation and scroll with it, not sit pinned above
   *  the composer. What a message offered belongs beside that message; pinned, it outlives the turn it
   *  came from and an advisor scrolling back cannot tell which answer it belonged to. Put AnswerChips in
   *  the turn — `SentinelTurn chips` — instead.
   *
   *  THE ONE EXCEPTION IS A SCREEN WITH NO CONVERSATION ON IT — Home. The ruling moves what a MESSAGE
   *  offered into that message, so a screen that has no message has nothing for its chips to sit under,
   *  and no scroll for them to outlive (Home has no scroller at all — measured). Starters above the
   *  composer there are `readme.md:187`'s "Dock pills act on the current state of the conversation, and
   *  they persist" in its only remaining case: the current state is "nothing asked yet". `check-previews`
   *  fails any other page that passes this.
   *
   *  `cta` WAS THE THIRD SLOT AND IT IS DELETED (20 Sep 2026). It had no exception: no screen in this
   *  product pins a decision, and a decision belongs under the thing it decides about. It outlived the
   *  ruling by two days only because `ui_kits/` passed it in six artboards and the kit is not edited
   *  lightly; the kits were redrawn on `SentinelTurn` the same day it went. Use `SentinelTurn cta`. */
  chips?: React.ReactNode;
  /* `cta` WAS DECLARED HERE UNTIL 20 SEP 2026, after the slot itself was deleted — so a caller
     passing it got silence rather than an error. The deprecation record above stays; the declaration
     does not, because a contract that offers a prop the implementation does not read is a contract
     that lies. `check-previews` still fails any page that passes it. */
  /** DEPRECATED BY THE SAME RULING, and it has NO exception: Home's starters are chips, and no screen
   *  in this product pins a decision. `screens/` has zero consumers and the gate keeps it that way.
   *  A decision belongs under the thing it decides about. */
  /** Composer or MoneyComposer — required on every screen. RULE 3 IS UNCHANGED: the composer is docked,
   *  always present, and nothing replaces it. The ruling moved the chips and the CTA, never this. */
  composer: React.ReactNode;
  disclosure?: boolean;
}
export function Dock(props: DockProps): JSX.Element;

/* ==============================================================================================
   components/shell/Drawer.d.ts
   ============================================================================================== */

import type { ListRowProps } from '../lists/ListRow';
export type DrawerSection = 'saved' | 'recent' | 'clients';
export interface DrawerProps {
  open: boolean;
  /** Called by the scrim, by Escape and by nothing else — the drawer has no close button because the
   *  scrim is one. The caller owns `open`, so a drawer never half-closes. */
  onClose: () => void;
  /** The "+" in the header: a new thread. */
  onNew?: () => void;
  /** The "See all N" footer of a capped section. */
  onSeeAll?: (section: DrawerSection) => void;
  /** Row props for each section — `title`, `meta`, `subtitle`, `leading`, `onPress`. Pass the FULL
   *  list; the drawer caps it and shows "See all N" only when the cap bit. */
  saved?: Array<Partial<ListRowProps>>;
  recent?: Array<Partial<ListRowProps>>;
  clients?: Array<Partial<ListRowProps>>;
  /** Default 3 / 7 / 8 — List.jsx's own rule, so the drawer carries ONE scroll and no List scrolls
   *  inside it. Change these only with the reason written down. */
  caps?: { saved: number; recent: number; clients: number };
  /** Skeleton rows in every section. Right here and wrong on Home: the drawer IS its history. */
  loading?: boolean;
  /** Per-section failure. The other sections, the header and the footer keep working — the drawer never
   *  blanks and the advisor is never trapped in an empty menu. */
  failed?: Partial<Record<DrawerSection, boolean>>;
  /** Below the lists: "Back to home", the appearance control. NEVER a composer — the owner's ruling,
   *  contradiction 59: the thread and its composer are one tap behind the scrim. */
  footer?: React.ReactNode;
  /** A `SearchField`, rendered directly above the client list. The book is 512 names and the list shows
   *  eight; without this the other 504 are reachable only by typing a name into the thread's composer.
   *  The drawer gives it a place — the filtering is the caller's, because the drawer does not own the book. */
  search?: React.ReactNode;
  /** The dialog's accessible name. Default "Menu". */
  label?: string;
}
/** The menu: saved work, recent threads, the client book — history, which is why it is here and not
 *  on Home. 300pt panel (--w-drawer) over a 25% scrim, sections capped 3 / 7 / 8 with "See all".
 *  A dialog: Escape closes, focus moves in on the false → true transition and back to the opener on
 *  close, Tab wraps. Like ExplainerSheet, both arm on the transition — NO SCREEN MOUNTS IT ALREADY OPEN.
 *  Mount it closed and open it with an action. */
export function Drawer(props: DrawerProps): JSX.Element | null;


/* ==============================================================================================
   components/shell/ExplorerSheet.d.ts
   ============================================================================================== */

import * as React from 'react';

/** peek answers "how many?", half answers "which ones?", full answers "narrow it". */
export type ExplorerDetent = 'peek' | 'half' | 'full';

export interface ExplorerSheetProps {
  open: boolean;
  /** Which of the three heights the sheet is at. Default 'half'. */
  detent?: ExplorerDetent;
  /** Called with the next detent. Omit it and the sheet is fixed at `detent` — the grabber then only
   *  closes, which is the right behaviour for a specimen but not for the product. */
  onDetentChange?: (next: ExplorerDetent) => void;
  /** The explicit dismiss the owner's 22 Sep ruling requires. Always rendered; never gesture-only. */
  onClose?: () => void;
  /** One line under the count: what the list is OF, in the advisor's words. */
  title?: string;
  /** The result count, which is the whole of what `peek` shows. */
  count?: number | null;
  /** What `count` counts. Defaults to 'funds'. */
  unit?: string;
  /**
   * Distance from the bottom of the positioned ancestor to the bottom of the sheet, in px — set by
   * the screen to its composer's height. THIS IS HOW THE SHEET CANNOT COVER THE COMPOSER: the box
   * stops here, so no detent can reach it. Leaving it at 0 on a screen that has a composer breaks
   * the ruling this component was approved under.
   */
  bottom?: number | string;
  /** What `peek` shows beneath the count — the sentence an advisor reads without opening anything. */
  summary?: React.ReactNode;
  /** The filter rail. Rendered only at `full`, because carrying the rail is what full IS. */
  rail?: React.ReactNode;
  /** The list. Rendered at `half` and `full`, in the sheet's own scroll region. */
  children?: React.ReactNode;
  /** Accessible name for the region. Default 'Fund explorer'. */
  label?: string;
}

/**
 * A browse surface that rises over the thread and never takes the composer.
 *
 * NON-MODAL BY CONTRACT: no scrim, no `aria-modal`, no focus trap. The thread behind stays readable
 * and the composer stays live, because an advisor mid-client-call has to be able to keep talking to
 * Sentinel while a list is open — that is the entire argument for a sheet rather than a screen.
 * Do not add dialog mechanics to this component; a trap here would steal the composer's keyboard.
 *
 * Back is one rule, three steps: full → half → peek → gone. The grabber is a real button that steps
 * down one detent, because a gesture nobody can see is not an affordance; a product build layers a
 * drag on top and keeps the button for keyboard users.
 *
 * The mechanic has no incumbent — no shipped product raises a browse sheet over a live chat with the
 * composer working underneath. Each half is proven (Rufus inverted, Google Maps' three detents,
 * Spotify's mutating object); the seam is not. Prototype it before trusting it.
 */
export function ExplorerSheet(props: ExplorerSheetProps): JSX.Element | null;


/* ==============================================================================================
   components/shell/HomeIndicator.d.ts
   ============================================================================================== */

export interface HomeIndicatorProps { /** bronze on chat surfaces, dark on result frames / confirm sheets. */ tone?: 'bronze' | 'dark'; }
export function HomeIndicator(props: HomeIndicatorProps): JSX.Element;


/* ==============================================================================================
   components/shell/MotionGuard.d.ts
   ============================================================================================== */

export interface MotionGuardProps {
  /** None. It renders nothing; the props exist so the contract is declarable. */
  children?: never;
}
/** The reduced-motion block, shipped in the bundle rather than only in `tokens/effects.css`.
 *  Installing on module evaluation is the point: loading `ds_bundle.js` is enough, so a consuming
 *  project that brings its own page styles still honours `prefers-reduced-motion`. Idempotent. */
export const REDUCED_MOTION_CSS: string;
/** Appends the block once, id `ds-reduced-motion`. Returns false if it was already there. */
export function installReducedMotion(doc?: Document): boolean;
/** Renders nothing. Only needed when the bundle is loaded lazily and you want the install tied to a React tree. */
export function MotionGuard(props?: MotionGuardProps): null;


/* ==============================================================================================
   components/shell/PathBar.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface PathStep {
  /** Stable identity, so re-ordering does not re-key the row. Falls back to `label`. */
  key?: string;
  /** The answer, as the advisor gave it: 'Equity', 'Mutual fund', 'Large Cap Fund'. Not the question
   *  — the question is in the step itself, and repeating it here would spend the one line twice. */
  label: string;
}

export interface PathBarProps {
  /** The answers so far, oldest first. Empty renders 'Nothing chosen yet' rather than an empty bar,
   *  because a bar with nothing in it reads as a component that failed to load. */
  steps?: PathStep[];
  /** Tapping a crumb reopens that step where it stands. The LAST crumb is not a control — tapping
   *  where you already are is the thing every breadcrumb gets wrong. */
  onStep?: (step: PathStep, index: number) => void;
  /** Shown only once there is something to clear. */
  onReset?: () => void;
  /** One control on the right — the filter pill, usually. Anything taller than 28pt will push the
   *  bar past the 36 it is allowed. */
  action?: React.ReactNode;
  /** Default true. Off for a specimen or a board. */
  sticky?: boolean;
}

/**
 * Where you are, in one line, without scrolling back for it.
 *
 * A funnel that appends down a long conversation eventually puts its own first question above the
 * fold, and changing the second answer should not be a scroll through everything that came after it.
 * The steps already collapse into their answers; this is how you reach one from anywhere.
 *
 * It is deliberately ONE line — 36pt — because nothing may permanently eat the height the
 * conversation is read in. It is also the only thing in the funnel that never scrolls away;
 * everything else is content and behaves like it.
 *
 * It truncates from the LEFT: the oldest crumbs collapse to a '…' that reopens the first step,
 * because the recent end of a path is the part being worked on.
 */
export function PathBar(props: PathBarProps): JSX.Element;


/* ==============================================================================================
   components/shell/PhoneFrame.d.ts
   ============================================================================================== */

/** @startingPoint section="Sentinel app" subtitle="Blank 375×812 phone shell" viewport="375x812" */
export interface PhoneFrameProps { children: React.ReactNode; }
export function PhoneFrame(props: PhoneFrameProps): JSX.Element;


/* ==============================================================================================
   components/shell/ScreenBackdrop.d.ts
   ============================================================================================== */

export interface ScreenBackdropProps {}
export function ScreenBackdrop(props: ScreenBackdropProps): JSX.Element;


/* ==============================================================================================
   components/shell/ScreenScaffold.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface ScreenScaffoldProgress {
  n: number;
  total: number;
  /** Dimmed while a detour is open over the journey. */
  dim?: boolean;
}

export interface ScreenScaffoldProps {
  /** The status bar's clock. Every specimen states a time. Default '3:04', which is the thread's;
   *  the rail's journey is a morning story and passes '10:12'. */
  time?: string;
  /** The top bar's title. One value in this product, and still a prop: a screen that needs a
   *  different one is a screen we have not designed yet, and it should have to say so. */
  title?: string;
  /** Opens the drawer. The menu is one of this product's only two ways out of a surface — the other
   *  is a new thread — so a screen that omits it builds a dead end. */
  onMenu?: () => void;
  /** Starts a new thread. The second of the two doors. */
  onNew?: () => void;
  /** `{ n, total, dim }` renders `ProgressRail` in the gutter between the bar and the body, with the
   *  8px below it that every rail already used. Omit it on a thread. */
  progress?: ScreenScaffoldProgress;
  /** Pinned between the bar and the body, outside the scroller — the only slot here that does not
   *  scroll away. The only thing that belongs in it is a state the whole screen is in: a journey
   *  paused behind the conversation (`DetourBanner`). NOT a place for what a message offered; that
   *  goes inside the turn (contradiction 60). */
  banner?: React.ReactNode;
  /** `'thread'` (default, 32 of the 37 measured instances) scrolls, is bottom-anchored, and owns the
   *  gutter and the `--stack` gap between turns. `'page'` does not scroll: children sit under the bar
   *  with their own padding and a spacer pushes the Dock to the floor. Home is the only page, and a
   *  page that needs to scroll is a thread. */
  body?: 'thread' | 'page';
  children?: React.ReactNode;
  /** Where the thread rests when `revision` changes. Ignored on a page.
   *   'newest'  the newest turn STARTS on screen, and ends on screen too when it fits. The default,
   *             and the reason this prop exists: sticking to the bottom scrolls the sentence off
   *             while it is being read.
   *   'bottom'  the end of the thread, for a specimen of a thread already read.
   *   number    that turn at the top, for a turn re-opened in place.
   *   ref       that ELEMENT at the top — what `ArtifactCard`'s contract asks for on expand. */
  anchor?: 'newest' | 'bottom' | number | React.RefObject<HTMLElement>;
  /** Bumped by the caller when the turns changed. The anchor fires on this and never on every
   *  render, so the caller's own expand/collapse scrolls are not fought. */
  revision?: number | string;
  /** Lets a caller drive the scroller it does not own — the two thread scrolls `ArtifactCard`'s
   *  contract assigns to the caller need it. */
  scrollRef?: React.RefObject<HTMLDivElement>;
  /** Chips above the composer, in the Dock's own slot. Home's starters are the only ones. */
  chips?: React.ReactNode;
  /** The composer. **Required**, and it is the whole point: rule 3 says nothing replaces it, and a
   *  required prop is how a rule survives the next screen. WHICH composer is the caller's decision —
   *  a rail step with `money` wants `MoneyComposer`. */
  composer: React.ReactNode;
  /** Where a thread rests when it does NOT fill the screen. Default 'bottom' — right for a thread of
   *  ANSWERS, where the newest should sit above the composer with the eye already on it. `'top'` is
   *  for a thread whose first turn is a QUESTION the advisor has to act on: the fund explorer opened
   *  with its asset-class card 228pt down a 562pt thread, under a screenful of nothing. Ignored when
   *  the content is taller than the thread, and ignored entirely for `body='page'`. */
  rest?: 'top' | 'bottom';
  /** Modal layers that belong to the SCREEN rather than to the thread — a filter sheet, an explainer,
   *  a confirm sheet, a drawer. A bottom sheet is `position:absolute; bottom:0`, and its nearest
   *  positioned ancestor decides what 'bottom' means: rendered among the thread's children it
   *  resolves against a scrolled content box, which is how the fund explorer's filter sheet came out
   *  half off the TOP of the screen. This slot is the scaffold's own relative root, the only box in a
   *  Sentinel screen that means 'the phone'. */
  overlay?: React.ReactNode;
}

/** THE PHONE, WITH THE COMPOSER GUARANTEED.
 *
 *  Rule 3 is "the composer is on every screen", and until 20 Sep 2026 it was kept by three
 *  hand-built shells that happened to agree: `thread.jsx:45-63`, `rail.jsx:87-105`, `home.jsx:45-83`,
 *  across **16 pages and 37 instances**. Diffed with the design-system prefix normalised away, the
 *  thread's and the rail's shells are the **same nineteen lines**, and differ in exactly three:
 *
 *  1. the rail hardcodes `StatusSpacer time="10:12"` where the thread takes a prop;
 *  2. the rail has a `ProgressRail` between the bar and the body;
 *  3. **the rail scrolls to the bottom.** `rail.jsx:85` is `e.scrollTop = e.scrollHeight` — precisely
 *     the behaviour `thread.jsx:17-45` exists to reject, and measured there. Looked at on
 *     `screens/journey-e/rebalance`: the rail opened on the middle of a list of targets, Sentinel's
 *     question scrolled off the top and the first card cut in half. Two shells agreeing by hand is
 *     how a fixed bug comes back in the copy.
 *
 *  Home is the one real variant, and it is a real one: no scroller at all. That is `body="page"`.
 *
 *  The Dock is not the caller's to place. That is what turns rule 3 from a convention into a
 *  structure — a fourth screen written tomorrow cannot omit it. */
export function ScreenScaffold(props: ScreenScaffoldProps): JSX.Element;


/* ==============================================================================================
   components/shell/ScreenStack.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface ScreenStackProps {
  /** Which screen is mounted. Any value that compares with `!==` — a string key is the usual choice.
   *  Changing it plays the transition; setting it to what it already is does nothing. */
  screen: unknown;
  /** Draws one screen. Called for the incoming screen and, while a transition runs, for the outgoing
   *  one — so it must render from the key alone and never from state the parent has already moved on. */
  render: (screen: any) => React.ReactNode;
  /** `forward` (default) sends the new screen in from the right and the old one out to the left.
   *  `back` plays the SAME two keyframes reversed and swapped, so the transition reads as going up
   *  rather than deeper. No third keyframe exists; see the component header for why. Captured at the
   *  moment `screen` changes, so changing this prop alone never moves anything. */
  direction?: 'forward' | 'back';
  /** Fires when the outgoing screen has been unmounted, i.e. `--dur-screen` after the change. Use it
   *  to restore scroll or focus, never to start the next transition. */
  onSettle?: (screen: any, from: any) => void;
}

/** Two screens in one slot, for as long as `--dur-screen`.
 *
 *  It owns which screen is mounted and nothing about how a screen moves: both keyframes are
 *  `tokens/effects.css`'s own and the duration is read from the token at run time, so the unmount can
 *  never happen before the animation it is waiting for. Under `prefers-reduced-motion` both keyframes
 *  are already redefined to a fade in place and the reversed direction is still a fade, so `back`
 *  needs no special case.
 *
 *  There is NO shared-element transition in this system. A card does not fly into a page; an artifact
 *  expands in place. This component moves whole screens or nothing. */
export function ScreenStack(props: ScreenStackProps): JSX.Element;


/* ==============================================================================================
   components/shell/ScrollToBottomButton.d.ts
   ============================================================================================== */

export interface ScrollToBottomButtonProps {
  /** Hidden but present: it fades and lifts rather than mounting, so it never shifts the layout.
   *  While hidden it is also out of the tab order and hidden from a screen reader — a control that
   *  cannot be seen and cannot be pressed should not be announced either. */
  show: boolean;
  onClick: () => void;
  /** Default "Go to the newest turn" — what the advisor wants, rather than where the scroll ends.
   *  It shipped in v9 with no name at all, which a screen reader announces as "button". */
  label?: string;
}
export function ScrollToBottomButton(props: ScrollToBottomButtonProps): JSX.Element;


/* ==============================================================================================
   components/shell/SectionStrip.d.ts
   ============================================================================================== */

import * as React from 'react';

export interface SectionStripSection {
  /** Matches the id of the section it jumps to. */
  id: string;
  /** One or two words — this row scrolls, and a sentence in a pill makes it scroll further. */
  label: string;
}

export interface SectionStripProps {
  sections: SectionStripSection[];
  /** The section currently on screen. The pill scrolls itself into view when this changes — a
   *  current-location indicator the advisor cannot see is not an indicator. */
  active?: string;
  onJump?: (id: string) => void;
  /** Accessible name for the group. Default 'Sections'. */
  label?: string;
}

/**
 * A sticky mini table of contents for a long page — the alternative to tabs on a fund page.
 *
 * A fund page is a cross-reference task (expense read against return, riskometer against what the
 * client holds), and tabs tax exactly that: users who switch back and forth to compare pay in
 * short-term memory and interaction cost. So the page is one scroll and this strip keeps it
 * navigable, showing where the reader currently is.
 *
 * NOT tabs, and must not read as them: tabs change what you are looking at, this changes where you
 * are in one thing. Rendered in the filter-pill vocabulary at 32px, with button roles rather than
 * `tablist`/`tab`, which would promise arrow-key movement between panels that do not exist.
 *
 * The caller owns the scroll spy and passes `active`. This component does not observe the page —
 * the page knows where its sections are, and two observers is two answers to one question.
 */
export function SectionStrip(props: SectionStripProps): JSX.Element | null;


/* ==============================================================================================
   components/shell/StatusSpacer.d.ts
   ============================================================================================== */

export interface StatusSpacerProps {
  /** The clock. Defaults to '9:41', the fixed specimen time every board and spec page renders, so
   *  passing nothing is the old behaviour exactly. Pass a real one only where the screen states a time
   *  of day — a greeting that reads "good evening" over a 9:41 clock is the screen contradicting
   *  itself, which is how this prop was found. */
  time?: string;
}
export function StatusSpacer(props: StatusSpacerProps): JSX.Element;


/* ==============================================================================================
   components/shell/TopBar.d.ts
   ============================================================================================== */

export interface TopBarProps { onMenu?: () => void; onNew?: () => void; /** Centre pill label; "Sentinel" in the app. */ title?: string; }
export function TopBar(props: TopBarProps): JSX.Element;


/* ==============================================================================================
   components/text/Eyebrow.d.ts
   ============================================================================================== */

export interface EyebrowProps { children: React.ReactNode; /** Text colour; default muted. Use var(--color-bronze-deep) inside peach callouts. */ color?: string; style?: React.CSSProperties; }
export function Eyebrow(props: EyebrowProps): JSX.Element;


/* ==============================================================================================
   components/text/EyebrowDivider.d.ts
   ============================================================================================== */

export interface EyebrowDividerProps { children: React.ReactNode; }
export function EyebrowDivider(props: EyebrowDividerProps): JSX.Element;


/* ==============================================================================================
   components/text/Provenance.d.ts
   ============================================================================================== */

export interface ProvenanceProps { /** e.g. "As of 15 Sep · from her September statement" */ text: string; }
export function Provenance(props: ProvenanceProps): JSX.Element;


/* ==============================================================================================
   components/text/StandingDisclosure.d.ts
   ============================================================================================== */

export interface StandingDisclosureProps {
  /** Compliance copy. Default: "Sentinel assists an advisor · not investment advice" — one line.
   *  [PLACEHOLDER — compliance to supply]: the wording is a stand-in; replacement copy must also fit one line. */
  text?: string;
}
export function StandingDisclosure(props: StandingDisclosureProps): JSX.Element;
