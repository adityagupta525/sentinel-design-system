VersionRow — every revision of an artifact as a row in the thread, with a revert on each. The mechanism is Wabi's (`V1 ↺ · V2 ↺ · V3 ↺` in the conversation itself); it closes a **product hole, not a visual one** — an advisor who has revised a proposal twice has no way back to the version the client actually saw.
```jsx
<VersionRow currentId="v3" onRevert={restore} versions={[
  {id:'v1', name:'V1', summary:'First pass — 6 funds', meta:'Mon 11:04 am', sent:true},
  {id:'v2', name:'V2', summary:'Swapped the mid-cap for a flexi-cap', meta:'Mon 3:40 pm'},
  {id:'v3', name:'V3', summary:'Trimmed to 4 funds', meta:'Yesterday 4:12 pm'},
]} />
```
The current version carries the sand `--color-selected` fill and says *showing now*; the version the client received says *sent to the client*. **Revert never destroys** — it appends the restored version as a new revision, so the trail only grows. `Revert` is a word with a glyph beside it, never a glyph alone.
