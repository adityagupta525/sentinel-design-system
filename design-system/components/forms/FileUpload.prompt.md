FileUpload — the file as a chip in the thread, **parsing in stages**. The field standard for document parsing is a per-stage list rather than one progress bar, because the stages are what the reader cares about (Alan ticks `✓ Document detection` then runs `••• Anti-fraud analysis`; Monese/Veriff tick four stages with a spinner on the active one; Notion sits the file chip in the thread above the answer with a follow-up beside it).
```jsx
<FileUpload file={{name:"Sharma_Q3_statement.pdf", meta:"4 pages · 1.2 MB"}}
  stages={[{label:'Found 4 pages', state:'done'},{label:'Read 12 holdings', state:'done', meta:'12'},
           {label:'Matched to his mandate', state:'running'},{label:'Priced the drift', state:'pending'}]}
  onRetry={retryStage} onRemove={remove}
  actions={<FollowUpRow items={['What changed since June?']} />} />
```
This is why `StepTrace` earns twice: **the stages are the success summary arriving progressively**, which is already the system's rule — not "uploaded successfully" but "read her September statement · 4 pages · 12 holdings". So there is no separate success state; when the last stage ticks, the trace collapses to the summary. A **failed stage keeps its place and carries its own retry**, so the advisor retries the stage, not the 40-page upload.
