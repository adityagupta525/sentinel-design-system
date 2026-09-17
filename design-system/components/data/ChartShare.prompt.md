ChartShare — **the pie, answered**: a 100% stacked bar with a ranked `ChartLegend` beneath it. Same information, and it reads at 375pt, in greyscale and in print — which a pie in this palette does not (adjacent ramp pairs measure ΔE 11.4 against a floor of 15; a muted earthy trio collapses to ΔE 3.8 under protanopia).
```jsx
<ChartShare segments={[{label:'Equity', value:71},{label:'Debt', value:23},{label:'Cash', value:6}]} />
<ChartShare density="peek" segments={[…]} />   {/* → Equity 71% · Other 29%, no legend needed */}
```
Segments rank by value descending, so the ramp carries magnitude and the legend carries the ranking. The largest and smallest are direct-labelled above the legend. If a ring is wanted for a dashboard tile, that is the two-segment meter — one ratio, one limit, one hue — not this.

**`legend={false}` is ignored above two segments.** The legend is the compliance mechanism, not decoration: no colour in this palette separates adjacent segments at 3:1, so suppressing the labels on a four-segment bar would ship four bands nobody can tell apart. Two segments or fewer are already direct-labelled at the bar's ends, so `false` is honoured only there.

**And therefore a peek share carries at most two segments.** Forcing the legend on collided with the 96pt budget — three legend rows measure a 99px block inside a 96px card — and the answer is fewer segments, not smaller type. `density="peek"` collapses the tail into one `Other`, so the bar is leader + Other, both direct-labelled, and **`legend` defaults off at peek** (a legend there would just repeat the row above it). "Equity 71% · Other 29%" is the whole job of a 96pt preview; the breakdown is one tap away in expanded. Measured at peek: 8 + 6 + 15 = **29px**, two children.
