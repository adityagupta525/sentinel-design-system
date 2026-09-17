export type MessageAction = 'copy' | 'edit' | 'retry';
/** Actions under the LAST message only — at 375pt, a row under every turn is noise.
 *  Text at 11.5px `--color-muted`, never pills: ghost pills here would compete with the chip row below. */
export interface MessageActionsProps {
  /** 'user' → right-aligned, defaults to ['edit']. 'assistant' → left-aligned, defaults to ['copy','retry']. */
  role: 'user' | 'assistant';
  actions?: MessageAction[];
  /** Receives the action key. `edit` on a journey answer IS Edit on that decision: it must warn what it
   *  costs ("Editing this reopens question 7. The four answers after it will be asked again.") before
   *  discarding anything. Silent data loss is not acceptable in an advisory tool. */
  onAction?: (action: MessageAction) => void;
}
export function MessageActions(props: MessageActionsProps): JSX.Element;
