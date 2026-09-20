export interface ScrollToBottomButtonProps {
  /** Hidden but present: it fades and lifts rather than mounting, so it never shifts the layout.
   *  While hidden it is also out of the tab order and hidden from a screen reader — a control that
   *  cannot be seen and cannot be pressed should not be announced either. */
  show: boolean;
  onClick: () => void;
  /** Default "Go to the newest turn" — what the advisor wants, rather than where the scroll ends.
   *  It shipped in v9 with no name at all, which a screen reader announces as "button". */
  label?: string;
}
export function ScrollToBottomButton(props: ScrollToBottomButtonProps): JSX.Element;
