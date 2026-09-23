import * as React from 'react';

export interface IntentTileProps {
  /** What the filter set is called, in the advisor's words: "Equity", "Maturing within 3 years". */
  label: string;
  /** How many rows the set holds. Omit only when the number is genuinely unknown — a tile with no
   *  count asks the advisor to tap and find out, which is the tap this component exists to save. */
  count?: number | null;
  /** What `count` counts. Defaults to 'funds'; a bond tile says 'bonds'. */
  unit?: string;
  /** One line under the count: what is inside the set. Not shown when `unavailable`. */
  note?: string;
  /** A silhouette drawn at 76px in the bottom-right corner, at 7% ink, clipped by the tile's own
   *  radius. It is TEXTURE, never meaning: every tile states its class in words, so a tile with no
   *  mark is not a tile missing information, and rule 1 — colour and shape never carry a meaning
   *  alone — holds. Pass an `AssetMark`, or any 24-viewBox glyph sized up. */
  mark?: React.ReactNode;
  /** The set is the one currently applied. */
  selected?: boolean;
  /** No feed for this asset class yet. The tile stays visible and legible and loses only its
   *  affordance — an advisor needs to know the class exists. Never render `count={0}` for this. */
  unavailable?: boolean;
  /** Why it is unavailable, in words. Defaults to a line that says a feed is missing rather than
   *  implying the shelf is empty. */
  unavailableNote?: string;
  onClick?: () => void;
}

/**
 * A pre-filled filter set with a name and a count — the explorer's first screen as a sentence
 * rather than a form.
 *
 * Ten of the eleven guided paths in the Indian market are a separate surface from the screener;
 * GoldenPi's purpose tiles are the exception that lives inside it, and Centricity's own One Digital
 * does the same at asset level ("Equity 612 funds"). The count is load-bearing: option counts are
 * the highest-impact fix to a filter interface, and every funnel that worked carries one.
 *
 * `unavailable` is how an asset class with no feed appears — inert, legible, with the reason in
 * words. Never `count={0}`, which says the shelf is empty rather than that the feed is missing.
 */
export function IntentTile(props: IntentTileProps): JSX.Element;

export interface IntentGridProps {
  children: React.ReactNode;
  /** Tiles per row. Two at 375, which is the widest a label and a count sit on one line. */
  cols?: number;
}

/** The grid the tiles sit in. Here rather than on each screen so the gap cannot drift between the
 *  three explorer variations. */
export function IntentGrid(props: IntentGridProps): JSX.Element;
