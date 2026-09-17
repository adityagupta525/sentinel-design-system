InfoDot — **the rule as a component: any figure an advisor must defend carries an ⓘ to its explanation.** Shopee puts one on every stat in a fund detail; ours goes on any figure whose basis a client could ask for.
```jsx
<span style={{display:'flex',alignItems:'center',gap:4}}>CAGR 1Y <InfoDot figure="CAGR 1Y" onOpen={openSheet} /></span>
```
It opens the `ExplainerSheet` the system already has — **never a tooltip**: a tooltip at 375pt is dismissed by the next tap and cannot hold a formula, a date range and a source, which is exactly what sits behind "CAGR 1Y". 44pt target around a 14px glyph, from `Pressable`. The accessible name names the **figure**, not the icon.

Its companion rule needs no component: **a caveat sits at the number**, so it is a `caveat` prop on `ChartBar`, `ChartShare` and `StatTile` rather than a line in a global footer.
