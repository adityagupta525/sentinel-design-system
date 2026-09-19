import type { ChartSeries } from '../data/ChartLine';
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
  series?: ChartSeries[];
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
