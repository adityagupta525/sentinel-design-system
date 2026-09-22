import * as React from 'react';

/** peek answers "how many?", half answers "which ones?", full answers "narrow it". */
export type ExplorerDetent = 'peek' | 'half' | 'full';

export interface ExplorerSheetProps {
  open: boolean;
  /** Which of the three heights the sheet is at. Default 'half'. */
  detent?: ExplorerDetent;
  /** Called with the next detent. Omit it and the sheet is fixed at `detent` — the grabber then only
   *  closes, which is the right behaviour for a specimen but not for the product. */
  onDetentChange?: (next: ExplorerDetent) => void;
  /** The explicit dismiss the owner's 22 Sep ruling requires. Always rendered; never gesture-only. */
  onClose?: () => void;
  /** One line under the count: what the list is OF, in the advisor's words. */
  title?: string;
  /** The result count, which is the whole of what `peek` shows. */
  count?: number | null;
  /** What `count` counts. Defaults to 'funds'. */
  unit?: string;
  /**
   * Distance from the bottom of the positioned ancestor to the bottom of the sheet, in px — set by
   * the screen to its composer's height. THIS IS HOW THE SHEET CANNOT COVER THE COMPOSER: the box
   * stops here, so no detent can reach it. Leaving it at 0 on a screen that has a composer breaks
   * the ruling this component was approved under.
   */
  bottom?: number | string;
  /** What `peek` shows beneath the count — the sentence an advisor reads without opening anything. */
  summary?: React.ReactNode;
  /** The filter rail. Rendered only at `full`, because carrying the rail is what full IS. */
  rail?: React.ReactNode;
  /** The list. Rendered at `half` and `full`, in the sheet's own scroll region. */
  children?: React.ReactNode;
  /** Accessible name for the region. Default 'Fund explorer'. */
  label?: string;
}

/**
 * A browse surface that rises over the thread and never takes the composer.
 *
 * NON-MODAL BY CONTRACT: no scrim, no `aria-modal`, no focus trap. The thread behind stays readable
 * and the composer stays live, because an advisor mid-client-call has to be able to keep talking to
 * Sentinel while a list is open — that is the entire argument for a sheet rather than a screen.
 * Do not add dialog mechanics to this component; a trap here would steal the composer's keyboard.
 *
 * Back is one rule, three steps: full → half → peek → gone. The grabber is a real button that steps
 * down one detent, because a gesture nobody can see is not an affordance; a product build layers a
 * drag on top and keeps the button for keyboard users.
 *
 * The mechanic has no incumbent — no shipped product raises a browse sheet over a live chat with the
 * composer working underneath. Each half is proven (Rufus inverted, Google Maps' three detents,
 * Spotify's mutating object); the seam is not. Prototype it before trusting it.
 */
export function ExplorerSheet(props: ExplorerSheetProps): JSX.Element | null;
