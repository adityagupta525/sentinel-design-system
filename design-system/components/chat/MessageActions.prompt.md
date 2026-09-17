MessageActions — copy / edit / retry under the **last message only**; at 375pt, actions on every turn are noise. Text only, 11.5px `--color-muted`, **no pills** — this system is text-forward and ghost pills here would compete with the chip row directly below. 44px tap targets, negative row margins so the optical gap under the bubble stays tight.
```jsx
<UserBubble text="Use her KYC age — 38" />
<MessageActions role="user" onAction={a => a === 'edit' && confirmRewind()} />   {/* right-aligned: Edit */}
<SentinelBlock>…</SentinelBlock>
<MessageActions role="assistant" onAction={handle} />                            {/* left-aligned: Copy · Retry */}
```
`Edit` on the last user message returns its text to the composer and discards everything after it on resend. On a journey answer that is the same operation as the Decisions strip's `Edit` — it must state the cost first ("Editing this reopens question 7. The four answers after it will be asked again." · `Edit anyway` / `Keep it`).
