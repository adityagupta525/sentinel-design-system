InlineActionRow — a wrapping row of Pills inside a Sentinel message body, acting on the answer just given (open a canvas, start a branch). Formerly ActionCard; it is a row, not a card.
```jsx
<InlineActionRow actions={[{label:'Tell Sharma now'},{label:'Back to his portfolio'}]} />
```
Owns the entrance (60ms stagger); Pill owns the press state. For pills that answer the pending question, put a ChipRow in the Dock instead.
