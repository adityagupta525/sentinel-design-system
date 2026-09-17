import React from 'react';
/* C7 · collapsed question (muted, truncated) + the answer bubble (13px). */
export function QAPair({ question, answer }) {
  return (
    <div style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {question && <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-16)', color: 'var(--color-muted)' }}>{question}</p>}
      <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
        <div style={{ maxWidth: 280, borderRadius: '20px 20px 6px 20px', background: 'var(--color-bubble)', padding: '8px 12px', boxShadow: '0 0 0 1px var(--color-bubble-edge)' }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-13)', lineHeight: 'var(--leading-18)', color: 'var(--color-ink)' }}>{answer}</p>
        </div>
      </div>
    </div>
  );
}
