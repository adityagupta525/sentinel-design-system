import { motion } from "motion/react";
import { useState } from "react";
import {
  AllocationCard,
  AnswerChip,
  CanvasHeader,
  ChipRow,
  DarkButton,
  Dock,
  EASE,
  HomeIndicator,
  ScreenBackdrop,
  StatusSpacer,
  useInlineAsk,
  useStickyScroll,
} from "@/lib/ui";

const ALLOC = [
  { label: "Equity", value: 71, color: "#b69377" },
  { label: "Debt", value: 24, color: "#d9bb9e" },
  { label: "Cash", value: 5, color: "#ebd4c3" },
];

const HOLDINGS = [
  { name: "HDFC Flexi Cap", weight: 34, drift: true },
  { name: "Axis Bluechip", weight: 19, drift: true },
  { name: "SBI Corporate Bond", weight: 18, drift: false },
  { name: "ICICI Balanced Adv.", weight: 14, drift: false },
  { name: "Parag Parikh Flexi", weight: 10, drift: false },
  { name: "Cash & liquid", weight: 5, drift: false },
];

export function Portfolio({
  onMenu,
  onBack,
  onProposal,
}: {
  onMenu: () => void;
  onBack: () => void;
  onProposal: () => void;
}) {
  const { answers, composer } = useInlineAsk("Ask about this");
  const { ref, onScroll } = useStickyScroll([answers]);
  return (
    <div className="relative flex h-full w-full flex-col">
      <ScreenBackdrop />
      <StatusSpacer />
      {/* §1.3 — reframed as an A2 artifact canvas: back-to-chat exit, docked composer */}
      <CanvasHeader title="Client review" onBack={onBack} onMenu={onMenu} />

      <div ref={ref} onScroll={onScroll} className="no-scrollbar relative z-10 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[16px] px-[16px] pb-[24px] pt-[12px]">
          {/* client header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="flex items-center gap-[12px]"
          >
            <div className="flex size-[44px] items-center justify-center rounded-full bg-bronze/20 ring-1 ring-bubble-edge">
              <span className="font-['Urbanist:Bold',sans-serif] text-[16px] text-bronze-deep">SN</span>
            </div>
            <div>
              <p className="font-['Urbanist:SemiBold',sans-serif] text-[18px] leading-[22px] text-ink">Sunita Nair</p>
              <p className="font-['Urbanist:Medium',sans-serif] text-[13px] text-muted">Balanced mandate · ₹4.2 Cr</p>
            </div>
          </motion.div>

          {/* allocation */}
          <div>
            <p className="mb-[8px] font-['Urbanist:Bold',sans-serif] text-[12px] uppercase tracking-[0.06em] text-muted">Allocation</p>
            <AllocationCard segments={ALLOC} />
          </div>

          {/* mandate ceiling callout */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: EASE, delay: 0.08 }}
            className="rounded-[16px] bg-bubble px-[14px] py-[12px] ring-1 ring-bubble-edge"
          >
            {/* v4 §5.5 — CONFLICT: this screen says the single-fund ceiling is
                15%, but the risk/proposal/confirm journeys all state 25%. The
                figure below and the "25%" used elsewhere cannot both be right.
                [NEEDS DECISION — mandate single-fund ceiling: 15% or 25%?] —
                needs a human; not guessing. */}
            <p className="font-['Urbanist:Bold',sans-serif] text-[13px] text-bronze-deep">Mandate ceiling breached</p>
            <p className="mt-[3px] font-['Urbanist:Regular',sans-serif] text-[13px] leading-[19px] text-ink-soft">
              Two funds sit above the single-fund ceiling
              <span className="text-danger"> [ceiling 15% or 25%? — needs confirming]</span>. Equity is 71 % against a 60 % target.
            </p>
          </motion.div>

          {/* holdings */}
          <div>
            <p className="mb-[8px] font-['Urbanist:Bold',sans-serif] text-[12px] uppercase tracking-[0.06em] text-muted">Holdings</p>
            <div className="rounded-[16px] bg-white px-[12px]">
              {HOLDINGS.map((h, i) => (
                <div
                  key={h.name}
                  className={`flex h-[52px] items-center justify-between ${i < HOLDINGS.length - 1 ? "border-b-[0.5px] border-line-soft" : ""}`}
                >
                  <div className="flex items-center gap-[8px]">
                    <span className="font-['Urbanist:SemiBold',sans-serif] text-[14px] text-ink">{h.name}</span>
                    {h.drift && (
                      <span className="rounded-full bg-[#f3e2da] px-[7px] py-[2px] font-['Urbanist:Bold',sans-serif] text-[10px] uppercase tracking-[0.04em] text-danger">
                        Over ceiling
                      </span>
                    )}
                  </div>
                  <span className="font-['Urbanist:Medium',sans-serif] text-[14px] text-ink">{h.weight}%</span>
                </div>
              ))}
            </div>
          </div>

          <DarkButton label="Rebalance to mandate" onClick={onProposal} />

          {answers && <div className="mt-[4px]">{answers}</div>}
        </div>
      </div>

      {/* Step 3 — three-row dock: contextual chips, then the answering composer */}
      <Dock
        chips={
          <ChipRow>
            <AnswerChip label="Fix it" variant="primary" onClick={onProposal} />
            <AnswerChip label="Show the 5 we skipped" />
            <AnswerChip label="Why is 12% bad?" variant="tertiary" />
          </ChipRow>
        }
        composer={composer}
      />
      <HomeIndicator />
    </div>
  );
}
