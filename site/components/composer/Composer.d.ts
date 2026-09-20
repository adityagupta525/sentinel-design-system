export interface ComposerProps { value: string; onChange: (v: string) => void; onFocus?: () => void; onSend?: () => void; /** Context placeholders: home "Ask Sentinel" · thread "Ask Sentinel" · answer "or type your answer" · artifact "Ask about this" · sheet "Ask a follow-up". The artifact case was written "canvas" until v12; that surface was removed from the product in v5 and the placeholder outlived its name (same drift as F-13).
   *  HOME SHORTENED 19 Sep 2026: it read "Ask Sentinel about a client, a fund, or a plan", which is three
   *  examples sitting 55pt under three starter chips that are the same three examples with client names on
   *  them. This map was written before Home had chips. The chips carry the examples; the placeholder names
   *  the product once. */ placeholder?: string;
  /** THE CLIENT THIS THREAD IS ABOUT — a `<ClientChip>`, above the field. `ClientChip` has described
   *  itself as "composer-resident" since v9 and the composer had no slot for it, so the chip was on no
   *  screen and its contract was a promise with nowhere to land. Selection and typing resolve to the
   *  same state: picking from the WHO step and typing "Meera" both end here. Omit it and the composer
   *  renders exactly as before. */
  bound?: React.ReactNode;
  autoFocus?: boolean; /** Send disabled, Stop square in the send slot. */ streaming?: boolean; onStop?: () => void;
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
