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
