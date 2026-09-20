export interface UserBubbleProps {
  /** The question. While `editing` it is the field's value — this is a CONTROLLED field, so the caller
   *  owns the half-typed text and a re-render cannot silently discard it. */
  text: string;
  /** Edit in place, the way every other assistant does it — not a modal, and not the composer filling up
   *  behind the thread. The bubble becomes the field: same peach, same edge, same 14/19 semibold, corner
   *  un-tailed and width released. This is where `MessageActions role="user"`'s Edit has always led; until
   *  18 Sep 2026 there was no state at the end of it. */
  editing?: boolean;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onSave?: () => void;
  /** Words, never glyphs and never ghost pills — MessageActions' rule, one line up. */
  saveLabel?: string;
  cancelLabel?: string;
  /** What sending the edit will DESTROY, said before it is destroyed — "Sending this replaces the answer
   *  below it." MessageActions' contract has required this warning since v1 and had nowhere to render it.
   *  Silent data loss is not acceptable in an advisory tool. */
  costNote?: string;
  /** Accessible name of the field. Defaults to "Edit your question". */
  editLabel?: string;
}
export function UserBubble(props: UserBubbleProps): JSX.Element;