CompareTable — two or three funds, **read across a row**. `DataTable` is many entities with one kind per *column*, sorted and expandable; a comparison is its transpose — few entities, one kind per *row*, and the read is sideways. `OverlapView` answers the other comparison question (how much of two funds is the same fund).
```jsx
<CompareTable
  entities={[{ id: 'ppfas', name: 'Parag Parikh Flexi Cap', meta: 'PPFAS · Flexi cap' }, …]}
  rows={[{ label: 'Expense ratio', values: { ppfas: '0.63%', hdfc: '0.74%' }, better: 'low' },
         { label: 'On your shelf', values: { ppfas: 'Yes', hdfc: 'Yes' } }]}
  onAdd={pickThird} cap={3} capNote="Three is the most that fits…" footnote="As of 30 Sep · …" />
```
**The same value is the information, and it recedes.** The spec says "differences bolded", and taken literally that bolds almost every cell — two funds differ on nearly everything. Inverted it is useful: a row where every fund says the same thing is **muted**, so the eye lands where they actually part. A de-emphasis, not a claim. **`better` is the one claim, and only where direction is a fact** — a lower expense ratio is cheaper, which is arithmetic; a fund's *size* has no better, and a row without `better` never marks one. The winning cell takes `--type-row-strong-font`: same size, one weight up, never a colour. A tie marks nothing. Missing renders `——`, never a blank and never a zero. **The verdict belongs in a sentence in the turn**, not in the table: *"a table anyone can build; the reading is what the advisor is paying for."* Two funds fit 375 (104 + 2×105); a third scrolls sideways with the label column pinned.
