import * as React from 'react';

/** `raised` the card the thread scrolls past · `soft` a quieter card inside a panel · `ring` a block
 *  INSET into a card · `flat` a box that groups without lifting. Four, because those are the four
 *  things a box means in this product. A fifth is a new visual decision and belongs to the owner. */
export type SurfaceElevation = 'raised' | 'soft' | 'ring' | 'flat';
/** `surface` the card ground · `canvas` a block inset into a card · `bubble` the peach, for a block
 *  that carries bad news as TEXT (rule 2 — never as a fill on its own). */
export type SurfaceTone = 'surface' | 'canvas' | 'bubble';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Default 'raised'. */
  elevation?: SurfaceElevation;
  /** Default 'surface'. */
  tone?: SurfaceTone;
  /** A step on the radius scale: 8 · 12 · 16 · 20 · 24. Default **16**, which 18 of the 38
   *  hand-written surfaces already used. 12 is the one for a block inside a card. A number off the
   *  scale falls back to 16 rather than drawing an off-ramp box. */
  radius?: 8 | 12 | 16 | 20 | 24;
  /** A step on the spacing scale: 6 · 8 · 10 · 12 · 14 · 16 · 20, or 0 to lay the children out
   *  yourself. Default **14**, the repository's own most-used card padding. */
  padding?: 0 | 6 | 8 | 10 | 12 | 14 | 16 | 20;
  /** Fills its flex parent and allows its content to scroll — `flex: 1; min-height: 0`. For a panel
   *  body between a fixed header and a fixed footer, which is the only place this product scrolls
   *  inside a surface. */
  grow?: boolean;
}

/** THE PLAIN CARD, and the reason it exists is a count.
 *
 *  `components/cards/` held fourteen cards and not one of them was simply a card, so nine screens and
 *  six system components hand-wrote the same box. Measured 19 Sep 2026: **38 hand-written surfaces**,
 *  and one intent — a hairline ring — written **three ways**, two inset and one not, one carrying a
 *  raw `1px` where the system has `--border-1`. `moves.jsx:62` was byte-for-byte `InfoCard.jsx:69`.
 *
 *  Every default is the repository's own most-used value rather than a preference, so `<Surface>` with
 *  no props draws the box this system already draws most often. It adds no visual decision: it names
 *  the four that were already being made, and stops the fifth being made by accident.
 *
 *  **It is not a replacement for the cards that mean something.** `ArtifactCard` carries peek/expand
 *  and provenance; `InfoCard` is the fund's page; `ResultCard` is the end of a journey. Reach for
 *  `Surface` when the box is only a box. */
export function Surface(props: SurfaceProps): JSX.Element;
