import * as React from 'react';

export interface ShortlistStale {
  /** What moved, in words: "Two of these changed category on 26 Feb." A saved list whose data has
   *  moved says so; it does not carry a coloured dot, because nothing is wrong — the world moved. */
  text: string;
}

export interface ShortlistCardProps {
  /** The name the advisor gave it: "Sharma — flexi cap under 0.7%". Not a query string. */
  name: string;
  /** How many rows it holds. */
  count: number;
  /** What `count` counts. Defaults to 'funds'. */
  unit?: string;
  /** Whose it is. Omitted for a shortlist not yet attached to a client. */
  client?: string;
  /** When it was last saved, in words: "22 Sep". */
  savedAt?: string;
  /** How many times it has been saved. Shown only from 2 — "v1" on a first save is noise. */
  version?: number;
  /** The filters that produced it, as labels an advisor can read aloud to a client. On the card's
   *  face, never behind it. */
  filters?: string[];
  /** Set when the underlying data has moved since the save. Renders as text on the peach surface
   *  with the re-run offer beside it (rule 2) — never a badge, never an automatic refresh. */
  stale?: ShortlistStale | null;
  onOpen?: () => void;
  /** Offered beside `stale`. Re-running is the advisor's call: a list that changed silently between
   *  opening it and reading it aloud is the defect this card exists to prevent. */
  onRefresh?: () => void;
  /** Optional preview rows — the first two or three funds, so the card is worth returning to. */
  children?: React.ReactNode;
}

/**
 * A shortlist the advisor keeps: named, dated, versioned, re-runnable.
 *
 * Every serious advisor tool has one and Sentinel had none — Tickertape's saved screens, Wealthy
 * Select's monthly playbook, NJ's Recommended Portfolio. The explorer re-sent a fresh table every
 * turn instead, so an eight-turn session left eight stale tables and nothing to return to.
 *
 * NOT a replacement for `ArtifactCard`. That is a thing Sentinel made in this thread, which peeks,
 * expands and dies with the conversation. This is a thing the advisor kept, with a name they gave
 * it and a client it belongs to. A screen that needs both uses both.
 */
export function ShortlistCard(props: ShortlistCardProps): JSX.Element;
