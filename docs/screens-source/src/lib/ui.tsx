import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { IconArrow, IconAttach, IconChevronRight, IconMenu, IconPlus, IconSparkle } from "./icons";

export const EASE = [0.2, 0.8, 0.2, 1] as const;

/* ── Aura wash + paper texture, sampled from the source frame ─────────── */
export function ScreenBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-canvas">
      <div className="absolute inset-0 paper-texture" />
      <div
        className="absolute left-[-93px] top-[-105px] size-[320px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(182,147,119,0.26) 0%, rgba(182,147,119,0) 66%)" }}
      />
      <div
        className="absolute right-[-120px] top-[-40px] size-[320px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(17,17,17,0.06) 0%, rgba(17,17,17,0) 66%)" }}
      />
    </div>
  );
}

/* ── Device frame: 375 × 812 with safe-area + home indicator ──────────── */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden rounded-[44px] bg-canvas shadow-[0px_40px_80px_-24px_rgba(37,31,27,0.45)] ring-1 ring-black/10">
      <div className="relative flex h-full w-full flex-col">{children}</div>
    </div>
  );
}

export function StatusSpacer() {
  return (
    <div className="relative z-10 flex h-[44px] w-full shrink-0 items-end justify-between px-[24px] pb-[6px]">
      <p className="font-['Urbanist:SemiBold',sans-serif] text-[13px] text-ink">9:41</p>
      <div className="flex items-center gap-[5px]">
        <div className="flex items-end gap-[2px]">
          {[6, 9, 12, 15].map((h) => (
            <div key={h} className="w-[3px] rounded-[1px] bg-ink" style={{ height: h }} />
          ))}
        </div>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.5C10 2.5 11.8 3.3 13 4.6M8 6C9 6 9.9 6.4 10.5 7M5.5 9.3 8 11l2.5-1.7" stroke="#251f1b" strokeWidth="1.3" strokeLinecap="round" /></svg>
        <div className="relative h-[11px] w-[22px] rounded-[3px] border border-ink/40"><div className="absolute inset-[1.5px] right-[5px] rounded-[1px] bg-ink" /></div>
      </div>
    </div>
  );
}

export function HomeIndicator({ tone = "bronze" }: { tone?: "bronze" | "dark" }) {
  return (
    <div className="relative z-10 flex h-[24px] w-full shrink-0 items-center justify-center">
      <div className={`h-[5px] w-[134px] rounded-full ${tone === "dark" ? "bg-ink/80" : "bg-bronze"}`} />
    </div>
  );
}

/* ── Top bar: hamburger · Sentinel pill · new-thread ──────────────────── */
export function TopBar({
  onMenu,
  onNew,
  title = "Sentinel",
}: {
  onMenu?: () => void;
  onNew?: () => void;
  title?: string;
}) {
  return (
    <div className="relative z-10 flex h-[44px] w-full shrink-0 items-center justify-between px-[16px]">
      <Pressable onClick={onMenu} className="flex size-[40px] items-center justify-center rounded-full">
        <IconMenu />
      </Pressable>
      <Pressable onClick={onNew ? undefined : undefined} className="cursor-default rounded-full bg-white px-[16px] py-[12px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)] ring-1 ring-line">
        <p className="font-['Urbanist:SemiBold',sans-serif] text-center text-[14px] leading-none text-ink">{title}</p>
      </Pressable>
      <Pressable onClick={onNew} className="flex size-[44px] items-center justify-center rounded-full">
        <IconPlus />
      </Pressable>
    </div>
  );
}

/* ── Generic pressable with the calm press micro-state ────────────────── */
export function Pressable({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: EASE }}
      className={`${className} ${disabled ? "opacity-40" : ""} outline-none`}
    >
      {children}
    </motion.button>
  );
}

/* ── Quick-action chip ────────────────────────────────────────────────── */
export function Chip({
  label,
  onClick,
  active = false,
  labelStyle,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  labelStyle?: CSSProperties;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: EASE }}
      className={`h-[36px] rounded-full px-[12px] ring-1 transition-colors ${
        active ? "bg-bronze/20 ring-bronze" : "bg-chip ring-bubble-edge"
      }`}
    >
      <span className="font-['Urbanist:Bold',sans-serif] text-[12px] leading-[18px] text-bronze-deep" style={labelStyle}>{label}</span>
    </motion.button>
  );
}

/* ── Suggestion row with chevron ──────────────────────────────────────── */
export function SuggestionRow({
  label,
  onClick,
  last = false,
}: {
  label: string;
  onClick?: () => void;
  last?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98, backgroundColor: "rgba(182,147,119,0.06)" }}
      transition={{ duration: 0.15, ease: EASE }}
      className={`flex h-[42px] w-full items-center justify-between text-left ${last ? "" : "border-b-[0.5px] border-line-soft"}`}
    >
      <span className="font-['Urbanist:SemiBold',sans-serif] text-[12px] leading-[18px] text-ink">{label}</span>
      <IconChevronRight />
    </motion.button>
  );
}

/* ── Allocation card with staggered stacked bar ───────────────────────── */
export type AllocSeg = { label: string; value: number; color: string };

