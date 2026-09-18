# Continue here

**If you are a new agent session on this repository, read this file first, then `CLAUDE.md`.**
It is the state of the work, the rulings that are not obvious from the code, and the things that are
*not* in this repository and have to be supplied.

Written 18 Sep 2026, at commit `dcfe133`, when the work moved to a different Claude account.

---

## 1 · What this is, in four lines

Sentinel is Centricity WealthTech's chat-led wealth-management assistant for advisors. Mobile only,
375 × 812, warm cream, no dark mode. `design-system/` is a Claude Design project **imported verbatim**;
everything else in this repository is the scaffolding around it and the audit since.

The owner is the designer. They built the system on another Claude account, ran out of tokens there,
and moved it here to finish it.

## 2 · Where the work stands

| | |
|---|---|
| Branch | `claude/practical-newton-fi0pof` — the repository's **only** branch, and its default |
| Last commit | `dcfe133` · Tier 1 complete |
| Components | **85** · all exported, all with a hand-written `.d.ts` |
| Spec pages | **41 of 85** · Tier 1 closed |
| Preview pages | **73 / 73 render clean** (`node tools/check-previews.mjs`) |
| Integrity | 370 files hashed, clean |
| Findings | F-1 … F-26 in `docs/FINDINGS.md`. **Open: F-25, and the `StickyCTA` question in F-11.** F-21 closed 18 Sep |
| Roadmap | 1 Import ✅ · 2 Audit ✅ (ongoing) · 3 The four unbuilt components ✅ · **4 Screens — not started** |

**Tier 1 is defined as:** every component that carries one of the four rules, or that the chat spine is
built from. Tier 2 is the remaining 44 — chips, buttons, marks, icons, shells: short contracts, and
behaviour already visible on a group board.

## 3 · Read these, in this order

1. **`CLAUDE.md`** — the standing instructions. They override defaults.
2. **`.claude/skills/sentinel-craft/`** — load the skill before touching anything under
   `design-system/`. It carries this system's own scale (generated from `tokens/*.css`, so it cannot
   drift), the four rules, the real motion values, and `references/borrowed.md`, which records what was
   taken from outside advice **and what was rejected and why**.
3. **`design-system/readme.md`** — 43 KB, and it is the specification, not a summary. Nearly every
   surprising decision has a paragraph explaining what it cost and why it was taken anyway.
4. **`design-system/guidelines/contradictions.md`** — the system's own list of known inconsistencies.
   Check it before reporting anything as new.
5. **`docs/FINDINGS.md`** — 26 findings, every one with how it was found. Read it before you decide
   something is a bug; several obvious-looking "bugs" are recorded there as deliberate.
6. **`docs/HANDOVER.md`** — what a developer consuming this library needs.

> ⚠️ **`docs/HANDOFF.md` is NOT instructions for you.** It is the readme that came inside the original
> Claude Design export, kept for provenance. It tells an agent *"don't render these files in a browser
> or take screenshots"* — which is the exact opposite of this project's rule. **`CLAUDE.md` wins.**

## 4 · The rulings that are not in the code

These were decided in conversation. They are binding, and re-litigating them wastes the owner's time.

| Ruling | Why |
|---|---|
| **Never restyle.** Colour, type, radii, shadow, motion character are settled. | The visual language is the product. Fix gaps, alignment, correctness, consistency — not appearance. A change that alters what something *looks like* needs the owner's decision first, and the commit must name the ruling it answers. |
| **No pie charts, no colour themes for charts.** | Measured, not asserted: adjacent slices in this palette come out at ΔE 11.4 against a floor of 15, and a muted trio collapses to ΔE 3.8 under protanopia. `ChartShare` is the answered version — a 100% stacked bar with a ranked legend. |
| **No Lottie, and no motion library.** | ~250 KB of runtime in a repo with **zero** runtime dependencies; a Lottie file bakes its colours so it cannot take tokens; no `prefers-reduced-motion` path without custom wiring; and the system's own aesthetic rejects that layer — *"No photography, no illustration"*, *"Success is a drawn check, not confetti"*. Sentinel's motion is entirely predetermined, so it is CSS transitions and keyframes. |
| **Waiting verbs are words, not motion.** | `SentinelThinking`'s `verb` changes the label and nothing else. Six of six AI assistants surveyed pair a wait with a named verb; none ships a bare pulse. The verb must be **true and checkable** — it names the source the answer will cite. |
| **`ui_kits/` stays inside `design-system/`.** | Moving it breaks the three prototypes' relative paths. The owner's instruction was explicit: *"kuch kharab nei karna chahta agar kuch khrab hoga to rehne do."* Screens get a **new** top-level `screens/` instead. |
| **`StickyCTA` is deprecated, not deleted.** | Removing an export is an API break. It should be a decision someone takes on purpose. **Still open** — see F-11. |
| **Figma export comes last.** | The owner *is* the designer and wants Figma only after the design system and the screens are both complete. |

