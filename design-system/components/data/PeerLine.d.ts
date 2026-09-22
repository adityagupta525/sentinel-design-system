import * as React from 'react';

/** A real position inside a real category. Pass it only where the denominator is the whole category,
 *  not the rows that happened to match a filter — an invented rank is worse than no rank. */
export interface PeerLineRank {
  /** 1-based position. Rendered as an ordinal: 4 → "4th". */
  n: number;
  /** How many schemes the position is out of. */
  of: number;
}

export interface PeerLineProps {
  /** The fund's own figure, as a number so the gap can be computed here rather than trusted. */
  value: number;
  /** The category's figure for the same period, from the same source. */
  peer: number;
  /** The window both figures cover, in words: "3 years", "1 year". Printed, never parsed. */
  period: string;
  /** What `peer` is the figure OF: "Flexi cap average", "its category". Printed as given. */
  peerLabel: string;
  /** Optional, and never invented — see PeerLineRank. Omitted, the line still reads as a judgement. */
  rank?: PeerLineRank | null;
  /** Unit suffix on both figures. Defaults to '%'; the only unit the explorer currently compares on. */
  unit?: string;
}

/**
 * A fund's figure beside its category's, on one line, with the gap said in words.
 *
 * The row-level half of a pair: `Dumbbell` draws the same comparison as marks on an axis where a
 * fund page has room, and `PeerLine` says it as type where a list row does not. Both read the same
 * two numbers.
 *
 * The gap is COMPUTED from `value` and `peer` — a caller cannot hand in a verdict that disagrees
 * with the two figures printed beside it. Ahead and behind are carried by the word, never by
 * colour: rule 1 says colour never encodes, and an advisor reading this line to a client needs the
 * meaning to survive being spoken.
 */
export function PeerLine(props: PeerLineProps): JSX.Element;