export function AllocationCard({
  segments,
  animate = true,
}: {
  segments: AllocSeg[];
  animate?: boolean;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 100;
  return (
    <div className="w-full rounded-[16px] bg-white px-[12px] py-[2px]">
      {segments.map((s, i) => (
        <div
          key={s.label}
          className={`flex h-[42px] items-center justify-between ${i < segments.length - 1 ? "border-b-[0.5px] border-line-soft" : ""}`}
        >
          <span className="font-['Urbanist:Medium',sans-serif] text-[14px] leading-[20px] text-ink">{s.label}</span>
          <span className="font-['Urbanist:Medium',sans-serif] text-[14px] leading-[20px] text-ink">{s.value}%</span>
        </div>
      ))}
      <div className="pb-[12px] pt-[10px]">
        {/* §4.3 — bars fill with transform: scaleX(), never width. Each segment
            occupies its laid-out slot and grows from the left within it. */}
        <div className="flex h-[6px] w-full overflow-hidden rounded-full bg-alloc-track">
          {segments.map((s, i) => (
            <motion.div
              key={s.label}
              initial={animate ? { scaleX: 0 } : false}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.48, ease: "easeInOut", delay: animate ? i * 0.12 : 0 }}
              style={{ backgroundColor: s.color, width: `${(s.value / total) * 100}%`, transformOrigin: "left" }}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── User (partner) bubble ────────────────────────────────────────────── */
export function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: EASE }}
      className="flex w-full justify-end"
    >
      <div className="max-w-[280px] rounded-[20px] rounded-br-[6px] bg-bubble px-[12px] py-[10px] ring-1 ring-bubble-edge">
        <p className="font-['Urbanist:SemiBold',sans-serif] text-[14px] leading-[19px] text-ink">{text}</p>
      </div>
    </motion.div>
  );
}

/* ── Sentinel response block with sparkle label ───────────────────────── */
export function SentinelBlock({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      <div className="mb-[10px] flex items-center gap-[8px]">
        <IconSparkle />
        <span className="font-['Urbanist:Bold',sans-serif] text-[12px] leading-[16px] text-muted">Sentinel</span>
      </div>
      {children}
    </div>
  );
}

export function SentinelText({ text, weight = "Medium" }: { text: string; weight?: "Medium" | "Regular" }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="font-normal text-[14px] leading-[20px] text-ink-soft"
      style={{ fontFamily: `'Urbanist:${weight}', sans-serif` }}
    >
      {text}
    </motion.p>
  );
}

