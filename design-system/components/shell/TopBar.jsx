import React from 'react';
import { IconMenu } from '../icons/IconMenu.jsx';
import { IconPlus } from '../icons/IconPlus.jsx';
import { Pressable } from '../actions/Pressable.jsx';
/* hamburger · Sentinel pill · new-thread */
export function TopBar({ onMenu, onNew, title = 'Sentinel' }) {
  return (
    <div style={{ position: 'relative', zIndex: 10, display: 'flex', height: 44, width: '100%', flexShrink: 0, alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', boxSizing: 'border-box' }}>
      <Pressable onClick={onMenu} style={{ display: 'flex', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)' }}><IconMenu /></Pressable>
      <div style={{ borderRadius: 'var(--radius-full)', background: 'var(--color-surface)', padding: '12px 16px', boxShadow: 'var(--shadow-card), 0 0 0 1px var(--color-line)' }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-14)', lineHeight: 1, textAlign: 'center', color: 'var(--color-ink)' }}>{title}</p>
      </div>
      <Pressable onClick={onNew} style={{ display: 'flex', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)' }}><IconPlus /></Pressable>
    </div>
  );
}
