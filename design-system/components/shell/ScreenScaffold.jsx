import React from 'react';
import { ScreenBackdrop } from './ScreenBackdrop.jsx';
import { StatusSpacer } from './StatusSpacer.jsx';
import { TopBar } from './TopBar.jsx';
import { ProgressRail } from '../data/ProgressRail.jsx';
import { Dock } from './Dock.jsx';
import { HomeIndicator } from './HomeIndicator.jsx';
import { ScrollToBottomButton } from './ScrollToBottomButton.jsx';
/* THE PHONE, WITH THE COMPOSER GUARANTEED.
   Rule 3 is "the composer is on every screen", and until now it was kept by three hand-built shells
   that happened to agree. Measured 20 Sep 2026: `thread.jsx:45-63`, `rail.jsx:87-105` and
   `home.jsx:45-83` across 16 pages and 37 instances. Diffed with the DS prefix normalised away, the
   thread's and the rail's shells are the SAME NINETEEN LINES — outer column, ScreenBackdrop,
   StatusSpacer, TopBar, the pinned banner, the scroller, the bottom-anchored padded column at
   --stack, Dock, HomeIndicator — and differ in exactly three things:

     1. the rail hardcodes StatusSpacer time="10:12" where the thread takes a prop;
     2. the rail has a ProgressRail between the bar and the body;
     3. THE RAIL SCROLLS TO THE BOTTOM. `rail.jsx:85` is `e.scrollTop = e.scrollHeight`, which is
        precisely the behaviour `thread.jsx:17-45` exists to reject, measured: "the answer turn is
        ~500pt in a 462pt thread, so sticking to the bottom scrolled the sentence off while it was
        being read." Looked at on screens/journey-e/rebalance: the rail opens on the middle of a
        list of targets, Sentinel's question scrolled off the top and the first card cut in half.
        Two shells agreeing by hand is how a fixed bug comes back in the copy.

   Home is the one real variant. It has NO scroller: a greeting, a card of ready prompts, then a
   flex spacer that pushes the Dock down. That is `body="page"`. Everything else is `body="thread"`.

   A fourth screen written tomorrow cannot omit the Dock, because the Dock is not the caller's to
   place. That is the whole point: this is the component that turns a rule into a structure. */
