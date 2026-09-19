FigureRow — a label and its figure on one baseline, **and the tabular figures are set here**. Four hand-written instances across three screens were the same declaration (flex · `align-items: baseline` · `space-between` · `--space-8`) and all four remembered `fontVariantNumeric: 'tabular-nums'` by hand. Rule 4 asks for tabular figures on anything that changes; four call sites remembering independently is four chances to forget.
```jsx
<FigureRow label="What it costs him" value="₹11,200" />
<FigureRow label="To the mandate" value="Equity 60%"
  sub={{ label: 'His mandate', value: 'Moves ₹1,56,530 · 11 points' }} />
<FigureRow label="Tax on the switch" value="Not costed" tone="over" />
```
**Two weights, and they are a pair.** `strong` carries the answer, `quiet` qualifies it — which is why `sub` is always quiet: a card with two strong rows has not decided what it is saying. `tone='over'` is rule 2 — **text colour, never a fill**; this component never paints a background. **Not the figure/caption pair**: `InfoCard` sets a figure and its period on one baseline, which is one number and its caption. This is a label and its figure, two things at the two ends of a row.
