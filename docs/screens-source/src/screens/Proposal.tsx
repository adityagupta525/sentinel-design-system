import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  AnswerChip,
  CanvasHeader,
  ChipRow,
  DataTableCard,
  DecisionsStrip,
  DisclosureBlock,
  Dock,
  EASE,
  Eyebrow,
  ExplainerSheet,
  HomeIndicator,
  KindTag,
  ScreenBackdrop,
  StatusSpacer,
  useInlineAsk,
  useStickyScroll,
} from "@/lib/ui";
import { PROPOSAL_ROWS } from "@/journeys";
import type { Sheet } from "@/journeys";

/* Journey B (Proposal) client is Mr. Amit Aggrawal — one client per journey.
   The earlier build mixed in Sunita and a rebalance's fund switches; both are
   removed. Figures come from the approved PROPOSAL_ROWS, never invented here. */
export function Proposal({ onMenu, onBack }: { onMenu: () => void; onBack: () => void }) {
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const { answers, composer } = useInlineAsk("Ask about this");
  const { ref, onScroll } = useStickyScroll([answers]);

  return (
    <div className="relative flex h-full w-full flex-col">
      <ScreenBackdrop />
      <StatusSpacer />
      <CanvasHeader title="Proposal" onBack={onBack} onMenu={onMenu} />

      <div ref={ref} onScroll={onScroll} className="no-scrollbar relative z-10 flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
          className="flex flex-col gap-[16px] px-[16px] pb-[24px] pt-[12px]"
        >
          {/* §1.4 — Decisions strip replaces the wizard stepper; the settled facts of this proposal */}
          <DecisionsStrip
            tokens={[{ label: "₹25 L" }, { label: "6 funds" }, { label: "Moderate" }, { label: "Over 3 months" }]}
          />

          <div className="rounded-[16px] bg-white px-[14px] py-[14px]">
            {/* [draft] copy */}
            <p className="font-['Urbanist:SemiBold',sans-serif] text-[16px] text-ink">Proposal — Mr. Amit Aggrawal</p>
            <p className="mt-[2px] font-['Urbanist:Medium',sans-serif] text-[13px] text-muted">
              Moderate mandate · ₹25 lakh · 6 funds · 55 equity / 45 debt &amp; liquid
            </p>
          </div>

          <div>
            <Eyebrow className="mb-[8px]">Where the money goes</Eyebrow>
            <DataTableCard
              title="Where ₹25 lakh would go"
              meta="6 funds"
              description="Chosen from 312 funds that pass your compliance shelf. Six came through — no fund crosses 25%."
              columns={[
                { key: "name", header: "Fund" },
                { key: "share", header: "Share", align: "right" },
                { key: "amount", header: "Amount", align: "right" },
              ]}
              rows={PROPOSAL_ROWS.map((r) => ({
                name: (
                  <div className="min-w-0">
                    <p className="truncate font-['Urbanist:SemiBold',sans-serif] text-[13px] text-ink">{r.fund}</p>
                    <div className="mt-[3px]"><KindTag>{r.kind}</KindTag></div>
                  </div>
                ),
                share: <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">{r.share}</span>,
                amount: <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">{r.amount}</span>,
              }))}
              footer="Put it in over three months rather than in one go"
            />
          </div>

          {/* §1.4 — an advisor cannot send without seeing the disclosure */}
          <DisclosureBlock />

          {answers}
        </motion.div>
      </div>

      {/* Step 3 — contextual chips + docked composer; the composer is present here too */}
      <Dock
        chips={
          <ChipRow>
            <AnswerChip
              label="Which 312 did you look at?"
              variant="tertiary"
              onClick={() =>
                setSheet({
                  title: "Which 312 did you look at?",
                  body: [
                    "The 312 are every fund that passes your compliance shelf — the mandate's allowed categories, expense limits and single-fund ceilings.",
                    "Six came through as the smallest set that covers large, mid, small, debt and liquid without any fund crossing 25%.",
                  ],
                })
              }
            />
            <AnswerChip label="Send to Mr. Aggrawal on WhatsApp" variant="outline" />
          </ChipRow>
        }
        composer={composer}
      />

      <HomeIndicator />

      <AnimatePresence>
        {sheet && <ExplainerSheet open title={sheet.title} body={sheet.body} onClose={() => setSheet(null)} />}
      </AnimatePresence>
    </div>
  );
}
