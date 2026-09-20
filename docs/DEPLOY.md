# Deploying Sentinel for the team

Two things a team can be given, and they answer different questions.

| | Who it is for | What it is |
|---|---|---|
| **The artifact** | Someone who should look at the product | A private link, 254 files, no build. Updated with `npm run build:artifact` and republished |
| **A Vercel deployment** | A team that should USE it — testing, a demo on a real phone, a link in a ticket | The same pages on a public URL, rebuilt on every push |

## Vercel

`vercel.json` is in the repository and needs nothing else. It builds the bundle, regenerates
the component index, stages `artifact/` and serves that as the site root — so the deployed
landing page is the same grouped cover as the artifact, and every link under it works.

```bash
npx vercel            # first run: link the project, then deploy a preview
npx vercel --prod     # the production URL
```

Or connect the GitHub repository in the Vercel dashboard and let it build on push. The branch
this work lives on is `claude/practical-newton-fi0pof`.

**One header matters.** `.d.ts`, `.jsx` and `.md` are served as `text/plain`. Without it a `.d.ts`
is served as `video/mp2t` and every spec page's **Props** block comes up blank — the same trap the
artifact publish has.

**Nothing needs a server.** These pages are static: React, ReactDOM, Babel and d3 come from public
CDNs, and the component bundle is a file. The dev server in `tools/preview-server.mjs` exists only to
swap in `node_modules` copies when those CDNs are unreachable on a laptop; on the open internet it is
not needed.

## An `.apk` for demo testing

Not built, and worth saying why rather than leaving it implied. This product is a web build at
375 × 812 — there is no React Native app, no native shell and no store account here. Three honest
routes, in the order they cost:

1. **A home-screen PWA.** Add a manifest and a service worker to the deployment above; an advisor
   opens the Vercel URL on Android, taps *Add to home screen*, and gets a full-screen icon with no
   browser chrome. Closest to an app for a demo, and it is an afternoon's work rather than a project.
2. **A WebView wrapper** — Capacitor or Bubblewrap around the same URL, which does produce a real
   `.apk` that can be side-loaded. It is still these pages inside a frame; what it buys is the file
   itself, which is sometimes what a demo needs.
3. **A native build**, which is the real product and a different piece of work entirely.

Route 1 or 2 can be done from what is already here. Route 3 is what the handoff in
`docs/HANDOVER.md` is for.
