ChartReadout — for **dragging** along a plot. A fixed 22px row **above** the chart, not a box that follows the finger: during a scrub the finger is sitting on the thing you are trying to read. X label left in muted, value right in ink, tabular figures; the chart draws a 1px crosshair at the touch position and nothing else moves.
```jsx
<ChartReadout label="30 Sep" value="71%" active />
<ChartLine scrub series={[…]} />     {/* ChartLine renders this row itself when scrub is on */}
```
**The row is reserved when idle**, showing the latest value — so it never appears out of nowhere and shifts the layout. Tapping a single mark is the other interaction and it is `ChartTooltip`.
