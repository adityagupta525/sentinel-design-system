import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
export function ScrollToBottomButton({ show, onClick }) {
  return (
    <div style={{ position: 'absolute', bottom: 8, left: '50%', zIndex: 20, transform: show ? 'translateX(-50%)' : 'translate(-50%, 8px)', opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none', transition: 'opacity var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)' }}>
      <Pressable onClick={onClick} style={{ display: 'flex', width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-float), 0 0 0 1px var(--color-line)' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v9M4 8l4 4 4-4" stroke="var(--color-bronze-deep)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Pressable>
    </div>
  );
}
