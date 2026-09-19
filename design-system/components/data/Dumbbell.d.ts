export interface DumbbellProps {
  label?: string;
  /** The hollow dot — what was agreed, or the benchmark. */
  target: number;
  /** The filled dot — what is. */
  actual: number;
  /** The low end of the scale. **Default 0**, so every caller written before this draws what it drew:
   *  the rebalance's equity shares, where 0% equity is a real position. Pass it when the zero is not
   *  meaningful for the quantity — two funds at 23.1% and 21.6% against a 16.8% benchmark put both
   *  dumbbells in the right quarter of a 0–25 track and the difference between the two gaps, which is
   *  the whole reason the chart is there, came out at 19px of 315. The system already scales a series
   *  to its data rather than to zero (`chartMath.niceDomain`, `ChartLine`), and the safeguard is the
   *  same: every figure here is direct-labelled, so the picture never carries a number on its own. */
  min?: number;
  /** The high end. Default 100. */
  max?: number;
  /** Sits BESIDE its value, never instead of it (F-46). */
  targetLabel?: string;
  actualLabel?: string;
}
export function Dumbbell(props: DumbbellProps): JSX.Element;
