ProgressRail — 2px bronze-gradient rail under the TopBar with "QUESTION 5 OF 12" eyebrow; fills by scaleX. `dim` is the detour signal and dims the rail only — the label always holds full opacity, so never wrap the rail in a parent `opacity`.
```jsx
<ProgressRail n={5} total={12} />
<ProgressRail n={5} total={12} dim />
```
