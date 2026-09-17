import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* Every revision of an artifact, as a row in the thread, with a revert on each.

   The mechanism is Wabi's: `V1 ↺ · V2 ↺ · V3 ↺ · V4` in the conversation itself. It solves a product
   hole rather than a visual one — an advisor who has revised a proposal twice currently has no way
   back to the version the client actually saw, and "the one I sent on Tuesday" is the version that
   matters when the client rings.

   Sentinel's own language: the row is ListRow's geometry, the current version carries the sand
   selected fill rather than a dot, and revert is a word, not a glyph alone (the text-before-a-glyph
   rule). Revert never destroys: it appends the restored version as a new revision, so the trail only
   ever grows — which is the same reasoning as MessageActions' edit warning, one level up. */
export function VersionRow({ versions = [], currentId, onSelect, onRevert, label = 'Versions' }) {
  const current = currentId || (versions[versions.length - 1] || {}).id;
  return (
    <div style={{ width: '100%' }}>
      <p style={{ margin: `0 0 var(--space-6)`, font: 'var(--type-eyebrow-font)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{label}</p>
      <div role="list" style={{ borderRadius: 'var(--radius-12)', background: 'var(--color-surface)', boxShadow: `inset 0 0 0 var(--border-1) var(--color-line)`, padding: `0 var(--space-12)`, boxSizing: 'border-box' }}>
        {versions.map((v, i) => {
          const isCurrent = v.id === current;
          return (
            <div key={v.id} role="listitem" style={{ display: 'flex', minHeight: 'var(--h-row-md)', alignItems: 'center', gap: 'var(--space-8)', padding: `var(--space-8) 0`, borderTop: i ? `var(--border-hairline) solid var(--color-line-soft)` : 'none' }}>
              <span style={{ display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', minWidth: 34, height: 22, borderRadius: 'var(--radius-full)', background: isCurrent ? 'var(--color-selected)' : 'var(--color-chip)', boxShadow: isCurrent ? `0 0 0 var(--border-1) var(--color-bronze)` : 'none', font: 'var(--type-label-font)', color: isCurrent ? 'var(--color-ink)' : 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>{v.name}</span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', font: 'var(--type-row-font)', color: 'var(--color-ink)' }}>{v.summary}</span>
                <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{v.meta}{isCurrent ? ' · showing now' : ''}{v.sent ? ' · sent to the client' : ''}</span>
              </span>
              {!isCurrent && onRevert && (
                <Pressable onClick={() => onRevert(v.id)} label={`Revert to ${v.name}`} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span style={{ font: 'var(--type-label-font)', color: 'var(--color-bronze-deep)' }}>Revert</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 8" stroke="var(--color-bronze-deep)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 3v5h5" stroke="var(--color-bronze-deep)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Pressable>
              )}
              {isCurrent && onSelect && <span style={{ flexShrink: 0, font: 'var(--type-caption-font)', color: 'var(--color-data-deemph)' }}>current</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
