---
name: sentinel-scope
description: Work at the scope of the change, not the scope of the repository. Load at the start of every Sentinel session and before every verification run — it decides what to read, which gates to run, and what to look at, so a one-screen change costs a one-screen verification instead of a full-repo sweep. Use when a session feels slow or expensive, when deciding whether to re-render, re-lint or re-read, before running check-previews or lint:adherence, and before opening readme.md, FINDINGS.md or contradictions.md. Triggers on token burn, slow session, verify this, re-render, which pages does this affect, do I need the full sweep, blast radius.
---

# sentinel-scope

## The defect this fixes

**Every gate in this repository runs at full-repo scope regardless of the diff.** There is no notion
of "what changed". That single fact is the whole problem; everything below is a symptom of it.

A one-line change to one screen currently pays: an 82-page browser sweep, a 100 KB lint read, a
1.5 MB board screenshot, and — in a fresh session — a 206 KB onboarding read. None of that is
proportional to the change, and none of it is more honest for being bigger.

## What was measured, on this repository, 18 Sep 2026

Every number below came from running the thing, not from reading it.

| Step | As currently run | At the scope of the change | Factor |
| --- | --- | --- | --- |
| Verify one screen | `check-previews` (all 82) — **2 m 14 s**, 5,354 B | `--only <page>` — **5.5 s**, 316 B | **24× time, 17× output** |
| Adherence lint | `lint:adherence` — **100,064 B**, 1,474 lines (≈ 25k tokens) | `--max-warnings=<baseline> --silent` → exit code, **95 B** | **1,053×** |
| Look at the work | board PNG, **1,535 KB** at 1400×2600 | one phone, **67 KB** at 375×812 | **23×** |
| Blast radius of a component edit | all 82 pages | `grep -rl` → **~5 pages** | **~15×** |
| Fresh-session reading | 8 documents, **206,569 B** (≈ 51,600 tokens) | routed — see §1 | — |

`lint:adherence` reports **0 errors** and a warning count that only moves when a component is added.
Reading 25k tokens to be told a number that has not moved is the clearest waste in the project.

**THE BASELINE IS NOT A CONSTANT — DERIVE IT, NEVER HARDCODE IT.** This skill first shipped with 169,
which was true when it was written and false two commits later: promoting `Drawer` and `SegmentedRow`
into the system took it to **171**, and then exempting the generated `index.d.ts` took it to **62**
(measured 18 Sep 2026 — `--max-warnings=62` exits 0, `61` exits 1). It moved twice in one day.
A hardcoded baseline fails the next person for a reason that is not their fault, so take it from the tree:

    BASE=$(npm run -s lint:adherence 2>&1 | sed -n 's/^Found \([0-9]*\) warnings.*/\1/p')
    npx oxlint --config design-system/_adherence.oxlintrc.json --max-warnings=$BASE --silent design-system

The gate is now wired: **`npm run lint:adherence:gate`**, and CI runs it. Its number lives in
`package.json` — move it in the same commit as the change that moved it, and say which direction and why.

## 1 · Route the read. Do not read the library.

A fresh session is told to read `CLAUDE.md`, `CONTINUE-HERE.md`, `readme.md`, `contradictions.md`,
`FINDINGS.md`, `SCREENS-PLAN.md`, `sentinel-craft` and `_index.json`. Read whole, that is **51,600
tokens before the first useful thought**, and four of those documents are reference material that
should be queried, never recited.

Always read, in full — they are small and they are the contract:

    CLAUDE.md                              4.3 KB
    .claude/skills/sentinel-craft/SKILL.md 7.4 KB
    docs/CONTINUE-HERE.md                  19 KB   (§5b and §5c especially)

Then read **only** what the task names:

| Task | Also read | Never read whole — grep it |
| --- | --- | --- |
| Build or change a screen | `docs/SCREENS-PLAN.md`, the sibling screen | `readme.md` |
| Change a component | that component's `.jsx` + `.d.ts` | `readme.md`, `_index.json` |
| Judge spacing, alignment, craft | `sentinel-craft` (already read) | everything else |
| Chase a known issue | the one `F-nn` row | `FINDINGS.md`, `contradictions.md` |
| Answer "is this deliberate?" | — | `readme.md`, `contradictions.md` |

