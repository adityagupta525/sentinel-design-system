export interface StepComposerProps {
  /** The question asks for an amount. Renders `MoneyComposer`, which reads what is typed AS MONEY —
   *  a text composer under "how much is he putting in?" accepts "two and a half lakh" and hands back
   *  a string nothing can add up. */
  money?: boolean;
  /** Default "or type your answer" — the wording that says the chips are the fast path and typing is
   *  still open. */
  placeholder?: string;
  /** Default "or type the amount". */
  moneyPlaceholder?: string;
  /** The text, or the formatted rupee string from `MoneyComposer`. */
  onSend?: (text: string) => void;
  /** The paperclip. Real on every screen (the owner's ruling, 19 Sep) — `MoneyComposer` has none, and
   *  that is deliberate: an amount is typed, not attached. */
  onAttach?: (file: File) => void;
}
/** THE COMPOSER A QUESTION ASKS FOR, and the other half of rule 3. The composer is always present;
 *  WHICH composer is a property of the step. Promoted from `screens/journey-a/rail.jsx` on
 *  20 Sep 2026, where three journeys were each deciding it again. */
export function StepComposer(props: StepComposerProps): JSX.Element;
