export interface BadgeProps {
  children: React.ReactNode;
  /** status = 10px uppercase bold on the status token pairs · meta = 11px medium, chip bg, line ring. */
  variant?: 'status' | 'meta';
  /** status only. Always ships with a word — colour never signals alone. */
  tone?: 'over' | 'under' | 'ok';
}
/** Not interactive — no onClick. Exempt from the 44px touch-target rule for that reason. If it must be a target, use Pill. */
export function Badge(props: BadgeProps): JSX.Element;
