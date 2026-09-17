ResponseFeedback — marking an answer wrong. Sentinel had this **nowhere**, in a product whose whole value is the quality of its answers and whose answers an advisor has to defend to a client. The mechanism is Mindvalley's Eve AI (👍/👎 at the foot of a response), with two changes: **no emoji** — the glyphs are drawn on the icon set's 24px grid at 1.5px — and confirmation happens **on the control that was pressed**, because the no-toasts law leaves the acknowledgement nowhere else to go.
```jsx
<SentinelBlock>…</SentinelBlock>
<ResponseFeedback onRate={send} onReason={log} />
```
**Down is deliberately not symmetrical with up.** Up is one tap and done. Down opens a short reason row — `The number is wrong · Not what I asked · Missing a holding · Too long` — because a down-vote without a reason is the least useful signal there is, and chips rather than a text field because a field asks an advisor for an essay between meetings. Sits at the foot of the **last** assistant message, like `MessageActions`.
