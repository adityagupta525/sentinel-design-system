import React from 'react';
import { Pill } from './Pill.jsx';
/* A thin wrapper over Pill, and deliberately thin — it exists so that "download" is one decision in
   one place rather than a loading flag wired by hand at every call site. It was blocked on Pill
   gaining `loading`; that landed in v10, so this is now four lines of real behaviour.

   The label holds through the wait (Pill's rule: the width never changes, so the target under the
   finger never moves), and confirmation happens ON the control — "Downloaded" in place, for two
   seconds — because there are no toasts in this product. Failure says what to do next rather than
   what went wrong internally. */
/* `doneLabel` — BECAUSE THIS COMPONENT CANNOT KNOW WHETHER A FILE WAS WRITTEN (20 Sep 2026). It said
   "Saved to Files" on every success, and in this build nothing writes a file anywhere — so the one
   control in the product that states an outcome was stating a false one, against the product's own
   standard that it names what it cannot do rather than failing silently. The default is still the
   right words for a real build; a specimen passes the truth instead. */
export function DownloadAction({ label, format = 'PDF', onDownload, size = 'md', tone = 'outline', disabled = false, doneLabel = 'Saved to Files' }) {
  const [state, setState] = React.useState('idle');
  const text = label || `Download ${format}`;
  const run = async () => {
    setState('working');
    try { await (onDownload ? onDownload(format) : Promise.resolve()); setState('done'); setTimeout(() => setState('idle'), 2000); }
    catch { setState('failed'); }
  };
  const shown = state === 'done' ? doneLabel : state === 'failed' ? 'Try again' : text;
  return <Pill label={shown} size={size} tone={state === 'done' ? 'smart' : tone} loading={state === 'working'} disabled={disabled} onClick={state === 'working' ? undefined : run} selected={state === 'done'} />;
}
