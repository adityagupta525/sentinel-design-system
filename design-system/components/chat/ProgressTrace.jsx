import React from 'react';
import { SentinelBlock } from './SentinelBlock.jsx';
import { Pressable } from '../actions/Pressable.jsx';
/* Step 5 · the real progress trace — steps name real work, then collapse to "Thought for Ns". */
function Circle({ state }) {
  if (state === 'done') return <span style={{ display: 'flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: 'var(--color-bronze)' }}><svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.8 4.6 3.6 6.4 7.2 2.6" stroke="var(--color-surface)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
  if (state === 'active') return <span style={{ width: 16, height: 16, borderRadius: 'var(--radius-full)', background: 'var(--color-canvas)', boxShadow: '0 0 0 2px var(--color-bronze)', boxSizing: 'border-box' }} />;
  return <span style={{ width: 16, height: 16, borderRadius: 'var(--radius-full)', boxShadow: '0 0 0 1px var(--color-line)' }} />;
}
export function ProgressTrace({ steps, stepMs = 850, reasoning, onDone, autoplay = true, initialActive = 0, seconds = 3, initialCollapsed = false }) {
  const [active, setActive] = React.useState(initialActive);
  /* A frozen trace whose initialActive has passed the last step IS a finished trace. Until v12 the
     only way to reach the done state was to let the clock run, so a specimen or an artboard could
     show "Working · 4s" with every circle already filled — and could never show the reasoning block,
     which only renders once done. No new prop: autoplay={false} with initialActive < steps.length is
     unchanged, which is what every existing frozen call site passes. */
  const [done, setDone] = React.useState(!autoplay && initialActive >= steps.length);
  /* initialCollapsed (18 Sep 2026): the RESTING state of a finished trace is the one line "Thought for
     Ns ›" — that is what the advisor is looking at while they read the answer under it. A frozen
     specimen could reach done-and-expanded since v12 (F-22) but never done-and-collapsed, so a screen
     page showing the answer had to show the steps open above it, which the product does not do.
     Honoured only when the trace is already done; a running trace has nothing to collapse. */
  const [collapsed, setCollapsed] = React.useState(initialCollapsed && !autoplay && initialActive >= steps.length);
  const [secs, setSecs] = React.useState(autoplay ? 0 : seconds);
  React.useEffect(() => { if (done || !autoplay) return; const iv = setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(iv); }, [done, autoplay]);
  React.useEffect(() => {
    if (!autoplay) return;
    let idx = initialActive, t;
    const step = () => { idx += 1; if (idx >= steps.length) { setActive(steps.length); setDone(true); setCollapsed(true); onDone && onDone(); return; } setActive(idx); t = setTimeout(step, stepMs); };
    t = setTimeout(step, stepMs);
    return () => clearTimeout(t);
  }, []);
  const chev = (rot) => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: rot ? 'rotate(-90deg)' : 'none' }}><path d="M4.5 3 7.5 6l-3 3" stroke="var(--color-muted)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (done && collapsed) return <SentinelBlock><Pressable onClick={() => setCollapsed(false)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}><span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-13)', color: 'var(--color-muted)' }}>Thought for {secs}s</span>{chev(false)}</Pressable></SentinelBlock>;
  return (
    <SentinelBlock>
      <div style={{ width: '100%' }}>
        <button type="button" onClick={() => done && setCollapsed(true)} style={{ appearance: 'none', border: 'none', background: 'transparent', padding: 0, cursor: done ? 'pointer' : 'default', marginBottom: 'var(--space-10)', display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-12)', color: done ? 'var(--color-muted)' : 'var(--color-ink)' }}>{done ? `Thought for ${secs}s` : `Working · ${secs}s`}</span>
          {done && chev(true)}
        </button>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', paddingLeft: 'var(--space-2)' }}>
          <div style={{ position: 'absolute', bottom: 8, left: 9, top: 8, width: 1, background: 'var(--color-line)' }} />
          {steps.map((s, i) => {
            const state = i < active ? 'done' : i === active && !done ? 'active' : done ? 'done' : 'pending';
            return (
              <div key={s} style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 'var(--space-10)', opacity: i === active && !done ? 1 : 0.4, transition: 'opacity var(--dur-fast) var(--ease)' }}>
                <Circle state={state} />
                <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-13)', lineHeight: 'var(--leading-18)', color: 'var(--color-ink-soft)' }}>{s}</span>
              </div>
            );
          })}
        </div>
        {done && reasoning && <div style={{ marginTop: 'var(--space-12)', borderLeft: '1px solid var(--color-line)', paddingLeft: 'var(--space-12)' }}><p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-13)', lineHeight: 'var(--leading-19)', color: 'var(--color-muted)' }}>{reasoning}</p></div>}
      </div>
    </SentinelBlock>
  );
}
