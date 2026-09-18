export interface ExplainerSheetProps {
  open: boolean;
  /** Also the dialog's accessible name — it is what a screen reader announces when the sheet opens,
   *  so it must name the term being explained, never "Info" or "Details". */
  title: string;
  /** One paragraph per entry. An array rather than a string so a sheet cannot smuggle in a heading,
   *  a list or a link; two paragraphs is the working limit, and a third belongs in the thread. */
  body: string[];
  /** Called by the scrim, by "Got it" and by Escape. The caller owns `open`, so a sheet never
   *  half-closes. */
  onClose: () => void;
}
/** The definition, on demand. role="dialog" aria-modal, labelled by `title`; Escape closes it; focus
 *  moves into the sheet when it opens and returns to whatever opened it when it closes.
 *
 *  It does NOT trap Tab — focus can still walk out of the sheet into the content behind the scrim.
 *  That is logged (F-25) rather than fixed here, because a trap needs a decision about what to do at
 *  the boundary and this sheet has exactly one control in it.
 *
 *  Never put a decision in it. "Got it" is the only way out besides the scrim, and it is not a word
 *  anyone should tap to approve money — a decision belongs in the Dock's CTA (rule 3). */
export function ExplainerSheet(props: ExplainerSheetProps): JSX.Element | null;
