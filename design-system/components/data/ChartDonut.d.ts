import * as React from 'react';

export interface DonutSlice {
  /** What the segment IS, in the advisor's words. Printed in the legend; never left to colour alone. */
  label: string;
  /** Its share. Must be > 0 — a zero slice is left out, because a zero-width arc that still holds a
   *  legend row states something untrue. A value the product does not know is not passed at all. */
  value: number;
  /** Only where a data role demands it: 'muted' for a benchmark or prior period, 'status' for a
   *  crossed limit. Never a colour, and never to tell one category from another. */
  tone?: 'ramp' | 'muted' | 'status';
}

export interface ChartDonutProps {
  slices: DonutSlice[];
  /** Outer box in px. Default 168 — fits a 343 card with the legend beneath. */
  size?: number;
  /** Ring width in px. Default 22. */
  thickness?: number;
  /** How many segments before the rest fold into one. Default 5: a ring is readable at four to six
   *  and a bar chart beats it past that, because the eye is poor at comparing arcs that do not touch. */
  max?: number;
  /** What the folded segment is called. Default 'Other'; the count is appended. */
  otherLabel?: string;
  /** THE HOLE'S JOB. The figure the reader came for — the total, the headline percentage, the balance.
   *  Every finance app in the reference set does this, and it is what makes a ring worth its space. */
  center?: React.ReactNode;
  /** One line under it: what the figure is of. */
  centerNote?: React.ReactNode;
  /** How a slice's value prints in the legend. Default one decimal and a per-cent sign. */
  valueFormat?: (v: number) => string;
  /** Default true. Turn it off only where the same names are already listed beside the chart. */
  legend?: boolean;
  /** The label of the slice to emphasise — drawn thicker, never recoloured. */
  selected?: string | null;
  /** Makes each legend row a control. Omit it and the legend is static text. */
  onSelect?: (label: string) => void;
  /** Sweep the segments in on mount. Default true; false for a frozen specimen. */
  run?: boolean;
  /** The as-of line, at the chart rather than in a page footer. */
  caveat?: string;
  /** Accessible name for the figure. Default 'Composition'. */
  label?: string;
  /** Park the largest segment's name on the ring itself, outside the arc. A ring in the wild almost
   *  always carries one figure ON it rather than only in a list below. Only one chip is ever drawn,
   *  and only when that segment holds at least a quarter of the ring — two labels on a 168px ring
   *  collide. Default false. */
  leadChip?: boolean;
}

/**
 * Part of a whole, with the whole in the middle — a donut, never a pie.
 *
 * Twenty shipped finance screens were read for this and not one is a solid pie: every one is a ring
 * whose hole carries the thing the reader came for. A pie spends its middle on nothing.
 *
 * Colour is rank from the system's four-step ramp, which is legal HERE and not on a line or a single
 * bar: only ramp step 1 clears 3:1 against the page, so steps 2–4 are allowed exactly where marks
 * separate from EACH OTHER by edge and label rather than from the page. So every segment carries a
 * hairline edge, a gap of the card's own ground shows between them, and the legend names every one
 * with its figure. No segment is ever left to colour alone.
 *
 * Past `max` segments the rest fold into one named "Other". Use `ChartBar` horizontal instead when
 * the job is to compare the parts with each other rather than to see the split.
 */
export function ChartDonut(props: ChartDonutProps): JSX.Element;
