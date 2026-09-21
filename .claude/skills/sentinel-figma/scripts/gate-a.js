/* GATE A — structural parity. Paste into `use_figma` with SET_NAME set to the component set.
   See ../references/parity.md. The ceiling is zero literals: a Figma component that renders
   perfectly and fails this drifts silently on the first token change, and nothing reports it.

   Two scoping rules, both learned the hard way on Surface:

   1. The COMPONENT_SET is a container Figma draws to ARRANGE variants. Its own padding and radius
      are how the board looks, not what ships. Auditing them reported 46 literals that were all the
      board's. Gate A covers each COMPONENT and its descendants.

   2. A node named `content` is the replaceable slot. Its geometry has no tokens by definition, so
      it is exempt — but its TEXT is not: a placeholder still has to use one of the 14 roles.

   And one correction to the gate itself: **Figma records a stroke-weight binding on the four
   per-side fields**, `strokeTopWeight` and friends, not on `strokeWeight`. Checking only the
   combined field reported three bound ring variants as literals. */
const SET_NAME = 'REPLACE_ME';

const page = figma.currentPage;
const set = page.findOne((n) => n.type === 'COMPONENT_SET' && n.name === SET_NAME)
  || page.findOne((n) => n.type === 'COMPONENT' && n.name === SET_NAME);
if (!set) throw new Error(`no component or set named ${SET_NAME} on ${page.name}`);
const variants = set.type === 'COMPONENT_SET' ? set.children : [set];

const vars = new Map();
for (const t of ['COLOR', 'FLOAT', 'STRING']) {
  for (const v of await figma.variables.getLocalVariablesAsync(t)) vars.set(v.id, v);
}
const tstyles = new Map((await figma.getLocalTextStylesAsync()).map((s) => [s.id, s.name]));
const estyles = new Map((await figma.getLocalEffectStylesAsync()).map((s) => [s.id, s.name]));
const pstyles = new Map((await figma.getLocalPaintStylesAsync()).map((s) => [s.id, s.name]));

const GEOM = ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius',
  'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing'];
const SIDE_WEIGHTS = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'];

const problems = [];
const used = new Set();

for (const variant of variants) {
  for (const node of [variant, ...variant.findAll(() => true)]) {
    const where = `${variant.name} › ${node.name}`;
    const isSlot = node.name === 'content';
    const bv = node.boundVariables || {};

    if ('fills' in node && Array.isArray(node.fills) && node.fills.length) {
      if (node.fillStyleId) used.add('paint:' + (pstyles.get(node.fillStyleId) || node.fillStyleId));
      else {
        for (const f of node.fills) {
          if (f.boundVariables && f.boundVariables.color) used.add(vars.get(f.boundVariables.color.id)?.name);
          else problems.push({ where, what: 'fill is a literal' });
        }
      }
    }
    if ('strokes' in node && Array.isArray(node.strokes) && node.strokes.length) {
      for (const s of node.strokes) {
        if (s.boundVariables && s.boundVariables.color) used.add(vars.get(s.boundVariables.color.id)?.name);
        else problems.push({ where, what: 'stroke colour is a literal' });
      }
      /* The per-side fields are where Figma keeps the binding. Any one of them counts. */
      const bound = SIDE_WEIGHTS.filter((k) => bv[k]);
      if (bv.strokeWeight) used.add(vars.get(bv.strokeWeight.id)?.name);
      else if (bound.length) used.add(vars.get(bv[bound[0]].id)?.name);
      else if (node.strokeWeight) problems.push({ where, what: `strokeWeight = ${node.strokeWeight} is a literal` });
    }
    if (!isSlot) {
      for (const k of GEOM) {
        if (!(k in node)) continue;
        const v = node[k];
        if (typeof v !== 'number' || v === 0) continue;
        if (bv[k]) used.add(vars.get(bv[k].id)?.name);
        else problems.push({ where, what: `${k} = ${v} is a literal` });
      }
    }
    if (node.type === 'TEXT') {
      if (node.textStyleId) used.add('text:' + tstyles.get(node.textStyleId));
      else problems.push({ where, what: `text "${node.characters.slice(0, 20)}" has no style` });
    }
    if (node.effects && node.effects.length && !node.effectStyleId) {
      problems.push({ where, what: 'effect is not a style' });
    }
    if (node.effectStyleId) used.add('effect:' + estyles.get(node.effectStyleId));
  }
}

const names = [...used].filter(Boolean);
/* Every variable reached for must be one the generated map knows — proven by it carrying a real
   var(--token) code syntax, which only the map's own build sets. */
const unknown = names.filter((n) => !/^(text|effect|paint):/.test(n)).filter((n) => {
  const v = [...vars.values()].find((x) => x.name === n);
  return !v || !v.codeSyntax || !v.codeSyntax.WEB;
});

return {
  component: SET_NAME,
  variants: variants.length,
  literals: problems.length,
  problems: problems.slice(0, 12),
  tokensUsed: [...new Set(names)].sort(),
  unknownTokens: unknown,
  gateA: problems.length === 0 && unknown.length === 0 ? 'PASS' : 'FAIL',
};
