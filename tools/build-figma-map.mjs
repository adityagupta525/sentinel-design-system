/* Regenerates .claude/skills/sentinel-figma/references/{tokens,inventory}.md and figma-tokens.json
   from design-system/tokens/*.css, the components and their .d.ts.

   Why generated, not written: the same reason scale.md is. A Figma library built from a token list
   typed into a skill drifts from the product the first time a token changes, and the drift is
   invisible until someone measures a screen against the file. This reads the token layer, measures
   how each token is actually CONSUMED across all 98 components, and derives the Figma variable type
   and scopes from that measurement rather than from the token's name.

   It fails loudly. A token it cannot classify is printed and the process exits non-zero, because a
   quiet default is how a wrong scope reaches a designer's picker.

   Usage: npm run build:figma-map */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DS = join(ROOT, 'design-system');
const OUT = join(ROOT, '.claude/skills/sentinel-figma/references');

/* ── read the token layer ─────────────────────────────────────────────────── */

const TOKEN_FILES = ['colors.css', 'spacing.css', 'typography.css', 'effects.css'];
const decls = [];
for (const f of TOKEN_FILES) {
  const css = await readFile(join(DS, 'tokens', f), 'utf8');
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);(?:[ \t]*\/\*([^*]*)\*\/)?/gi)) {
    decls.push({ name: m[1], value: m[2].trim(), note: (m[3] || '').replace(/@kind\s+\w+/g, '').trim(), file: f });
  }
}
const byName = new Map(decls.map((d) => [d.name, d]));

/* ── measure how each token is consumed ───────────────────────────────────── */

/* Every `property: … var(--token) …` across the components and the screens. The property is what
   decides the Figma scope; the token's name is not evidence of anything. */
