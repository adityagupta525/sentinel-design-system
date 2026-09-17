StepTrace — **what the assistant did**, as collapsible one-line rows with per-step state. The mechanism is converged across four AI products (Manus indents reasoning under a step; Linktree's `Analysis ⌄` opens a ruled list of ticked steps; ChatGPT collapses a tool call to `Ran 3 commands ›`; DeepSeek heads its trace `Thought for 5 seconds ⌄`) — drawn here in Sentinel's own language: ProgressTrace's spine and 16px node, the 40% rule for pending rows, the existing collapsed-reasoning summary row.
```jsx
<StepTrace id="trace-1" defaultOpen steps={[
  {label:"Read her holdings", state:'done', meta:'12 holdings'},
  {label:"Matched to the mandate", state:'done', detail:'Equity ceiling 60%, on file since March'},
  {label:"Checked the compliance shelf", state:'running'},
  {label:"Priced the switch", state:'pending'},
]} />
```
For an advisor this is provenance, not decoration — *read her holdings · matched to the mandate · checked the compliance shelf* is what they repeat to the client. **Failure is a step, not an absence:** a failed row keeps its place, turns its label to status tone, carries the word, and offers `retry` inline. The same component is `FileUpload`'s staged parse (`dense`), because the stages **are** the success summary arriving progressively.
