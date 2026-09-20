# UserTurn

The advisor's half of a turn: the bubble they typed, and the actions under it.

Use it for **every** thing the advisor said — a typed question, a chip they tapped that became a
sentence, the caption over a file they attached. Sentinel's half is `SentinelTurn`; a thread is those
two alternating and nothing else.

- `costNote` says what re-sending will cost **before** it is sent. Pass it wherever the turn below is
  work that would be replaced.
- `busy` while the answer is arriving — the actions come back when it has landed.
- `editable={false}` for a turn in the history. An answered question is not re-editable in place.

Never place a bare `UserBubble` in a thread: it renders the words and drops the edit, which is the
rule about the last prompt being editable.
