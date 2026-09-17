import React from 'react';
import { Eyebrow } from '../text/Eyebrow.jsx';
/* C1 · 2px journey rail, right-aligned "Question n of total".
   `dim` is the detour signal and it dims the RAIL ONLY — the label always holds full opacity.
   Never wrap this component in a parent `opacity`: the parent bleeds into the label and
   "QUESTION 12 OF 12" then reads fainter than "QUESTION 1 OF 12" for no stated reason. */
export function ProgressRail({ n, total, dim = false }) {
  return (
    <div style={{ width: '100%', padding: '2px 16px 6px', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 'var(--space-5)', display: 'flex', justifyContent: 'flex-end', opacity: 1 }}><Eyebrow>Question {n} of {total}</Eyebrow></div>
      <div style={{ height: 2, width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-full)', background: 'var(--color-line)', opacity: dim ? 0.4 : 1, transition: 'opacity var(--dur-fast) var(--ease)' }}>
        <div style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-full)', background: 'var(--gradient-rail)', transformOrigin: 'left', transform: `scaleX(${n / total})`, transition: 'transform var(--dur-screen) var(--ease)' }} />
      </div>
    </div>
  );
}
