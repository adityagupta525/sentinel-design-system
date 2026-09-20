export interface FigureRowSub {
  label: string;
  value: string;
  /** Rule 2 applies here too: `'over'` is TEXT colour, never a fill. */
  tone?: 'ink' | 'over';
}

export interface FigureRowProps {
  /** The thing being measured, on the left. */
  label: string;
  /** The figure, on the right, on the same baseline. **Tabular figures are set here and not by the
   *  caller** — rule 4 asks for them on anything that changes, and four call sites remembering
   *  independently is four chances to forget. Indian grouping and one decimal stay the caller's;
   *  the book's `inr()` does that. */
  value: string;
  /** A second, quieter pair under the first — the rule under the target, the average under the
   *  total. Always `quiet`: a card with two strong rows has not decided what it is saying. */
  sub?: FigureRowSub;
  /** `'strong'` for the row that carries the answer, `'quiet'` for the one that qualifies it.
   *  Default 'strong'. */
  weight?: 'strong' | 'quiet';
  /** Rule 2. A figure the product cannot stand behind — an uncosted move — states its reason in
   *  `--color-status-over-fg` TEXT, on whatever surface it is already on. This component never
   *  paints a background. */
  tone?: 'ink' | 'over';
}

/** A LABEL AND ITS FIGURE, ON ONE BASELINE.
 *
 *  Four hand-written instances across three screens — `moves.jsx:70`, `rebalance.jsx:30` and `:34`,
 *  `review.jsx:46` — all the same declaration (flex, `align-items: baseline`, `space-between`,
 *  `--space-8`), and all four setting `fontVariantNumeric: 'tabular-nums'` on the right-hand span by
 *  hand.
 *
 *  **Not the figure/caption pair.** `InfoCard` sets its figure and `figureNote` on one baseline and
 *  that is a different mark — one number and its period. This is a label and its figure, two things
 *  at the two ends of a row. */
export function FigureRow(props: FigureRowProps): JSX.Element;
