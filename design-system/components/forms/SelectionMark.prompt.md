SelectionMark — the radio and checkbox forms, drawn rather than imported: 20px box, 1.5px ring, bronze when selected, white check on bronze for the checkbox.
```jsx
<SelectionMark kind="radio" selected />
<SelectionMark kind="checkbox" selected />
```
Belongs to a row (`variant="select"` takes radio, `variant="multi"` takes checkbox). Never a standalone control, never in a chip.
