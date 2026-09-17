export interface ResponseFeedbackProps {
  /** Controlled rating. Omit to let the component own it. */
  value?: 'up' | 'down' | null;
  onRate?: (value: 'up' | 'down' | null) => void;
  /** Fires when a reason chip is picked. Down-votes without a reason are the least useful signal there is. */
  onReason?: (reason: string) => void;
  /** Reason chips shown after a down-vote. Four at most — this is a between-meetings interaction. */
  reasons?: string[];
  /** Optional line about where the signal goes. */
  note?: string;
}
/** Marking an answer wrong — the affordance Sentinel had nowhere. Two drawn thumbs at the icon set's
 *  24px grid (no emoji), confirmation ON the control that was pressed (the no-toasts law), and an
 *  asymmetry that is deliberate: up is one tap, down opens a short reason row, because the reason is
 *  the whole value of the signal. Reasons are chips, not a text field. */
export function ResponseFeedback(props: ResponseFeedbackProps): JSX.Element;
