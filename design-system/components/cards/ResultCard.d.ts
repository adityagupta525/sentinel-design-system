export type ResultJourney = 'proposal' | 'review' | 'rebalance';
/** draft → saved on Save. saved → sent only after the confirm step completes — never on the primary
 *  press itself, because the press opens the confirm rather than committing. */
export type ResultState = 'draft' | 'saved' | 'sent';

export interface ResultCardProps {
  journey: ResultJourney;
  /** Default 'draft'. */
  state?: ResultState;
  title: string;
  /** REQUIRED — "As of 15 Sep · from her September statement". A result an advisor may have to defend
   *  without a source is a number the client can ask about and the advisor cannot answer. */
  provenance: string;
  /** One or two sentences in the product's voice, above the content. */
  summary?: string;
  /** 'saved' and 'sent' only — renders a Badge variant="meta" reading "Saved · 16 Sep". */
  savedAt?: string;
  /** The table, the chart or the move list. */
  children: React.ReactNode;
}
/** The end state of a proposal, review or rebalance, on the artifact card. Always expanded: the
 *  advisor arrived here to read it, and the thread carries the scroll. */
export function ResultCard(props: ResultCardProps): JSX.Element;

export interface ResultActionsProps {
  state?: ResultState;
  onSave?: () => void;
  /** Receives the format string. Wraps DownloadAction, so the wait, the in-place confirmation and the
   *  "Try again" failure wording are the ones every other download in the product uses. */
  onDownload?: (format: string) => void | Promise<void>;
  /** Default 'PDF'. */
  format?: string;
  /** Default 'Save'. */
  saveLabel?: string;
}
/** The secondary pills — Save and Download. NOT inside the card, and — since the ruling of 18 Sep 2026 —
 *  NOT in the Dock either: they go in the turn, under the card they act on, and scroll away with it.
 *  This doc said "the Dock's `chips` slot" until 19 Sep, when Journey D became this component's first
 *  consumer and the contract was found still describing the pre-ruling dock. Rule 3 is untouched: the
 *  composer stays docked and nothing replaces it. */
export function ResultActions(props: ResultActionsProps): JSX.Element;

export interface ResultPrimaryProps {
  journey: ResultJourney;
  state?: ResultState;
  /** proposal only — the label reads "Send to Mr. Aggrawal". */
  client?: string;
  /** rebalance only — 1 gives "Approve the move", 2 gives "Approve both moves", 3+ "Approve all 3 moves". */
  moves?: number;
  /** Overrides the journey's derived label. Use it when the consequence is more specific than the
   *  default, never to shorten it: the label is what the advisor reads before taking responsibility. */
  label?: string;
  /** Opens the CONFIRM STEP. It does not send, fix or place anything — §4.2. Disclosure above the
   *  numbers, the compliance status rows, then the commit. */
  onPrimary?: () => void;
  /** 'sent' only — appended to the success line. */
  sentAt?: string;
}
/** The one dark CTA — in the TURN, under the card it commits, not in the Dock (ruling, 18 Sep 2026; this
 *  doc said `cta` slot until 19 Sep). At state='sent' it becomes the success state: a drawn check, a
 *  timestamp and a settlement line. Success is a drawn check, never confetti.
 *
 *  THE SUCCESS LINE SAYS THE CLIENT HAS IT, AND NOTHING MORE. What happened to the money differs by
 *  journey — a rebalance placed it, a proposal did not — so the consequence is a sentence the screen
 *  writes in the turn beneath. Journey D does exactly that, and says the opposite of Journey B's. */
export function ResultPrimary(props: ResultPrimaryProps): JSX.Element;
