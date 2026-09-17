ChartLine — one or two series, **never three**. 2px stroke, round caps; series 2 dashed 4-2, muted, drawn behind; area fill (`--tint-bronze-06`) only on a single series. Baseline only, no gridlines — one dashed line when there is a target. Both series end-labelled; **no legend**.
```jsx
<ChartLine density="expanded" series={[{label:'Sharma', points:[{x:1,y:62},…]}]} target={{value:60}} scrub valueFormat={v=>`${v}%`} />
<ChartLine density="peek" series={[…]} />                        {/* the 96px card: plot 72 + one 14px label row */}
<ChartLineMultiples series={[a,b,c]} />                           {/* three or more: one chart each, shared scale */}
```
Scales, nice ticks and the monotone path come from `d3-scale` / `d3-shape` (peer, via `window.d3`); every stroke, fill and duration is ours. Draw-on is `stroke-dashoffset` — the one named motion exception: 600ms, first reveal only, never on a re-render, opacity-only under reduced motion.