export function ScreenScaffold({
  time = '3:04', title = 'Sentinel', onMenu, onNew,
  progress, banner, body = 'thread', children,
  anchor = 'newest', revision = 0, scrollRef,
  chips, composer,
}) {
  const own = React.useRef(null);
  const el = () => (scrollRef ? scrollRef.current : own.current);
  const [away, setAway] = React.useState(false);
  const onScroll = (e) => {
    const t = e.currentTarget;
    setAway(t.scrollHeight - t.scrollTop - t.clientHeight > 120);
  };
  const toBottom = () => { const e = el(); if (e) e.scrollTo({ top: e.scrollHeight, behavior: (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'auto' : 'smooth' }); };
  /* WHERE A THREAD RESTS — lifted verbatim from thread.jsx, which is where it was measured.
       'newest'  the newest turn STARTS on screen; if it also fits, it ends on screen too (scroll to
                 the bottom). The rule keeps the first line where the eye already is; the advisor
                 scrolls to the card. The archive's useStickyScroll always went to the bottom and had
                 exactly the problem this replaces.
       'bottom'  the end of the thread, for a specimen of a thread that has been read.
       a number  that turn at the top, for a turn re-opened in place.
       a ref     that ELEMENT at the top, which is what ArtifactCard's contract asks for on expand:
                 "bring the card's header just under the app bar". Anchoring the TURN is not the same
                 thing — the card sits 291pt inside its own turn on screen 4, so the turn at the top
                 leaves the card below the fold.
     It fires only on `revision`, never on every render, so a caller's own expand/collapse scrolls
     are not fought. */
  React.useLayoutEffect(() => {
    if (body !== 'thread') return;
    const e = el(); if (!e) return;
    const col = e.firstElementChild; const kids = col ? Array.from(col.children) : [];
    const pad = col ? parseFloat(getComputedStyle(col).paddingTop) || 0 : 0;
    const target = anchor && anchor.current ? anchor.current
      : typeof anchor === 'number' ? kids[anchor]
      : anchor === 'newest' ? kids[kids.length - 1] : null;
    if (!target || (anchor === 'newest' && target.offsetHeight <= e.clientHeight - pad)) { e.scrollTop = e.scrollHeight; return; }
    /* Rect-based, not offsetTop: the target may be nested inside a turn rather than be one. */
    e.scrollTop = Math.max(0, e.scrollTop + (target.getBoundingClientRect().top - e.getBoundingClientRect().top) - pad);
  }, [revision, anchor, body]);
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <ScreenBackdrop />
      <StatusSpacer time={time} />
      {/* No back button, because this product has none: the way out of any surface is the menu's
          "Back to home" or a new thread. A back arrow here would be a second door to one thing. */}
      <TopBar title={title} onMenu={onMenu || (() => {})} onNew={onNew || (() => {})} />
      {progress && (
        <div style={{ position: 'relative', zIndex: 1, padding: '0 var(--gutter) var(--space-8)' }}>
          <ProgressRail n={progress.n} total={progress.total} dim={progress.dim} />
        </div>
      )}
      {/* PINNED BETWEEN THE BAR AND THE BODY — the one slot here that does not scroll, and the only
          thing that belongs in it is a state the whole screen is in: a journey paused behind the
          conversation (DetourBanner). Deliberately NOT a place for what a message offered; that goes
          inside the turn (contradiction 60). */}
      {banner && <div style={{ position: 'relative', zIndex: 1, paddingBottom: 'var(--space-8)' }}>{banner}</div>}
      {body === 'thread' ? (
        /* The screen carries the scroll — never a card inside it, and never a second scroller. */
        <div ref={scrollRef || own} onScroll={onScroll} style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
          {/* THE BOTTOM PADDING RESERVES THE DISC'S ROW (20 Sep 2026). `ScrollToBottomButton` floats
              8px above the Dock, and nothing had reserved space for it — so the last line of a thread
              could rest underneath it, and on several boards that line was the provenance or the
              standing disclaimer. 24 + 36 + 8: the disc's own height and its offset. A floating
              control may pass over content while you scroll; it may not sit on it at rest. */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--stack)', padding: `16px var(--gutter) ${body === 'thread' ? 68 : 24}px` }}>
            {children}
          </div>
        </div>
      ) : (
        /* A page does not scroll and is not bottom-anchored: its children sit under the bar with
           their own padding and a spacer pushes the Dock to the floor. Home is the only one, and a
           page that needs to scroll is a thread. */
        <React.Fragment>
          {children}
          <div style={{ flex: 1 }} />
        </React.Fragment>
      )}
      {/* SCROLLED UP IN A LONG THREAD, THE NEWEST TURN IS THE ONE YOU CANNOT SEE (20 Sep 2026).
          `ScrollToBottomButton` was built for exactly this and had been on no screen since v9, so
          every journey in the product let an advisor scroll back through twelve answered questions
          with no way down but the same twelve swipes. It is the scaffold's, not the caller's, for
          the reason the Dock is: a thread that forgot it would be a thread with a trap in it.
          Threshold 120px — far enough that it does not flicker at the bottom of a settling scroll. */}
      {body === 'thread' && (
        /* A zero-height relative line directly above the Dock, so the button's own `bottom: 8`
           measures from there and it sits 8px clear of the composer rather than behind it. */
        <div style={{ position: 'relative', height: 0 }}><ScrollToBottomButton show={away} onClick={toBottom} /></div>
      )}
      {/* The Dock is NOT the caller's to place — that is how rule 3 survives the next screen. */}
      <Dock chips={chips} composer={composer} />
      <HomeIndicator />
    </div>
  );
}
