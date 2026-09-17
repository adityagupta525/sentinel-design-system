ChartTooltip — for **tapping a single mark** (scrubbing is `ChartReadout`). Appears on tap, sits above the mark, flips below near the top edge, dismisses on the next tap anywhere. Surface fill, radius 8, padding 8/10, hairline as `inset 0 0 0 0.5px var(--color-line)` — the `HeroNumberCard` idiom, so it belongs.
```jsx
<div style={{position:'relative'}}>
  <button onClick={() => setTip(i)} style={{width:44,height:44,…}}>…</button>   {/* ≥44pt around the mark */}
  {tip === i && <ChartTooltip label="Small-cap rally" value="+6.1 pts" meta="As of 30 Sep · Q3 statement" />}
</div>
```
**No arrow or tail** — a 1px leader line runs to the mark instead, because a tail clips at the plot's edges and a clipped tail just looks broken. Two rules the component can't enforce: the 44pt target, and the table view in the card's `⋯`.
