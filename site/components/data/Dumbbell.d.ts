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
  /** Sits BESIDE its value, never instead of it (F-46). Pass the NAME only — the component prints
   *  the number, so `actualLabel="This fund"` renders "This fund 23.1%" and `"This fund 23.1%"`
   *  renders it twice. */
  targetLabel?: string;
  actualLabel?: string;
  /** What the pair means. `'move'` (default) is what this component was built for — from what is to
   *  what was agreed — and prints the target with a leading arrow. `'against'` is the comparison case
   *  the `target` doc above already allows, where the hollow dot is a benchmark or a category average:
   *  two measurements of different things, with nothing travelling between them. It drops the arrow
   *  and changes nothing else. */
  relation?: 'move' | 'against';
}
export function Dumbbell(props: DumbbellProps): JSX.Element;