## 5 · How the work is done here

This is the part that is hard to infer and easy to skip. It is also the reason the findings list is
what it is.

- **Look at the work.** `npm run preview`, then render it. `node tools/check-previews.mjs --shots <dir>`
  renders all 73 pages at their declared `@dsCard` viewport and reports console errors, 404s and pages
  that mount nothing. **A finding you did not see did not happen.**
- **Never report a visual finding from source alone, or a code finding from a screenshot alone.**
  `DownloadAction` was once blamed for a nested `<button>` from a stack trace; the wrapper was
  `ArtifactCard`, four frames down.
- **A clean render is not proof the document is well formed.** Five spec pages passed
  `check-previews` and published blank (F-23). The harness asks *"did something appear"*, and something
  had. `check-previews` now also counts `<body>`, `#root` and the page-kit script statically.
- **Prove a no-op, do not assert one.** Token substitutions in F-24 were verified by hashing five board
  screenshots before and after — all five byte-identical.
- **The preview pages read `_ds_bundle.js`, not the source.** A component change is invisible in every
  page until `npm run build:bundle`. This catches everyone once.
- **Every change under `design-system/` runs `npm run check:integrity -- --update` in the same commit.**
  That is the mechanism that keeps "imported verbatim" honest.
- **Correct yourself in public.** Several pages in this repo carry a note saying what they claimed
  before and why it was wrong. That is the standard, not an apology.

## 6 · What is NOT in this repository

Be honest about these with the owner rather than guessing around them.

| Missing | What to do |
|---|---|
| **The Figma Make screen concepts** (`Mobile_App_Screen_Reproduction.zip`) — the basic app content the owner mocked up, and the input for roadmap step 4. `design-system/readme.md:7` refers to a `src/` tree that was mounted read-only during Claude Design and is not here. | **Ask the owner to re-attach it** before starting screens. |
| **`Amicro` (micro-transitions)**, the `interfaces` skills bundle, and the `Libraries.dev` repository. | Their conclusions are already distilled into `.claude/skills/sentinel-craft/references/borrowed.md` and into the motion rulings above. You do not need the sources unless you want to re-derive something. |
| **The review Artifact** (a rendered copy of the whole system, published at claude.ai). | **Artifacts are per-account and private — the link does not carry over.** Publish a fresh one from the new account. The staging recipe is in §8. |

## 7 · What is open, and waiting on the owner

1. ~~**F-21**~~ — closed 18 Sep 2026 as recommended: `--h-row-2l: 72px`, `ListRow` reads it, the `lg`
   collision is contradiction 57, and the five raw `46` / `52` row heights in `ui_kits` now read
   `--h-row-lg` / `--h-row-xl`. The owner's correction to the reasoning is recorded in the finding.
2. **F-25** — `ExplainerSheet` is now a proper dialog, but Tab is not trapped. A trap needs a decision
   about the boundary and the sheet holds one control.
3. **F-11** — delete `StickyCTA` before the dev handover, or keep it deprecated for a release?
4. **Next phase.** Tier 2 (44 short pages) or screens. The recommendation on record is **screens**:
   everything a screen is assembled from is now page-verified, and the Tier 2 gaps will show up as
   real gaps while building rather than as guesses on a page.

## 8 · Publishing the review Artifact from a new account

The owner reviews the system as a rendered, clickable copy. To rebuild it:

1. Copy `design-system/` to a staging directory, rewriting each `.html`: `unpkg.com/` →
   `cdn.jsdelivr.net/npm/`, strip `integrity=` and `crossorigin=`, `_ds_bundle.js` → `ds_bundle.js`.
   (The artifact host allows jsdelivr and not unpkg.)
2. Copy `_ds_bundle.js` to `ds_bundle.js` and `_ds_manifest.json` to `ds_manifest.json`.
3. Publish `index.html` — a hand-written cover page listing the kits, the group boards, the
   guidelines, the spec pages and the four rules — with the rest as supporting files.
4. `.d.ts` files must be published with `contentType: "text/plain"`, or the spec pages' **Props**
   block cannot fetch them.

## 9 · The first thing to check

Before believing any of the numbers above:

