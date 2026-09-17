ArtifactCard — A1: a result living in the thread, and the artifact's **only** surface (the canvas was removed; there is no "Back to chat"). Eyebrow, 16/24 title stating the finding, preview, provenance, then a 44px footer of exactly three slots. The first slot is the disclosure: `Expand ⌄` / `Collapse ⌃`, chevron rotating 180°.
```jsx
const [state, setState] = React.useState('peek');
<ArtifactCard state={state} eyebrow="Drift attribution · Q2 → Q3" title="62% → 71%, mostly the market" provenance="As of 30 Sep · from his Q3 statement"
  onToggle={() => setState(s => s === 'expanded' ? 'peek' : 'expanded')} onWhy={explain} onShare={share} onMenu={openTableView}>
  {state === 'expanded' ? <AttributionChart from={62} to={71} contributions={…} /> : <SparkStrip points={…} endLabel="71%" />}
</ArtifactCard>
```
`peek` (the default) is **96px, fixed** — recognition, not reading. What goes there is a sparkline strip (plot 72 + one 14px end-label row, no ticks, no gridlines, no legend), a single stat row, or a table's top three rows plus `+40 more`. **Never a chart with axes** — the thread is only 463–497px, so a taller peek would eat half of it. `expanded` grows to natural height (plot 180 + 14px axis band) and moves the title and `⋯` into the card's own header row. `filling` is skeleton-first. There is no `'collapsed'` state; a stale caller passing it lands on `peek`.

**No nested scroll** — the contract, not a preference. The card never scrolls; the thread does. No `overflow: auto`, no `maxHeight`, no scrolling `children`. On expand, scroll the thread so the card header sits under the app bar; on collapse, scroll back to the card. Missing actions leave their slot empty — the row never re-centres.