/* thinking state: shimmering sparkle label + bouncing dots */
export function SentinelThinking() {
  return (
    <div className="w-full">
      <div className="mb-[10px] flex items-center gap-[8px] sentinel-shimmer">
        <IconSparkle />
        <span className="font-['Urbanist:Bold',sans-serif] text-[12px] leading-[16px] text-muted">Sentinel</span>
      </div>
      <div className="flex items-center gap-[5px] pl-[1px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-[6px] rounded-full bg-bronze"
            style={{ animation: `dot-bounce 1200ms ease-in-out ${i * 150}ms infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Inline secondary-outline action pair (chip language) ─────────────── */
export function ActionCard({ actions }: { actions: { label: string; onClick?: () => void }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: EASE }}
      className="flex flex-wrap gap-[8px]"
    >
      {actions.map((a) => (
        <motion.button
          key={a.label}
          type="button"
          onClick={a.onClick}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: EASE }}
          className="rounded-full bg-chip px-[14px] py-[9px] ring-1 ring-bubble-edge"
        >
          <span className="font-['Urbanist:Bold',sans-serif] text-[12px] leading-[16px] text-bronze-deep">{a.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ── Composer / ask bar ───────────────────────────────────────────────── */
export function Composer({
  value,
  onChange,
  onFocus,
  onSend,
  placeholder = "Ask Sentinel about a client, a fund, or a plan",
  autoFocus = false,
  streaming = false,
  onStop,
}: {
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  onSend?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  streaming?: boolean; // §2.1 — send disabled, Stop in the send slot
  onStop?: () => void;
}) {
  const canSend = value.trim().length > 0 && !streaming;
  const [focus, setFocus] = useState(false);
  return (
    <div
      /* §7.2 (Jobber) — bronze focus ring, 150 ms; the composer now responds to tap */
      className="w-full rounded-[20px] bg-white p-[12px] shadow-[0px_16px_30px_-18px_rgba(37,31,27,0.24),0px_2px_4px_0px_rgba(37,31,27,0.05)] transition-[box-shadow,border-color] duration-150"
      style={{
        border: `1px solid ${focus ? "#b69377" : "#e1deda"}`,
        boxShadow: focus ? "0 0 0 3px rgba(182,147,119,0.24)" : undefined,
      }}
    >
      <input
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setFocus(true);
          onFocus?.();
        }}
        onBlur={() => setFocus(false)}
        onKeyDown={(e) => e.key === "Enter" && canSend && onSend?.()}
        placeholder={placeholder}
        className="w-full bg-transparent font-['Urbanist:Medium',sans-serif] text-[14px] leading-[20px] text-ink placeholder:text-muted outline-none"
      />
      <div className="mt-[12px] flex items-center justify-between pr-[2px]">
        <div className="flex size-[42px] items-center justify-center rounded-[22px] bg-white ring-1 ring-line">
          <IconAttach />
        </div>
        {streaming ? (
          <motion.button
            type="button"
            onClick={onStop}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.15, ease: EASE }}
            className="flex size-[42px] items-center justify-center rounded-full"
            style={{ background: "linear-gradient(to bottom, #3b3531 0%, #1a1614 48%, #111 100%)" }}
          >
            <span className="size-[13px] rounded-[3px] bg-white" />
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={() => canSend && onSend?.()}
            disabled={!canSend}
            whileTap={canSend ? { scale: 0.94 } : undefined}
            transition={{ duration: 0.15, ease: EASE }}
            className={`flex size-[42px] items-center justify-center rounded-full ${canSend ? "" : "opacity-40"}`}
            style={{ background: "linear-gradient(to bottom, #3b3531 0%, #1a1614 48%, #111 100%)" }}
          >
            <motion.div whileTap={{ rotate: -15 }} transition={{ duration: 0.15, ease: EASE }}>
              <IconArrow />
            </motion.div>
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ── Dark CTA in the composer-button language ─────────────────────────── */
export function DarkButton({ label, onClick, full = true }: { label: string; onClick?: () => void; full?: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: EASE }}
      className={`${full ? "w-full" : ""} flex h-[48px] items-center justify-center gap-[8px] rounded-[16px] px-[20px]`}
      style={{ background: "linear-gradient(to bottom, #3b3531 0%, #1a1614 48%, #111 100%)" }}
    >
      <span className="font-['Urbanist:SemiBold',sans-serif] text-[14px] text-white">{label}</span>
      <IconArrow />
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Journey component library (C1–C20) — every element derived from the
   tokens and primitives above. No new hex, radius, font or shadow.
   ═════════════════════════════════════════════════════════════════════ */

/* Small-caps grey eyebrow, reused for column headers, meta, dividers. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-['Urbanist:Bold',sans-serif] text-[11px] uppercase tracking-[0.08em] text-muted ${className}`}>
      {children}
    </p>
  );
}

/* ── C1 · Journey progress rail ───────────────────────────────────────── */
export function ProgressRail({ n, total }: { n: number; total: number }) {
  return (
    <div className="w-full px-[16px] pb-[6px] pt-[2px]">
      <div className="mb-[5px] flex justify-end">
        <Eyebrow>Question {n} of {total}</Eyebrow>
      </div>
      {/* §4.3 — rail fills with scaleX from the left, never width */}
      <div className="h-[2px] w-full overflow-hidden rounded-full bg-line">
        <motion.div
          initial={false}
          animate={{ scaleX: n / total }}
          transition={{ duration: 0.32, ease: EASE }}
          className="h-full w-full rounded-full"
          style={{
            background: "linear-gradient(to right, #715035 0%, #b69377 60%, #ebd4c3 100%)",
            transformOrigin: "left",
          }}
        />
      </div>
    </div>
  );
}

/* ── C2–C5 · Answer chip variants ─────────────────────────────────────── */
export type ChipVariant = "outline" | "smart" | "tertiary" | "muted" | "primary";

function ChipGlyph({ kind }: { kind: "smart" | "tertiary" | "check" | "chevron" }) {
  if (kind === "tertiary")
    return <span className="font-['Urbanist:Bold',sans-serif] text-[13px] leading-none text-bronze-deep">?</span>;
  if (kind === "smart")
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <rect x="1" y="2.5" width="11" height="8" rx="1.5" stroke="#715035" strokeWidth="1.1" />
        <path d="M3.2 5.2h2.2M3.2 7.2h4.4" stroke="#715035" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    );
  if (kind === "check")
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M2.5 6.8 5 9.3l5.5-5.6" stroke="#251f1b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 3 7.5 6l-3 3" stroke="#b69377" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AnswerChip({
  label,
  subtitle,
  variant = "outline",
  selected = false,
  onClick,
}: {
  label: string;
  subtitle?: string; // §7.3 (Lóvi) — becomes a card-with-subtitle where the option needs disambiguation
  variant?: ChipVariant;
  selected?: boolean;
  onClick?: () => void;
}) {
  // card variant — used only where the option's wording changes the meaning
  if (subtitle) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: EASE }}
        className={`flex w-full flex-col items-start gap-[3px] rounded-[16px] px-[14px] py-[11px] text-left transition-colors ${
          selected ? "bg-alloc-cash ring-1 ring-bronze" : "bg-bubble ring-1 ring-bubble-edge"
        }`}
      >
        <span className="flex items-center gap-[6px] font-['Urbanist:SemiBold',sans-serif] text-[14px] leading-[19px] text-ink">
          {label}
          {selected && <ChipGlyph kind="check" />}
        </span>
        <span className="font-['Urbanist:Regular',sans-serif] text-[13px] leading-[18px] text-muted">{subtitle}</span>
      </motion.button>
    );
  }
  const styles: Record<ChipVariant, string> = {
    outline: "bg-chip ring-1 ring-bubble-edge text-bronze-deep",
    smart: "bg-bubble ring-1 ring-bubble-edge text-bronze-deep",
    tertiary: "bg-transparent border border-dashed border-bronze/60 text-bronze-deep",
    muted: "bg-chip ring-1 ring-bubble-edge text-bronze-deep/60",
    primary: "bg-alloc-cash ring-1 ring-bubble-edge text-ink",
  };
  const cls = selected ? "bg-alloc-cash ring-1 ring-bronze text-ink" : styles[variant];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: EASE }}
      className={`inline-flex h-[36px] shrink-0 items-center gap-[6px] rounded-full px-[13px] transition-colors ${cls}`}
    >
      {/* §1.2 — a 12 pt check fades in at the leading edge on select; no chevron on choice chips */}
      {selected ? (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
          <ChipGlyph kind="check" />
        </motion.span>
      ) : (
        <>
          {variant === "smart" && <ChipGlyph kind="smart" />}
          {variant === "tertiary" && <ChipGlyph kind="tertiary" />}
        </>
      )}
      <span className="whitespace-nowrap font-['Urbanist:Bold',sans-serif] text-[12px] leading-[18px]">{label}</span>
    </motion.button>
  );
}

/* ── C6 · Chip row (staggered entrance, horizontal scroll, wraps to 2) ── */
export function ChipRow({ children }: { children: ReactNode[] }) {
  return (
    <div className="no-scrollbar flex w-full flex-wrap gap-[8px] px-[16px]">
      {children.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: EASE, delay: i * 0.06 }}
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}

/* ── C7 · Collapsed Q&A pair ──────────────────────────────────────────── */
export function QAPair({ question, answer }: { question?: string; answer: string }) {
  return (
    <div className="flex w-full flex-col gap-[6px]">
      {question ? (
        <p className="truncate font-['Urbanist:Medium',sans-serif] text-[12px] leading-[16px] text-muted">{question}</p>
      ) : null}
      <div className="flex w-full justify-end">
        <div className="max-w-[280px] rounded-[20px] rounded-br-[6px] bg-bubble px-[12px] py-[8px] ring-1 ring-bubble-edge">
          <p className="font-['Urbanist:SemiBold',sans-serif] text-[13px] leading-[18px] text-ink">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ── C9 · Section eyebrow divider ─────────────────────────────────────── */
export function EyebrowDivider({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-[10px] py-[2px]">
      <div className="h-px flex-1 bg-line" />
      <Eyebrow>{children}</Eyebrow>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}

/* ── C10 · Hero number card with the lowest-of-three meter ────────────── */
function useCountUp(target: number, ms: number, run: boolean) {
  const [v, setV] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!run) return;
    // §4.5 — reduced motion jumps count-ups to their final value
    if (reduce) return setV(target);
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, run, reduce]);
  return v;
}

