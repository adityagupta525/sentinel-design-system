DownloadAction — a deliberately thin `Pill` wrapper, so that "download" is one decision in one place rather than a loading flag wired by hand at every call site. It was blocked on `Pill` gaining `loading`; that landed in v10.
```jsx
<DownloadAction format="PDF" onDownload={save} />
<DownloadAction format="PPTX" label="Download the deck" onDownload={save} />
```
The label holds through the wait (Pill's rule — the width never changes, so the target under the finger never moves), and **confirmation lands on the control**: `Saved to Files` in place for two seconds, because this product has no toasts. Failure reads `Try again` — what to do next, not what broke internally.
