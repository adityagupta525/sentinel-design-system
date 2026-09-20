export interface AttachmentFile {
  name: string;
  size?: number;
  /** TRUE when the VIEWER picked it rather than the specimen supplying it. Everything honest about
   *  this component hangs off this flag: a picked file gets no summary, no completed stages, and a
   *  `ParseNote` saying so. */
  picked?: boolean;
}
export interface AttachmentTurnProps {
  /** Null renders nothing — a caller can pass its attachment state straight through. */
  file: AttachmentFile | null;
  /** What the advisor said when they attached it. It is a `UserBubble`, because attaching is saying. */
  caption?: string;
  /** The stages for a SUPPLIED file: completed work with names on it. */
  stages?: unknown;
  /** The stages for a PICKED file: the same steps, pending. Falls back to `stages`. */
  pendingStages?: unknown;
  /** The one-line result — "Read his Q3 statement · 14 pages · 18 holdings". NEVER shown for a picked
   *  file: a holdings count over somebody's own PDF is a fabricated figure. */
  summary?: string;
  /** Overrides the default note shown under a picked file. */
  note?: string;
  onRemove?: () => void;
}
/** A FILE THE ADVISOR ATTACHED, AS A TURN — caption, the file, and the note that keeps it honest.
 *  Promoted from `screens/journey-b/thread.jsx` on 20 Sep 2026, where every screen used the same ten
 *  lines. The paperclip is real on every screen in this product (the owner's ruling, 19 Sep); this is
 *  what it produces. */
export function AttachmentTurn(props: AttachmentTurnProps): JSX.Element | null;
