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