export { useCountUp };

export type MeterRow = { label: string; value: number; binding?: boolean };

export function HeroNumberCard({
  title,
  meta,
  value,
  badge,
  copy,
  rows,
}: {
  title: string;
  meta: string;
  value: number;
  badge: string;
  copy: ReactNode;
  rows: MeterRow[];
}) {
  const n = useCountUp(value, 600, true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="w-full rounded-[16px] bg-white px-[16px] py-[16px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)]"
    >
      <div className="flex items-start justify-between">
        <p className="font-['Urbanist:Medium',sans-serif] text-[16px] leading-[24px] text-ink">{title}</p>
        <div className="rounded-full bg-chip px-[8px] py-[3px] ring-1 ring-line">
          <Eyebrow>{meta}</Eyebrow>
        </div>
      </div>
      <div className="mt-[8px] flex items-end gap-[12px]">
        <span
          className="leading-none text-bronze-deep"
          style={{ fontFamily: "'Darker Grotesque:Medium', sans-serif", fontSize: 64 }}
        >
          {n}
        </span>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE, delay: 0.6 }}
          className="mb-[10px] rounded-full bg-alloc-cash px-[12px] py-[4px] ring-1 ring-bubble-edge"
        >
          <span className="font-['Urbanist:Bold',sans-serif] text-[13px] text-ink">{badge}</span>
        </motion.div>
      </div>
      <p className="mt-[6px] font-['Urbanist:Regular',sans-serif] text-[14px] leading-[20px] text-ink-soft">{copy}</p>
      <div className="mt-[14px] flex flex-col gap-[12px]">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="mb-[5px] flex items-center justify-between">
              <span
                className={`text-[13px] leading-[18px] ${r.binding ? "text-ink" : "text-muted"}`}
                style={{ fontFamily: `'Urbanist:${r.binding ? "Bold" : "Medium"}', sans-serif` }}
              >
                {r.label}
              </span>
              <span
                className={`text-[14px] ${r.binding ? "text-bronze-deep" : "text-ink"}`}
                style={{ fontFamily: `'Urbanist:${r.binding ? "Bold" : "Medium"}', sans-serif` }}
              >
                {r.value}
              </span>
            </div>
            <div className="h-[6px] w-full overflow-hidden rounded-full bg-alloc-track">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: r.value / 100 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.6 + i * 0.12 }}
                className="h-full w-full rounded-full"
                style={{ backgroundColor: r.binding ? "#b69377" : "#ebd4c3", transformOrigin: "left" }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── C11 · Constraint callout (reuses the peach mandate callout) ───────── */
export function ConstraintCallout({ eyebrow, body }: { eyebrow: string; body: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: EASE }}
      className="w-full rounded-[16px] bg-bubble px-[14px] py-[12px] ring-1 ring-bubble-edge"
    >
      <Eyebrow className="text-bronze-deep">{eyebrow}</Eyebrow>
      <p className="mt-[4px] font-['Urbanist:Regular',sans-serif] text-[13px] leading-[19px] text-ink-soft">{body}</p>
    </motion.div>
  );
}

/* ── C12 · Delta pill (extends the OVER CEILING pill) ─────────────────── */
export function DeltaPill({ text, tone }: { text: string; tone: "over" | "under" | "ok" }) {
  const tones = {
    over: "bg-[#f3e2da] text-danger",
    under: "bg-chip text-bronze-deep",
    ok: "bg-[#e4ecdf] text-[#4b6141]",
  } as const;
  return (
    <span className={`rounded-full px-[8px] py-[3px] font-['Urbanist:Bold',sans-serif] text-[10px] uppercase tracking-[0.04em] ${tones[tone]}`}>
      {text}
    </span>
  );
}

/* ── C16 · Numbered move card ─────────────────────────────────────────── */
export function MoveCard({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex w-full gap-[12px] rounded-[16px] bg-white px-[14px] py-[13px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)]">
      <span className="leading-none text-bronze-deep" style={{ fontFamily: "'Darker Grotesque:Medium', sans-serif", fontSize: 24 }}>
        {n}
      </span>
      <div className="flex-1">
        <p className="font-['Urbanist:Medium',sans-serif] text-[15px] leading-[22px] text-ink">{title}</p>
        <p className="mt-[3px] font-['Urbanist:Regular',sans-serif] text-[13px] leading-[18px] text-muted">{body}</p>
      </div>
    </div>
  );
}

/* ── C15 · Concentration bar ──────────────────────────────────────────── */
export function ConcentrationBar({ fraction, label }: { fraction: number; label: string }) {
  return (
    <div className="w-full">
      <div className="flex h-[8px] w-full overflow-hidden rounded-full bg-alloc-track">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: fraction }}
          transition={{ duration: 0.5, ease: EASE }}
          className="h-full w-full rounded-full bg-bronze"
          style={{ transformOrigin: "left" }}
        />
      </div>
      <p className="mt-[6px] font-['Urbanist:Medium',sans-serif] text-[12px] text-muted">{label}</p>
    </div>
  );
}

/* ── C19 · Demo-data footer ───────────────────────────────────────────── */
export function DemoFooter() {
  return (
    <p className="w-full text-center font-['Urbanist:Regular',sans-serif] text-[11px] leading-[16px] text-muted">
      Demo data — Meera Nair is an example. No real portfolio is shown.
    </p>
  );
}

/* ── Provenance line ──────────────────────────────────────────────────────
   v4 §6 — every figure on an artifact card names where it came from. This
   replaces the per-message demo footer: the honesty moves onto the data
   itself ("As of 15 Sep · from her September statement") instead of a banner. */
