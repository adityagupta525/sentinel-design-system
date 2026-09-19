import React from 'react';
/* The reduced-motion law, in the bundle rather than only in the stylesheet.
   tokens/effects.css carries the same block, but a consuming project that loads _ds_bundle.js and
   styles its own page would get every animation at full travel — the document promised something the
   build did not keep. This module installs the block from JS the moment the bundle evaluates, so the
   promise holds for anyone who loads the bundle at all. Idempotent by id; the stylesheet version wins
   where both exist, because they say the same thing.
   Keyframes are REDEFINED, not cancelled: every looping or entrance animation lands in its final state
   with an opacity fade and nothing else — no translate, no scale, no rotation, no pulse. */
/* THE DEFINING KEYFRAME SHIPS WITH THE CANCELLING ONE (F-46, 19 Sep 2026). `ds-spin` was DEFINED only
   inside IconSpinner's own <style>, while the block below CANCELS it globally — so on any page without
   an IconSpinner mounted, `Pill loading`'s spinner carried an animation name with no keyframe and stood
   still. Measured on pages/Pill.html and on screens/thread/ledger.html: keyframe defined 0 times,
   getAnimations().length 0, transform: none. The system's own rule is that a global rule does not live
   inside a component; the cancelling half obeyed it and the defining half did not. */
export const MOTION_CSS = `@keyframes ds-spin{to{transform:rotate(360deg)}}`;
export const REDUCED_MOTION_CSS = MOTION_CSS + `@media (prefers-reduced-motion:reduce){
@keyframes sentinel-shimmer{0%,100%{opacity:1}}
@keyframes dot-pulse{0%,100%{opacity:1}}
@keyframes ds-rise{from{opacity:0}to{opacity:1}}
@keyframes ds-fade{from{opacity:0}to{opacity:1}}
@keyframes ds-grow{from{transform:scaleX(1)}to{transform:scaleX(1)}}
@keyframes ds-artifact{from{opacity:0}to{opacity:1}}
@keyframes ds-sheet{from{opacity:0;transform:none}to{opacity:1;transform:none}}
@keyframes ds-draw{from{stroke-dashoffset:0;opacity:0}to{stroke-dashoffset:0;opacity:1}}
@keyframes ds-draw-on{from{stroke-dashoffset:0;opacity:0}to{stroke-dashoffset:0;opacity:1}}
@keyframes ds-spin{from{transform:none}to{transform:none}}
@keyframes ds-tip-up{from{opacity:0;transform:translateX(-50%)}to{opacity:1;transform:translateX(-50%)}}
@keyframes ds-tip-down{from{opacity:0;transform:translateX(-50%)}to{opacity:1;transform:translateX(-50%)}}
@keyframes kit-slide{from{opacity:0}to{opacity:1}}
@keyframes kit-drawer{from{opacity:0;transform:none}to{opacity:1;transform:none}}
*,*::before,*::after{transition-duration:1ms!important;scroll-behavior:auto!important}
}
/* Pressable's two guarantees, shipped from the bundle for the same reason the reduced-motion block is:
   a consuming project that loads _ds_bundle.js and styles its own page would otherwise get a base
   component whose focus ring and 44pt hit expansion silently do nothing. tokens/effects.css carries
   the identical rules; whichever lands first wins and they say the same thing. */
.ds-pressable{outline:none}
.ds-pressable:focus-visible{outline:var(--border-focus-width) solid var(--border-focus);outline-offset:2px;box-shadow:var(--focus-ring)}
.ds-pressable[data-hit]::before{content:"";position:absolute;left:calc(-1 * var(--hit-x));right:calc(-1 * var(--hit-x));top:calc(-1 * var(--hit-y));bottom:calc(-1 * var(--hit-y))}`;
export function installReducedMotion(doc) {
  const d = doc || (typeof document !== 'undefined' ? document : null);
  if (!d || d.getElementById('ds-reduced-motion')) return false;
  const el = d.createElement('style');
  el.id = 'ds-reduced-motion';
  el.textContent = REDUCED_MOTION_CSS;
  d.head.appendChild(el);
  return true;
}installReducedMotion();
/* Renders nothing. Mount it only where the bundle is loaded lazily and you want the install tied to a
   React tree; loading the bundle already installed it. */
export function MotionGuard() {
  React.useEffect(() => { installReducedMotion(); }, []);
  return null;
}
