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
8. **Nothing breaks the 16pt gutter.** `check-previews` enforces it on every `screens/` page: inside
   each phone frame, an element must sit at least 16pt from both edges. Full-bleed chrome is exempt by
   geometry — left 0 **and** right 0 — and each page names its own in a `@gutter` marker so the
   exemption is readable:

   ```html
   <!-- @gutter min="16" fullBleed="ScreenBackdrop, StatusSpacer, TopBar, GreetingDivider, Dock, HomeIndicator" -->
   ```

A box that **clips** is checked itself and then closes the question for everything inside it — what
   cannot be seen outside a box cannot break a gutter. That is what exempts `ScreenBackdrop`'s two aura
   blobs at `left: -93` and `right: -120`. The phone itself is excluded on purpose: the phone clipping
   something **is** the bug.

   An element may also declare `data-gutter="edge"` and become **the frame for its own subtree**. A
   drawer is flush to the phone's left edge because that is what a drawer is, and geometry cannot tell
   that apart from a card that overran. Its contents are then measured against the drawer, so they still
   owe both gutters — measured, a 300pt drawer keeps the same 16 the phone does. The count of
   edge-anchored elements is printed with the result, because an escape hatch nobody can see is an
   escape hatch that gets used.

   This exists because it was missed. Screen 1 shipped a card 367pt wide in a 343 box, 8pt past the
   right edge and visibly cut off, and `75/75 pages render clean` was true the whole time — the harness
   asked whether the page rendered and threw, never whether it fitted. The cause was a `width: 100%`
   child carrying its own `padding: 0 12px` without `box-sizing: border-box`, which is the one mistake
   most likely to recur on every screen after it. Watch it fail:

   ```bash
   node tools/check-previews.mjs --self-test
   ```

   **What the guard covers, and what it does not — decided, not assumed.** It runs on **`screens/` and
   `design-system/ui_kits/`**: both are product-shaped surfaces, where a phone frame means a screen and
   the screen has edges. It does **not** run on the component spec pages or the group boards, because
   those are specimen boards — a specimen may legitimately show a component against the edge to
   demonstrate exactly that, and failing it would teach people to add exemptions rather than fix
   screens.

   That scope was measured before it was written down. Running the guard over every page in the
   repository reports **zero** gutter errors, and the only pages carrying phone frames at all are the
   three UI kits (16 + 11 + 1 = 28 phones) and this folder (4). So covering the kits costs nothing
   today and catches a regression there tomorrow; covering spec pages would cover nothing at all.
   **Do not read "N/N pages render clean" as "the whole repository is gutter-checked".** It is not,
   and that is on purpose.
9. **Nothing truncates silently — and write copy that fits with ROOM.**
   CI renders on Linux, where this face measures wider than it does on macOS: a version summary that fitted
   locally needed 220px in a 218px box on the runner and failed the gate (run 64). Two pixels is not a
   margin. If a string is close to its box, shorten it rather than declaring the truncation allowed.
   The original rule: On the same surfaces, any element with `text-overflow: ellipsis`
   whose text is wider than its box fails the page — unless the page's `@gutter` marker says
   `truncation="allowed"`, with a comment naming which state truncates on purpose. A label lost a third
   of itself on 18 Sep and passed every check until a human measured it.
10. **One Babel scope, checked before the browser.** Every `text/babel` file a page loads compiles into
   one global scope; a second top-level `const { Dock } = …` is a `SyntaxError` and the page renders
   nothing. `check-previews` now lists every top-level `const` / `let` / `function` / `class` across a
   screen page's loaded `.jsx` files and inline script and fails on a duplicate — the class of failure
   that broke Home's extraction and the drawer on first load. Shared `.jsx` files use one uniquely
   named const (`THREAD_DS`) and read components through it.
11. **Screens run the system's adherence lint in CI** (`npm run lint:adherence:screens`) — the raw-hex
   and reach-into-`components/` rules the system holds itself to. It does not yet count raw px values
   the way `_index.json` does for components; that gap is open.
12. **A live page plays only the system's motion.** `journey-b/prototype.html` runs screens 1 → 3 with a log
   of what moved and which keyframe carried it. Every animation there is a `ds-*` keyframe on a `--dur-*`
   token; the page decides only the order. The one thing it hand-builds — `ScreenStack`, two screens in one
   slot — holds no value of its own and is named on the page with its promotion trigger: the second live
   page that needs it moves it to `shell/ScreenStack`. Reduced motion is verified by running the same
   probe under `reducedMotion: 'reduce'`, not by reading the CSS.
