/* The thread shell, shared by every screen of the journey that is a conversation — screens 2 to 5 and
   7. One file so the five do not drift into five slightly different threads.

   No top-level destructuring on purpose. Every .jsx a page loads compiles into ONE scope, so
   `const { Dock } = …` here and the same line in home.jsx would be a redeclaration and the page would
   render nothing. A single uniquely-named const, read through in JSX, cannot collide. */
const THREAD_DS = window.SentinelDesignSystem_0682a2;

/* The thread carries the scroll — never a card inside it, and never a second scroller. */
/* scrollRef: the live prototype owns the two thread scrolls ArtifactCard's contract assigns to the
   caller — header under the app bar on expand, back to the card on collapse — and needs the scroller. */
function Thread({ time = '3:04', children, chips, cta, composer, onMenu, onNew, scrollRef, revision = 0, anchor = 'newest' }) {
  /* WHERE A THREAD RESTS. On mount, and whenever the caller says the turns changed (`revision`):
       'newest'  — the newest turn STARTS on screen; if it also fits, it ends on screen too (scroll to
                   the bottom). Measured on screen 3: the answer turn is ~500pt in a 462pt thread, so
                   sticking to the bottom scrolled the sentence off while it was being read, and when the
                   artifact arrived 900ms later it did it again. The rule keeps the first line where the
                   eye already is; the advisor scrolls to the card. The archive's useStickyScroll always
                   went to the bottom, and had the same problem.
       'bottom'  — the end of the thread, for a specimen of a thread that has been read.
       a number  — that turn at the top, for a specimen of a turn re-opened in place.
     It fires only on `revision`, never on every render, so the caller's own two scrolls (ArtifactCard's
     expand / collapse contract) are not fought. */
  const own = React.useRef(null);
  const el = () => (scrollRef ? scrollRef.current : own.current);
  React.useLayoutEffect(() => {
    const e = el(); if (!e) return;
    const col = e.firstElementChild; const kids = col ? Array.from(col.children) : [];
    const pad = col ? parseFloat(getComputedStyle(col).paddingTop) || 0 : 0;
    const target = typeof anchor === 'number' ? kids[anchor] : anchor === 'newest' ? kids[kids.length - 1] : null;
    if (!target || (anchor === 'newest' && target.offsetHeight <= e.clientHeight - pad)) { e.scrollTop = e.scrollHeight; return; }
    e.scrollTop = Math.max(0, target.offsetTop - pad);
  }, [revision, anchor]);
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <THREAD_DS.ScreenBackdrop />
      <THREAD_DS.StatusSpacer time={time} />
      <THREAD_DS.TopBar title="Sentinel" onMenu={onMenu || (() => {})} onNew={onNew || (() => {})} />
      <div ref={scrollRef || own} style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--stack)', padding: '16px var(--gutter) 24px' }}>
          {children}
        </div>
      </div>
      <THREAD_DS.Dock chips={chips} cta={cta} composer={composer} />
      <THREAD_DS.HomeIndicator />
    </div>
  );
}

Object.assign(window, { Thread });
