FollowUpRow — **a follow-up that exceeds one line becomes a row, not a pill.** That is the rule this component exists to carry. A wrapping pill has stopped being a pill: its radius-full ends turn into a lozenge and its 44pt target becomes two rows of uneven target. Three products solve it as a row — Mindvalley groups full-width rows under a label, GitHub Copilot uses two-line title + description cards, Agoda adds a leading icon and trailing chevron — drawn here in ListRow's geometry under an Eyebrow.
```jsx
<FollowUpRow onAsk={send} items={[
  {question:'What about the 34 tiny funds?', note:'They are 4% of the portfolio and 60% of the paperwork'},
  {question:'What would this look like if we did nothing until April?'},
]} />
```
`Pill` keeps the short follow-ups; this takes the real questions. Rows are **inline** — they belong to the message that produced them and scroll away with it, so they sit under the answer and **never in the dock**, which is for what persists.
