import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* What the assistant actually did, as collapsible one-line rows with per-step state.

   The mechanism, not the layout: four AI products have converged on it — Manus indents a step's
   reasoning beneath it, Linktree opens `Analysis ⌄` onto a vertical-ruled list of ticked steps,
   ChatGPT collapses a tool call to `Ran 3 commands ›`, DeepSeek heads its trace `Thought for 5
   seconds ⌄`. For an advisor this is not decoration: "read her holdings · matched to the mandate ·
   checked the compliance shelf" IS the provenance they repeat to the client, and Sentinel currently
   buries it in a sentence.

   Sentinel's own language, not theirs: the spine and the 16px node are ProgressTrace's, the muted
   40% rule for inactive rows is ours, and the summary row is the existing collapsed-reasoning row.
   Same component serves FileUpload's staged parse — the stages ARE the parse summary arriving
   progressively, which is the "success describes the user's world" rule already in the readme.

   Failure is a first-class step, not an absence: Mimo's completed-card-then-`⚠ Error detected`-then-
   `Try to fix` sequence is the half Sentinel was missing. A failed step keeps its place in the list,
   carries the word, and offers its retry inline. */
const NODE = 16;
function Node({ state }) {
  const done = state === 'done', failed = state === 'failed', running = state === 'running';
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 3, display: 'flex', width: NODE, height: NODE, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: done ? 'var(--color-bronze)' : failed ? 'var(--color-status-over-bg)' : 'var(--color-canvas)', boxShadow: done ? 'none' : `inset 0 0 0 var(--border-1) ${failed ? 'var(--color-status-over-fg)' : running ? 'var(--color-bronze)' : 'var(--color-line)'}` }}>
      {done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--color-surface)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
      {/* DRAWN, like the tick above it (20 Sep 2026). This was a typed "!" — the only exclamation
          mark in the product's text, against a voice rule that has none, and the only node in a set
          of three that was a character rather than a stroke. Same node, same colour, same weight. */}
      {failed && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-over-fg)" strokeWidth="3.4" strokeLinecap="round"><path d="M12 6v7" /><path d="M12 17.5v.5" /></svg>}
      {running && <span style={{ width: 6, height: 6, borderRadius: 'var(--radius-full)', background: 'var(--color-bronze)', animation: 'dot-pulse 1200ms var(--ease) infinite' }} />}
    </span>
  );
}
export function StepTrace({ steps = [], summary, open: openProp, defaultOpen = false, onToggle, id = 'steptrace', dense = false }) {
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp == null ? openState : openProp;
  const toggle = () => { if (openProp == null) setOpenState((v) => !v); if (onToggle) onToggle(!open); };
  const done = steps.filter((s) => s.state === 'done').length;
  const failed = steps.some((s) => s.state === 'failed');
  const running = steps.find((s) => s.state === 'running');
  const head = summary || (failed ? 'Could not finish' : running ? running.label : `Read ${done} ${done === 1 ? 'source' : 'sources'}`);
  return (
    <div style={{ width: '100%' }}>
      <Pressable onClick={toggle} expanded={open} controls={id} label={`${head}. ${open ? 'Collapse' : 'Expand'} what Sentinel did.`}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <span style={{ font: 'var(--type-label-font)', color: failed ? 'var(--color-status-over-fg)' : 'var(--color-muted)' }}>{head}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease)' }}>
          <path d="M6 9.5l6 6 6-6" stroke={failed ? 'var(--color-status-over-fg)' : 'var(--color-muted)'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Pressable>
      {open && (
        <div id={id} role="list" style={{ position: 'relative', marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: dense ? 'var(--space-8)' : 'var(--space-12)' }}>
          <span aria-hidden="true" style={{ position: 'absolute', left: 9, top: 'var(--space-8)', bottom: 'var(--space-8)', width: 'var(--border-1)', background: 'var(--color-line)' }} />
          {steps.map((s, i) => {
            const inactive = s.state === 'pending';
            return (
              <div key={s.label + i} role="listitem" style={{ position: 'relative', paddingLeft: 'var(--space-24)', opacity: inactive ? 0.4 : 1, transition: 'opacity var(--dur-fast) var(--ease)' }}>
                <Node state={s.state || 'pending'} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-8)' }}>
                  <span style={{ flex: 1, minWidth: 0, font: 'var(--type-row-font)', color: s.state === 'failed' ? 'var(--color-status-over-fg)' : 'var(--color-ink-soft)' }}>{s.label}</span>
                  {s.meta && <span style={{ flexShrink: 0, font: 'var(--type-caption-font)', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>{s.meta}</span>}
                </div>
                {s.detail && <p style={{ margin: 'var(--space-2) 0 0', font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{s.detail}</p>}
                {s.state === 'failed' && s.retry && <div style={{ marginTop: 'var(--space-6)' }}>{s.retry}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
