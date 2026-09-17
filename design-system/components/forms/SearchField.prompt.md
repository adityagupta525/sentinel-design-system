SearchField — the field a `searchable` List renders in a picker sheet: the composer's visual style (radius 20, white, 1px `line` ring, bronze 1px + 3px 24% focus ring at 150ms) but **one row at 44px**, so it reads as a filter and never as a second composer. `Clear` is text, not a glyph.
```jsx
<SearchField value={q} onChange={setQ} placeholder="Search 512 clients" />
```
Selection is the browsing path (`List variant="select"` in a sheet, recent clients as `ListRow trailing="radio"` with a `₹4.2 Cr · Balanced mandate` meta line); the docked composer stays the path for an advisor who already knows the name. Neither is primary. `List` and `ListRow` themselves are pending — see the component spec, Part 3.
