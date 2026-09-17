# Contributing

## The one rule that outranks the others

**The visual language does not change.** Colour, type, spacing scale, radii, shadow, motion and the
four hard rules in `design-system/SKILL.md` are settled. Work here fixes gaps, tightens craft and fills
in what is missing — it does not restyle. If a change alters what a component *looks like* rather than
how correctly or consistently it behaves, it needs an explicit decision before it is written, and the
PR has to say which ruling in `design-system/readme.md` it answers.

## Before you touch anything

1. Read `design-system/readme.md` end to end. It is the specification, not a summary — voice, colour,
   type, motion, layout and the reasoning behind each. Most "bugs" are documented decisions.
2. Read `design-system/guidelines/contradictions.md`. The system tracks its own known inconsistencies.
   If what you found is already there, you are fixing known debt, not discovering something.
3. Read the component's `.d.ts`. The prop contracts carry the rationale, not just the types.

## Making a change

```bash
npm run preview            # look at it
npm run check              # barrel + integrity + adherence
node tools/check-previews.mjs --shots /tmp/shots   # every page renders, with screenshots
```

Every file under `design-system/` is hashed in `baseline/design-system.sha256`. Changing one without
updating the baseline fails CI — deliberately. When the change is intended:

```bash
npm run check:integrity -- --update
```

in the **same commit**, so the review sees exactly which design files moved.

## Adding a component

The index is generated from disk and will not count a component that is not really there. A row is
`shipped` only when all three exist:

```
design-system/components/<group>/<Name>.jsx     the component
design-system/components/<group>/<Name>.d.ts    the contract, with the reasoning in the doc comments
design-system/pages/<Name>.html                 the spec page: specimen, anatomy, variants, states
```

Then `npm run build:barrel && npm run build:index`.

Tokens only — no raw hex, no raw `px`, no raw `font-family` in a component. `npm run lint:adherence`
enforces it. A component-local custom property (like `Pill`'s `--hit`) is fine and is not a token;
the index keeps the two apart on purpose.

## Commits

Conventional commits, scoped by group where it helps:

```
feat(components): add OverlapView pairs mode
fix(chat): StepTrace page renders — ${req} was never interpolated
docs: record the icon grid reconciliation
chore(tools): ...
```

## What not to do

- Do not rename the `SentinelDesignSystem_0682a2` bundle namespace — 47 preview pages destructure it.
- Do not move files inside `design-system/`. Every page, the bundle manifest and every component
  import is relative to where things are.
- Do not convert `.jsx` to `.tsx`. The `.d.ts` files are hand-written contracts carrying documentation
  a generator would throw away.
- Do not edit `_ds_bundle.js`, `index.js` or `index.d.ts` by hand. They are generated.
