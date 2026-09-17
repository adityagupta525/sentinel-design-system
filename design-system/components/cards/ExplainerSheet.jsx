import React from 'react';
import { Pill } from '../actions/Pill.jsx';
/* C20 · explainer bottom sheet — 24px top radius, 44×5 grabber, "Got it" primary chip. */
export function ExplainerSheet({ open, title, body, onClose }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'var(--scrim)', opacity: 0.4, animation: 'ds-fade 300ms var(--ease) both' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30, borderRadius: '24px 24px 0 0', background: 'var(--color-surface)', padding: '12px 20px 28px', animation: 'ds-sheet 300ms var(--ease) both' }}>
        <style>{'@keyframes ds-sheet{from{transform:translateY(100%)}to{transform:none}}@media (prefers-reduced-motion:reduce){@keyframes ds-sheet{from{opacity:0;transform:none}to{opacity:1;transform:none}}}'}</style>
        <div style={{ margin: '0 auto 14px', height: 5, width: 44, borderRadius: 'var(--radius-full)', background: 'var(--color-line)' }} />
        <p style={{ margin: 0, ...{ font: 'var(--type-sheet-title-font)', color: 'var(--color-ink)' } }}>{title}</p>
        <div style={{ marginTop: 'var(--space-10)', display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>{body.map((p, i) => <p key={i} style={{ margin: 0, ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink-soft)' } }}>{p}</p>)}</div>
        <div style={{ marginTop: 18 }}><Pill label="Got it" tone="primary" onClick={onClose} /></div>
      </div>
    </>
  );
}
