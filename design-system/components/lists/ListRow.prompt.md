ListRow — one row with **constrained pairings**, enforced here rather than left to the caller: `nav → chevron|meta`, `select → radio`, `multi → checkbox`, `action → menu`, `static → badge|meta|none`. An illegal trailing falls back to the variant's default and warns once. The chevron belongs to `nav` and nowhere else — an affordance meaning "goes somewhere" never sits on something that selects. `static` takes no `onPress` and is exempt from the touch-target rule, like Badge. 56px, or 72px when a subtitle is present.
```jsx
<ListRow variant="nav" title="Meera's risk profile" meta="Step 7 of 16" trailing="chevron" onPress={open} />      {/* progress hint */}
<ListRow variant="nav" title="Why did Sharma's portfolio drift…" meta="2h ago" onPress={open} trailing="meta" />   {/* relative time */}
<ListRow variant="nav" title="Rebalance" chip={<ClientChip name="R. Sharma" />} meta="Yesterday" trailing="meta" onPress={open} />
<ListRow variant="select" leading="avatar" title="Sunita Nair" subtitle="Reviewed 12 Sep" selected onPress={pick} />
<ListRow variant="action" title="₹25 L proposal" subtitle="Saved 14 Sep · 6 funds" onMenu={menu} />
```
The drawer's three row shapes are compositions of this one row: **progress hint** (`meta="Step 7 of 16"`), **relative time** (`meta="2h ago"`), **client chip** (`chip={<ClientChip …>}`). Question options are **not** rows — they stay in the dock as chips.
