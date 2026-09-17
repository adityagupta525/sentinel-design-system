List — the wrapper around `ListRow`: eyebrow header, inset/full/no dividers, an optional footer row (`See all 43`), `groupBy` (`client` / `date` / `journey`), skeleton `loading`, and an **`emptyState` that is required, not optional** — every list in this product is empty on someone's first day, and the copy is real, in the product's voice, never "No data".
```jsx
<List header="Saved work" rowProps={{variant:'nav', trailing:'chevron'}}
  items={[{title:"Meera's risk profile", meta:'Step 7 of 16'}, {title:'₹25 L proposal', meta:'Draft · 2 funds'}]}
  footer={<Pill label="See all 43" tone="tertiary" />}
  emptyState={{title:"Nothing in progress", body:"Anything you start and don't finish waits here."}} />
```
**One scroll.** A List never scrolls independently inside a scrolling surface — cap it and add a footer row instead. That is why the drawer's sections are capped at 3 / 7 / 8 with `See all`.
