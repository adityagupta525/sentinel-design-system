export interface UserTurnProps {
  /** What the advisor said. */
  text: string;
  /** Default true. False for a turn in the history — an answered question is not re-editable in place. */
  editable?: boolean;
  /** The answer is still arriving. Withdraws the actions: editing a question Sentinel is halfway
   *  through answering would leave the answer below it belonging to a sentence that no longer exists. */
  busy?: boolean;
  /** What re-sending this costs, said BEFORE it is sent — "Sending this replaces the review below it."
   *  A turn that quietly replaces the work under it is the defect this line exists to prevent. */
  costNote?: string;
  /** The edited text, on save. The caller decides what re-sending means; this component only edits. */
  onSave?: (text: string) => void;
  /** A cancelled edit restores the original and discards nothing, because nothing had changed yet. */
  onCancel?: () => void;
  /** Default true. False where the action row would be the only thing on a frozen specimen. */
  actions?: boolean;
}
/** THE USER'S HALF OF A TURN. `UserBubble` and `MessageActions` are the two halves and this is the
 *  pairing, with the edit state that pairing needs. Promoted from `screens/journey-b/thread.jsx` on
 *  20 Sep 2026, where the same twelve lines served every journey in the product.
 *
 *  Sentinel's half is `SentinelTurn`. A thread is those two, alternating, and nothing else. */
export function UserTurn(props: UserTurnProps): JSX.Element;
