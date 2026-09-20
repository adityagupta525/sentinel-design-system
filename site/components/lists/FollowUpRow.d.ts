export interface FollowUp {
  /** The question as the advisor would ask it. Wraps to two lines freely — that is the point. */
  question: string;
  /** One line of why it is worth asking. GitHub Copilot's two-line card, in our geometry. */
  note?: string;
  leading?: React.ReactNode;
}
export interface FollowUpRowProps {
  /** Strings or FollowUp objects. */
  items: Array<string | FollowUp>;
  label?: string;
  onAsk?: (question: string) => void;
  /** A leading icon for every row — Agoda's pattern. Per-item `leading` overrides it. */
  leading?: React.ReactNode;
}
/** THE RULE: a follow-up that exceeds one line becomes a row, not a pill. Pill keeps the short ones.
 *  Rows are inline — they belong to the message that produced them and scroll away with it — so they
 *  sit in the thread under the answer, never in the dock, which is for what persists. */
export function FollowUpRow(props: FollowUpRowProps): JSX.Element | null;
