export interface ComposerProps { value: string; onChange: (v: string) => void; onFocus?: () => void; onSend?: () => void; /** Context placeholders: home "Ask Sentinel about a client, a fund, or a plan" · thread "Ask Sentinel" · answer "or type your answer" · artifact "Ask about this" · sheet "Ask a follow-up". The artifact case was written "canvas" until v12; that surface was removed from the product in v5 and the placeholder outlived its name (same drift as F-13). */ placeholder?: string; autoFocus?: boolean; /** Send disabled, Stop square in the send slot. */ streaming?: boolean; onStop?: () => void;
  /** THE PAPERCLIP, MADE REAL (18 Sep 2026). Receives the chosen File; the disc becomes a button with a
   *  hidden file input behind it. Omit it and the disc renders exactly as it always has — a control that
   *  is announced and does nothing is worse than a drawing that is honest about being one. What the file
   *  becomes in the thread is `FileUpload`, which has carried the staged parse since v7 with no way in. */
  onAttach?: (file: File) => void;
  /** Accessible name of the attach button. Defaults to "Attach a file". */
  attachLabel?: string;
  /** Passed to the input, e.g. ".pdf,.csv". Omit to accept anything. */
  accept?: string;
}

export function Composer(props: ComposerProps): JSX.Element;