const usage = new Map();                       // token → Map(property → count)
const sources = [];                            // the components — also the inventory's source
for (const dir of await readdir(join(DS, 'components'), { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const f of await readdir(join(DS, 'components', dir.name))) {
    if (f.endsWith('.jsx')) sources.push(join(DS, 'components', dir.name, f));
  }
}
/* A token is consumed by more than the components. The stylesheets carry every `.ds-*` rule and
   every keyframe; the kits and the screens carry the rest. Measuring components alone reported 70
   tokens as unused against check:tokens' 30, and a wrong scope is worse than a missing one. */
const consumers = [...sources];
for (const f of await readdir(join(DS, 'tokens'))) if (f.endsWith('.css')) consumers.push(join(DS, 'tokens', f));
for (const base of [join(DS, 'ui_kits'), join(ROOT, 'screens')]) {
  const walk = async (d) => {
    let ents; try { ents = await readdir(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (e.name.startsWith('.')) continue;
      const p = join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (/\.(jsx|css|html)$/.test(e.name)) consumers.push(p);
    }
  };
  await walk(base);
}
for (const p of consumers) {
  const src = await readFile(p, 'utf8');
  /* The property must not be preceded by `--` (that is a token DEFINITION referencing another
     token, not a consumption) and must not be a selector fragment like `.ds-pressable:focus`.
     Both slipped through a looser regex and invented properties named `ds-pressable` and
     `gradient-dark-cta`, which then measured as zero bindable scopes. */
  for (const m of src.matchAll(/(^|[^-a-zA-Z0-9_.#])([a-zA-Z][a-zA-Z-]*)\s*:\s*([^;\n{}]*?var\((--[a-z0-9-]+)\)[^;\n{}]*)/g)) {
    const prop = m[2];
    for (const t of m[3].matchAll(/var\((--[a-z0-9-]+)\)/g)) {
      if (!usage.has(t[1])) usage.set(t[1], new Map());
      const u = usage.get(t[1]);
      u.set(prop, (u.get(prop) || 0) + 1);
    }
  }
}
/* A COLOUR ALIAS inherits its consumption from the token that aliases it: --color-bronze is
   written as `color:` nowhere, but --color-alloc-equity aliases it and is. Restricted to a pure
   alias (`--a: var(--b);`, nothing else) so it cannot cross kinds — an earlier version let a type
   role push its own `font:` consumption onto all four primitives it binds, which put FRAME_FILL on
   a font weight. */
for (const d of decls) {
  const pure = d.value.match(/^var\((--[a-z0-9-]+)\)$/);
  if (!pure) continue;
  const target = pure[1];
  if (!usage.has(target)) usage.set(target, new Map());
  const from = usage.get(d.name);
  if (!from) continue;
  const to = usage.get(target);
  for (const [prop, n] of from) to.set(prop, (to.get(prop) || 0) + n);
}

/* property → Figma variable scope. Only properties Figma can actually bind appear here. */
const SCOPE = {
  color: 'TEXT_FILL', fill: 'SHAPE_FILL', webkitTextFillColor: 'TEXT_FILL',
  background: 'FRAME_FILL', backgroundColor: 'FRAME_FILL', backgroundImage: 'FRAME_FILL',
  borderColor: 'STROKE_COLOR', stroke: 'STROKE_COLOR', outlineColor: 'STROKE_COLOR',
  border: 'STROKE_COLOR', borderTop: 'STROKE_COLOR', borderBottom: 'STROKE_COLOR',
  borderLeft: 'STROKE_COLOR', borderRight: 'STROKE_COLOR', outline: 'STROKE_COLOR',
  gap: 'GAP', rowGap: 'GAP', columnGap: 'GAP',
  padding: 'GAP', paddingTop: 'GAP', paddingBottom: 'GAP', paddingLeft: 'GAP', paddingRight: 'GAP',
  paddingBlock: 'GAP', paddingInline: 'GAP',
  margin: 'GAP', marginTop: 'GAP', marginBottom: 'GAP', marginLeft: 'GAP', marginRight: 'GAP',
  width: 'WIDTH_HEIGHT', height: 'WIDTH_HEIGHT', minWidth: 'WIDTH_HEIGHT', minHeight: 'WIDTH_HEIGHT',
  maxWidth: 'WIDTH_HEIGHT', maxHeight: 'WIDTH_HEIGHT', flexBasis: 'WIDTH_HEIGHT', inset: 'WIDTH_HEIGHT',
  top: 'WIDTH_HEIGHT', left: 'WIDTH_HEIGHT', right: 'WIDTH_HEIGHT', bottom: 'WIDTH_HEIGHT',
  borderRadius: 'CORNER_RADIUS',
  borderWidth: 'STROKE_FLOAT', strokeWidth: 'STROKE_FLOAT', outlineWidth: 'STROKE_FLOAT',
  fontSize: 'FONT_SIZE', lineHeight: 'LINE_HEIGHT', fontWeight: 'FONT_WEIGHT',
  fontFamily: 'FONT_FAMILY', letterSpacing: 'LETTER_SPACING',
};

/* ── classify ─────────────────────────────────────────────────────────────── */

const HEX = /^#[0-9a-f]{3,8}$/i;
const RGBA = /^rgba?\(/i;
const PX = /^-?[0-9.]+px$/;
const NUM = /^-?[0-9.]+$/;
const EM = /^-?[0-9.]+em$/;
const MS = /^[0-9.]+m?s$/;
const ALIAS = /^var\((--[a-z0-9-]+)\)$/;

/* Not representable as a Figma variable. Each is here for a stated reason, not because it was
   awkward — the skill quotes these back so nobody re-litigates them at build time. */
const DOCUMENTED_ONLY = {
  '--ease': 'Figma has no easing variable. The one curve is set per prototype interaction.',
  '--dur-press': 'Figma has no duration variable. Prototype interactions carry the ms.',
  '--dur-fast': 'as --dur-press', '--dur-enter': 'as --dur-press', '--dur-screen': 'as --dur-press',
  '--dur-bar': 'as --dur-press', '--dur-count': 'as --dur-press',
  '--press-scale': 'a transform, applied in the pressed variant, not a variable.',
  '--press-scale-icon': 'as --press-scale',
  '--paper-texture': 'a radial-gradient pattern. Figma renders it as an image fill on the canvas frame.',
  '--paper-texture-size': 'as --paper-texture',
  '--gradient-dark-cta': 'a gradient. Figma holds gradients in a paint STYLE, not a variable.',
  '--gradient-rail': 'as --gradient-dark-cta',
  '--aura-bronze': 'a radial-gradient. Figma holds it as a radial paint style, not a variable.',
  '--aura-shadow': 'as --aura-bronze',
  '--screen-w': 'the frame width. Set on the frame, not bound.',
  '--screen-h': 'the frame height. Set on the frame, not bound.',
};

const typeRoles = [];
const effects = [];
const variables = [];
const documented = [];
const unclassified = [];

for (const d of decls) {
  const { name, value } = d;
  const props = [...(usage.get(name) || new Map()).entries()].sort((a, b) => b[1] - a[1]);
  /* SCOPES. Two rules, and which one applies depends on whether the family is ambiguous.

     A COLOUR is ambiguous — the same hex can be a fill, a text colour or a stroke, and only the
     CSS says which. So a colour's scopes are MEASURED from the properties that consume it.

     Everything else is not ambiguous: a radius token is a corner radius, a leading token is a line
     height. Measuring those adds nothing and subtracts a lot, because the CSS reaches most of them
     through the `font:` shorthand, which a property measurement cannot see — measured alone,
     --text-14 returned one bindable scope out of 82 uses. So the family determines the scope, and
     that is a fact about the token layer, not a guess about intent. */
  const FAMILY = [
    [/^--(space|gutter|stack|chip-gap)/, ['GAP', 'WIDTH_HEIGHT']],
    [/^--(h|w)-/, ['WIDTH_HEIGHT']],
    [/^--radius-/, ['CORNER_RADIUS']],
    [/^--border-(hairline|1|focus-width)/, ['STROKE_FLOAT']],
    [/^--(text|display)-/, ['FONT_SIZE']],
    [/^--leading-/, ['LINE_HEIGHT']],
    [/^--weight-/, ['FONT_WEIGHT']],
    [/^--font-/, ['FONT_FAMILY']],
    [/^--tracking-/, ['LETTER_SPACING']],
  ];
  /* Only for non-colours. Sentinel names nine COLOUR tokens `--text-primary`, `--text-muted`,
     `--text-danger` and so on — the family regex read those as font sizes and put FONT_SIZE on a
     hex. A colour is decided by measurement, whatever it is called. */
  const looksColour = HEX.test(value) || RGBA.test(value)
    || (ALIAS.test(value) && (() => { const b = byName.get(value.match(ALIAS)[1]); return b && (HEX.test(b.value) || RGBA.test(b.value)); })());
  const family = looksColour ? null : FAMILY.find(([re]) => re.test(name));
  const measured = [...new Set(props.map(([p]) => SCOPE[p]).filter(Boolean))];
  const COLOUR_SCOPES = ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR', 'EFFECT_COLOR'];
  let scopes = family ? family[1] : measured.filter((x) => COLOUR_SCOPES.includes(x));
  let scopeSource = family ? 'family' : 'measured';
  /* A colour that IS referenced but whose consuming property cannot be resolved. Sentinel passes
     several colours as DATA — `{ label: 'Equity', color: 'var(--color-alloc-equity)' }` — and a
     property measurement sees the object key, not the eventual fill. Empty scopes would hide the
     token from every picker, which is worse than a broad one, so it gets all four colour scopes
     and is labelled as undetermined rather than measured. */
  if (looksColour && !scopes.length && props.length) {
    scopes = ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR'];
    scopeSource = 'indeterminate';
  }
  const aliasOf = (value.match(ALIAS) || [])[1] || null;
  const row = { ...d, props: props.map(([p, n]) => `${p}×${n}`), scopes, scopeSource, aliasOf };

  if (DOCUMENTED_ONLY[name]) { documented.push({ ...row, why: DOCUMENTED_ONLY[name] }); continue; }

  /* the 14 composite type roles → Figma TEXT STYLES, each binding four variables */
  if (/^--type-.*-font$/.test(name)) {
    const m = value.match(/^var\((--weight-[a-z]+)\)\s+var\((--(?:text|display)-[0-9-]+)\)\/(?:var\((--leading-[0-9]+)\)|([0-9.]+))\s+var\((--font-[a-z]+)\)$/);
    if (!m) { unclassified.push({ ...row, why: 'type role shorthand did not parse' }); continue; }
    typeRoles.push({ role: name.replace(/^--type-|-font$/g, ''), name, weight: m[1], size: m[2], leading: m[3] || m[4], family: m[5], note: d.note });
    continue;
  }
  if (/^--type-/.test(name)) { documented.push({ ...row, why: 'a companion of a type role; carried by the text style.' }); continue; }

  if (/^--(shadow|focus-ring)/.test(name)) { effects.push(row); continue; }

  if (aliasOf) {
    const base = byName.get(aliasOf);
    if (!base) { unclassified.push({ ...row, why: `aliases ${aliasOf}, which is not defined` }); continue; }
    const kind = HEX.test(base.value) || RGBA.test(base.value) ? 'COLOR' : PX.test(base.value) || NUM.test(base.value) ? 'FLOAT' : 'STRING';
    variables.push({ ...row, kind, layer: 'semantic' });
    continue;
  }
  if (HEX.test(value) || RGBA.test(value)) { variables.push({ ...row, kind: 'COLOR', layer: 'base' }); continue; }
  if (PX.test(value)) { variables.push({ ...row, kind: 'FLOAT', layer: 'base', number: parseFloat(value) }); continue; }
  if (NUM.test(value)) { variables.push({ ...row, kind: 'FLOAT', layer: 'base', number: parseFloat(value) }); continue; }
  if (EM.test(value)) { variables.push({ ...row, kind: 'FLOAT', layer: 'base', number: parseFloat(value), em: true }); continue; }
  if (/^'/.test(value)) { variables.push({ ...row, kind: 'STRING', layer: 'base' }); continue; }
  if (MS.test(value)) { documented.push({ ...row, why: 'a duration. Figma has no duration variable.' }); continue; }
  unclassified.push({ ...row, why: `value "${value}" matched no rule` });
}

/* ── the collection plan ──────────────────────────────────────────────────── */

/* Derived from the token layer, not from the skill's default table. Sentinel has ONE canvas and no
   dark mode, so every collection has one mode. The base/semantic split is measured: a token whose
   value is a literal is base, a token whose value is var(--other) is semantic. */
const collection = (v) => {
  if (v.kind === 'COLOR') return v.layer === 'base' ? 'Palette' : 'Colour';
  if (/^--radius-/.test(v.name)) return 'Radius';
  if (/^--(text|display|leading|weight|font|tracking)-|^--font-/.test(v.name)) return 'Type';
  if (/^--border-/.test(v.name) && v.kind === 'FLOAT') return 'Stroke';
  return 'Layout';
};
for (const v of variables) v.collection = collection(v);

/* THE ONE DELIBERATE OVERRIDE. A palette entry is a raw literal; a designer picks the role, never
   the literal. Empty scopes keep every palette variable out of every picker while still existing
   for the roles to alias. See tokens.md. */
for (const v of variables) {
  if (v.collection === 'Palette') { v.scopes = []; v.scopeSource = 'hidden-primitive'; }
}

const figmaName = (n) => n.replace(/^--/, '').replace(/-/g, '/').replace(/^(color|space|radius|text|display|leading|weight|font|tracking|border|h|w)\//, '$1/');

/* ── write the machine map ────────────────────────────────────────────────── */

await mkdir(OUT, { recursive: true });
const json = {
  generated: 'tools/build-figma-map.mjs — do not edit',
  modes: ['Value'],
  collections: [...new Set(variables.map((v) => v.collection))].sort(),
  variables: variables.map((v) => ({
    css: v.name, figma: figmaName(v.name), collection: v.collection, layer: v.layer, kind: v.kind,
    value: v.value, aliasOf: v.aliasOf, scopes: v.scopes.length ? v.scopes : ['__UNUSED__'],
    scopeSource: v.scopeSource,
    codeSyntax: `var(${v.name})`, measuredIn: v.props,
  })),
  textStyles: typeRoles.map((t) => ({ name: `${t.role}`, css: t.name, weight: t.weight, size: t.size, leading: t.leading, family: t.family })),
  effectStyles: effects.map((e) => ({ name: e.name.replace(/^--/, ''), css: e.name, value: e.value })),
  documentedOnly: documented.map((d) => ({ css: d.name, value: d.value, why: d.why })),
};
await writeFile(join(OUT, 'figma-tokens.json'), JSON.stringify(json, null, 2) + '\n');

/* ── write the human map ──────────────────────────────────────────────────── */

const byFamily = variables.filter((v) => v.scopeSource === 'family');
const unused = variables.filter((v) => !v.scopes.length);
const neverUsed = unused.filter((v) => !v.props.length);
const nonBindable = unused.filter((v) => v.props.length);
const groups = [...new Set(variables.map((v) => v.collection))].sort();
const table = (rows) => rows.map((v) =>
  `| \`${figmaName(v.name)}\` | ${v.kind} | ${v.aliasOf ? '→ `' + figmaName(v.aliasOf) + '`' : '`' + v.value + '`'} | ${v.scopes.join(', ') || '—'} | \`var(${v.name})\` |`).join('\n');

const md = `<!-- GENERATED by tools/build-figma-map.mjs from design-system/tokens/*.css and the components.
     Do not edit. Run \`npm run build:figma-map\` after changing tokens. -->

# Sentinel in Figma — the token map

Every Figma variable, text style and effect style this system may hold, and the exact CSS token each
one answers to. **Scopes are measured**, not named: each is derived from the CSS properties that
actually consume the token across all ${consumers.length} files that consume tokens
(components, the stylesheets, the UI kits and the screens), so a colour only reaches the
stroke picker if something strokes with it.

**${variables.length} variables · ${typeRoles.length} text styles · ${effects.length} effect styles ·
${documented.length} documented-only.**

## One mode, not Light/Dark

Sentinel has one canvas and **no dark mode** — \`grep prefers-color-scheme design-system/tokens/*.css\`
returns nothing. Every collection therefore has a single mode named \`Value\`. The generic advice to
start with Light/Dark is for a different product; adding an empty Dark mode here would invent a
surface the system does not have, and every variable would carry a second value nobody set.

## Two colour layers, and the split is measured

A token whose value is a literal (\`#251f1b\`, \`rgba(…)\`) is a **Palette** variable. A token whose
value is \`var(--other)\` is a **Colour** variable that aliases it. That is read off the CSS, not
decided: ${variables.filter((v) => v.kind === 'COLOR' && v.layer === 'base').length} palette
entries, ${variables.filter((v) => v.kind === 'COLOR' && v.layer === 'semantic').length} roles.

**Palette variables get \`scopes = []\`** so they never appear in a designer's picker — the role is
what a designer picks. This is the one place the map overrides its own measurement, and it is
deliberate.

${groups.map((g) => {
  const rows = variables.filter((v) => v.collection === g);
  return `## Collection \`${g}\` — ${rows.length} variables\n\n| Figma name | Type | Value | Measured scopes | Code syntax |\n| --- | --- | --- | --- | --- |\n${table(rows)}`;
}).join('\n\n')}

## Text styles — ${typeRoles.length} roles

A type role is a composite (\`weight size/leading family\`), which no single Figma variable can hold.
Each becomes a **text style** that binds four variables. The role name is the style name: a designer
picks \`body\`, never 14px.

| Style | Weight | Size | Line height | Family |
| --- | --- | --- | --- | --- |
${typeRoles.map((t) => `| \`${t.role}\` | \`${figmaName(t.weight)}\` | \`${figmaName(t.size)}\` | \`${figmaName(t.leading)}\` | \`${figmaName(t.family)}\` |`).join('\n')}

Both families are Google Fonts and load natively in Figma — **Urbanist** (400/500/600/700) and
**Darker Grotesque** (500). Nothing has to be uploaded, and type fidelity is therefore achievable
rather than approximated.

## Effect styles — ${effects.length}

| Style | Value |
| --- | --- |
${effects.map((e) => `| \`${e.name.replace(/^--/, '')}\` | \`${e.value}\` |`).join('\n')}

## Documented only — ${documented.length}, and why

Figma has no variable type for these. They are not missing from the library; they are carried
somewhere else, and the skill states where so nobody adds them as loose numbers.

| Token | Value | Where it lives instead |
| --- | --- | --- |
${documented.map((d) => `| \`${d.name}\` | \`${d.value.slice(0, 48)}${d.value.length > 48 ? '…' : ''}\` | ${d.why} |`).join('\n')}

## Variables with no scope — ${unused.length}, in two kinds

Both are created with \`scopes = []\` — present in the library for completeness, hidden from every
picker — but they are hidden for different reasons, and collapsing them would hide real debt.

### Referenced nowhere — ${neverUsed.length}

Dead tokens. \`npm run check:tokens\` already counts these as debt, not as a defect. The Figma
library must not offer a designer a token the product never uses.

${neverUsed.map((v) => `- \`${figmaName(v.name)}\``).join('\n') || '_none_'}

### Used, but only where Figma cannot bind — ${nonBindable.length}

These are live tokens consumed by \`animation\`, \`transition\`, \`zIndex\`, \`opacity\` and the
like. Figma has no variable scope for those properties, so the value is carried by the prototype
interaction or set directly on the node, and the variable exists as the record of the number.

| Token | Measured in |
| --- | --- |
${nonBindable.map((v) => `| \`${figmaName(v.name)}\` | ${v.props.slice(0, 4).join(' · ')} |`).join('\n') || '| _none_ | |'}
`;
await writeFile(join(OUT, 'tokens.md'), md);

/* ── the component inventory ──────────────────────────────────────────────── */

const groupsOf = {};
let withProps = 0, noDts = 0;
for (const p of sources) {
  const g = basename(dirname(p));
  const name = basename(p, '.jsx');
  let props = [];
  try {
    const dts = await readFile(p.replace(/\.jsx$/, '.d.ts'), 'utf8');

    /* Every exported string-union type in the file. A prop typed as one of these is a VARIANT SET
       in Figma, and its members are the variant values — which is the single most useful thing the
       .d.ts can tell a Figma build, so it is extracted rather than left for someone to re-read. */
    const unions = new Map();
    for (const u of dts.matchAll(/export\s+type\s+(\w+)\s*=\s*((?:\s*'[^']*'\s*\|?)+)\s*;/g)) {
      unions.set(u[1], [...u[2].matchAll(/'([^']*)'/g)].map((m) => m[1]));
    }

    /* The props interface, single-line or multi-line. The earlier parser only handled multi-line
       and reported 35 of 98 components as propless; AnswerChip declares five props on one line. */
    const iface = dts.match(new RegExp(`(?:interface|type)\\\\s+${name}Props\\\\s*=?\\\\s*\\\\{([\\\\s\\\\S]*?)\\\\}\\\\s*(?:;|\\\\n)`))
      || dts.match(/(?:interface|type)\s+\w*Props\s*=?\s*\{([\s\S]*?)\}\s*(?:;|\n)/);
    if (iface) {
      /* Strip comments first — a doc comment can contain a colon and would parse as a prop. */
      const body = iface[1].replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
      /* Split on the `;` and newlines that separate members, not on those inside `() => void`. */
      for (const member of body.split(/[;\n]/)) {
        const m = member.match(/^\s*(?:readonly\s+)?['"]?([a-zA-Z_$][\w$-]*)['"]?\s*(\??)\s*:\s*(.+)$/s);
        if (!m) continue;
        const [, prop, optional, type] = m;
        const t = type.trim();
        let values = null;
        if (unions.has(t.replace(/\s*\|\s*undefined$/, ''))) values = unions.get(t.replace(/\s*\|\s*undefined$/, ''));
        else if (/^(?:\s*'[^']*'\s*\|?)+$/.test(t)) values = [...t.matchAll(/'([^']*)'/g)].map((x) => x[1]);
        const kind = values ? 'VARIANT' : /^boolean\b/.test(t) ? 'BOOLEAN'
          : /^string\b/.test(t) ? 'TEXT'
          : /(ReactNode|JSX\.Element|ReactElement)/.test(t) ? 'INSTANCE_SWAP'
          : /^\(/.test(t) || /=>/.test(t) ? 'interaction' : 'other';
        if (props.some((x) => x.prop === prop)) continue;   // a prop restated in an extends clause
        props.push({ prop, kind, values, optional: optional === '?' });
      }
    }
  } catch { noDts++; }
  if (props.length) withProps++;
  (groupsOf[g] ||= []).push({ name, props });
}
const order = Object.keys(groupsOf).sort();
const allProps = Object.values(groupsOf).flat().flatMap((c) => c.props);
const variantProps = allProps.filter((p) => p.kind === 'VARIANT');

const cell = (c) => c.props.length
  ? c.props.map((p) => p.kind === 'VARIANT' ? `**\`${p.prop}\`**=${p.values.join('｜')}` : `\`${p.prop}\``).join(' · ')
  : '—';
