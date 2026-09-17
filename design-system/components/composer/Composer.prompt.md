Composer — the persistent message bar: white radius-20 card, 14px medium input, attach disc (line ring) left, 42px dark-gradient send disc right (40% when empty; a white Stop square while streaming). Focus = bronze border + 3px 24% bronze ring.
```jsx
<Composer value={v} onChange={setV} onSend={send} placeholder="Ask Sentinel" />
<Composer value="" onChange={()=>{}} streaming onStop={stop} />
```
Present on every screen. A CTA stacks above it; nothing replaces it.
