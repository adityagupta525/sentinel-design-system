import * as React from 'react';

export interface ScreenStackProps {
  /** Which screen is mounted. Any value that compares with `!==` — a string key is the usual choice.
   *  Changing it plays the transition; setting it to what it already is does nothing. */
  screen: unknown;
  /** Draws one screen. Called for the incoming screen and, while a transition runs, for the outgoing
   *  one — so it must render from the key alone and never from state the parent has already moved on. */
  render: (screen: any) => React.ReactNode;
  /** `forward` (default) sends the new screen in from the right and the old one out to the left.
   *  `back` plays the SAME two keyframes reversed and swapped, so the transition reads as going up
   *  rather than deeper. No third keyframe exists; see the component header for why. Captured at the
   *  moment `screen` changes, so changing this prop alone never moves anything. */
  direction?: 'forward' | 'back';
  /** Fires when the outgoing screen has been unmounted, i.e. `--dur-screen` after the change. Use it
   *  to restore scroll or focus, never to start the next transition. */
  onSettle?: (screen: any, from: any) => void;
}

/** Two screens in one slot, for as long as `--dur-screen`.
 *
 *  It owns which screen is mounted and nothing about how a screen moves: both keyframes are
 *  `tokens/effects.css`'s own and the duration is read from the token at run time, so the unmount can
 *  never happen before the animation it is waiting for. Under `prefers-reduced-motion` both keyframes
 *  are already redefined to a fade in place and the reversed direction is still a fade, so `back`
 *  needs no special case.
 *
 *  There is NO shared-element transition in this system. A card does not fly into a page; an artifact
 *  expands in place. This component moves whole screens or nothing. */
export function ScreenStack(props: ScreenStackProps): JSX.Element;
