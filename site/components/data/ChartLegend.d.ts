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
