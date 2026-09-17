/* The bundle runs in a page that already loaded React from a <script> tag, so `import React from
   'react'` inside a component has to resolve to that one instance — never a second copy. Aliased in
   by tools/build-bundle.mjs. */
const React = globalThis.React;
if (!React) throw new Error('_ds_bundle.js needs React on the page before it loads.');
export default React;
