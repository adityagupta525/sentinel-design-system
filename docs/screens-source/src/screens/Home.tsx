import { motion } from "motion/react";
import { useState } from "react";
import { Keyboard } from "@/lib/Keyboard";
import {
  Chip,
  Composer,
  EASE,
  Eyebrow,
  GreetingDivider,
  HomeIndicator,
  ScreenBackdrop,
  StatusSpacer,
  SuggestionRow,
  TopBar,
} from "@/lib/ui";
import { JUMP_ROWS } from "@/journeys";
import type { EntryTarget } from "@/journeys";

const SUGGESTIONS = [
  "Show me Diwali offer from HDFC AMC",
  "Build a proposal for Mr. Amit Aggrawal",
  "Why did Sharma's portfolio drift this quarter?",
];

const CHIPS = ["Review a portfolio", "Proposal", "Fund explorer"];

export function Home({
  onMenu,
  onSubmit,
  onChip,
  onEntry,
}: {
  onMenu: () => void;
  onSubmit: (text: string) => void;
  onChip: (label: string) => void;
  onEntry: (target: EntryTarget, seed: string) => void;
}) {
  const [value, setValue] = useState("");
  const [keyboard, setKeyboard] = useState(false);

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.32, ease: EASE, delay: 0.06 * i },
  });

  return (
    <div className="relative flex h-full w-full flex-col">
      <ScreenBackdrop />
      <StatusSpacer />
      <TopBar onMenu={onMenu} onNew={() => setValue("")} />

      {/* greeting */}
      <motion.div {...stagger(0)} className="relative z-10 w-full pt-[4px]">
        <GreetingDivider>Good afternoon, Ashish</GreetingDivider>
      </motion.div>

      {/* suggestion card */}
      <div className="relative z-10 px-[16px] pt-[24px]">
        <motion.div {...stagger(1)} className="w-full rounded-[16px] bg-white px-[12px] py-[0px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.04)]">
          {SUGGESTIONS.map((s, i) => (
            <SuggestionRow key={s} label={s} last={i === SUGGESTIONS.length - 1} onClick={() => onSubmit(s)} />
          ))}
        </motion.div>
      </div>

      {/* v4 Part 2.2 — "Jump back in": doors to the four built journeys, quieter
          than the three capability rows above and additive to them */}
      <div className="relative z-10 px-[16px] pt-[20px]">
        <div className="mb-[8px] px-[4px]">
          <Eyebrow>Jump back in</Eyebrow>
        </div>
        <motion.div {...stagger(2)} className="w-full rounded-[16px] bg-white px-[12px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.04)]">
          {JUMP_ROWS.map((r, i) => (
            <button
              key={r.label}
              type="button"
              onClick={() => onEntry(r.target, r.target.kind === "journey" ? r.target.seed : r.label)}
              className={`flex h-[46px] w-full items-center justify-between text-left ${i < JUMP_ROWS.length - 1 ? "border-b-[0.5px] border-line-soft" : ""}`}
            >
              <span className="font-['Urbanist:SemiBold',sans-serif] text-[13px] leading-[18px] text-ink">{r.label}</span>
              <span className="flex items-center gap-[8px]">
                <span className="font-['Urbanist:Medium',sans-serif] text-[11.5px] leading-[16px] text-muted">{r.meta}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 3 7.5 6l-3 3" stroke="#b69377" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          ))}
        </motion.div>
      </div>

      <div className="flex-1" />

      {/* quick-action chips */}
      <div className="relative z-10 flex flex-wrap items-start justify-center gap-x-[8px] gap-y-[13px] px-[16px] pb-[12px]">
        {CHIPS.map((c, i) => (
          <motion.div key={c} {...stagger(2 + i)}>
            <Chip label={c} onClick={() => onChip(c)} labelStyle={c === "Review a portfolio" ? { lineHeight: "22px" } : undefined} />
          </motion.div>
        ))}
      </div>

      {/* composer pinned above keyboard */}
      <motion.div {...stagger(5)} className="relative z-10 px-[16px] pb-[12px]">
        <Composer
          value={value}
          onChange={setValue}
          onFocus={() => setKeyboard(true)}
          onSend={() => value.trim() && onSubmit(value.trim())}
          autoFocus={false}
        />
      </motion.div>

      {/* keyboard rises/dismisses */}
      <motion.div
        initial={false}
        animate={{ height: keyboard ? "auto" : 0, opacity: keyboard ? 1 : 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="relative z-10 w-full overflow-hidden"
      >
        <Keyboard />
      </motion.div>

      {!keyboard && <HomeIndicator />}
    </div>
  );
}
