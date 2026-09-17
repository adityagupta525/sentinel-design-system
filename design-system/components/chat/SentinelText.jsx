import React from 'react';
export function SentinelText({ text, weight = 'Medium' }) {
  return <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: weight === 'Regular' ? 400 : 500, fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink-soft)', animation: 'ds-fade 300ms var(--ease) both' }}>{text}</p>;
}
