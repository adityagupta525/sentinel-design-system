import * as React from 'react';

export interface ScreenScaffoldProgress {
  n: number;
  total: number;
  /** Dimmed while a detour is open over the journey. */
  dim?: boolean;
}

export interface ScreenScaffoldProps {
  /** The status bar's clock. Every specimen states a time. Default '3:04', which is the thread's;
   *  the rail's journey is a morning story and passes '10:12'. */
  time?: string;
  /** The top bar's title. One value in this product, and still a prop: a screen that needs a
   *  different one is a screen we have not designed yet, and it should have to say so. */
  title?: string;
  /** Opens the drawer. The menu is one of this product's only two ways out of a surface — the other
   *  is a new thread — so a screen that omits it builds a dead end. */
  onMenu?: () => void;
  /** Starts a new thread. The second of the two doors. */
  onNew?: () => void;
  /** `{ n, total, dim }` renders `ProgressRail` in the gutter between the bar and the body, with the
   *  8px below it that every rail already used. Omit it on a thread. */
  progress?: ScreenScaffoldProgress;
  /** Pinned between the bar and the body, outside the scroller — the only slot here that does not
   *  scroll away. The only thing that belongs in it is a state the whole screen is in: a journey
   *  paused behind the conversation (`DetourBanner`). NOT a place for what a message offered; that
   *  goes inside the turn (contradiction 60). */
  banner?: React.ReactNode;
  /** `'thread'` (default, 32 of the 37 measured instances) scrolls, is bottom-anchored, and owns the
   *  gutter and the `--stack` gap between turns. `'page'` does not scroll: children sit under the bar
   *  with their own padding and a spacer pushes the Dock to the floor. Home is the only page, and a
   *  page that needs to scroll is a thread. */
  body?: 'thread' | 'page';
  children?: React.ReactNode;
  /** Where the thread rests when `revision` changes. Ignored on a page.
   *   'newest'  the newest turn STARTS on screen, and ends on screen too when it fits. The default,
   *             and the reason this prop exists: sticking to the bottom scrolls the sentence off
   *             while it is being read.
   *   'bottom'  the end of the thread, for a specimen of a thread already read.
   *   number    that turn at the top, for a turn re-opened in place.
   *   ref       that ELEMENT at the top — what `ArtifactCard`'s contract asks for on expand. */
  anchor?: 'newest' | 'bottom' | number | React.RefObject<HTMLElement>;
  /** Bumped by the caller when the turns changed. The anchor fires on this and never on every
   *  render, so the caller's own expand/collapse scrolls are not fought. */
  revision?: number | string;
  /** Lets a caller drive the scroller it does not own — the two thread scrolls `ArtifactCard`'s
   *  contract assigns to the caller need it. */
  scrollRef?: React.RefObject<HTMLDivElement>;
  /** Chips above the composer, in the Dock's own slot. Home's starters are the only ones. */
  chips?: React.ReactNode;
  /** The composer. **Required**, and it is the whole point: rule 3 says nothing replaces it, and a
   *  required prop is how a rule survives the next screen. WHICH composer is the caller's decision —
   *  a rail step with `money` wants `MoneyComposer`. */
  composer: React.ReactNode;
}

/** THE PHONE, WITH THE COMPOSER GUARANTEED.
 *
 *  Rule 3 is "the composer is on every screen", and until 20 Sep 2026 it was kept by three
 *  hand-built shells that happened to agree: `thread.jsx:45-63`, `rail.jsx:87-105`, `home.jsx:45-83`,
 *  across **16 pages and 37 instances**. Diffed with the design-system prefix normalised away, the
 *  thread's and the rail's shells are the **same nineteen lines**, and differ in exactly three:
 *
 *  1. the rail hardcodes `StatusSpacer time="10:12"` where the thread takes a prop;
 *  2. the rail has a `ProgressRail` between the bar and the body;
 *  3. **the rail scrolls to the bottom.** `rail.jsx:85` is `e.scrollTop = e.scrollHeight` — precisely
 *     the behaviour `thread.jsx:17-45` exists to reject, and measured there. Looked at on
 *     `screens/journey-e/rebalance`: the rail opened on the middle of a list of targets, Sentinel's
 *     question scrolled off the top and the first card cut in half. Two shells agreeing by hand is
 *     how a fixed bug comes back in the copy.
 *
 *  Home is the one real variant, and it is a real one: no scroller at all. That is `body="page"`.
 *
 *  The Dock is not the caller's to place. That is what turns rule 3 from a convention into a
 *  structure — a fourth screen written tomorrow cannot omit it. */
export function ScreenScaffold(props: ScreenScaffoldProps): JSX.Element;
