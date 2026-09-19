/* The thread shell, shared by every screen of the journey that is a conversation — screens 2 to 5 and
   7. One file so the five do not drift into five slightly different threads.

   No top-level destructuring on purpose. Every .jsx a page loads compiles into ONE scope, so
   `const { Dock } = …` here and the same line in home.jsx would be a redeclaration and the page would
   render nothing. A single uniquely-named const, read through in JSX, cannot collide. */
const THREAD_DS = window.SentinelDesignSystem_0682a2;

/* The thread carries the scroll — never a card inside it, and never a second scroller. */
/* scrollRef: the live prototype owns the two thread scrolls ArtifactCard's contract assigns to the
   caller — header under the app bar on expand, back to the card on collapse — and needs the scroller. */
/* `banner` is pinned BETWEEN the app bar and the thread — the one slot in this shell that does not
   scroll, and the only thing that belongs in it is a state the whole thread is in: a journey paused
   behind the conversation (`DetourBanner`). It is deliberately not a place for what a message offered;
   that is inside the turn (contradiction 60). */
function Thread({ time = '3:04', children, composer, banner, onMenu, onNew, scrollRef, revision = 0, anchor = 'newest' }) {
  /* WHERE A THREAD RESTS. On mount, and whenever the caller says the turns changed (`revision`):
       'newest'  — the newest turn STARTS on screen; if it also fits, it ends on screen too (scroll to
                   the bottom). Measured on screen 3: the answer turn is ~500pt in a 462pt thread, so
                   sticking to the bottom scrolled the sentence off while it was being read, and when the
                   artifact arrived 900ms later it did it again. The rule keeps the first line where the
                   eye already is; the advisor scrolls to the card. The archive's useStickyScroll always
                   went to the bottom, and had the same problem.
       'bottom'  — the end of the thread, for a specimen of a thread that has been read.
       a number  — that turn at the top, for a specimen of a turn re-opened in place.
       a ref     — that ELEMENT at the top, which is what ArtifactCard's contract asks for on expand:
                   "bring the card's header just under the app bar". Anchoring the turn is not the same
                   thing — measured on screen 4, the card sits 291pt inside its own turn, so the turn at
                   the top leaves the card below the fold.
     It fires only on `revision`, never on every render, so the caller's own two scrolls (ArtifactCard's
     expand / collapse contract) are not fought. */
  const own = React.useRef(null);
  const el = () => (scrollRef ? scrollRef.current : own.current);
  React.useLayoutEffect(() => {
    const e = el(); if (!e) return;
    const col = e.firstElementChild; const kids = col ? Array.from(col.children) : [];
    const pad = col ? parseFloat(getComputedStyle(col).paddingTop) || 0 : 0;
    const target = anchor && anchor.current ? anchor.current
      : typeof anchor === 'number' ? kids[anchor]
      : anchor === 'newest' ? kids[kids.length - 1] : null;
    if (!target || (anchor === 'newest' && target.offsetHeight <= e.clientHeight - pad)) { e.scrollTop = e.scrollHeight; return; }
    /* Rect-based, not offsetTop: the target may be nested inside a turn rather than be one. */
    e.scrollTop = Math.max(0, e.scrollTop + (target.getBoundingClientRect().top - e.getBoundingClientRect().top) - pad);
  }, [revision, anchor]);
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <THREAD_DS.ScreenBackdrop />
      <THREAD_DS.StatusSpacer time={time} />
      <THREAD_DS.TopBar title="Sentinel" onMenu={onMenu || (() => {})} onNew={onNew || (() => {})} />
      {banner && <div style={{ position: 'relative', zIndex: 1, paddingBottom: 'var(--space-8)' }}>{banner}</div>}
      <div ref={scrollRef || own} style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--stack)', padding: '16px var(--gutter) 24px' }}>
          {children}
        </div>
      </div>
      {/* The Dock carries the composer and nothing else: `chips` and `cta` are deprecated (contradiction
          60) and no screen passes them, so the shell does not offer them either — a prop with nothing
          behind it is how a deprecated pattern quietly returns. */}
      <THREAD_DS.Dock composer={composer} />
      <THREAD_DS.HomeIndicator />
    </div>
  );
}

Object.assign(window, { Thread });
