import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  AnswerChip,
  CanvasHeader,
  Composer,
  COMPOSER_PLACEHOLDER,
  Dock,
  EASE,
  Eyebrow,
  HomeIndicator,
  Pressable,
  Provenance,
  ScreenBackdrop,
  SentinelText,
  StatusSpacer,
} from "@/lib/ui";

/* ══════════════════════════════════════════════════════════════════════
   Fund Explorer (v4 §7 / v2 §3.4)

   A conversational canvas, not a data table. The query arrives as removable
   pills; the advisor drops what doesn't fit and can add "On your shelf" to
   restrict to funds already approved. Funds collect into a shortlist, which
   opens a compare canvas. Any single fund opens a one-pager, and a reverse
   lookup answers "which of my clients hold this?".

   HARD RULE — never fabricate a fund figure. Every performance number, TER and
   AUM here is UNSOURCED, so it is shown LOCKED rather than invented:
   [PLACEHOLDER — fund data to supply]. Nothing on this screen states a return.
   ═════════════════════════════════════════════════════════════════════ */

type Fund = {
  name: string;
  amc: string;
  cat: string; // display category
  bucket: "Equity" | "Debt" | "Hybrid" | "Index"; // filter bucket
  onShelf: boolean; // passes the advisor's compliance shelf
  heldBy: string[]; // reverse lookup — example relationships (demo data)
};

/* Fund names and AMCs only. No performance, TER or AUM — those are locked. */
const FUNDS: Fund[] = [
  { name: "Parag Parikh Flexi Cap", amc: "PPFAS", cat: "Flexi cap", bucket: "Equity", onShelf: true, heldBy: ["Meera Nair"] },
  { name: "HDFC Flexi Cap", amc: "HDFC", cat: "Flexi cap", bucket: "Equity", onShelf: true, heldBy: ["Meera Nair", "Sunita Nair"] },
  { name: "Quant Small Cap", amc: "Quant", cat: "Small cap", bucket: "Equity", onShelf: false, heldBy: ["R. Sharma"] },
  { name: "ICICI Corporate Bond", amc: "ICICI", cat: "Corporate bond", bucket: "Debt", onShelf: true, heldBy: ["R. Sharma"] },
  { name: "SBI Corporate Bond", amc: "SBI", cat: "Corporate bond", bucket: "Debt", onShelf: true, heldBy: [] },
  { name: "ICICI Balanced Advantage", amc: "ICICI", cat: "Balanced advantage", bucket: "Hybrid", onShelf: true, heldBy: ["Sunita Nair"] },
  { name: "UTI Nifty 50 Index", amc: "UTI", cat: "Index", bucket: "Index", onShelf: true, heldBy: [] },
];

/* The parsed query, as removable pills. Each carries the bucket it filters on
   (or null for a non-filtering descriptor). [draft] seed query. */
type Pill = { label: string; bucket: Fund["bucket"] | null };
const SEED_PILLS: Pill[] = [
  { label: "Equity", bucket: "Equity" },
  { label: "Flexi cap", bucket: null },
  { label: "Direct plan", bucket: null },
];

