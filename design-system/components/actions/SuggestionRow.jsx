import React from 'react';
import { IconChevronRight } from '../icons/IconChevronRight.jsx';
import { Pressable } from '../actions/Pressable.jsx';
/* Suggestion row with chevron, --h-row (42px), hairline divider.
   The height was the literal 42 while spacing.css named this component in --h-row's own comment. */
/* ROUTED THROUGH `Pressable` (20 Sep 2026). The row draws at `--h-row`, which is 42 — two points
   under the floor, on the three rows that are the whole of Home. It also hand-rolled its own press
   state and its own transform, which `Pressable` owns. The row still DRAWS at 42; the target is 44,
   and the focus ring now comes from the one place that is allowed to draw one. */
export function SuggestionRow({ label, onClick, last = false }) {
  return (
    <Pressable onClick={onClick}
      style={{ padding: 0, display: 'flex', height: 'var(--h-row)', width: '100%', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', borderBottom: last ? 'none' : '0.5px solid var(--color-line-soft)' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-18)', color: 'var(--color-ink)' }}>{label}</span>
      <IconChevronRight />
    </Pressable>
  );
}