13. **A thread rests with its newest turn's first line on screen.** If the turn also fits, it ends on
   screen too. `thread.jsx` does this on `revision`, never on every render, so a caller's own scrolls —
   `ArtifactCard`'s expand-to-header and collapse-back — are not fought. Measured on screen 3: a 500pt
   turn in a 462pt thread.
14. **Shared turns live in one file.** Home (`home.jsx`), the thread shell (`thread.jsx`), the answer turn
   (`answer.jsx`) and the menu's data (`shell/menu.jsx`) are each written once and loaded by every page
   that draws them, so a frozen state and the live prototype cannot disagree. New shared files use one
   uniquely named const (`ANSWER_DS`, `MENU_DS`) and export through `Object.assign(window, …)`.
15. **Screens and the system stay parallel** — the owner's rule, 18 Sep 2026: *nothing in the design
   system that is on no screen.* Two components proved why on the day it was made: `MessageActions` had
   offered Edit since v1 with no state to go to, and `FileUpload` had carried its staged parse since v7
   while the composer's paperclip was a `<div>`. Both were found by the owner looking at a screen.
   `npm run report:parallel` prints the gap in both directions, counting **transitively** — a screen that
   places `Drawer` is exercising `List` and `ListRow` whether it names them or not. The backlog half is a
   report, because two journey screens are still unbuilt; the defect half — a screen naming something the
   system does not export — fails CI.
16. **What the advisor is offered lives in the conversation.** Chips and CTAs sit inside the turn that
   offered them and scroll away with it — never pinned above the composer, where they outlive their turn
   and the screen reads as a toolbar. The composer stays docked: rule 3 is untouched. `Dock`'s `chips`
   and `cta` slots are deprecated (contradiction 60).
17. **One signature per turn, one door per thing.** Pass `continued` on every `SentinelBlock` after the
   first in a turn. Two controls that open the same sheet on one screen is a defect, not a convenience —
   keep the one that reads aloud.
18. **Whose message is it.** The advisor's things sit on the advisor's side and are capped like their
   bubble; Sentinel's fill the width. A file the advisor attached arrives at the END of the thread, like
   any message of theirs (`FileUpload side="advisor"`).
19. **Copy in plain English.** The advisor reads these sentences to a client and may not be a confident
   English reader: short sentences, the number before the explanation, no jargon where a plain word
   exists. Simplify the words, never the figure or the claim.
20. **A state of a screen is not a screen.** The expanded artifact is a state of the answer screen, on the
   same page. A new page is for a new surface.
21. **Run the reviewer before showing work.** `.claude/agents/sentinel-interface-reviewer.md` is the lead
   designer's pass: repetition, duplicate controls, placement, whose message, controls that are drawings,
   copy, iconography. Every item on its list is there because the owner found it on a rendered screen.
22. **The advisor's last prompt is always editable, and one component does it.** `AskTurn` in
   `journey-b/thread.jsx` is the only way a screen renders what the advisor said: it owns the bubble, the
   Edit affordance and the `costNote` that says what sending will replace. Every page rendering its own
   `UserBubble` is how the affordance ended up on one screen out of five. Where it is NOT offered, and why:
   a turn still running (Stop is the control, and it is in the send slot), a file (it is removed and
   replaced, not re-worded), and Home (there is no prompt yet).
23. **The paperclip is real on every screen.** `useAttachment()` + `<AttachedTurn>` give a screen the real
   picker, the file on the advisor's side at the END of the thread, and an honest output: the designed
   specimen shows its designed parse, and a file the VIEWER picks shows its own name and size with the
   stages pending and a `ParseNote` saying this specimen does not read it — because printing "18 holdings"
   over someone's own file would be a fabricated figure. `check-previews` fails any `screens/` phone whose
   Composer has no real file input behind its attach button.
24. **One book, and it is `screens/data/book.jsx`.** Every client, fund, holding, limit and rate lives
   there; a screen derives, it does not re-type. Before it, the same client held 43 funds on one page and
   31 on another. Load it before any other `.jsx` on the page. `docs/DNA.md` says what each field means,
   what the product calls it, and what is known, unknown or not applicable — the three states a field can
   be in, and the three different ways they render.