export function Provenance({ text }: { text: string }) {
  return (
    <p className="font-['Urbanist:Regular',sans-serif] text-[11px] leading-[15px] text-muted">
      {text}
    </p>
  );
}

/* ── C17 · Sticky primary CTA (reuses the black pill) ─────────────────── */
export function StickyCTA({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <motion.div
      initial={{ y: 64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.32, ease: EASE, delay: 0.32 }}
      className="relative z-10 px-[16px] pb-[8px] pt-[6px]"
    >
      <DarkButton label={label} onClick={onClick} />
    </motion.div>
  );
}

/* ── C18 · Money-input composer variant (₹ prefix, Indian digits) ─────── */
export function formatINR(digits: string) {
  const clean = digits.replace(/\D/g, "");
  if (!clean) return "";
  const n = clean.slice(-3);
  const rest = clean.slice(0, -3);
  return (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," : "") + n;
}

export function MoneyComposer({ onSend }: { onSend: (value: string) => void }) {
  const [raw, setRaw] = useState("");
  const formatted = formatINR(raw);
  const canSend = raw.length > 0;
  return (
    <div className="w-full rounded-[20px] bg-white p-[12px] ring-1 ring-line shadow-[0px_16px_30px_-18px_rgba(37,31,27,0.24),0px_2px_4px_0px_rgba(37,31,27,0.05)]">
      {/* §1.2 — ₹ prefix in its own 20 pt slot, hairline between prefix and input */}
      <div className="flex items-center">
        <div className="flex w-[20px] shrink-0 justify-center">
          <span className="font-['Urbanist:SemiBold',sans-serif] text-[16px] text-bronze-deep">₹</span>
        </div>
        <div className="mx-[10px] h-[22px] w-px shrink-0 bg-line" />
        <input
          value={formatted}
          inputMode="numeric"
          onChange={(e) => setRaw(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && canSend && onSend("₹" + formatted)}
          placeholder="or type an amount"
          className="w-full bg-transparent font-['Urbanist:Medium',sans-serif] text-[16px] leading-[20px] text-ink placeholder:text-muted outline-none"
        />
      </div>
      <div className="mt-[12px] flex items-center justify-end">
        <motion.button
          type="button"
          onClick={() => canSend && onSend("₹" + formatted)}
          disabled={!canSend}
          whileTap={canSend ? { scale: 0.94 } : undefined}
          transition={{ duration: 0.15, ease: EASE }}
          className={`flex size-[42px] items-center justify-center rounded-full ${canSend ? "" : "opacity-40"}`}
          style={{ background: "linear-gradient(to bottom, #3b3531 0%, #1a1614 48%, #111 100%)" }}
        >
          <IconArrow />
        </motion.button>
      </div>
    </div>
  );
}

/* ── C20 · Explainer bottom sheet ─────────────────────────────────────── */
export function ExplainerSheet({
  open,
  title,
  body,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string[];
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={onClose}
          className="absolute inset-0 z-20 bg-ink/40"
        />
      )}
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: EASE }}
          className="absolute inset-x-0 bottom-0 z-30 rounded-t-[24px] bg-white px-[20px] pb-[28px] pt-[12px]"
        >
          <div className="mx-auto mb-[14px] h-[5px] w-[44px] rounded-full bg-line" />
          <p className="font-['Urbanist:SemiBold',sans-serif] text-[18px] leading-[24px] text-ink">{title}</p>
          <div className="mt-[10px] flex flex-col gap-[10px]">
            {body.map((p, i) => (
              <p key={i} className="font-['Urbanist:Regular',sans-serif] text-[14px] leading-[20px] text-ink-soft">{p}</p>
            ))}
          </div>
          <div className="mt-[18px]">
            <AnswerChip label="Got it" variant="primary" onClick={onClose} />
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ── V2 · Dumbbell mark (before → after / target vs actual) ───────────── */
export function Dumbbell({
  label,
  target,
  actual,
  max = 100,
  targetLabel,
  actualLabel,
}: {
  label: string;
  target: number;
  actual: number;
  max?: number;
  targetLabel?: string;
  actualLabel?: string;
}) {
  const lo = Math.min(target, actual);
  const hi = Math.max(target, actual);
  const pct = (v: number) => `${(v / max) * 100}%`;
  return (
    <div className="w-full">
      {label && <p className="mb-[8px] font-['Urbanist:SemiBold',sans-serif] text-[13px] text-ink">{label}</p>}
      <div className="relative h-[16px] w-full">
        {/* base track */}
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-data-track" />
        {/* the gap — connecting bar, one hue; draws with scaleX from the low dot.
            A wrapper owns the position so the motion transform is scaleX only. */}
        <div className="absolute top-1/2 h-[2px] -translate-y-1/2" style={{ left: pct(lo), width: pct(hi - lo) }}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="h-full w-full bg-bronze"
            style={{ transformOrigin: "left" }}
          />
        </div>
        {/* hollow dot = target */}
        <div
          className="absolute top-1/2 size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bronze bg-canvas ring-2 ring-white"
          style={{ left: pct(target) }}
        />
        {/* filled dot = actual */}
        <div
          className="absolute top-1/2 size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze ring-2 ring-white"
          style={{ left: pct(actual) }}
        />
      </div>
      <div className="mt-[5px] flex items-center justify-between">
        <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-muted">
          {actualLabel ?? `${actual}%`} now
        </span>
        <span className="font-['Urbanist:Bold',sans-serif] text-[12px] text-bronze-deep">
          → {targetLabel ?? `${target}%`}
        </span>
      </div>
    </div>
  );
}

