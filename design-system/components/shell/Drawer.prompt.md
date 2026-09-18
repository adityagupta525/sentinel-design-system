Drawer — the menu over a 25% scrim: Jump back in (cap 3), Recent (cap 7), Clients (cap 8), each with "See all N" when capped; a footer slot for Back to home and the appearance control; no composer. Mount closed, open with an action.
```jsx
<Drawer open={open} onClose={() => setOpen(false)} onNew={newChat} saved={SAVED} recent={RECENT} clients={CLIENTS}
  footer={<><Pressable onClick={home} label="Back to home">‹ Back to home</Pressable><SegmentedRow label="Appearance" options={['Light','Dark']} value="Light" locked lockedNote="One theme so far. Dark arrives with its tokens." /></>} />
```
