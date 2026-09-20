export interface DockProps {
  /** DEPRECATED BY A RULING, 18 Sep 2026 — do not use on a screen with a conversation on it. The owner:
   *  what an advisor is offered must live IN the conversation and scroll with it, not sit pinned above
   *  the composer. What a message offered belongs beside that message; pinned, it outlives the turn it
   *  came from and an advisor scrolling back cannot tell which answer it belonged to. Put AnswerChips in
   *  the turn — `SentinelTurn chips` — instead.
   *
   *  THE ONE EXCEPTION IS A SCREEN WITH NO CONVERSATION ON IT — Home. The ruling moves what a MESSAGE
   *  offered into that message, so a screen that has no message has nothing for its chips to sit under,
   *  and no scroll for them to outlive (Home has no scroller at all — measured). Starters above the
   *  composer there are `readme.md:187`'s "Dock pills act on the current state of the conversation, and
   *  they persist" in its only remaining case: the current state is "nothing asked yet". `check-previews`
   *  fails any other page that passes this.
   *
   *  `cta` WAS THE THIRD SLOT AND IT IS DELETED (20 Sep 2026). It had no exception: no screen in this
   *  product pins a decision, and a decision belongs under the thing it decides about. It outlived the
   *  ruling by two days only because `ui_kits/` passed it in six artboards and the kit is not edited
   *  lightly; the kits were redrawn on `SentinelTurn` the same day it went. Use `SentinelTurn cta`. */
  chips?: React.ReactNode;
  /** DEPRECATED BY THE SAME RULING, and it has NO exception: Home's starters are chips, and no screen
   *  in this product pins a decision. `screens/` has zero consumers and the gate keeps it that way.
   *  A decision belongs under the thing it decides about. */
  cta?: React.ReactNode;
  /** Composer or MoneyComposer — required on every screen. RULE 3 IS UNCHANGED: the composer is docked,
   *  always present, and nothing replaces it. The ruling moved the chips and the CTA, never this. */
  composer: React.ReactNode;
  disclosure?: boolean;
}
export function Dock(props: DockProps): JSX.Element;