/* ── Decisions strip (§1.4) — read-only, tappable summary of settled facts ── */
export function DecisionsStrip({ tokens }: { tokens: { label: string; onClick?: () => void }[] }) {
  return (
    <div className="no-scrollbar flex w-full items-center gap-[8px] overflow-x-auto rounded-[16px] bg-white px-[12px] py-[10px] ring-1 ring-line">
      {tokens.map((t, i) => (
        <div key={t.label} className="flex shrink-0 items-center gap-[8px]">
          {i > 0 && <div className="h-[14px] w-px bg-line" />}
          <button
            type="button"
            onClick={t.onClick}
            className="shrink-0 rounded-full bg-chip px-[10px] py-[5px] ring-1 ring-line"
          >
            <span className="whitespace-nowrap font-['Urbanist:Bold',sans-serif] text-[12px] text-bronze-deep">{t.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

/* ── Artifact-canvas header (A2) — ‹ Back to chat · title · ⋯ ──────────── */
export function CanvasHeader({ title, onBack, onMenu }: { title: string; onBack?: () => void; onMenu?: () => void }) {
  return (
    <div className="relative z-10 flex h-[44px] w-full shrink-0 items-center justify-between px-[16px]">
      <Pressable onClick={onBack} className="flex items-center gap-[4px] rounded-full bg-white px-[12px] py-[8px] ring-1 ring-line">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 3 4.5 6l3 3" stroke="#715035" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-['Urbanist:SemiBold',sans-serif] text-[12px] leading-none text-bronze-deep">Back to chat</span>
      </Pressable>
      <p className="absolute left-1/2 -translate-x-1/2 font-['Urbanist:SemiBold',sans-serif] text-[14px] text-ink">{title}</p>
      <Pressable onClick={onMenu} className="flex size-[40px] items-center justify-center rounded-full">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="4" cy="10" r="1.4" fill="#251f1b" />
          <circle cx="10" cy="10" r="1.4" fill="#251f1b" />
          <circle cx="16" cy="10" r="1.4" fill="#251f1b" />
        </svg>
      </Pressable>
    </div>
  );
}

/* ── Locked disclosure block (§3.1 / §1.4) — peach callout treatment ───── */
export function DisclosureBlock() {
  return (
    <div className="w-full rounded-[16px] bg-bubble px-[14px] py-[12px] ring-1 ring-bubble-edge">
      <div className="mb-[5px] flex items-center gap-[6px]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="2.5" y="5" width="7" height="5" rx="1" stroke="#715035" strokeWidth="1.1" />
          <path d="M4 5V4a2 2 0 0 1 4 0v1" stroke="#715035" strokeWidth="1.1" />
        </svg>
        <Eyebrow className="text-bronze-deep">Required disclosure · locked</Eyebrow>
      </div>
      <p className="font-['Urbanist:Regular',sans-serif] text-[12px] leading-[17px] text-ink-soft">
        Mutual fund investments are subject to market risk. Read all scheme-related documents carefully. Past performance is not indicative of future returns.
      </p>
    </div>
  );
}

/* ── C13 · Data table card ────────────────────────────────────────────── */
export type TableCol = { key: string; header: string; align?: "left" | "right" };
export type TableRow = Record<string, ReactNode>;

export function DataTableCard({
  title,
  meta,
  description,
  columns,
  rows,
  footer,
  filters,
  bar,
  showAll,
}: {
  title: string;
  meta?: string;
  description?: string;
  columns: TableCol[];
  rows: TableRow[];
  footer?: string;
  filters?: ReactNode;
  bar?: ReactNode;
  showAll?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="w-full rounded-[16px] bg-white px-[14px] py-[14px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)]"
    >
      <div className="flex items-start justify-between gap-[8px]">
        <p className="font-['Urbanist:Medium',sans-serif] text-[16px] leading-[22px] text-ink">{title}</p>
        {meta && (
          <div className="shrink-0 rounded-full bg-chip px-[8px] py-[3px] ring-1 ring-line">
            <Eyebrow>{meta}</Eyebrow>
          </div>
        )}
      </div>
      {description && (
        <p className="mt-[6px] font-['Urbanist:Regular',sans-serif] text-[13px] leading-[19px] text-muted">{description}</p>
      )}
      {filters && <div className="mt-[10px]">{filters}</div>}
      {bar && <div className="mt-[12px]">{bar}</div>}
      <div className="mt-[12px] flex items-center gap-[8px] border-b-[0.5px] border-line-soft pb-[6px]">
        {columns.map((c) => (
          <div key={c.key} className={`${c.align === "right" ? "text-right" : "text-left"} ${colWidth(c.key)}`}>
            <Eyebrow>{c.header}</Eyebrow>
          </div>
        ))}
      </div>
      {rows.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, ease: EASE, delay: i * 0.04 }}
          className={`flex items-center gap-[8px] py-[9px] ${i < rows.length - 1 ? "border-b-[0.5px] border-line-soft" : ""}`}
        >
          {columns.map((c) => (
            <div key={c.key} className={`${c.align === "right" ? "text-right" : "text-left"} ${colWidth(c.key)}`}>
              {r[c.key]}
            </div>
          ))}
        </motion.div>
      ))}
      {footer && <p className="mt-[10px] font-['Urbanist:Regular',sans-serif] text-[12px] leading-[17px] text-muted">{footer}</p>}
      {showAll && (
        <button type="button" className="mt-[10px] w-full rounded-[12px] bg-chip py-[9px] ring-1 ring-line">
          <span className="font-['Urbanist:Bold',sans-serif] text-[12px] text-bronze-deep">{showAll}</span>
        </button>
      )}
    </motion.div>
  );
}

function colWidth(key: string) {
  if (key === "name" || key === "what") return "flex-1 min-w-0";
  return "shrink-0";
}

/* Kind tag used inside data tables. */
export function KindTag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-chip px-[7px] py-[2px] font-['Urbanist:Medium',sans-serif] text-[11px] text-muted ring-1 ring-line">
      {children}
    </span>
  );
}

