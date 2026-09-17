MotionGuard — the `prefers-reduced-motion` block **in the bundle**, not only in `tokens/effects.css`. It installs itself the moment `_ds_bundle.js` evaluates, so a consuming project that brings its own page styles still honours reduced motion; every motion row in the system is a promise the build now keeps. Idempotent (`id="ds-reduced-motion"`).
```jsx
/* nothing to do — loading the bundle installs it */
installReducedMotion();          // explicit, e.g. into an iframe document
<MotionGuard />                  // only when the bundle is loaded lazily
```
Keyframes are **redefined, not cancelled**: every looping or entrance animation lands in its final state with an opacity fade and nothing else — no translate, scale, rotation or pulse — and transitions collapse to 1ms.
