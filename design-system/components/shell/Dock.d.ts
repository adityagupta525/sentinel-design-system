export interface DockProps {
  /** DEPRECATED BY A RULING, 18 Sep 2026 — do not use on new screens. The owner: chips and the CTA must
   *  live IN the conversation and scroll with it, not sit pinned above the composer. What an advisor is
   *  offered belongs beside the message that offered it; pinned, it outlives the turn it came from and
   *  the screen reads as a toolbar. Use `InlineActionRow` (or AnswerChips placed in the thread) and a
   *  `DarkButton full` under the message instead. The slot stays so the journey rail, which asks one
   *  question at a time and answers it in place, can be migrated deliberately rather than broken.
   *
   *  THE ONE EXCEPTION IS A SCREEN WITH NO CONVERSATION ON IT — Home. The ruling moves what a MESSAGE
   *  offered into that message, so a screen that has no message has nothing for its chips to sit under,
   *  and no scroll for them to outlive (Home has no scroller at all — measured). Starters above the
   *  composer there are `readme.md:187`'s "Dock pills act on the current state of the conversation, and
   *  they persist" in its only remaining case: the current state is "nothing asked yet". */
  chips?: React.ReactNode;
  /** DEPRECATED BY THE SAME RULING. A decision belongs under the thing it decides about. */
  cta?: React.ReactNode;
  /** Composer or MoneyComposer — required on every screen. RULE 3 IS UNCHANGED: the composer is docked,
   *  always present, and nothing replaces it. The ruling moved the chips and the CTA, never this. */
  composer: React.ReactNode;
  disclosure?: boolean;
}
export function Dock(props: DockProps): JSX.Element;