/* ── C14 · Filter chip row ────────────────────────────────────────────── */
export function FilterChip({ label, selected, onClick }: { label: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[32px] shrink-0 rounded-full px-[12px] ring-1 transition-colors ${
        selected ? "bg-alloc-cash ring-bronze" : "bg-chip ring-line"
      }`}
    >
      <span className={`font-['Urbanist:Bold',sans-serif] text-[12px] ${selected ? "text-ink" : "text-bronze-deep"}`}>{label}</span>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   v3 additions — the parse note, detour banner, progress trace, the
   three-row dock, sticky scroll and the drawn-check success.
   ═════════════════════════════════════════════════════════════════════ */

/* ── A6 · Parse note (§3.1) — 12 pt grey line under the user bubble ────── */
export function ParseNote({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="w-full pr-[2px] text-right font-['Urbanist:Regular',sans-serif] text-[12px] leading-[16px] text-muted"
    >
      {text}
    </motion.p>
  );
}

/* ── A7 · Detour banner (§3.3) — pinned below the header while paused ──── */
export function DetourBanner({ label, onResume }: { label: string; onResume: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.24, ease: EASE }}
      className="relative z-10 mx-[16px] flex h-[32px] items-center justify-between rounded-[10px] bg-chip px-[12px] ring-1 ring-line"
    >
      <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-muted">{label}</span>
      <Pressable onClick={onResume} className="rounded-full px-[6px]">
        <span className="font-['Urbanist:Bold',sans-serif] text-[12px] text-bronze-deep">Resume</span>
      </Pressable>
    </motion.div>
  );
}

/* ── Bucket-2 rejection callout (§3.2) — peach surface + the two ways out ─ */
export function RejectCallout({
  eyebrow,
  body,
  chips,
  onChip,
}: {
  eyebrow: string;
  body: string;
  chips: string[];
  onChip: (label: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[10px]">
      <ConstraintCallout eyebrow={eyebrow} body={body} />
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-[8px]">
          {chips.map((c) => (
            <AnswerChip key={c} label={c} onClick={() => onChip(c)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Step 5 · The real progress trace (§4.4 item 2, Plate 1) ───────────── */
export function ProgressTrace({
  steps,
  stepMs = 850,
  reasoning,
  onDone,
}: {
  steps: string[];
  stepMs?: number;
  reasoning?: string;
  onDone?: () => void;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [secs, setSecs] = useState(0);

  // running clock, in whole seconds, until done
  useEffect(() => {
    if (done) return;
    const iv = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [done]);

  // write the steps one at a time, naming real work
  useEffect(() => {
    let idx = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      idx += 1;
      if (idx >= steps.length) {
        setActive(steps.length);
        setDone(true);
        setCollapsed(true);
        onDone?.();
        return;
      }
      setActive(idx);
      t = setTimeout(step, stepMs);
    };
    t = setTimeout(step, stepMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Circle = ({ state }: { state: "done" | "active" | "pending" }) => {
    if (state === "done")
      return (
        <span className="flex size-[16px] items-center justify-center rounded-full bg-bronze">
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1.8 4.6 3.6 6.4 7.2 2.6" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    if (state === "active")
      return <span className="size-[16px] rounded-full bg-canvas ring-2 ring-bronze" />;
    return <span className="size-[16px] rounded-full ring-1 ring-line" />;
  };

  if (done && collapsed) {
    return (
      <SentinelBlock>
        <Pressable onClick={() => setCollapsed(false)} className="flex items-center gap-[6px]">
          <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-muted">Thought for {secs}s</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 3 7.5 6l-3 3" stroke="#605954" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Pressable>
      </SentinelBlock>
    );
  }

  return (
    <SentinelBlock>
      <div className="w-full">
        <button
          type="button"
          onClick={() => done && setCollapsed(true)}
          className="mb-[10px] flex w-full items-center justify-between"
        >
          <span className={`font-['Urbanist:Medium',sans-serif] text-[12px] ${done ? "text-muted" : "text-ink"}`}>
            {done ? `Thought for ${secs}s` : "Working"} · {secs}s
          </span>
          {done && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: "rotate(-90deg)" }}>
              <path d="M4.5 3 7.5 6l-3 3" stroke="#605954" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* step list joined by a 1 px rail */}
        <div className="relative flex flex-col gap-[12px] pl-[2px]">
          <div className="absolute bottom-[8px] left-[9px] top-[8px] w-px bg-line" />
          {steps.map((s, i) => {
            const state = i < active ? "done" : i === active && !done ? "active" : done ? "done" : "pending";
            return (
              <motion.div
                key={s}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: i > active ? 0.4 : i < active ? 0.4 : 1 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="relative z-10 flex items-center gap-[10px]"
              >
                <Circle state={state as "done" | "active" | "pending"} />
                <span className="font-['Urbanist:Medium',sans-serif] text-[13px] leading-[18px] text-ink-soft">{s}</span>
              </motion.div>
            );
          })}
        </div>

        {/* expanded reasoning sits behind a left hairline rule (DeepSeek) */}
        {done && reasoning && (
          <div className="mt-[12px] border-l border-line pl-[12px]">
            <p className="font-['Urbanist:Regular',sans-serif] text-[13px] leading-[19px] text-muted">{reasoning}</p>
          </div>
        )}
      </div>
    </SentinelBlock>
  );
}

/* ── Step 4 · Sticky scroll, gated on an is-near-bottom check (§1.2 D1) ── */
export function useStickyScroll(deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const [showButton, setShowButton] = useState(false);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    nearBottom.current = near;
    setShowButton(!near);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // only follow the thread if the advisor was already at the bottom
    if (nearBottom.current) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const scrollToBottom = () => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    nearBottom.current = true;
    setShowButton(false);
  };

  return { ref, showButton, onScroll, scrollToBottom };
}

export function ScrollToBottomButton({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
      transition={{ duration: 0.2, ease: EASE }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      className="pointer-events-none absolute bottom-[8px] left-1/2 z-20 -translate-x-1/2"
    >
      <Pressable
        onClick={onClick}
        className="flex size-[36px] items-center justify-center rounded-full bg-white ring-1 ring-line shadow-[0px_4px_12px_-4px_rgba(37,31,27,0.24)]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v9M4 8l4 4 4-4" stroke="#715035" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Pressable>
    </motion.div>
  );
}

/* ── Step 3 · The three-row dock (§2.2, Plate 3) ──────────────────────────
   chips → CTA → composer, all stacked; the CTA never replaces the composer.
   The standing disclosure sits under the composer, persistent and quiet. */
export function Dock({
  chips,
  cta,
  composer,
  disclosure = true,
}: {
  chips?: ReactNode;
  cta?: ReactNode;
  composer: ReactNode;
  disclosure?: boolean;
}) {
  return (
    <div className="relative z-10 flex flex-col gap-[8px] px-[16px] pb-[8px] pt-[6px]">
      {chips}
      {cta}
      {composer}
      {disclosure && <StandingDisclosure />}
    </div>
  );
}

/* Persistent under-composer disclosure (§7.2 Mindvalley) — visually locked. */
export function StandingDisclosure() {
  return (
    <p className="px-[8px] text-center font-['Urbanist:Regular',sans-serif] text-[11px] leading-[15px] text-data-deemph">
      {/* [PLACEHOLDER — compliance to supply] */}
      Sentinel assists an advisor and does not provide investment advice.
    </p>
  );
}

/* ── Step 7 · The drawn-check success mark (§4.4 item 6) ───────────────── */
export function DrawnCheck({ size = 22 }: { size?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="flex items-center justify-center rounded-full bg-bronze" style={{ width: size, height: size }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 12 12" fill="none">
        <motion.path
          d="M2.2 6.2 4.8 8.8 9.8 3.2"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </svg>
    </span>
  );
}

/* Placeholders keyed by context, so the composer law is enforced in one map. */
export const COMPOSER_PLACEHOLDER = {
  home: "Ask Sentinel about a client, a fund, or a plan",
  thread: "Ask Sentinel",
  answer: "or type your answer",
  amount: "or type an amount",
  canvas: "Ask about this",
  drawer: "Ask Sentinel",
  sheet: "Ask a follow-up",
} as const;

/* ── V3 · Attribution chart (§4.4) — contributions draw top-down, then the
   total counts up. One bronze hue for magnitude; direct labels for identity. */
export type Contribution = { label: string; value: number; note?: string };

export function AttributionChart({
  from,
  to,
  contributions,
  skeleton = false,
}: {
  from: number;
  to: number;
  contributions: Contribution[];
  skeleton?: boolean; // §7.1 (Wabi/MacroFactor) — card fills in, never a blank wait
}) {
  const total = useCountUp(to, 600, !skeleton);
  const max = Math.max(...contributions.map((c) => Math.abs(c.value)), 1);
  return (
    <div className="w-full">
      <div className="mb-[12px] flex items-baseline gap-[8px]">
        <span className="leading-none text-bronze-deep" style={{ fontFamily: "'Darker Grotesque:Medium', sans-serif", fontSize: 40 }}>
          {skeleton ? from : total}%
        </span>
        <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-muted">from {from}%, mostly the market</span>
      </div>
      <div className="flex flex-col gap-[12px]">
        {contributions.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: skeleton ? 0.5 : 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE, delay: skeleton ? 0 : i * 0.2 }}
          >
            <div className="mb-[5px] flex items-center justify-between">
              <span className="font-['Urbanist:SemiBold',sans-serif] text-[13px] text-ink">{c.label}</span>
              <span className="font-['Urbanist:Bold',sans-serif] text-[13px] text-bronze-deep">
                {c.value > 0 ? "+" : ""}
                {c.value.toFixed(1)}
              </span>
            </div>
            <div className="h-[6px] w-full overflow-hidden rounded-full bg-data-track">
              {skeleton ? (
                <div className="h-full w-1/3 rounded-full bg-data-track" />
              ) : (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: Math.abs(c.value) / max }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.2 + i * 0.2 }}
                  className="h-full w-full rounded-full bg-bronze"
                  style={{ transformOrigin: "left" }}
                />
              )}
            </div>
            {c.note && <p className="mt-[4px] font-['Urbanist:Regular',sans-serif] text-[12px] text-muted">{c.note}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Canvas composer (§2.2) — the composer law reaches inside every artifact.
   It answers honestly rather than clearing: recognised intents are offered
   back to the thread, everything else gets an honest "not in this build". No
   figure, fund or client situation is ever invented here. */
export function useInlineAsk(placeholder: string) {
  const [text, setText] = useState("");
  const [log, setLog] = useState<{ u: string; a: string }[]>([]);

  function send() {
    const q = text.trim();
    if (!q) return;
    // A canvas has no answer engine of its own — stay honest about that.
    const a =
      "I can't answer free questions about this artifact in this build. Use the chips above to act on it, or take it back to the thread — I won't invent a figure to fill the gap.";
    setLog((l) => [...l, { u: q, a }]);
    setText("");
  }

  const answers = log.length > 0 && (
    <div className="flex flex-col gap-[12px]">
      {log.map((m, i) => (
        <div key={i} className="flex flex-col gap-[10px]">
          <UserBubble text={m.u} />
          <SentinelBlock>
            <SentinelText text={m.a} />
          </SentinelBlock>
        </div>
      ))}
    </div>
  );

  const composer = <Composer value={text} onChange={setText} onSend={send} placeholder={placeholder} />;

  return { answers, composer };
}

/* ── Section divider used under the greeting ──────────────────────────── */
export function GreetingDivider({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center justify-center gap-[8px] px-[16px] py-[8px]">
      <div className="h-0 flex-1 border-t border-dashed border-[#d9cfc3]" />
      <p className="whitespace-nowrap text-center text-[27px] leading-none text-bronze-deep" style={{ fontFamily: "'Darker Grotesque:Medium', sans-serif" }}>
        {children}
      </p>
      <div className="h-0 flex-1 border-t border-dashed border-[#d9cfc3]" />
    </div>
  );
}
