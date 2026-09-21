DotField — bronze dots on orbits that settle into the mascot, eyes first. The splash's reveal.
```jsx
<DotField size={168} onSettled={() => setSolid(true)} />
<DotField size={168} working />      // settled and breathing, SentinelThinking's rhythm
```
One colour from `--color-bronze`, never passed in. Pair with `<Mascot>` for the hand-off; do not
use it as a spinner beside text — that is `SentinelThinking`'s job.
