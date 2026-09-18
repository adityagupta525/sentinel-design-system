ProgressTrace — Sentinel's working state: "Working · 3s", a 1px rail of 16px circles (bronze check done · bronze-ringed active · line pending), then collapses to "Thought for Ns ›".
```jsx
<ProgressTrace steps={["Reading Sharma's holdings — 18 funds","Comparing against his mandate","Attributing the drift"]} reasoning="Equity went from 62% to 71%…" onDone={next} />
```
Frozen specimens: `autoplay={false} initialActive={N} seconds={4}`; past the last step it is finished, and `initialCollapsed` starts it at the one-line resting state a real answer sits under.
