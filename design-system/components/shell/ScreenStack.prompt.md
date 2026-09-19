ScreenStack — two screens in one slot for exactly `--dur-screen`, and **nothing else**. It owns which screen is mounted and how long the outgoing one stays; it owns no motion. Both keyframes are `tokens/effects.css`'s own and the duration is read from the token at run time, so the outgoing screen can never be unmounted before the animation it is waiting for.
```jsx
<ScreenStack screen={screen} render={(s) => SCREENS[s]}
  direction={goingBack ? 'back' : 'forward'}
  onSettle={() => restoreScroll()} />
```
**Going back is the same motion read backwards.** `direction="back"` plays `ds-screen-in` / `ds-screen-out` swapped and reversed — no third keyframe. A back gesture that looks like a forward one tells the advisor they went deeper when they went up. Under reduced motion both keyframes are already a fade in place, and a reversed fade is still a fade, so `back` needs no special case. `render` must draw from the key alone: while a transition runs it is called for a screen the parent has already left. **There is no shared-element transition in this system** — whole screens or nothing.
