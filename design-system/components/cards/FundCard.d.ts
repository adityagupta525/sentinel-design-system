import * as React from 'react';

export interface FundHeadline {
  /** The figure, already formatted — '9.76%', '₹1,04,318', '8.75%'. The card never formats, because
   *  what a figure means differs per family and the caller is the one that knows. */
  value: string;
  /** What it is, in the advisor's words: '3Y return', 'Coupon', 'Current value'. */
  label: string;
}

export interface FundFact {
  label: string;
  /** Already formatted, Indian grouping applied. */
  value: string;
}

export interface FundCardProps {
  /** The instrument, as the catalogue names it. */
  name: string;
  /** One line under it: category, plan, sub-type. */
  sub?: string;
  /** One or two letters for the AMC disc — 'CR', 'UTI'. A letter, not a logo image: this system ships
   *  no images and a remote 24px logo is a request that can fail on a card. */
  logo?: string;
  /** 'On your shelf', 'New'. Takes the top-right corner, unless `selectable` needs it — then it moves
   *  down to the chip row rather than sitting on top of the checkbox. */
  badge?: string;
  badgeTone?: 'over' | 'under' | 'ok';
  /** Short facts that are labels rather than figures: 'Direct', 'Very high risk', 'Open ended'. */
  chips?: string[];
  /** The one number the advisor came for. **Optional, and its absence is not a gap.** Four of the
   *  eight families in the catalogue have no return at all; a bond's card is carried by `facts`. Never
   *  pass a placeholder — an em dash where the headline goes reads as "we do not know this fund". */
  headline?: FundHeadline;
  /** The series behind the headline, oldest first. Drawn only when it exists — there is no empty
   *  state, because a blank 84x26 box beside a number reads as a chart that failed to load. Two funds
   *  on the same three-year return are not the same fund, and this is what says so. */
  spark?: number[];
  /** The facts this KIND of instrument has: AUM and TER for a fund, maturity and frequency for a
   *  bond. Divided by a hairline from the headline, and by middots from each other. */
  facts?: FundFact[];
  /** Show a checkbox for multi-select comparison. It is a SIBLING of the card's own control, never
   *  nested inside it — a control inside a control is invalid, and this repository has shipped that
   *  bug before. */
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  /** The one-pager, open. Controlled by the list, because opening one closes the others. */
  open?: boolean;
  onToggle?: () => void;
  /** The one-pager itself. When present the card becomes its own control and grows into the page in
   *  place — the same `0fr → 1fr` StepBlock uses, deliberately: two expansions in one funnel would
   *  teach the advisor two behaviours for one gesture. */
  children?: React.ReactNode;
  id?: string;
}

/**
 * An instrument, as a card that opens into its own page.
 *
 * The card is not a fund card with fields missing. Of the catalogue's eight families only two carry
 * a return and a NAV series; a bond has a coupon, a yield, a face value, a maturity and a payment
 * frequency instead, and those are different facts rather than worse ones. So the card takes one
 * `headline` and a row of `facts`, and the caller — which has already asked `shapeOf(id)` — decides
 * what they are.
 *
 * It opens in place: the one-pager is not a screen, the card grows into it and shrinks back, in the
 * same thread, with the scroll position kept.
 */
export function FundCard(props: FundCardProps): JSX.Element;
