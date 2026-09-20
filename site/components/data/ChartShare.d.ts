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
