/* The thread shell, shared by every screen of the journey that is a conversation — screens 2 to 5 and
   7. One file so the five do not drift into five slightly different threads.

   No top-level destructuring on purpose. Every .jsx a page loads compiles into ONE scope, so
   `const { Dock } = …` here and the same line in home.jsx would be a redeclaration and the page would
   render nothing. A single uniquely-named const, read through in JSX, cannot collide. */
const THREAD_DS = window.SentinelDesignSystem_0682a2;

/* The thread carries the scroll — never a card inside it, and never a second scroller. */
function Thread({ time = '3:04', children, chips, cta, composer, onMenu }) {
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <THREAD_DS.ScreenBackdrop />
      <THREAD_DS.StatusSpacer time={time} />
      <THREAD_DS.TopBar title="Sentinel" onMenu={onMenu || (() => {})} onNew={() => {}} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
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
