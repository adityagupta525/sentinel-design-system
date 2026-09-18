# screens/

Roadmap step 4. Product screens built **on** the design system, kept **outside** it.

`design-system/` holds tokens, components and states. It does not hold product screens — a product
screen in the system's own vitrine is stale by construction, because the product moves and the vitrine
does not. That is the reasoning that closed contradiction 43 by deletion, and it is why this folder is
a new top level rather than a folder inside `design-system/`.

**`design-system/ui_kits/` is not touched.** It renders three prototypes off relative paths and the
owner's instruction about it is explicit.

## How a screen page works

Same mechanism as a spec page, one directory up: the page loads `../../design-system/styles.css` and
`../../design-system/_ds_bundle.js`, then compiles its own inline JSX with Babel standalone. It reads
the **bundle**, not the source, so a component change is invisible here until `npm run build:bundle`.

`screen-kit.jsx` is this folder's own shell — `ScreenShell`, `State`, `StateRow`, `Note`, `MotionTable`.
It is deliberately not `design-system/pages/page-kit.jsx`: that kit is built for spec pages and links
back to `00-Index.html`, which does not exist from here.

```bash
npm run build:bundle          # the screens read the bundle
npm run preview               # → http://localhost:4321/screens/index.html
node tools/check-previews.mjs # walks design-system/ AND screens/
```

## The rules every screen in here keeps

1. **Only system components.** If a screen needs something that does not exist, it stops and asks. It
   does not invent a component, and it does not reach into `design-system/` to add one on the way past.
2. **Every state in the matrix is rendered**, not just the typical one. The matrix is in
   `docs/SCREENS-PLAN.md` §2, per screen: empty · loading · typical · edge · refused · error.
3. **No screen mounts `ExplainerSheet` already open.** A sheet mounts closed and is opened by an
   action. F-25's Tab trap and its focus move both arm on the `false → true` transition, so a sheet
   mounted with `open={true}` — restored state, a reload, a deep link — gets neither. The component is
   right; this is the screens' side of the contract, and it is verified with a keyboard on every screen
   that carries a sheet. All three mount sites in `docs/screens-source/` do it the wrong way; do not
   copy them.
4. **A confirm sheet carries no composer.** It is the single documented exception to rule 3 — a
   commit-or-dismiss decision, where a composer would offer a third path that does not exist. Explainer
   sheets keep theirs. Nothing else on any screen may drop the composer.
5. **The canvas does not exist.** It was removed from the product in v5. Three of the archive's seven
   screens are built on it; here they are expanded artifacts in the thread — `ResultCard`, `DataTable`,
   `OverlapView`, `ArtifactCard` — and the thread carries the scroll. `CanvasHeader` is deprecated and
   is not used.
6. **Every figure carries provenance; every motion states its reduced-motion answer.** Both on the
   screen's own page, so a reviewer never has to take it on trust.
7. **Rendered at 375 × 812 and looked at** before it is called done.
