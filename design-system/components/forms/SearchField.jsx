import React from 'react';
/* The search field a `searchable` List renders — the composer's visual style (radius 20, white,
   1px line ring, bronze focus ring at 150ms) at one row and 44px, so it reads as a filter and not as
   a second composer. For picking one client out of 512; the composer remains the path for an advisor
   who already knows the name. `Clear` is text, not a glyph, per the text-before-a-glyph rule. */
export function SearchField({ value = '', onChange, placeholder = 'Search 512 clients', onClear, autoFocus = false }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', width: '100%', height: 44, borderRadius: 'var(--radius-20)', background: 'var(--color-surface)', padding: '0 14px', boxSizing: 'border-box', border: `1px solid ${focus ? 'var(--color-bronze)' : 'var(--color-line)'}`, boxShadow: focus ? 'var(--focus-ring)' : 'none', transition: 'box-shadow var(--dur-press), border-color var(--dur-press)' }}>
      <input value={value} autoFocus={autoFocus} placeholder={placeholder} onChange={(e) => onChange && onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', padding: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink)' }} className="ds-search-input" />
      <style>{'.ds-search-input::placeholder{color:var(--color-muted)}'}</style>
      {value ? (
        <button type="button" onClick={() => { onClear && onClear(); onChange && onChange(''); }}
          style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', minHeight: 44, padding: '0 2px', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 11.5, lineHeight: 'var(--leading-16)', color: 'var(--color-muted)' }}>Clear</button>
      ) : null}
    </div>
  );
}
