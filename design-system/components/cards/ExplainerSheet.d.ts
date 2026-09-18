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
 *  Tab is trapped and wraps at the boundary: Tab on the last control goes to the first, Shift+Tab on
 *  the first goes to the last, so with one control both keys keep "Got it". The trap is armed by the
 *  same `false → true` transition that moves focus in, and never for a sheet mounted already open —
 *  a spec page's static specimens are pictures of a dialog, not dialogs, and must not take the page's
 *  keyboard. Until F-25 was closed, aria-modal said there was nothing outside while a keyboard could
 *  still walk out behind the scrim.
 *
 *  Never put a decision in it. "Got it" is the only way out besides the scrim, and it is not a word
 *  anyone should tap to approve money — a decision belongs in the Dock's CTA (rule 3). */
export function ExplainerSheet(props: ExplainerSheetProps): JSX.Element | null;
