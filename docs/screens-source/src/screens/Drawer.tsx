import { AnimatePresence, motion } from "motion/react";
import { COMPOSER_PLACEHOLDER, EASE, Pressable, useInlineAsk } from "@/lib/ui";
import { IconChevronRight, IconPlus, IconSparkle } from "@/lib/icons";
import { JUMP_ROWS } from "@/journeys";
import type { EntryTarget } from "@/journeys";

const HISTORY = [
  "R. Sharma — portfolio drift",
  "Mr. Amit Aggrawal — proposal draft",
  "HDFC Diwali offer",
  "Meera Nair — Q3 review",
];

/* §5.3 roster — four distinct clients, none interchangeable */
const CLIENTS = ["Meera Nair", "Mr. Amit Aggrawal", "Sunita Nair", "R. Sharma"];

export function Drawer({
  open,
  onClose,
  onNew,
  onPortfolio,
  onEntry,
}: {
  open: boolean;
  onClose: () => void;
  onNew: () => void;
  onPortfolio: () => void;
  onEntry: (target: EntryTarget, seed: string) => void;
}) {
  const { answers, composer } = useInlineAsk(COMPOSER_PLACEHOLDER.drawer);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={onClose}
            className="absolute inset-0 z-30 bg-black/25"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.32, ease: EASE }}
            className="absolute inset-y-0 left-0 z-40 flex w-[300px] flex-col bg-canvas paper-texture shadow-[24px_0px_60px_-24px_rgba(37,31,27,0.4)]"
          >
            <div className="flex items-center justify-between px-[20px] pb-[8px] pt-[52px]">
              <div className="flex items-center gap-[8px]">
                <IconSparkle />
                <span className="font-['Urbanist:Bold',sans-serif] text-[16px] text-ink">Sentinel</span>
              </div>
              <Pressable onClick={onNew} className="flex size-[36px] items-center justify-center rounded-full bg-white ring-1 ring-line">
                <IconPlus />
              </Pressable>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-[16px] pt-[8px]">
              {/* v4 §2.3 — SAVED WORK: the drawer's doors to the four built
                  journeys, mirroring Home's "Jump back in" so every journey is
                  reachable in two taps from the menu as well. */}
              <p className="px-[4px] pb-[6px] pt-[8px] font-['Urbanist:Bold',sans-serif] text-[11px] uppercase tracking-[0.06em] text-muted">Saved work</p>
              <div className="rounded-[16px] bg-white px-[12px]">
                {JUMP_ROWS.map((r, i) => (
                  <Pressable
                    key={r.label}
                    onClick={() => onEntry(r.target, r.target.kind === "journey" ? r.target.seed : r.label)}
                    className={`flex h-[46px] w-full items-center justify-between text-left ${i < JUMP_ROWS.length - 1 ? "border-b-[0.5px] border-line-soft" : ""}`}
                  >
                    <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">{r.label}</span>
                    <span className="flex items-center gap-[8px]">
                      <span className="font-['Urbanist:Medium',sans-serif] text-[11.5px] text-muted">{r.meta}</span>
                      <IconChevronRight />
                    </span>
                  </Pressable>
                ))}
              </div>

              <p className="px-[4px] pb-[6px] pt-[18px] font-['Urbanist:Bold',sans-serif] text-[11px] uppercase tracking-[0.06em] text-muted">Recent</p>
              <div className="rounded-[16px] bg-white px-[12px]">
                {HISTORY.map((h, i) => (
                  <Pressable
                    key={h}
                    onClick={onClose}
                    className={`flex h-[46px] w-full items-center justify-between text-left ${i < HISTORY.length - 1 ? "border-b-[0.5px] border-line-soft" : ""}`}
                  >
                    <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">{h}</span>
                    <IconChevronRight />
                  </Pressable>
                ))}
              </div>

              <p className="px-[4px] pb-[6px] pt-[18px] font-['Urbanist:Bold',sans-serif] text-[11px] uppercase tracking-[0.06em] text-muted">Clients</p>
              <div className="rounded-[16px] bg-white px-[12px]">
                {CLIENTS.map((c, i) => (
                  <Pressable
                    key={c}
                    onClick={onPortfolio}
                    className={`flex h-[46px] w-full items-center gap-[10px] text-left ${i < CLIENTS.length - 1 ? "border-b-[0.5px] border-line-soft" : ""}`}
                  >
                    <div className="flex size-[28px] items-center justify-center rounded-full bg-bronze/20 ring-1 ring-bubble-edge">
                      <span className="font-['Urbanist:Bold',sans-serif] text-[11px] text-bronze-deep">
                        {c.split(" ").map((w) => w[0]).join("")}
                      </span>
                    </div>
                    <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">{c}</span>
                  </Pressable>
                ))}
              </div>

              {answers && <div className="pt-[16px]">{answers}</div>}

              {/* v4 §5.1 — the demo is honest about itself, once, in the menu */}
              <p className="px-[4px] pb-[4px] pt-[18px] font-['Urbanist:Regular',sans-serif] text-[11px] leading-[15px] text-muted">
                Demo data · no real client portfolios are shown
              </p>
            </div>

            {/* Step 6 — the drawer stays an overlay but gains a composer (nine contexts) */}
            <div className="px-[16px] pb-[20px] pt-[8px]">{composer}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
