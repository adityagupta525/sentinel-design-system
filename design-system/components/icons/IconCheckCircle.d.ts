export interface IconCheckCircleProps {
  /** Stroke colour; defaults to var(--color-status-ok-fg). */
  stroke?: string;
  /** Rendered box in px. 20 is the system size; stroke stays 1.5 on the 24px grid. */
  size?: number;
}
export function IconCheckCircle(props: IconCheckCircleProps): JSX.Element;
