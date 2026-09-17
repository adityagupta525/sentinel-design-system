import type { ChartSeries } from '../data/ChartLine';
export interface InfoCardStat {
  /** "CAGR 1Y", "Max drawdown 1Y" — named so the ⓘ's label reads "How is CAGR 1Y worked out?". */
  label: string;
  value: string;
  /** This one figure has no confirmed owner — renders as —— while the rest of the card works. */
  locked?: boolean;
}
export interface InfoCardProps {
  name: string;
  meta?: string;
  /** The headline figure, in the display face. */
  figure?: string;
  figureNote?: string;
  series?: ChartSeries[];
  range?: string;
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
