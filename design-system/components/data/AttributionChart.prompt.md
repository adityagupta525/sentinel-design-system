AttributionChart — V3, the diverging attribution bar: a top-down chain from the agreed target to today. Each contribution is a 20px bronze bar with its value direct-labelled at the tip; an `intentional` contribution goes de-emphasis grey with a hairline so "what you did" separates from "what happened to you" without a second colour. The total counts up in the display face.
```jsx
<AttributionChart from={62} to={71} target={60} contributions={[
  {label:'Small-cap rally',value:6.1,note:'the market, not a decision of yours'},
  {label:'His own top-up in July',value:3.4,note:'went into Quant Small Cap'},
  {label:'Your switch out of small cap',value:-1.2,note:'this one was intentional',intentional:true},
  {label:'Debt fund NAV drift',value:0.7}]} />
```
Never a pie, donut or multi-hue stack.