The grep, not the read:

    grep -n "ExplainerSheet" design-system/readme.md    # 44 KB → the 2 lines that mention it
    grep -n "^### F-21" docs/FINDINGS.md                # 42 KB → one heading, with its verdict in it
    grep -n "track" design-system/guidelines/contradictions.md   # 31 KB → only the rows in play

`FINDINGS.md` writes its verdict into the heading — `### F-21 · … — *fixed 18 Sep 2026*` — so one
grep for the heading answers "is this still open?" without opening the file.

**Worked example — a gap the cheap path found.** `CLAUDE.md:56` says `**open: F-11, F-21, F-25**`.
Two greps, about 300 bytes of output:

    grep -n "F-25\|F-11\|F-21" CLAUDE.md
    grep -n "^### F-25\|^### F-11\|^### F-21" docs/FINDINGS.md

`FINDINGS.md` has all three closed — F-11 *deleted 18 Sep 2026*, F-21 *fixed 18 Sep 2026*, F-25
*fixed*. **The repository's own map pointed three sessions at work that was already done.** Reading either
document whole would have cost 46 KB and buried it; the grep surfaced it in seconds. Scope discipline is
not a smaller review — it is a sharper one. *(That line was corrected later the same day: `CLAUDE.md:56`
now reads "F-1 … F-30 recorded; **none open**". The example stands as the method, not as a live gap.)*

**Worked example — a gap that was not one.** Home renders `3:04` in the status bar while
`StatusSpacer` defaults to `'9:41'`. One grep of the component returned its own comment: the `time`
prop exists precisely so three phones do not all read 9:41. Deliberate, not a gap. No render, no
file read, four lines of output.

## 2 · Run every gate at the scope of the diff

**Find the blast radius first. It is one command and it is milliseconds.**

    git diff --name-only HEAD
    grep -rl "\bComponentName\b" design-system/pages design-system/ui_kits screens

A component edit touches about five pages out of seventy-five. Verify those five.

| You changed | Run |
| --- | --- |
| One screen or page | `node tools/check-previews.mjs --only <substring>` |
| One component | `npm run build:bundle` then `--only <ComponentName>` — the bundle first, always, or the page shows you the old code |
| Tokens, or a shared shell component | the full sweep — the blast radius really is everything |
| Anything at all, before commit | `npm run check:integrity -- --update` **if `design-system/` was touched**, in that same commit |

**Never skip `build:bundle` to save the 1.3 s.** The pages load `_ds_bundle.js`, not the source. A
source change is invisible until it is rebuilt, and a page that renders the old code renders a lie.

### The adherence gate, at 95 bytes instead of 100 KB

Do not read the lint. Gate on it:

    npx oxlint --config design-system/_adherence.oxlintrc.json \
               --max-warnings="$BASE" --silent design-system

Exit 0 means nothing regressed. **Tested both ways** — passes at the baseline (rc=0, 95 B), trips one below
(rc=1, 143 B). A gate that has never been seen to fail is not a gate.

**Its blind spot, stated plainly:** a count gate passes if one warning appears while another is
fixed. When a change touches more than a couple of files, use the line-level baseline instead —
also tested, and exact:

    # once, to record today's truth
    npx oxlint --config design-system/_adherence.oxlintrc.json --format=unix design-system 2>/dev/null \
      | sed 's/:[0-9]*:[0-9]*:/::/' | sort > .adherence.baseline    # 62 lines, on disk not in context

    # every run after — prints nothing when nothing changed
    npx oxlint --config design-system/_adherence.oxlintrc.json --format=unix design-system 2>/dev/null \
      | sed 's/:[0-9]*:[0-9]*:/::/' | sort | diff .adherence.baseline -

Line and column are stripped on purpose: a warning must not "regress" because something above it
moved down three lines.

