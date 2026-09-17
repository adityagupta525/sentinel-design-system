ChartLegend — used **only where a direct label cannot go**: `ChartShare` and the overlap bars. One series never has a legend; two series are end-labelled. 8px dot on its ramp step, label in `--color-ink`, value right-aligned in `--color-muted`, 11.5px, wrapping rather than truncating. **Text never wears the data colour** — the dot carries identity.
```jsx
<ChartLegend items={[{label:'Equity', value:'71%', amount:71},{label:'Debt', value:'23%', amount:23},{label:'Cash', value:'6%', amount:6}]} />
```
Two rules that are load-bearing: **left-aligned to the plot's left edge, never centred**, and **ordered by value descending, always** — so the legend doubles as the ranking and reads fine with no colour at all. Ramp steps follow that rank, never a category. Replaced `Legend` (2026-09-17).
