import * as React from 'react';

export interface IconFilterProps {
  /** Defaults to `--color-bronze`, which is what the rest of the set takes. */
  stroke?: string;
  /** Default 15 — the set's one size. */
  size?: number;
}

/**
 * Three sliders, not a funnel.
 *
 * A funnel glyph is the common choice and it is wrong here: this product HAS a funnel — four
 * questions down the screen — and using its picture for the thing that narrows the result would name
 * two different mechanics with one shape. Sliders say "adjust", which is what the sheet does.
 */
export function IconFilter(props: IconFilterProps): JSX.Element;