**When the baseline legitimately moves** — someone fixes a literal, or adds a component — re-record
it *in the same commit as the change that moved it*, and say in the message which direction it moved
and why. A baseline quietly raised to make a gate green is worse than no gate.

## 3 · Look at one phone, not at a board

`--shots` writes the whole board: 1,535 KB at 1400×2600, mostly empty canvas around four phones.
Pulling that into context to check one gutter is the most expensive way to be told something a
375×812 crop says better.

`tools/phone-shot.mjs` ships alongside this skill. It finds the 375×812 frames the gutter guard
already knows how to find, and shoots one:

    node tools/phone-shot.mjs screens/journey-b/01-home.html 0 /tmp/home.png
    # → /tmp/home.png  phone 1/4  375x812   (67 KB)

**Measure first, look second.** The gutter guard is text, costs nothing, and is exact; the eye is
for craft, not for arithmetic. But the record of this project says the opposite failure is real too:
three automated measurements missed the 8pt overflow on Home and a single crop found it instantly.
So — run the guard, then look at the one phone. Both, in that order, cheaply.

## 4 · The full sweep is a batch gate, not a per-commit gate

2 m 14 s and 75 pages is the right price for: a token change, a shell component, the last commit
before a push, and a CI run. It is the wrong price for every intermediate commit in a batch, and
paying it eight times in a batch of eight buys nothing the last one would not have caught.

Rule: **targeted per commit, full before push.** If the full sweep then fails on something the
targeted run passed, that is a finding about the blast radius — write it down, do not just re-run.

## 5 · Saving tokens must never cost a product gap

This skill narrows scope. It does not lower the bar, and these do not bend for it:

- **Never restyle.** Colour, type, radii, shadow and motion character are settled. A change that
  alters appearance needs the owner's word first, however small and however obviously "better".
- **Never report a visual finding from source alone, or a code finding from a screenshot alone.**
  `DownloadAction` was blamed for a nested `<button>` from a stack trace; the wrapper was
  `ArtifactCard`, four frames down.
- **Never let a cheap gate stand in for a real one.** The lint gate proves the count did not move.
  It does not prove the screen is right. Only looking at the screen does that.
- **Never let a narrowed run be reported as a full one.** "2/2 pages render clean" is true and is
  not "75/75". Say which you ran.
- **Never batch the integrity update into a later commit.** Same commit as the change, or the
  mechanism that keeps `design-system/` honest stops being a mechanism.

### The cheap checks that actually catch gaps

Scope discipline pays for these, so run them — they are seconds and they are where real gaps hide:

    node tools/check-previews.mjs --self-test          # the guard still fails on the defect
    grep -rn "px\b" <changed component>                # literals the token layer should own
    grep -c "" design-system/pages/_index.json          # shipped/building counts moved as expected
    git diff --stat                                    # the diff is the size you think it is

## 6 · What this skill has not fixed, and what it costs

Honest limits, so nobody mistakes this for more than it is:

- ~~`--only` takes one substring~~ — **fixed 18 Sep 2026.** It takes a comma-separated list:
  `--only 01-home,drawer` runs exactly those two.
- ~~No `--quiet`~~ — **fixed the same day.** `--quiet` prints failures and the tally only.
- ~~`lint:adherence` lints `_ds_bundle.js` and some of the warnings are its~~ — **measured, and it was
  the wrong file.** The bundle contributes **2** of the warnings. **109 of 171 came from
  `design-system/index.d.ts`**: the override exempted `**/index.js` — the generated public entry — and
  not its generated declaration file, so the barrel was warned for importing the components it exists to
  export. One line in `_adherence.oxlintrc.json` (`"**/index.d.ts"` added to the same override) took the
  count **171 → 62**, and the gate now measures consumers instead of drowning in the entry point. This was
  not a cleanup slipped in to move a number: the file's own header says it is the public entry, which is
  exactly what the override already exempts.
- The onboarding read is routed here, not shrunk. The 206 KB is still on disk, still authoritative,
  and still the right thing to grep.

