# Deploying Sentinel for the team

Two things a team can be given, and they answer different questions.

| | Who it is for | What it is |
|---|---|---|
| **The artifact** | Someone who should look at the product | A private link, 254 files, no build. Updated with `npm run build:artifact` and republished |
| **A Vercel deployment** | A team that should USE it — testing, a demo on a real phone, a link in a ticket | The same pages on a public URL, rebuilt on every push |

## Vercel

`vercel.json` serves the committed `site/` directory and **runs no build**. That is deliberate:
`site/` is built and verified before it is pushed — 131 pages that render over `file://` with the
theme resolved, no console error and no failed request — so rebuilding it on Vercel would add three
ways to fail (`npm ci`, the esbuild binary, and `python3` for the cover generator) in exchange for
nothing, and a failed build is a failed deployment.

**The trade:** a push that changes source without running `npm run build:artifact` deploys a stale
site. Rebuild and commit `site/` in the same commit as any change that should be visible.

### Connecting it, once

Vercel needs a login connection to GitHub before it can link the repository. That is an account
setting and only the account owner can grant it:

1. vercel.com → **Settings → Login Connections → GitHub → Connect**.
2. Then **Add New → Project**, pick `adityagupta525/sentinel-design-system`, and deploy. Vercel reads
   `vercel.json` and needs no other configuration.

The branch this work lives on is `claude/practical-newton-fi0pof`; set it as the production branch in
**Settings → Git** so pushes to it deploy.

### Or from a terminal, with no connection at all

```bash
npx vercel --prod
```

The first run opens a browser to log in, asks which scope to deploy under, and links the directory.
It uploads what is on disk — so `site/` must be current. Nothing else is needed.

**One header matters.** `.d.ts`, `.jsx` and `.md` are served as `text/plain`. Without it a `.d.ts`
is served as `video/mp2t` and the files cannot be read in a browser — the same trap the artifact
publish has.

**Nothing needs a server.** These pages are static. React, ReactDOM and d3 come from public CDNs; the
component bundle is a file; the JSX is compiled at build time and the theme is inlined into every
page. `tools/preview-server.mjs` exists only to swap in `node_modules` copies when those CDNs are
unreachable on a laptop.

**It will be public.** A Vercel deployment on the hobby plan is reachable by anyone with the URL.
If that is not wanted, turn on **Settings → Deployment Protection → Vercel Authentication** before
sharing the link.

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
