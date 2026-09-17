ClientChip — the bound client, living in the composer: 28px, bronze-20 avatar letter, name, and a `✕` with a 44pt target. Tapping a client **does not navigate** — it binds the next thread to that client, and this chip is what bound looks like. The drawer's client tap and a journey's client picker produce the same chip in the same place, and typing a name resolves to the same state, so selection and typing are one flow.
```jsx
<Composer value={v} onChange={setV} lead={<ClientChip name="R. Sharma" onRemove={unbind} />} />
<ListRow variant="nav" title="Rebalance" chip={<ClientChip name="R. Sharma" />} meta="2h ago" onPress={open} />   {/* read-only inside a row */}
```
Always removable in the composer — a binding the advisor cannot undo in place is a trap. A typed name that matches nothing is the `not understood` bucket, not a silent bind.
