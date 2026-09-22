import * as React from 'react';

export interface SectionStripSection {
  /** Matches the id of the section it jumps to. */
  id: string;
  /** One or two words — this row scrolls, and a sentence in a pill makes it scroll further. */
  label: string;
}

export interface SectionStripProps {
  sections: SectionStripSection[];
  /** The section currently on screen. The pill scrolls itself into view when this changes — a
   *  current-location indicator the advisor cannot see is not an indicator. */
  active?: string;
  onJump?: (id: string) => void;
  /** Accessible name for the group. Default 'Sections'. */
  label?: string;
}

/**
 * A sticky mini table of contents for a long page — the alternative to tabs on a fund page.
 *
 * A fund page is a cross-reference task (expense read against return, riskometer against what the
 * client holds), and tabs tax exactly that: users who switch back and forth to compare pay in
 * short-term memory and interaction cost. So the page is one scroll and this strip keeps it
 * navigable, showing where the reader currently is.
 *
 * NOT tabs, and must not read as them: tabs change what you are looking at, this changes where you
 * are in one thing. Rendered in the filter-pill vocabulary at 32px, with button roles rather than
 * `tablist`/`tab`, which would promise arrow-key movement between panels that do not exist.
 *
 * The caller owns the scroll spy and passes `active`. This component does not observe the page —
 * the page knows where its sections are, and two observers is two answers to one question.
 */
export function SectionStrip(props: SectionStripProps): JSX.Element | null;
