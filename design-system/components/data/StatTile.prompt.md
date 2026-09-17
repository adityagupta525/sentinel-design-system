StatTile — V5: one headline number with a sentence-case label and a qualifying line. Sits in rows of two or three on a canvas. Never a one-bar bar chart.
```jsx
<StatTile label="Cost of doing nothing" value="₹4,40,000" note="in a 20% fall" />
<StatTile label="Drift if left to Dec" value="≈74%" sparkline={<Sparkline points={[62,64,67,71,74]} />} locked />
```
`locked` is for figures this product does not compute — pair it with a [PLACEHOLDER — … to supply] line.
