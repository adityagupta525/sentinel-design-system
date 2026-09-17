import React from 'react';
import { IconAttach } from '../icons/IconAttach.jsx';
import { IconArrow } from '../icons/IconArrow.jsx';
/* The ask bar — present on every screen. Bronze focus ring, 150ms. streaming = Stop in the send slot. */
export function Composer({ value = '', onChange, onFocus, onSend, placeholder = 'Ask Sentinel about a client, a fund, or a plan', autoFocus = false, streaming = false, onStop }) {
  const [focus, setFocus] = React.useState(false);
  const canSend = value.trim().length > 0 && !streaming;
  const btn = { appearance: 'none', border: 'none', cursor: 'pointer', display: 'flex', width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: 'var(--gradient-dark-cta)', padding: 0 };
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-20)', background: 'var(--color-surface)', padding: 'var(--space-12)', boxSizing: 'border-box', border: `1px solid ${focus ? 'var(--color-bronze)' : 'var(--color-line)'}`, boxShadow: focus ? 'var(--focus-ring)' : 'var(--shadow-composer)', transition: 'box-shadow var(--dur-press), border-color var(--dur-press)' }}>
      <input value={value} autoFocus={autoFocus} onChange={(e) => onChange && onChange(e.target.value)} onFocus={() => { setFocus(true); onFocus && onFocus(); }} onBlur={() => setFocus(false)} onKeyDown={(e) => e.key === 'Enter' && canSend && onSend && onSend()} placeholder={placeholder}
        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink)' }} className="ds-composer-input" />
      <style>{'.ds-composer-input::placeholder{color:var(--color-muted)}'}</style>
      <div style={{ marginTop: 'var(--space-12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 'var(--space-2)' }}>
        <div style={{ display: 'flex', width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 22, background: 'var(--color-surface)', boxShadow: '0 0 0 1px var(--color-line)' }}><IconAttach /></div>
        {streaming ? (
          <button type="button" onClick={onStop} style={btn}><span style={{ width: 13, height: 13, borderRadius: 3, background: 'var(--color-surface)' }} /></button>
        ) : (
          <button type="button" onClick={() => canSend && onSend && onSend()} disabled={!canSend} style={{ ...btn, opacity: canSend ? 1 : 0.4, cursor: canSend ? 'pointer' : 'default' }}><IconArrow /></button>
        )}
      </div>
    </div>
  );
}
