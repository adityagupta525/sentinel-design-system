import React from 'react';
import { IconArrow } from '../icons/IconArrow.jsx';
export function formatINR(digits) {
  const clean = String(digits).replace(/\D/g, '');
  if (!clean) return '';
  const n = clean.slice(-3), rest = clean.slice(0, -3);
  return (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' : '') + n;
}
/* C18 · ₹ prefix in a 20px slot, hairline, Indian-grouped digits. */
export function MoneyComposer({ onSend, placeholder = 'or type an amount' }) {
  const [raw, setRaw] = React.useState('');
  const formatted = formatINR(raw);
  const canSend = raw.length > 0;
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-20)', background: 'var(--color-surface)', padding: 'var(--space-12)', boxSizing: 'border-box', boxShadow: 'var(--shadow-composer), 0 0 0 1px var(--color-line)' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', width: 20, flexShrink: 0, justifyContent: 'center' }}><span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-16)', color: 'var(--color-bronze-deep)' }}>₹</span></div>
        <div style={{ margin: '0 10px', height: 22, width: 1, flexShrink: 0, background: 'var(--color-line)' }} />
        <input value={formatted} inputMode="numeric" onChange={(e) => setRaw(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => e.key === 'Enter' && canSend && onSend && onSend('₹' + formatted)} placeholder={placeholder} className="ds-composer-input"
          style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-16)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink)' }} />
        <style>{'.ds-composer-input::placeholder{color:var(--color-muted)}'}</style>
      </div>
      <div style={{ marginTop: 'var(--space-12)', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" disabled={!canSend} onClick={() => canSend && onSend && onSend('₹' + formatted)} style={{ appearance: 'none', border: 'none', display: 'flex', width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: 'var(--gradient-dark-cta)', opacity: canSend ? 1 : 0.4, cursor: canSend ? 'pointer' : 'default', padding: 0 }}><IconArrow /></button>
      </div>
    </div>
  );
}
