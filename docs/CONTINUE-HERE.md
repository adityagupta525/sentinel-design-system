# Continue here

**If you are a new agent session on this repository, read this file first, then `CLAUDE.md`.**
It is the state of the work, the rulings that are not obvious from the code, and the things that are
*not* in this repository and have to be supplied.

Written 18 Sep 2026, at commit `dcfe133`, when the work moved to a different Claude account.

---

## 0 · Where this stopped — 18 Sep 2026, end of the second account's first session

**Read this section first; §1–§10 below are the standing document and are still true.**

### The last drop

| | |
|---|---|
| Branch / HEAD | `claude/practical-newton-fi0pof` at `2cb7412` — local and remote identical, tree clean |
| CI | 25 commits this session, **every one green** (runs 20–43). Before this session 19 of 19 were red. |
| Pages | **78 / 78** render clean (73 design-system + 5 screens) |
| Integrity | 367 files intact |
| Screens built | **3 of 7** in Journey B, plus the shell drawer: `screens/journey-b/01-home.html`, `02-thread-trace.html`, `screens/shell/drawer.html`, and `screens/flow.html` (the journey end to end) |
| **Next screen** | **03 — Thread, the answer**: "Two-thirds of the drift is the small-cap rally…", the allocation bar, `ArtifactCard` at its 96px peek. Dock chips "Why is 71% a problem?" · "Show the 18 holdings", CTA "Rebalance to his mandate". Use `screens/journey-b/thread.jsx` as the shell. |
| Review artifact | https://claude.ai/artifact/H9KoAbs6Ha7goJgrhtJZ2T — version 7, owned by ashish@centricity.co.in, cover → Screens section → flow, Home, Drawer, Trace. Republish after every screen (recipe: memory + §8). |
| Claude Design canvas | **Undecided.** DesignSync works on this machine after `/design-login` in a real terminal. `0682a2d3` is unreachable from both accounts (404 / "Project not found"). None of the six writable projects is Sentinel. Owner must pick: new project (recommended) or one of the six. Do not create one without the word. |

### Rulings made this session, not visible in code

Beyond §4. Each was the owner's call; do not re-open.

