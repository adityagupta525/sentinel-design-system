import * as React from 'react';

export interface PathStep {
  /** Stable identity, so re-ordering does not re-key the row. Falls back to `label`. */
  key?: string;
  /** The answer, as the advisor gave it: 'Equity', 'Mutual fund', 'Large Cap Fund'. Not the question
   *  — the question is in the step itself, and repeating it here would spend the one line twice. */
  label: string;
}

export interface PathBarProps {
  /** The answers so far, oldest first. Empty renders 'Nothing chosen yet' rather than an empty bar,
   *  because a bar with nothing in it reads as a component that failed to load. */
  steps?: PathStep[];
  /** Tapping a crumb reopens that step where it stands. The LAST crumb is not a control — tapping
   *  where you already are is the thing every breadcrumb gets wrong. */
  onStep?: (step: PathStep, index: number) => void;
  /** Shown only once there is something to clear. */
  onReset?: () => void;
  /** One control on the right — the filter pill, usually. Anything taller than 28pt will push the
   *  bar past the 36 it is allowed. */
  action?: React.ReactNode;
  /** Default true. Off for a specimen or a board. */
  sticky?: boolean;
}

/**
 * Where you are, in one line, without scrolling back for it.
 *
 * A funnel that appends down a long conversation eventually puts its own first question above the
 * fold, and changing the second answer should not be a scroll through everything that came after it.
 * The steps already collapse into their answers; this is how you reach one from anywhere.
 *
 * It is deliberately ONE line — 36pt — because nothing may permanently eat the height the
 * conversation is read in. It is also the only thing in the funnel that never scrolls away;
 * everything else is content and behaves like it.
 *
 * It truncates from the LEFT: the oldest crumbs collapse to a '…' that reopens the first step,
 * because the recent end of a path is the part being worked on.
 */
export function PathBar(props: PathBarProps): JSX.Element;
