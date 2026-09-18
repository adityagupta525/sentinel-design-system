export interface SentinelBlockProps {
  children: React.ReactNode;
  /** Pulses the label while thinking. */
  shimmer?: boolean;
  label?: string;
  /** Drop the "✦ Sentinel" signature — for every block after the first IN THE SAME TURN. A turn is often
   *  the trace and then the answer, and each block used to sign itself, so the name appeared twice for one
   *  thing Sentinel said. Say it once, at the top of the turn. */
  continued?: boolean;
}
export function SentinelBlock(props: SentinelBlockProps): JSX.Element;
