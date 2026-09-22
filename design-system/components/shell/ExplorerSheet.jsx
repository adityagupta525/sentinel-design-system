import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* THE EXPLORER SHEET — a browse surface that rises over the thread WITHOUT taking the composer.

   This is the one mechanic in the fund explorer with no incumbent. Forty-two reference screens were
   read for it and the union does not exist anywhere: Amazon Rufus raises a CHAT sheet over a STORE
   (the mirror of this), Google Maps gives three detents over a live canvas but not over a
   conversation, Spotify's Prompted Playlists mutate one object inside a thread rather than layering
   over it. So every part of this is borrowed from a proven half, and the seam is the risk — which is
   why the sheet is deliberately simple and why the owner's ruling is recorded below rather than
   assumed.

   THE OWNER'S RULING, 22 Sep 2026. "Nothing pinned above the composer" (18 Sep) removed `Dock.chips`
   and `Dock.cta`, which sat above the composer on every screen whether or not the advisor asked for
   them. This sheet is the opposite case and was ruled a different thing: it opens only on a funds
   query, it always carries a visible dismiss, and it NEVER covers the composer. That last part is
   structural here, not a caller's discipline — the sheet's box stops at `bottom`, which the screen
   sets to the composer's height, so there is no height at which it can reach the composer.

   NON-MODAL, AND THAT IS THE POINT. No scrim, no aria-modal, no focus trap: the thread behind stays
   readable and the composer stays live, because an advisor mid-client-call must be able to keep
   talking to Sentinel while a list is open. That is the whole argument for a sheet over a screen. It
   also means this component must NOT be given the dialog treatment ConfirmSheet and FilterSheet carry
   — a trap here would steal the composer's keyboard, which is the one thing the design promises not
   to do.

   THREE DETENTS, EACH A DIFFERENT QUESTION. `peek` answers "how many?" — the count and nothing else,
   so the thread keeps almost all of its height. `half` answers "which ones?" — the shortlist. `full`
   answers "narrow it" — the list plus the filter rail. Google Maps' three states, measured: a summary
   height, a list height, a full height, with the canvas alive behind all three.

   BACK IS ONE RULE, THREE STEPS: full → half → peek → gone. The grabber is a real button that steps
   down one detent, because a gesture nobody can see is not an affordance; a product build adds the
   drag on top of it, and the button remains for keyboard and for anyone who cannot drag. `onClose` is
   the explicit dismiss the ruling requires and is always rendered. */

const DETENTS = ['peek', 'half', 'full'];
/* Measured against the sheet's own container, not the phone: `bottom` has already taken the composer
   out, so these are shares of what is left. peek is content-sized — a count is one line and does not
   deserve a fraction. */
const HEIGHT = { peek: 'auto', half: '52%', full: '86%' };

export function ExplorerSheet({
  open, detent = 'half', onDetentChange, onClose,
  title, count = null, unit = 'funds', bottom = 0,
  summary, rail, children, label = 'Fund explorer',
}) {
  if (!open) return null;
  const at = DETENTS.includes(detent) ? detent : 'half';
  const stepDown = () => {
    const i = DETENTS.indexOf(at);
    if (i <= 0) { onClose && onClose(); return; }
    onDetentChange && onDetentChange(DETENTS[i - 1]);
  };
  const stepUp = () => {
    const i = DETENTS.indexOf(at);
    if (i < DETENTS.length - 1 && onDetentChange) onDetentChange(DETENTS[i + 1]);
  };
  return (
    <section aria-label={label}
      style={{
        position: 'absolute', left: 0, right: 0, bottom, zIndex: 'var(--z-sheet)',
        display: 'flex', flexDirection: 'column',
        height: HEIGHT[at], maxHeight: '86%',
        borderRadius: 'var(--radius-24) var(--radius-24) 0 0',
        background: 'var(--color-canvas)',
        /* Depth, not a scrim: the thread behind must stay readable. --shadow-bar is the system's
           "this layer is above that one" without dimming anything. */
        boxShadow: 'var(--shadow-bar)',
        boxSizing: 'border-box',
        animation: 'ds-explorer var(--dur-screen) var(--ease) both',
      }}>
      <style>{'@keyframes ds-explorer{from{transform:translateY(100%)}to{transform:none}}@media (prefers-reduced-motion:reduce){@keyframes ds-explorer{from{opacity:0;transform:none}to{opacity:1;transform:none}}}'}</style>

      {/* The grabber IS the back control — a button, because a gesture nobody can see is not an
          affordance. A build adds drag on top; this stays for keyboard. */}
      <Pressable onClick={stepDown} label={at === 'peek' ? 'Close the explorer' : 'Show less of the explorer'}
        style={{ flexShrink: 0, display: 'flex', width: '100%', height: 'var(--space-20)', alignItems: 'center', justifyContent: 'center' }}>
        <span aria-hidden="true" style={{ display: 'block', height: 'var(--space-5)', width: 'var(--h-touch)', borderRadius: 'var(--radius-full)', background: 'var(--color-line)' }} />
      </Pressable>

      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-8)', padding: `0 var(--space-16) var(--space-8)` }}>
        <div style={{ minWidth: 0 }}>
          {count != null && (
            <p style={{ margin: 0, font: 'var(--type-title-font)', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>
              {count.toLocaleString('en-IN')} {unit}
            </p>
          )}
          {title && <p style={{ margin: 0, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{title}</p>}
        </div>
        <Pressable onClick={onClose} label="Close the explorer"
          style={{ flexShrink: 0, display: 'inline-flex', minHeight: 'var(--h-touch)', alignItems: 'center' }}>
          <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)' }}>Close</span>
        </Pressable>
      </div>

      {/* `summary` is what peek shows — the sentence the advisor reads without opening anything. */}
      {at === 'peek' ? (
        <div style={{ flexShrink: 0, padding: `0 var(--space-16) var(--space-16)` }}>
          {summary}
          {onDetentChange && (
            <Pressable onClick={stepUp} label="Show the list"
              style={{ display: 'flex', minHeight: 'var(--h-touch)', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)' }}>Show the list</span>
            </Pressable>
          )}
        </div>
      ) : (
        <React.Fragment>
          {/* The rail only exists at full — that is what full IS. */}
          {at === 'full' && rail && (
            <div style={{ flexShrink: 0, padding: `0 var(--space-16) var(--space-8)` }}>{rail}</div>
          )}
          {/* --space-20 at the foot, not --space-16: a card that ends flush against the sheet's edge
              reads as cut off rather than scrolled, and the last row of a shortlist is the one an
              advisor is most likely to be reaching for. */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: `0 var(--space-16) var(--space-20)` }}>
            {children}
          </div>
        </React.Fragment>
      )}
    </section>
  );
}