## Verification record

Run on `claude/practical-newton-fi0pof`, 18 Sep 2026, on this repository.

| Claim | How it was checked | Result |
| --- | --- | --- |
| Full sweep 2 m 14 s / 5,354 B | `time node tools/check-previews.mjs` | 82/82 clean (75 was before screens 3–4) |
| `--only a,b` runs exactly two | `--only 01-home,drawer --quiet` | 2/2 clean, tally only |
| `phone-shot --reduced` | `… 01-home.html 0 p.png --reduced` | `phone 1/4 375x812 (reduced motion)`, 74,572 B |
| Warnings after the override fix | `npm run lint:adherence` | **62**, 0 errors |
| Targeted 5.5 s / 316 B | `time … --only journey-b` | 2/2 clean, 5 lines |
| Lint 100,064 B, 171 warnings (before the override fix) | `npm run -s lint:adherence \| wc -c` | 1,474 lines, 0 errors |
| Lint gate passes at baseline | `--max-warnings=62 --silent` (was 171) | rc=0 |
| Lint gate trips below baseline | `--max-warnings=61 --silent` | rc=1 |
| Baseline diff is stable | unix format, line/col stripped, diffed against itself | 0 lines |
| Baseline diff catches a change | one line removed from the baseline | diff reported it |
| Blast radius ≈ 5 pages | `grep -rl` for three components | 6, 5, 6 pages |
| Phone crop 67 KB | `node tools/phone-shot.mjs … 0` | `phone 1/4 375x812`, 67,164 B |
| The crop is legible | the PNG was opened and read | Home renders correctly, gutters even |
| The grep recipes work as written | each run on this repo | readme 2 hits, FINDINGS 1 heading, self-test PASSED |
| `CLAUDE.md`'s open list is stale | the two greps above | F-11, F-21, F-25 all closed in `FINDINGS.md` |
| Build steps are cheap | each npm script timed | barrel 1.6 s, bundle 1.3 s, index 0.2 s, scale 0.2 s, integrity 0.3 s |

Not verified, and not claimed: that any of this changes CI, which runs the full sweep by design and
should keep doing so.

## Corrections applied 18 Sep 2026

Two numbers in this skill were true when it was written and false by the time it was pulled into the
other session's tree. Both were re-measured rather than adjusted on paper:

- **The lint baseline was 169 and is 171.** `Drawer` and `SegmentedRow` were promoted out of a screen
  into the system in the meantime, and each shipped component adds its restricted-import warnings. The
  fix is not a new constant — the baseline is now derived from the tree in §3, because it will move again
  on the next promotion.
- **The repository had 75 pages and has 82** (75 system + 7 screens). Every "all 75" above reads "all 82".

The argument the skill makes is unaffected: both errors made the *scoped* numbers look better than they
were, not worse. `--only` really does verify one page in **5.5 s**, and `tools/phone-shot.mjs` really does
return a 67 KB phone instead of a 1.5 MB board — both re-run on this tree today.

## Verified against the system, 18 Sep 2026

Every claim above was re-run on this tree before it was trusted, and three things changed as a result:

- **Two named limits were closed rather than documented:** `--only` now takes a comma-separated list and
  `--quiet` exists. Both were small, both were named here as gaps, and a gap you can close in five lines
  is not a limit.
- **One claim was wrong in a way worth keeping a record of.** The lint was blamed on the bundle; it was
  the generated `index.d.ts`, at 109 of 171 warnings. The skill's instinct — "the gate is drowning in
  generated output" — was right; the file it named was not. Measuring found the right one, which is the
  method this skill argues for, applied to itself.
- **The gate exists now.** `npm run lint:adherence:gate` at 62, run by CI. Before this it was a number
  nobody enforced; the skill was right that a gate never seen to fail is not a gate, and the answer was
  to wire it, not to keep describing it.

What was NOT changed, deliberately: `_ds_bundle.js` is still linted (2 warnings). Excluding generated
output from a lint is a different argument from exempting the public entry the rule already exempts, and
it is the owner's call.
