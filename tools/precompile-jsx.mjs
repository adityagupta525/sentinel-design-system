/* PRECOMPILE THE PAGES' JSX, SO THE PUBLISHED ARTIFACT NEEDS NO COMPILER (20 Sep 2026).
   Every page shipped `<script type="text/babel">` and let Babel standalone compile it in the
   browser. That is right for the repository — a source edit is visible on reload with no build —
   and wrong for the artifact, for three reasons: it downloads a 3 MB compiler per page, it fetches
   each .jsx over XHR, and it compiles through `new Function`, which a strict Content-Security-Policy
   refuses. The artifact's own CSP is the one environment we cannot open a console in, so the
   dependency is removed rather than assumed to be allowed.

   The compile options below are copied from @babel/standalone's own script-tag runner
   (`buildBabelOptions`), and the output is emitted as plain `<script>` in document order — which is
   exactly what that runner does with `document.createElement('script')`. So the compiled page runs
   in the same one global script scope the pages were written against, and a screen module still
   publishes onto `window` rather than relying on a shared binding. */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';

const Babel = createRequire(import.meta.url)('@babel/standalone');

const DEFAULT_PRESETS = ['react', 'env'];
const PLUGINS = ['transform-class-properties', 'transform-object-rest-spread', 'transform-flow-strip-types'];

const cache = new Map();

function compile(code, presets, filename) {
  const key = `${presets.join('+')}::${filename}::${code.length}`;
  if (cache.has(key)) return cache.get(key);
  const out = Babel.transform(code, {
    presets,
    plugins: PLUGINS,
    filename,
    sourceMaps: false,
    targets: { browsers: undefined },
    babelrc: false,
    configFile: false,
  }).code;
  cache.set(key, out);
  return out;
}

const attr = (attrs, name) => (attrs.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1];

/* A compiled body that contained the literal `</script>` would end the tag early. Babel's own
   runner sets `.text` on an element and never parses HTML, so it never had to care; writing the
   code into a document does. */
const guard = (js) => js.replace(/<\/script/gi, '<\\/script');

/** Rewrite one HTML page. Returns { html, compiled } — compiled is how many tags were replaced. */
export function precompilePage(html, htmlPath) {
  let compiled = 0;
  const out = html.replace(
    /<script([^>]*\btype="text\/babel"[^>]*)>([\s\S]*?)<\/script>/g,
    (whole, attrs, inline) => {
      const src = attr(attrs, 'src');
      const presetAttr = attr(attrs, 'data-presets');
      const presets = presetAttr ? presetAttr.split(',').map((s) => s.trim()) : DEFAULT_PRESETS;
      let code, name;
      if (src) {
        const file = resolve(dirname(htmlPath), src);
        try {
          code = readFileSync(file, 'utf8');
        } catch {
          return whole; // a source the artifact does not carry: leave the page as it was
        }
        name = src;
      } else {
        code = inline;
        name = `${htmlPath.split('/').pop()} (inline)`;
      }
      compiled += 1;
      return `<script>${guard(compile(code, presets, name))}</script>`;
    },
  );
  if (!compiled) return { html: out, compiled };
  /* The compiler itself is now dead weight — and leaving it would keep the CSP dependency the
     whole exercise removes, because Babel runs `runScripts` on DOMContentLoaded whether or not
     there is anything left to compile. */
  return {
    html: out.replace(/\s*<script src="[^"]*babel[^"]*"[^>]*><\/script>/g, ''),
    compiled,
  };
}
