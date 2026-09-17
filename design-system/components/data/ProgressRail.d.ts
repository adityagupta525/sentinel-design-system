export interface ProgressRailProps {
  n: number;
  total: number;
  /** Detour state — dims the rail to 40%. The label is never dimmed; do not wrap the rail in a parent opacity. */
  dim?: boolean;
}
export function ProgressRail(props: ProgressRailProps): JSX.Element;