const kindsOf = (c) => {
  const k = {};
  for (const p of c.props) k[p.kind] = (k[p.kind] || 0) + 1;
  return Object.entries(k).map(([a, n]) => `${n} ${a}`).join(', ') || '—';
};

const inv = `<!-- GENERATED by tools/build-figma-map.mjs. Do not edit. Run \`npm run build:figma-map\`. -->

# Sentinel in Figma — the component inventory

${sources.length} components in ${order.length} groups. **One Figma page per group**, not one per
component: at ${sources.length} components a page each is a file nobody can navigate, and the groups
are already the system's own taxonomy. Split a group only when one component's variant matrix needs
the room.

## How a prop becomes a Figma property

Read from each \`.d.ts\`, and the type decides — this is not a judgement call at build time.

| \`.d.ts\` type | Figma | Count |
| --- | --- | --- |
| a string union (\`'outline' \\| 'smart'\`) | **variant set**, one variant per member | ${variantProps.length} |
| \`boolean\` | **BOOLEAN property** | ${allProps.filter((p) => p.kind === 'BOOLEAN').length} |
| \`string\` | **TEXT property** | ${allProps.filter((p) => p.kind === 'TEXT').length} |
| \`ReactNode\` / \`JSX.Element\` | **INSTANCE_SWAP** | ${allProps.filter((p) => p.kind === 'INSTANCE_SWAP').length} |
| a function | an **interaction** — a prototype link, never a variant | ${allProps.filter((p) => p.kind === 'interaction').length} |
| anything else (data, objects, arrays) | **not a property.** It is content: fill the instance and move on | ${allProps.filter((p) => p.kind === 'other').length} |

**Never a variant per icon** — that is what \`INSTANCE_SWAP\` is for. And a component whose variant
matrix would exceed 30 gets split, not built.

${withProps} of ${sources.length} components declare props; the rest take none and are a single
component with no variants.

Variant values are shown in **bold** below with their members, because those are the variant sets
that have to exist and nobody should have to re-read a \`.d.ts\` to find them.

${order.map((g) => {
  const rows = groupsOf[g].sort((a, b) => a.name.localeCompare(b.name));
  const v = rows.reduce((n, c) => n + c.props.filter((p) => p.kind === 'VARIANT').length, 0);
  return `## \`${g}\` — ${rows.length} components, ${v} variant set${v === 1 ? '' : 's'}\n\n| Component | Props | Figma |\n| --- | --- | --- |\n${rows.map((c) => `| \`${c.name}\` | ${cell(c)} | ${kindsOf(c)} |`).join('\n')}`;
}).join('\n\n')}
`;
await writeFile(join(OUT, 'inventory.md'), inv);

/* ── report ───────────────────────────────────────────────────────────────── */

console.log(`figma-tokens.json + tokens.md: ${variables.length} variables in ${groups.length} collections ` +
  `(${groups.join(', ')}), ${typeRoles.length} text styles, ${effects.length} effect styles, ${documented.length} documented-only`);
console.log(`inventory.md: ${sources.length} components in ${order.length} groups, ${withProps} with props, ${variantProps.length} variant sets`);
console.log(`  scopes: ${byFamily.length} from the token family, ${variables.length - byFamily.length} measured from consumption (colours)`);
if (unused.length) console.log(`  ${unused.length} with no scope: ${neverUsed.length} referenced nowhere (debt), ${nonBindable.length} used only where Figma cannot bind`);
/* Figma rejects a scope that does not match the variable's type, and a rejected scope is a silent
   ALL_SCOPES in practice. Asserted here rather than discovered when a designer opens a picker. */
const COLOUR_ONLY = ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR', 'EFFECT_COLOR'];
const mismatched = variables.filter((v) => {
  const s = v.scopes;
  if (!s.length) return false;
  return v.kind === 'COLOR' ? !s.every((x) => COLOUR_ONLY.includes(x)) : s.some((x) => COLOUR_ONLY.includes(x));
});
if (mismatched.length) {
  console.error(`\n${mismatched.length} variable(s) carry a scope their type cannot hold:`);
  for (const m of mismatched) console.error(`  ${m.name} (${m.kind}): ${m.scopes.join(', ')}`);
  process.exit(1);
}

if (unclassified.length) {
  console.error(`\n${unclassified.length} token(s) could not be classified — a guess here reaches a designer's picker:`);
  for (const u of unclassified) console.error(`  ${u.name}: ${u.why}`);
  process.exit(1);
}
