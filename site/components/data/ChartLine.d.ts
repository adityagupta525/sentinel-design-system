export interface ChartPoint { x: number; y: number }
export interface ChartSeries {
  /** The end label's name, drawn under its value ON the plot. **Keep it to two short lines** — it is
   *  clamped at two and a third would be a name to shorten, not a layout to stretch. A card that has
   *  already named the benchmark in a sentence above should pass the ROLE here ("Benchmark"), not the
   *  full name again: "Nifty Smallcap 250 TRI" in 10px beside a line is the same fact twice. */
  label: string;
  points: ChartPoint[];
  /** Per-series override. Series 2 is drawn muted and dashed regardless — it is the benchmark role. */
  tone?: 'ramp' | 'muted' | 'status';
}
export interface ChartLineProps {
  /** One or two series. A third is ignored — three or more is `ChartLineMultiples`, not three colours. */
  series: ChartSeries[];
  /** 'peek' — the 96px card's sparkline strip: plot 72, one 14px end-label row, no axes, no readout.
   *  'expanded' — plot 180 + a 14px axis band. */
  density?: 'peek' | 'expanded';
  /** Data role, not a colour: ramp (the client's own money) · muted (benchmark, prior period) · status (a crossed limit). */
  tone?: 'ramp' | 'muted' | 'status';
  /** Draws one dashed reference line. There are no other gridlines. */
  target?: { value: number; label?: string };
  width?: number;
  valueFormat?: (v: number) => string;
  xFormat?: (x: number) => string;
  /** Tap-and-drag scrubbing: adds the reserved ChartReadout row above the plot and a 1px crosshair. Ignored at peek. */
  scrub?: boolean;
  /** First-reveal draw-on. Set false to render the final state (in a card that has already animated). */
  run?: boolean;
  /** Explicit [min, max] — how small multiples share one scale. Omit and the domain is niced from the data. */
  domain?: [number, number];
}
export function ChartLine(props: ChartLineProps): JSX.Element;
/** Three or more series: one chart per series on a shared scale, stacked down the card. */
export function ChartLineMultiples(props: { series: ChartSeries[]; width?: number; valueFormat?: (v: number) => string; xFormat?: (x: number) => string; tone?: 'ramp' | 'muted' | 'status' }): JSX.Element;
