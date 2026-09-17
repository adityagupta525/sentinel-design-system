export interface StatTileProps {
  /** Sentence case, 12px muted. */
  label: string;
  /** The headline figure, display face. */
  value: string;
  /** One qualifying line — "in a 20% fall", "exit load + STCG". */
  note?: string;
  /** Optional <Sparkline points={…} />. */
  sparkline?: React.ReactNode;
  /** A figure supplied elsewhere: chip surface, de-emphasis value. Use with [PLACEHOLDER — … to supply]. */
  locked?: boolean;
}
export function StatTile(props: StatTileProps): JSX.Element;
export interface SparklineProps { points: number[]; width?: number; height?: number }
export function Sparkline(props: SparklineProps): JSX.Element;