export function FundExplorer({ onMenu, onBack }: { onMenu: () => void; onBack: () => void }) {
  const [pills, setPills] = useState<Pill[]>(SEED_PILLS);
  const [shelf, setShelf] = useState(false);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [ask, setAsk] = useState("");
  const [onePager, setOnePager] = useState<Fund | null>(null);
  const [compare, setCompare] = useState(false);

  const bucketFilters = pills.map((p) => p.bucket).filter((b): b is Fund["bucket"] => b != null);

  const results = useMemo(
    () =>
      FUNDS.filter(
        (f) =>
          (bucketFilters.length === 0 || bucketFilters.includes(f.bucket)) &&
          (!shelf || f.onShelf),
      ),
    [pills, shelf],
  );

  function toggleShort(name: string) {
    setShortlist((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));
  }

  const shortFunds = FUNDS.filter((f) => shortlist.includes(f.name));

  return (
    <div className="relative flex h-full w-full flex-col">
      <ScreenBackdrop />
      <StatusSpacer />
      <CanvasHeader title="Fund explorer" onBack={onBack} onMenu={onMenu} />

      {/* A4 — the query as removable pills, plus the self-added shelf filter */}
      <div className="relative z-10 px-[16px] pt-[8px]">
        <Eyebrow className="mb-[8px]">Filtering on</Eyebrow>
        <div className="flex flex-wrap gap-[8px]">
          {pills.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setPills((ps) => ps.filter((x) => x.label !== p.label))}
              className="flex items-center gap-[6px] rounded-full bg-chip px-[12px] py-[6px] ring-1 ring-line"
            >
              <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-ink">{p.label}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2.5 2.5 7.5 7.5M7.5 2.5 2.5 7.5" stroke="#8a7a6a" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShelf((s) => !s)}
            className={`flex items-center gap-[6px] rounded-full px-[12px] py-[6px] ring-1 ${shelf ? "bg-bubble ring-bubble-edge" : "bg-white ring-line"}`}
          >
            <span className={`font-['Urbanist:Medium',sans-serif] text-[12px] ${shelf ? "text-bronze-deep" : "text-muted"}`}>
              {shelf ? "On your shelf ✓" : "+ On your shelf"}
            </span>
          </button>
        </div>
      </div>

      <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto pt-[16px]">
        <div className="flex flex-col gap-[10px] px-[16px] pb-[24px]">
          <p className="px-[2px] font-['Urbanist:Medium',sans-serif] text-[12px] text-muted">
            {results.length} {results.length === 1 ? "fund" : "funds"} match
          </p>

          {results.length === 0 ? (
            <EmptyState />
          ) : (
            results.map((f, i) => {
              const picked = shortlist.includes(f.name);
              return (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE, delay: i * 0.04 }}
                  className="rounded-[16px] bg-white px-[14px] py-[13px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.04)]"
                >
                  <div className="flex items-start justify-between">
                    <Pressable onClick={() => setOnePager(f)} className="text-left">
                      <p className="font-['Urbanist:SemiBold',sans-serif] text-[14px] text-ink">{f.name}</p>
                      <p className="mt-[2px] font-['Urbanist:Medium',sans-serif] text-[12px] text-muted">
                        {f.amc} · {f.cat}
                        {f.onShelf && <span className="text-bronze-deep"> · on your shelf</span>}
                      </p>
                    </Pressable>
                    <Pressable
                      onClick={() => toggleShort(f.name)}
                      className={`shrink-0 rounded-full px-[12px] py-[7px] ring-1 ${picked ? "bg-ink ring-ink" : "bg-chip ring-bubble-edge"}`}
                    >
                      <span className={`font-['Urbanist:Bold',sans-serif] text-[12px] ${picked ? "text-white" : "text-bronze-deep"}`}>
                        {picked ? "Shortlisted ✓" : "Shortlist"}
                      </span>
                    </Pressable>
                  </div>
                  {/* returns/TER are unsourced — shown locked, never invented */}
                  <div className="mt-[12px]">
                    <LockedFigure />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* shortlist artifact bar — appears once funds are picked, opens compare */}
      <AnimatePresence>
        {shortFunds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.24, ease: EASE }}
            className="relative z-10 px-[16px] pb-[6px]"
          >
            <div className="flex items-center justify-between rounded-[16px] bg-white px-[14px] py-[11px] ring-1 ring-line shadow-[0px_2px_8px_-2px_rgba(37,31,27,0.12)]">
              <span className="font-['Urbanist:SemiBold',sans-serif] text-[13px] text-ink">
                Shortlist · {shortFunds.length}
              </span>
              <Pressable
                onClick={() => shortFunds.length >= 2 && setCompare(true)}
                className={`rounded-full px-[14px] py-[7px] ${shortFunds.length >= 2 ? "bg-ink" : "bg-chip ring-1 ring-line"}`}
              >
                <span className={`font-['Urbanist:Bold',sans-serif] text-[12px] ${shortFunds.length >= 2 ? "text-white" : "text-muted"}`}>
                  {shortFunds.length >= 2 ? `Compare ${shortFunds.length}` : "Pick 2 to compare"}
                </span>
              </Pressable>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dock composer={<Composer value={ask} onChange={setAsk} onSend={() => setAsk("")} placeholder={COMPOSER_PLACEHOLDER.canvas} />} />
      <HomeIndicator />

      {/* fund one-pager + reverse lookup */}
      <AnimatePresence>
        {onePager && <OnePager fund={onePager} onClose={() => setOnePager(null)} />}
      </AnimatePresence>

      {/* compare canvas */}
      <AnimatePresence>
        {compare && <CompareCanvas funds={shortFunds} onBack={() => setCompare(false)} onMenu={onMenu} />}
      </AnimatePresence>
    </div>
  );
}

