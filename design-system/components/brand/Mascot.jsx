import React from 'react';
/* THE MASCOT, DRAWN — not rendered (21 Sep 2026).
   The product ships no images, so the character that exists as a 3D model in Blender
   (~/Downloads/sentinel-mascot/sentinel-bot-v4.blend) exists here as one SVG built from tokens.
   Every proportion below was read off that model's orthographic front view, so the drawing and the
   model are the same creature at two resolutions rather than two creatures that resemble each other.

   HEAD ONLY, on purpose. The model has a tiny body tucked under the head; at every size this
   component is used at, the body is noise beneath the one thing that reads — the face. The head is
   1.38 : 1, wider than tall. The plate is about half the head's width and 62% of its height,
   centred. The eyes sit LOW and RIGHT of the plate's centre — that offset is the character's
   signature; centred, it is any robot.

   Colour never encodes identity (rule 1), and this component does not break that: the shell and the
   plate are two neutrals from the surface set, and the eyes are the one bronze — the same bronze the
   thinking dots and the chip text already are. `tone` swaps which neutral is which so the mascot
   sits on either ground; it never introduces a colour. */
const TONE = {
  light: { shell: 'var(--color-desk)', plate: 'var(--color-ink)', eye: 'var(--color-bronze)', tab: 'var(--color-bronze-deep)' },
  dark:  { shell: 'var(--color-ink)',  plate: 'var(--color-desk)', eye: 'var(--color-bronze)', tab: 'var(--color-bronze)' },
};

/* `working` reuses `dot-pulse` — 1.2s, opacity .28 → 1 — exactly SentinelThinking's rhythm, so the
   mascot waiting and the thread waiting are visibly one behaviour. The second eye trails by 150ms,
   which is the same stagger the three dots use. Under prefers-reduced-motion `dot-pulse` already
   resolves to a hold at full opacity (tokens/effects.css), so nothing here needs its own answer. */
const pulse = (i) => `dot-pulse 1200ms var(--ease) ${i * 150}ms infinite`;

export function Mascot({ size = 96, state = 'attentive', tone = 'light', label = 'Sentinel' }) {
  const c = TONE[tone] || TONE.light;
  const eyesOn = state !== 'waking';
  const working = state === 'working';
  const h = Math.round(size * 0.74);
  return (
    <svg className="ds-mascot" width={size} height={h} viewBox="0 0 100 74" role="img" aria-label={label} style={{ display: 'block', flexShrink: 0 }}>
      <g className="ds-mascot-shell">
        <rect x="0" y="28" width="6" height="14" rx="2" fill={c.tab} />
        <rect x="4" y="4" width="92" height="66" rx="18" fill={c.shell} />
        <rect x="27" y="17" width="46" height="40" rx="8" fill={c.plate} />
      </g>
      <g className="ds-mascot-eyes" style={{ opacity: eyesOn ? 1 : 0, transition: `opacity var(--dur-enter) var(--ease)` }}>
        <rect x="51" y="42" width="8" height="8" rx="2" fill={c.eye} style={working ? { animation: pulse(0) } : undefined} />
        <rect x="61" y="42" width="8" height="8" rx="2" fill={c.eye} style={working ? { animation: pulse(1) } : undefined} />
      </g>
    </svg>
  );
}
