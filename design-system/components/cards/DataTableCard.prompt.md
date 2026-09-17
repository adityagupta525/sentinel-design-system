DataTableCard — white card: 16px title + eyebrow meta pill, optional description / FilterChips / ConcentrationBar, eyebrow column headers, hairline rows, muted footer, optional "Show all" button. The "name"/"what" column flexes; others shrink.
```jsx
<DataTableCard title="Where ₹25 lakh would go" meta="6 funds" columns={[{key:'name',header:'Fund'},{key:'share',header:'Share',align:'right'}]} rows={[{name:<span>Parag Parikh Flexi Cap</span>,share:<span>22%</span>}]} footer="No fund crosses 25%" />
```
Tables, not charts, carry identity.
