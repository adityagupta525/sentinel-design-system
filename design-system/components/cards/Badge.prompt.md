Badge — the non-tappable label: status (over / under / ok on the status tokens) or meta (neutral chip + line ring). Padding 8×3, always.
```jsx
<Badge variant="status" tone="over">12% over</Badge>
<Badge variant="status" tone="ok">Close enough</Badge>
<Badge>Flexi cap</Badge>
<Badge>Locked · 15 Sep 2026</Badge>
```
Replaces DeltaPill, KindTag and the inline meta pills in HeroNumberCard / DataTableCard. Takes no onClick.
