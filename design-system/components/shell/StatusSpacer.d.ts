export interface StatusSpacerProps {
  /** The clock. Defaults to '9:41', the fixed specimen time every board and spec page renders, so
   *  passing nothing is the old behaviour exactly. Pass a real one only where the screen states a time
   *  of day — a greeting that reads "good evening" over a 9:41 clock is the screen contradicting
   *  itself, which is how this prop was found. */
  time?: string;
}
export function StatusSpacer(props: StatusSpacerProps): JSX.Element;
