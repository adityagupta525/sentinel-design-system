import * as React from 'react';

export interface StepBlockProps {
  /** 1-based position in the funnel. Rendered as a numeral while the step is unanswered and as a
   *  tick once it is — a shape and a figure, never a colour on its own. Omit for a block that is
   *  not part of a numbered sequence. */
  step?: number;
  /** The question, in the advisor's words: "Asset class", "Product", "Category". */
  title: string;
  /** The answer, as the chips the advisor chose. Shown only while collapsed: while the step is open
   *  the selector beneath is already showing them, and printing them twice is noise. Beyond
   *  `maxChips` the remainder becomes `+N` — a count, never a fade, because a count is legible and a
   *  gradient over the fourth chip is a guess. */
  chips?: string[];
  /** The answer when it is a sentence rather than a set — "Parag Parikh Flexi Cap". Ignored when
   *  `chips` is non-empty. */
  summary?: React.ReactNode;
  /** The step has an answer. Drives the tick. A step can be `done` and closed, which is the resting
   *  state of every step above the one being worked on. */
  done?: boolean;
  /** Open. Controlled — the funnel owns which step is open, because opening one closes the others
   *  and a component cannot know that. */
  open?: boolean;
  onToggle?: () => void;
  /** Default 3. */
  maxChips?: number;
  /** How many rows this step's answer yields, shown on the right of the collapsed row: `24 funds`.
   *  This is the count the research found to be the highest-impact element of any filter interface —
   *  it is what saves the advisor a tap to find out. Omit when genuinely unknown; never pass 0 to
   *  mean "no feed", which is a lie about an empty shelf. */
  count?: number;
  /** What `count` counts. Default 'funds'. */
  unit?: string;
  /** The selector, list or panel this step opens. Stays mounted while closed so a half-made
   *  selection survives the advisor glancing at the step above. */
  children?: React.ReactNode;
  /** Base for the generated body id, for pages that need a stable one. */
  id?: string;
}

/**
 * A step of a funnel that collapses into its own answer.
 *
 * The explorer asks four questions in order and the owner's ruling is that all four live on one
 * screen with nothing opening a second. That only works if an answered question stops taking a
 * screenful — so a step collapses to one row carrying the answer, and the row is the control that
 * opens it again. The funnel then reads as a sentence down the screen, and changing any word of it
 * is one tap on that word.
 *
 * It grows from its own row rather than sliding in: `grid-template-rows: 0fr → 1fr`, which needs no
 * measurement and no max-height guess and does not jump when the content changes size. That is the
 * one expansion this system allows — an artifact expands in place, and there is no shared-element
 * transition.
 */
export function StepBlock(props: StepBlockProps): JSX.Element;

export interface StepStackProps { children?: React.ReactNode; }
/** The funnel's own spacing — `--space-8`, because these are steps of one question rather than
 *  separate messages in a thread, which take `--stack`. */
export function StepStack(props: StepStackProps): JSX.Element;
