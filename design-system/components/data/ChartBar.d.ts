export interface ChartBarDatum {
  label: string;
  value: number;
  /** Per-bar role override — `status` for the one bar that crossed a limit. Never a category colour. */
  tone?: 'ramp' | 'muted' | 'status';
}
export interface ChartBarProps {
  bars: ChartBarDatum[];
  /** 'vertical' for time, 'horizontal' for comparison. Default horizontal. */
  orientation?: 'vertical' | 'horizontal';
  density?: 'peek' | 'expanded';
  tone?: 'ramp' | 'muted' | 'status';
  width?: number;
  valueFormat?: (v: number) => string;
  /** Growth animation: scaleY from the bottom (scaleX from the left when horizontal), 480ms, 60ms stagger. */
  run?: boolean;
  /** A caveat that belongs AT the number — "These percentages are rounded for simplicity". Monzo's rule. */
  caveat?: string;
}
/** Bars are ONE colour (ramp 1), because every bar sits on the page and only ramp 1 clears 3:1 against
 *  it. Rank is carried by length, the strongest channel available. 24px max thickness, 4px rounded at
 *  the data end, square at the baseline, values direct-labelled in tabular figures, track hairlined. */
export function ChartBar(props: ChartBarProps): JSX.Element;
