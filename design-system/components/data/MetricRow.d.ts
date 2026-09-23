import * as React from 'react';

export interface MetricPeer {
  /** 'This fund', 'Category', 'Benchmark'. */
  label: string;
  /** Already formatted. */
  value: string;
  /** The fund's own figure — the one the others are read against. Takes the accent surface. The
   *  label still says which is which, so colour is not carrying the meaning alone. */
  self?: boolean;
  /** This peer has no figure on file. The tile STAYS — dropping it would hide that a comparison is
   *  meant to exist — and `value` becomes the words for the gap ('not on file'), set in caption
   *  weight rather than figure weight, so the eye does not compare three things when there are two. */
  missing?: boolean;
}

export interface MetricRowProps {
  /** 'Alpha (3Y)', 'Beta (3Y)', 'Expense ratio'. */
  label: string;
  /** The fund's own figure, already formatted. */
  value: string;
  /** What it is measured against, as tiles. Usually three: this fund, its category, its benchmark —
   *  all of which the catalogue carries. Empty means there is nothing to compare it to, and the row
   *  then has no chevron rather than a chevron that opens an empty panel. */
  peers?: MetricPeer[];
  /** One line under the tiles: what the comparison means here, not what the metric means in general.
   *  "Ahead of its category on both windows" — a reading, not a definition. */
  note?: string;
  open?: boolean;
  onToggle?: () => void;
  /** Set by `MetricList`. The last row drops its rule — a hairline with nothing under it draws the
   *  bottom of a box that is not there. */
  last?: boolean;
  id?: string;
}

/**
 * A figure that opens into what it is measured against.
 *
 * `Alpha 1.64` is only a fact once the reader knows the category did 8.64 and the benchmark 9.12.
 * The catalogue carries all three; printing all three per row makes a wall, so the row prints the
 * fund's own figure and opening it lays the peers beside it.
 *
 * Not `StatTile`, which is a headline figure with a door to a DEFINITION — what the metric means.
 * This is a row with a door to a COMPARISON — what it is here. A one-pager wants both, and a
 * component that did both would put two chevrons on one row.
 */
export function MetricRow(props: MetricRowProps): JSX.Element;

export interface MetricListProps { children?: React.ReactNode; }
/** Applies the divider rule and drops it on the last row. */
export function MetricList(props: MetricListProps): JSX.Element;