/* A locked figure — the honest stand-in for any fund number we cannot source. */
function LockedFigure() {
  return (
    <div className="flex items-center gap-[8px] rounded-[12px] bg-chip px-[12px] py-[9px] ring-1 ring-line">
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <rect x="2.5" y="6" width="9" height="6" rx="1.4" stroke="#8a7a6a" strokeWidth="1.2" />
        <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#8a7a6a" strokeWidth="1.2" />
      </svg>
      <span className="font-['Urbanist:Medium',sans-serif] text-[11.5px] leading-[15px] text-muted">
        Returns &amp; TER — data to supply
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-[6px] pt-[56px] text-center">
      <p className="font-['Urbanist:SemiBold',sans-serif] text-[15px] text-ink">Nothing matches every filter.</p>
      <p className="max-w-[250px] font-['Urbanist:Regular',sans-serif] text-[13px] leading-[19px] text-muted">
        Drop a pill above to widen the search, or turn off “On your shelf”.
      </p>
    </div>
  );
}

/* Fund one-pager — a bottom sheet. Reverse lookup lives here: it answers which
   of the advisor's clients already hold the fund. Figures stay locked. */
function OnePager({ fund, onClose }: { fund: Fund; onClose: () => void }) {
  const [reverse, setReverse] = useState(false);
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE }} onClick={onClose} className="absolute inset-0 z-30 bg-ink/40" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.28, ease: EASE }}
        className="absolute inset-x-0 bottom-0 z-40 flex max-h-[86%] flex-col rounded-t-[24px] bg-canvas"
      >
        <div className="mx-auto mb-[6px] mt-[10px] h-[5px] w-[44px] shrink-0 rounded-full bg-line" />
        <div className="no-scrollbar flex-1 overflow-y-auto px-[20px] pb-[20px]">
          <p className="font-['Urbanist:SemiBold',sans-serif] text-[18px] text-ink">{fund.name}</p>
          <p className="mt-[2px] font-['Urbanist:Medium',sans-serif] text-[13px] text-muted">
            {fund.amc} · {fund.cat} · {fund.onShelf ? "on your shelf" : "not on your shelf"}
          </p>

          {/* the numbers the one-pager would carry — all locked */}
          <div className="mt-[14px] rounded-[16px] bg-white px-[14px] py-[13px]">
            <Eyebrow className="mb-[10px]">Key figures</Eyebrow>
            <div className="flex flex-col gap-[8px]">
              {["1Y / 3Y / 5Y return", "Expense ratio (TER)", "AUM", "Riskometer"].map((k) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">{k}</span>
                  <span className="rounded-full bg-chip px-[10px] py-[4px] font-['Urbanist:Medium',sans-serif] text-[11px] text-muted ring-1 ring-line">
                    data to supply
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-[10px] font-['Urbanist:Regular',sans-serif] text-[11px] leading-[15px] text-muted">
              [PLACEHOLDER — fund data to supply] · I won't show a return I can't source.
            </p>
          </div>

          {/* reverse lookup */}
          <div className="mt-[14px]">
            {!reverse ? (
              <AnswerChip label="Which of my clients hold this?" variant="primary" onClick={() => setReverse(true)} />
            ) : (
              <div className="rounded-[16px] bg-white px-[14px] py-[13px]">
                <Eyebrow className="mb-[8px]">Held by</Eyebrow>
                {fund.heldBy.length === 0 ? (
                  <SentinelText text="None of your clients hold this one." />
                ) : (
                  <div className="flex flex-col gap-[6px]">
                    {fund.heldBy.map((c) => (
                      <div key={c} className="flex items-center justify-between border-b-[0.5px] border-line-soft py-[6px] last:border-0">
                        <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">{c}</span>
                        <span className="rounded-full bg-chip px-[10px] py-[3px] font-['Urbanist:Medium',sans-serif] text-[11px] text-muted ring-1 ring-line">
                          weight — data to supply
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-[10px]">
                  <Provenance text="As of 15 Sep · from each client's latest statement" />
                </div>
              </div>
            )}
          </div>
        </div>
        <HomeIndicator />
      </motion.div>
    </>
  );
}

/* Compare canvas — shortlisted funds side by side. Rows are the figures a
   comparison needs; every cell is locked until real data is supplied. */
function CompareCanvas({ funds, onBack, onMenu }: { funds: Fund[]; onBack: () => void; onMenu: () => void }) {
  const [ask, setAsk] = useState("");
  const ROWS = ["Category", "1Y return", "3Y return", "Expense ratio", "On your shelf"];
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.24, ease: EASE }} className="absolute inset-0 z-20 bg-ink/20" onClick={onBack} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.38, ease: EASE }}
        className="absolute inset-0 z-30 flex flex-col"
        style={{ transformOrigin: "center 40%" }}
      >
        <ScreenBackdrop />
        <StatusSpacer />
        <CanvasHeader title={`Compare · ${funds.length}`} onBack={onBack} onMenu={onMenu} />
        <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto px-[16px] pb-[16px] pt-[12px]">
          <div className="overflow-hidden rounded-[16px] bg-white">
            {/* fund name header row */}
            <div className="flex border-b-[0.5px] border-line-soft">
              <div className="w-[104px] shrink-0 px-[12px] py-[11px]" />
              {funds.map((f) => (
                <div key={f.name} className="flex-1 border-l-[0.5px] border-line-soft px-[10px] py-[11px]">
                  <p className="font-['Urbanist:SemiBold',sans-serif] text-[12px] leading-[15px] text-ink">{f.name}</p>
                </div>
              ))}
            </div>
            {ROWS.map((r, ri) => (
              <div key={r} className={`flex ${ri < ROWS.length - 1 ? "border-b-[0.5px] border-line-soft" : ""}`}>
                <div className="w-[104px] shrink-0 px-[12px] py-[12px]">
                  <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-muted">{r}</span>
                </div>
                {funds.map((f) => (
                  <div key={f.name} className="flex-1 border-l-[0.5px] border-line-soft px-[10px] py-[12px]">
                    {r === "Category" ? (
                      <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-ink">{f.cat}</span>
                    ) : r === "On your shelf" ? (
                      <span className="font-['Urbanist:SemiBold',sans-serif] text-[12px] text-ink">{f.onShelf ? "Yes" : "No"}</span>
                    ) : (
                      <span className="font-['Urbanist:Medium',sans-serif] text-[11px] text-muted">data to supply</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-[12px]">
            <Provenance text="[PLACEHOLDER — fund data to supply] · returns and TER are locked until sourced" />
          </div>
        </div>
        <Dock composer={<Composer value={ask} onChange={setAsk} onSend={() => setAsk("")} placeholder={COMPOSER_PLACEHOLDER.canvas} />} />
        <HomeIndicator />
      </motion.div>
    </>
  );
}
