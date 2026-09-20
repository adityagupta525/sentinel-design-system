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
