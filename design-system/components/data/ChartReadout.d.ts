export interface ChartReadoutProps {
  /** The x label at the touch position — or the latest x when idle. */
  label: string;
  /** The value, 13px ink, tabular figures. */
  value: string;
  /** True while the finger is down: the value goes ink, the chart draws its crosshair. */
  active?: boolean;
  /** Shown in place of `label` when there is nothing to name yet. */
  idleNote?: string;
}
/** A fixed 22px row above the plot, reserved even when idle — never a floating box under the thumb,
 *  which during a scrub covers the mark being read. */
export function ChartReadout(props: ChartReadoutProps): JSX.Element;
