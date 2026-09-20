import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* AN ICON BUTTON WITH NO ACCESSIBLE NAME, found the day it first reached a screen (20 Sep 2026).
   It shipped in v9 with a `Pressable` carrying an SVG and nothing else, so a screen reader announced
   "button" — the same defect F-39 found on the app bar, and it survived here because nothing had
   ever rendered this. It says what it does now, and what it does is go to the newest turn rather
   than to the bottom of a scroll, which is the thing the advisor actually wants. */
export function ScrollToBottomButton({ show, onClick, label = 'Go to the newest turn' }) {
  return (
    <div style={{ position: 'absolute', bottom: 8, left: '50%', zIndex: 20, transform: show ? 'translateX(-50%)' : 'translate(-50%, 8px)', opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none', transition: 'opacity var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)' }}>
      <Pressable onClick={onClick} label={label} aria-hidden={show ? undefined : true} tabIndex={show ? undefined : -1} style={{ display: 'flex', width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-float), 0 0 0 1px var(--color-line)' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v9M4 8l4 4 4-4" stroke="var(--color-bronze-deep)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Pressable>
    </div>
  );
}