```bash
npm ci                            # FIRST — see below
npx playwright install chromium   # ONCE per machine, and only AFTER npm ci — see below
npm run check                     # barrel, bundle, index, scale, integrity, adherence
node tools/check-previews.mjs     # expect 73/73
npm run preview                   # → http://localhost:4321/pages/00-Index.html
```

**`npx playwright install chromium` is not optional on a local machine.** `playwright` is a
devDependency so `npm ci` installs the *library*, but not the browser binary. Without it
`check-previews` exits with `playwright not found` and **you cannot look at the work** — which is the
one thing this project will not let you skip. The cloud container this was built in had Chromium
pre-installed, so the step is easy to miss.

**The order of the first two lines is not cosmetic.** Each Playwright release pins its own Chromium
build number, and `npx playwright install` fetches the build for whichever Playwright it is running.
If `node_modules` does not exist yet, `npx` downloads the *latest* Playwright and installs *its*
Chromium; `npm ci` then installs the locked `playwright@1.56.1`, which looks for a different build and
fails with `Executable doesn't exist at …/chromium_headless_shell-1194/…`. The fix is the same command
again, now that the locked Playwright is on disk. First seen 18 Sep 2026, the first time this repository
was set up from a clean clone.

**`npm ci` itself failed on that first clean clone.** `package.json` asked for `esbuild ^0.25.0` while
`package-lock.json` had resolved `0.28.2`, and `npm ci` refuses a lockfile that is out of sync with its
manifest. The range was a hand edit in commit `88d961e`; nothing upstream ever ran `npm ci` from an
empty tree, so it was never caught there — and it is why every CI run before this fix failed at the
install step, skipping every guard after it. `package.json` now says `^0.28.2`. That is the version the
committed `_ds_bundle.js` was built with: rebuilding with it reproduces the bundle byte-for-byte, which
`check:integrity` confirms.

Pushing from a local clone needs git credentials for `adityagupta525/sentinel-design-system`
(`gh auth login`, or an SSH key). Reading and rendering need nothing.

`npm run check` ends with **170 warnings and 0 errors**. The warnings are the system's own adherence
debt measured against itself — `pages/_index.json` reports it per component as `literals`. That number
is meant to go down, and it is the honest way to see where this system does not yet follow its own rule.

---

## 10 · The prompt to start a new session with

Paste this as the first message. It is deliberately short — everything else is in the repository, and a
prompt that restates the repository will go stale the moment the repository changes.

```
Ye Sentinel design system repo hai. Main isi ka designer/owner hoon — kaam pehle
dusre Claude account par ho raha tha, ab yahan se continue karna hai.

Shuru karne se pehle, is order me padho:
  1. docs/CONTINUE-HERE.md   — state, rulings, kya open hai, kya repo me nahi hai
  2. CLAUDE.md               — standing instructions (ye defaults ko override karte hain)
  3. .claude/skills/sentinel-craft/ — skill load karo, design-system/ ko chhune se pehle
  4. docs/FINDINGS.md        — 26 findings; kuch "obvious bugs" wahan deliberate likhe hain

Phir khud verify karo, mujhe numbers bata do:
  npm ci && npm run check && node tools/check-previews.mjs
  (expect: integrity clean, 0 errors, 73/73 pages render clean)

Uske baad mujhe batao:
  - state kya hai aur kya aapko CONTINUE-HERE se alag mila
  - teen open decisions (F-11, F-21, F-25) par tumhara vote
  - aage ka plan: Tier 2 spec pages ya screens — tumhara vote ke saath

Standing rules jo main dohra raha hoon:
  - Visual language settled hai. Restyle nahi karna. Gaps, alignment, correctness,
    consistency fix karo. Dikhne wala kuch badalna ho to pehle mujhse poochho.
  - Kaam ko DEKHO. Source padh kar visual finding mat batao, screenshot dekh kar
    code finding mat batao.
  - design-system/ ke har change ke saath usi commit me:
    npm run check:integrity -- --update
  - Branch: sirf apni designated branch par push karo. PR mat banao jab tak main na kahoon.
  - Jhoot mat bolo numbers ke baare me. Jo nahi ho paaya, wo bata do.

Jab tak main na kahoon, koi bada kaam shuru mat karo — pehle review karke plan do.
```

**Two things to attach in that first message, if you have them:**

1. `Mobile_App_Screen_Reproduction.zip` — the Figma Make screen concepts. **Required before screens
   work starts**; nothing in this repository replaces it.
2. Nothing else. The skills, the specs, the research conclusions and the decision record are all
   committed here.
