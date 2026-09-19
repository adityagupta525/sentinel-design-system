ConfirmSheet — the decision surface, and the only one in the product with no composer (rule 3's single exception). Fixed order: title → disclosure ABOVE the numbers → compliance as rows → what is being approved → commit, with a visible dismiss beside it.
```jsx
<ConfirmSheet open={confirm} title="Approve · R. Sharma" onClose={()=>setConfirm(false)} onCommit={approve}
  disclosure="These two switches run under your ARN. Sharma gets a note explaining both moves and the cost. Nothing else in his book changes."
  rows={[{label:'Compliance shelf',value:'Passed'},{label:'Single-fund ceiling',value:'No fund over 25%'},{label:'Client consent',value:'Required',tone:'required'}]}>
  <MoveCard n={1} title="Move ₹1,85,000 out of Quant Small Cap" body="Into ICICI Corporate Bond." />
</ConfirmSheet>
```
`disclosure` and `rows` are required: small print under the numbers was read after the decision, and compliance not stated as a row is compliance implied by silence.
