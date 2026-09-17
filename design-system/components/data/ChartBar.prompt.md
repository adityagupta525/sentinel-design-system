ChartBar — **vertical for time, horizontal for comparison**. Bars are **one colour** (ramp 1): every bar sits directly on the page, and measured, only ramp 1 clears WCAG's 3:1 against it (6.59 / 7.24 — ramp 2 is 2.57, ramp 3 1.66, ramp 4 1.30). Rank is carried by **length**, the strongest channel there is; the ramp was encoding it a second time in a channel three quarters of which nobody can see. 24px at the thickest, 4px rounded at the data end, square at the baseline, values at the bar end in tabular figures, track carrying its `--border-hairline` edge.
```jsx
<ChartBar bars={[{label:'Equity', value:71},{label:'Debt', value:23},{label:'Cash', value:6}]}
  caveat="These percentages are rounded for simplicity" />
<ChartBar orientation="vertical" bars={[{label:'Q1',value:62},{label:'Q2',value:66},{label:'Q3',value:71}]} />
<ChartBar bars={[{label:'Equity', value:71, tone:'status'}, …]} />   {/* one crossed limit */}
```
It grows with `scaleY` from `transform-origin: bottom` (`scaleX` from the left when horizontal), 480ms, **staggered 60ms** down the rows. Under reduced motion every bar lands full-length with an opacity fade. `caveat` puts the rounding note **at the number**, not in a global footer.
