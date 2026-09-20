export interface IconFileProps {
  /** Stroke colour; defaults to var(--color-muted). */
  stroke?: string;
  /** Rendered box in px. 20 is the system size; stroke stays 1.5 on the 24px grid. */
  size?: number;
}
export function IconFile(props: IconFileProps): JSX.Element;
