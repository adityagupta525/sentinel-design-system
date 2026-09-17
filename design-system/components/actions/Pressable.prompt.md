Pressable — the operable base under thirty component files. Calm press micro-state (scale 0.98 / 150 ms) plus **two guarantees callers cannot get wrong**: a **≥44 pt tap target**, measured off the rendered box and extended with a transparent `::before`, and a **`:focus-visible` outline** — 2px solid `--border-focus`, offset 2px, plus the `--focus-ring` halo.
```jsx
<Pressable onClick={open}>{children}</Pressable>
<Pressable onClick={menu} label="Row options">⋯</Pressable>        {/* glyph → label required */}
<Pressable onClick={toggle} expanded={open} controls="trace-1">Thought for 4s ⌄</Pressable>
<Pressable expand="none" style={{width:48,height:48}}>…</Pressable>  {/* already ≥44 both axes */}
```
**Why an outline and not a box-shadow:** the first version painted the ring with `box-shadow`, and an inline `style.boxShadow` from a caller beats a stylesheet rule — measured, a chip passing its own 1px ring returned `rgb(225,222,218) 0 0 0 1px` on focus and no ring at all. Four callers did exactly that, so the guarantee held for some components and failed silently for others, which is the one thing a base must never do. Callers may pass `boxShadow` freely; **they must not pass `outline`**.

Why solid and not just the halo: the halo is bronze at 24 % alpha, composites to `#e7ddd4`, and measures **1.22:1** against canvas — below WCAG 2.4.13's 3.0 floor. The solid outline is `--color-bronze-deep` at **6.59 / 7.24**. Both tokens already existed; only their use is new. This component previously set `outline: none` with nothing in its place, which switched the browser's own indicator off for everything beneath it.
