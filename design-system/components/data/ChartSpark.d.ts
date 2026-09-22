import * as React from 'react';

export interface ChartSparkProps {
  /** The series, oldest first. Fewer than two points renders an empty box of the same size, so a
   *  table column does not jump when one row has no history. */
  points: number[];
  /** Default 56 — the width a table cell can spare at 375 without pushing a figure off. */
  width?: number;
  /** Default 18, which sits inside DataTable's compact row without changing its height. */
  height?: number;
  /** 'ramp' (the default) is the fund's own line; 'muted' a benchmark or prior period; 'status' a
   *  crossed limit. Never a colour — a single mark against the page takes `markColor`, which returns
   *  bronze-deep whatever the rank. The series fills are pastels and a pastel clears nothing against
   *  warm paper; they are legible only in the pairing that gives every area its own darker contour,
   *  and a 56px line has no area to contour. */
  tone?: 'ramp' | 'muted' | 'status';
  /** Mark the last point. Default true: "where it ended" is what a reader looks for, and the eye
   *  should not have to hunt along the line for it. */
  endDot?: boolean;
  /** Accessible name. Defaults to the point count and the final value — say what the row is about
   *  where the column header does not. */
  label?: string;
}

/**
 * A line small enough to live in a table row — the component `DataTable`'s `sparkline` column kind
 * has declared since v1 and the system could not draw.
 *
 * No axis, no grid, no label: that is what makes it a spark rather than a chart, and the figure it
 * sits beside is its label. A number says where a fund ENDED; the spark says how it got there, and
 * two funds on the same three-year return with different paths are not the same fund.
 */
export function ChartSpark(props: ChartSparkProps): JSX.Element;
