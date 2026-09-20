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