- **Single-fund ceiling is 25%** (contradiction 32). Two different rules share the number 25 — single-fund (2 sentences, 3 places) and the small-cap **sleeve** (9 surfaces). The ruling is about the first only.
- **Home** = greeting · ready-prompt card (advisor's own book, whole sentences, named clients) · starter chips above the composer ("Build proposal · Review portfolio · Fund explorer") · composer. Saved work ("Jump back in") **moved to the drawer**. AMC offer row **removed, permanently** — reason in `SCREENS-PLAN.md` §2; it will be proposed again as "engagement" and the answer is no.
- **Two lists, two jobs**: the card sends *this* proposal for a named client; a chip starts *a* proposal and the thread asks who for. When the book is unavailable the card is **omitted**, never faked with capability rows.
- **Drawer** = Jump back in (cap 3) · Recent (cap 7, one line: client as title, topic as meta, no timestamp) · Clients (cap 8) · "Back to home" · Light/Dark control. **No composer** — owner's ruling, logged as contradiction 59; `readme.md:68` still names the drawer and needs the owner's wording. Row heights are `ListRow` at 56 (F-21 ruling), caps are `List.jsx:8`'s own 3/7/8.
- **Light/Dark control lives in `screens/`, not the system** — the system has one theme and cannot specify a two-state control. `RangePills`' `locked`/`lockedNote` pattern, copied verbatim. Promotion trigger: contradiction 58.
- **`StatusSpacer` takes `time`** (default 9:41). **`GreetingDivider` wraps** instead of truncating; its hairlines yield first (open, owner's call on a `max-width`).
- **No screen mounts `ExplainerSheet` already open** (§4).
- **The gutter guard** (`check-previews`) covers `screens/` and `ui_kits/`, not spec pages — deliberate, measured, documented in `screens/README.md`. `--self-test` proves it can fail. `data-gutter="edge"` makes an element the frame for its subtree (the drawer).
- **Everything designed here is 375 wide.** Screens are 375×812 by construction; the flow, index and artifact cover were measured to fit 375 with no sideways scroll.

### Two copy defects waiting in the archive (fix when screens 5 and 7 are built)

`docs/screens-source/src/screens/Chat.tsx`: the rebalance sentence says **71% → 58%** while the move card says **67% → 58%** (`:280` vs `:283`); and Sharma's SIP is "**her** ₹30,000" (`:284`, `:753`) in a journey that says *his* everywhere else. Both recorded on `screens/flow.html`.

### Why so many bugs — the honest audit, and the guardrails that came out of it

Five of this session's 25 commits are corrections of earlier commits in the same session. The owner caught four defects from a screenshot or a crop that I had already looked at and passed. The pattern, so the next session does not repeat it:

1. **Writing before measuring.** The card that ran 8pt past the edge, the label that lost a third of itself, the uncapped drawer with the client book below the fold, the greeting that would not wrap — every one was visible only after render, and my own first look missed the card. *Guardrail:* measure the geometry with Playwright **before** calling a screen done, not after; the probes in the scratchpad (`probe-gutter`, `measure-drawer`, `w375`) are the shape of it and should become `tools/`.
2. **One shared Babel scope.** Every `text/babel` file a page loads compiles into one global scope, so a second `const { Dock } = …` is a `SyntaxError` and the page renders **nothing**. It broke Home's extraction and the drawer, both on first load. *Guardrail:* shared `.jsx` files use one uniquely named const (`THREAD_DS`) and never destructure at top level — see `thread.jsx`.
3. **The harness checked "did it render", not "is it right".** "75/75 clean" was true while a card was cut off. The gutter guard fixes one class. **Still unchecked:** truncated text (`scrollWidth > clientWidth`), and raw style literals in `screens/` — `lint:adherence` runs on `design-system/` only, and `screens/` carries **71 raw px values** today. *Guardrail to add first next session:* a truncation probe in `check-previews`, and adherence lint on `screens/` (as a count in `_index.json`-style, then as a gate).
4. **Not reading the system before building on it.** The 3/7/8 caps were in `List.jsx:8`; `box-sizing: border-box` was in the kit's own `card` style; the rule-3 exception was in `readme.md`. *Guardrail:* before a screen, grep the components it uses for comments that name that screen.
5. **A patch that failed but a commit that went out anyway.** The index-link edit failed its assertion; the shell chain used `;` not `&&`, so the commit landed with a false claim in its message. *Guardrail:* every edit-then-commit chain is `&&`-joined, and the commit message is written after the check, not before.
6. **Three review surfaces got confused** — the published Artifact, the Design-type Artifact (created by mistake and deleted), the Claude Design canvas. *Rule:* the Artifact is the review surface today; the canvas waits for the owner's project decision.
7. **Two sessions on one branch.** Another claude.ai/code session pushed `65c03ac` mid-session. It was pulled and corrected, not clobbered. *Rule:* one writer per branch; check `git fetch` before every push.

### Are the screens aligned with the design system?

Mostly, and the gaps are named. Home and the thread use only system components. The drawer's panel, scrim and header are hand-built **because the system has no Drawer** (nine components in `shell/`, none of them a drawer) — a candidate for promotion once its shape settles. The appearance control is hand-built by decision (contradiction 58). What is **not** aligned: `screens/` is outside `lint:adherence`, so its 71 px literals are unmeasured debt the system would have flagged in itself.

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
| Last commit | `2cb7412` · screen 2 of Journey B (was `dcfe133` when this file was first written) |
| Components | **84** · all exported, all with a hand-written `.d.ts` (85 until `StickyCTA` was deleted, 18 Sep) |
| Spec pages | **41 of 84** · Tier 1 closed |
| Preview pages | **78 / 78 render clean** (`node tools/check-previews.mjs`) — 73 design-system + 5 screens |
| Integrity | 370 files hashed, clean |
| Findings | F-1 … F-26 in `docs/FINDINGS.md`. **None open.** F-11, F-21 and F-25 closed 18 Sep |
| Roadmap | 1 Import ✅ · 2 Audit ✅ (ongoing) · 3 The four unbuilt components ✅ · **4 Screens — 3 of 7 built, see §0** |

**Tier 1 is defined as:** every component that carries one of the four rules, or that the chat spine is
built from. Tier 2 is the remaining 43 — chips, buttons, marks, icons, shells: short contracts, and
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
7. **`docs/SCREENS-PLAN.md`** — roadmap step 4, planned and not yet approved: the screen inventory,
   the state matrix, the gap list and which journey goes first. Read it with
   `docs/screens-source/README.md` beside it.

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
| **`StickyCTA` is deleted** (18 Sep 2026). | It was deprecated first so the removal would be a decision taken on purpose; the owner took it. `package.json` is `private: true` and nothing in the system imported it, so there was no consumer to break. See F-11 and `CHANGELOG.md` → Removed. |
| **No screen mounts `ExplainerSheet` already open.** A sheet mounts closed and is opened by an action. | F-25's Tab trap arms on the `false → true` transition, which is also what moves focus in. That is right for a spec page rendering six specimens, but it means a sheet mounted with `open={true}` — a restored state, a reload, a deep link — gets neither focus nor a trap. The component is not wrong; this is the screens' side of the contract. Verify it on every screen that carries a sheet. |
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

## 5b · The canvas and the repository — which one is true

Added 18 Sep 2026, before the first Claude Design canvas was made for this work. Read it before you
push anything to a canvas, and before you believe anything you read on one.

**The repository is the source of truth. Not the canvas.** `design-system/` is 367 files pinned by
sha256 in `baseline/design-system.sha256`, and the whole of `check:integrity` — the mechanism that
keeps "imported verbatim" honest — stands on that. A canvas has no such pin.

**The canvas is where the work is reviewed, commented on and tweaked.** That is its job and it is a
real one: the owner is the designer, and they need to select a thing and change it, not only look at
a picture of it.

**Every change made on the canvas comes back as a commit** — in the repository, with
`npm run check:integrity -- --update` in the same commit when it touches `design-system/`. Never
silently. A change that exists only on the canvas does not exist.

**If the canvas and the repository disagree, the repository wins** — and the difference is reported to
the owner, not quietly reconciled. "I pulled the canvas version" is the one move that is never
allowed without saying so first.

**The original Claude Design project (`0682a2d3`) is the origin of this entire system** and is not to
be overwritten. `design-system/_ds_bundle.js` still publishes onto `window.SentinelDesignSystem_0682a2`
because that is where it came from. Ask the owner before writing to it; a new project or a new page is
almost always the right answer.

## 5c · Why `/design-login` fails on Claude Code Web — stop retrying it

Recorded 18 Sep 2026, after three attempts from two accounts.

`/design-login` is **not** missing, misspelt, or account-gated. It is surface-gated. The `DesignSync`
tool says so itself, verbatim, when called without authorization:

> DesignSync needs design-system authorization, and /design-login cannot run in this non-interactive
> session. Ask the user to run /design-login once from an interactive Claude Code session on this
> machine — headless and SDK runs here then reuse that authorization. If this is claude.ai/code, ask
> them instead to use Claude Design's "Send to Claude Code Web" (which seeds the project into the
> workspace) or to provide the project files directly.

Both of this project's sessions run on **claude.ai/code** — a remote container, non-interactive by the
tool's definition. So the command cannot succeed there no matter how it is typed, in the terminal pane
or the chat pane. `zsh: no such file or directory` was the shell being handed a slash command;
"isn't a recognized command here" was Claude Code correctly reporting the same gate.

There are exactly two ways in, and neither is a retry:

1. **Claude Design → "Send to Claude Code Web."** Open the project at claude.ai/design and use that
   button. It seeds the project into the workspace and carries the authorization with it. This is the
   path for the sessions we are actually running.
2. **The Claude Code CLI on the owner's own machine.** `npm i -g @anthropic-ai/claude-code`, `claude`
   inside this repository, then `/design-login` once. That session is interactive, so the command
   runs; the authorization it writes is then reused by headless and SDK runs on that machine.

Until one of those happens, `DesignSync` is unavailable **on that surface**. Do not report a canvas as
made, or a project as checked, on the strength of anything but a `DesignSync` call that returned. That
last rule is the durable one and it still stands.

### 5c.1 · Path 2 worked — corrected 18 Sep 2026, from a different surface

The section above was written from a **claude.ai/code** session and is correct about claude.ai/code.
As a blanket statement it was wrong, and this is the correction rather than a quiet edit.

A **Claude Code desktop app** session took path 2 — the CLI on the owner's own machine, then
`/design-login` once in a real interactive terminal — and after that `DesignSync` returned normally
**in the desktop session**. `/design-login` typed inside the desktop app's own Code tab still answers
"isn't available in this environment": that pane is not the interactive terminal the tool means. The
terminal is.

So the accurate statement is: `/design-login` needs an interactive Claude Code **CLI** session on the
owner's machine. Once it has run there, other sessions **on that machine** reuse the authorization.
claude.ai/code, being a remote container, is never that machine, which is why §5c's Send-to-Web path
is the right one there.

What a returned call then established, and what it did not:

| | |
|---|---|
| Checked | Six design-system projects are writable by this account: `197f7992`, `43e81071`, `9b8bd6c3`, `35f9eb34`, `4b0f24df`, `62d8af98` — dated May to July 2026. |
| Checked | **`0682a2d3` is not among them**, and none of the six is Sentinel. The newest "Centricity Design System" (`197f7992`) is the *Quiet Wealth* system — General Sans, Satoshi and Zodiak, with Avatar / TabBar / PortfolioCard / HoldingRow. Sentinel is Urbanist and Darker Grotesque, grouped actions / cards / chat / composer / data / forms / icons / lists / shell / text. Related lineage, different system. |
| **Not** checked | Whether `0682a2d3` still exists **anywhere**. `list_projects` returns writable projects only, and this system was built on a different Claude account (§1). Its absence here is expected and is not evidence that it is gone. |

## 6 · What is NOT in this repository

Be honest about these with the owner rather than guessing around them.

| Missing | What to do |
|---|---|
| **`Amicro` (micro-transitions)**, the `interfaces` skills bundle, and the `Libraries.dev` repository. | Their conclusions are already distilled into `.claude/skills/sentinel-craft/references/borrowed.md` and into the motion rulings above. You do not need the sources unless you want to re-derive something. |
| **The review Artifact** (a rendered copy of the whole system, published at claude.ai). | **Artifacts are per-account and private — the link does not carry over.** Publish a fresh one from the new account. The staging recipe is in §8. |

## 7 · What is open, and waiting on the owner

1. ~~**F-21**~~ — closed 18 Sep 2026 as recommended: `--h-row-2l: 72px`, `ListRow` reads it, the `lg`
   collision is contradiction 57, and the five raw `46` / `52` row heights in `ui_kits` now read
   `--h-row-lg` / `--h-row-xl`. The owner's correction to the reasoning is recorded in the finding.
2. ~~**F-25**~~ — closed 18 Sep 2026: Tab is trapped and wraps at the boundary, acting only while focus
   is inside the sheet so a page of open specimens does not fight over it. Measured before and after.
3. ~~**F-11**~~ — `StickyCTA` deleted 18 Sep 2026, on the owner's ruling. 84 components remain.
4. **`docs/SCREENS-PLAN.md` is waiting for a yes.** It also carries six content decisions that are
   yours alone — the 15% / 25% single-fund ceiling is the sharpest.
5. **Next phase.** Tier 2 (43 short pages) or screens. The recommendation on record is **screens**:
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
                                  #   Screens → /screens/index.html
```

**If port 4321 is already taken, the preview server says so and stops** — it does not fall back to
another port, because the printed URL has to be the URL that works. Whatever else is on 4321 will
answer your browser with its own 404, which reads exactly like a broken page in this repository. Run
`lsof -nP -iTCP:4321 -sTCP:LISTEN` to see what holds it, or `PORT=4322 npm run preview`. Hit on
18 Sep 2026, when an unrelated `python -m http.server` had owned 4321 since August.

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

**Nothing needs to be attached to that first message.** The screen source that used to be missing is
now `docs/screens-source/` — read its `README.md` first, including the two warnings and the three files
that were renamed so the archive cannot reprogram the repository. The skills, the specs, the research
conclusions and the decision record are all committed here too.
