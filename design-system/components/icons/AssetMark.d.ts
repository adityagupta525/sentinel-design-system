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
