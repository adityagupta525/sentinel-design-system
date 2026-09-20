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
