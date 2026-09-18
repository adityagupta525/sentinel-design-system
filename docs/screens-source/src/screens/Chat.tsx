import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  AllocationCard,
  AnswerChip,
  AttributionChart,
  CanvasHeader,
  Composer,
  COMPOSER_PLACEHOLDER,
  DarkButton,
  DrawnCheck,
  Dock,
  EASE,
  Eyebrow,
  ExplainerSheet,
  HomeIndicator,
  MoveCard,
  Pressable,
  ProgressTrace,
  Provenance,
  ScreenBackdrop,
  ScrollToBottomButton,
  SentinelBlock,
  SentinelText,
  StatusSpacer,
  TopBar,
  UserBubble,
  useStickyScroll,
} from "@/lib/ui";
import type { Sheet } from "@/journeys";
import { JOURNEY } from "@/journeys";
import { route } from "@/lib/router";
import type { JourneyId } from "@/lib/router";

/* Sharma's book, for the drift allocation card. [draft] demo data — example client. */
const SHARMA_ALLOC = [
  { label: "Equity", value: 71, color: "#b69377" },
  { label: "Debt", value: 24, color: "#d9bb9e" },
  { label: "Cash", value: 5, color: "#ebd4c3" },
];

/* [draft] Attribution of the 62% → 71% drift. Illustrative demo figures —
   the headline (62→71, small-cap rally) is from the pattern plate. */
const DRIFT_CONTRIB = [
  { label: "Small-cap rally", value: 6.1, note: "the market, not a decision of yours" },
  { label: "His July top-up", value: 2.0, note: "went into Quant Small Cap" },
  { label: "Funds crept up-cap", value: 0.9, note: "managers drifted toward large caps" },
];

type Phase = "loading" | "attribution" | "rebalance" | "done" | "static";

/* v4 §5 — honest capability sheet, used by "Something else" / "What can I ask".
   It lists only what is actually built, so it never over-promises. */
const CAPABILITY_SHEET: Sheet = {
  title: "What I can do here",
  body: [
    "Profile a client's risk over twelve questions — say “Meera's risk profile”.",
    "Build a proposal from an amount and a mandate — “Build a proposal for Mr. Amit Aggrawal”.",
    "Show what a client holds — “What does Meera hold?”.",
    "Explain and fix a drift — “Why did Sharma's portfolio drift?” then rebalance.",
    "Search funds by cap, plan and expense ratio — “Find a large-cap direct fund”.",
    "Anything outside these I'll say I can't do rather than guess.",
  ],
};

/* v4 §5 — an honest dead end. The two moves are the whole recommendation; the
   "five skipped" were never itemised in this build, and inventing them would be
   fabrication. So this states that plainly rather than listing made-up trades. */
const SKIPPED_SHEET: Sheet = {
  title: "The five I skipped",
  body: [
    "I recommended the two moves that do the most with the least cost and tax.",
    "The other candidate trades aren't itemised in this build — I won't list moves I can't cost, so there's nothing real to show here yet.",
  ],
};

/* v4 §5 — "Tell Sharma now" opens the drafted note for review before sending.
   Copy only, no figures invented beyond the two moves already on screen. */
const TELL_SHARMA_SHEET: Sheet = {
  title: "Note to R. Sharma",
  body: [
    "Before it sends: this goes to Sharma under your ARN. Review the wording, then send from your own client channel — this build drafts it, it doesn't send.",
    "“Hi Sharma — I've rebalanced your portfolio back to the mix we agreed. Two switches, cost ₹11,200, and your monthly SIP now goes to debt so the drift doesn't return. Happy to walk you through it.”",
  ],
};

type Msg =
  | { k: "user"; text: string }
  | { k: "trace" }
  | { k: "attribution" }
  | { k: "rebalance" }
  | { k: "success" }
  | { k: "scope"; text: string }
  | { k: "unknown" }
  | { k: "action"; preview: string }
  // v4 §5 — the Stop button aborted a running trace; the partial is kept and a
  // Continue affordance is offered.
  | { k: "aborted" }
  // v4 §3 — a journey door reached through the thread: Sentinel replies, then
  // offers a card that opens the built journey (never a silent jump).
  | { k: "journeycard"; journey: JourneyId; seed: string }
  // v4 §7 — funds intent gets a conversational turn with removable query pills
  // before any canvas opens.
  | { k: "funds"; seed: string }
  // v4 §3 Rule 1 — a bare client name is not an intent; offer what to start.
  | { k: "disambiguate"; label: string; chips: { label: string; seed: string }[] }
  // v4 §8 — an AMC offer request: a reply, then a card that opens the offer /
  // client-match / WhatsApp-draft canvas.
  | { k: "offer" };

/* Seed → the opening thread turn. A journey/funds/disambiguate route becomes a
   card or chips in the thread; drift/scope/action keep their prior behaviour. */
function seedMsgs(seed: string): Msg[] {
  const r = route(seed, { mode: "free" });
  if (r.kind === "journey") return [{ k: "user", text: seed }, { k: "journeycard", journey: r.journey, seed: r.seed }];
  if (r.kind === "funds") return [{ k: "user", text: seed }, { k: "funds", seed: r.seed }];
  if (r.kind === "offer") return [{ k: "user", text: seed }, { k: "offer" }];
  if (r.kind === "disambiguate") return [{ k: "user", text: seed }, { k: "disambiguate", label: r.label, chips: r.chips }];
  if (r.kind === "drift") return [{ k: "user", text: seed }, { k: "trace" }];
  if (r.kind === "scope") return [{ k: "user", text: seed }, { k: "scope", text: r.body }];
  if (r.kind === "action") return [{ k: "user", text: seed }, { k: "action", preview: r.preview }];
  return [{ k: "user", text: seed }, { k: "unknown" }];
}

export function Chat({
  seed,
  onMenu,
  onNew,
  onOpenJourney,
  onOpenCanvas,
}: {
  seed: string;
  onMenu: () => void;
  onNew: () => void;
  onOpenJourney: (index: number, seed: string) => void;
  onOpenCanvas: (canvas: "portfolio" | "proposal" | "funds") => void;
}) {
  // route the opening seed exactly once
  const [msgs, setMsgs] = useState<Msg[]>(() => seedMsgs(seed));
  const [phase, setPhase] = useState<Phase>(() =>
    route(seed, { mode: "free" }).kind === "drift" ? "loading" : "static",
  );
  const [value, setValue] = useState("");
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [canvas, setCanvas] = useState(false); // drift attribution canvas
  const [confirm, setConfirm] = useState(false); // Plate 4 confirm sheet
  const [offer, setOffer] = useState(false); // v4 §8 Diwali offer canvas
  const failCount = useRef(0);

  const { ref, showButton, onScroll, scrollToBottom } = useStickyScroll([msgs, phase]);

  function traceDone() {
    setMsgs((m) => [...m.filter((x) => x.k !== "trace"), { k: "attribution" }]);
    setPhase("attribution");
  }

  /* v4 §5 — Stop aborts the running trace, keeps what was shown, and offers a
     way back in. It never leaves the thread mid-stream with no exit. */
  function stop() {
    setMsgs((m) => m.map((x) => (x.k === "trace" ? { k: "aborted" } : x)));
    setPhase("static");
  }

  function resume() {
    setMsgs((m) => m.map((x) => (x.k === "aborted" ? { k: "trace" } : x)));
    setPhase("loading");
  }

  function toRebalance() {
    setCanvas(false);
    setMsgs((m) => [...m, { k: "user", text: "What would fixing it cost?" }, { k: "rebalance" }]);
    setPhase("rebalance");
  }

  function approve() {
    setConfirm(false);
    setMsgs((m) => [...m, { k: "success" }]);
    setPhase("done");
  }

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    const r = route(q, { mode: "free" });
    if (r.kind === "journey") {
      setValue("");
      failCount.current = 0;
      setMsgs((m) => [...m, { k: "user", text: q }, { k: "journeycard", journey: r.journey, seed: r.seed }]);
      setPhase("static");
      return;
    }
    if (r.kind === "funds") {
      setValue("");
      failCount.current = 0;
      setMsgs((m) => [...m, { k: "user", text: q }, { k: "funds", seed: r.seed }]);
      setPhase("static");
      return;
    }
    if (r.kind === "offer") {
      setValue("");
      failCount.current = 0;
      setMsgs((m) => [...m, { k: "user", text: q }, { k: "offer" }]);
      setPhase("static");
      return;
    }
    if (r.kind === "disambiguate") {
      setValue("");
      failCount.current = 0;
      setMsgs((m) => [...m, { k: "user", text: q }, { k: "disambiguate", label: r.label, chips: r.chips }]);
      setPhase("static");
      return;
    }
    if (r.kind === "drift") {
      setValue("");
      failCount.current = 0;
      setMsgs((m) => [...m, { k: "user", text: q }, { k: "trace" }]);
      setPhase("loading");
      return;
    }
    if (r.kind === "scope") {
      setValue("");
      failCount.current = 0;
      setMsgs((m) => [...m, { k: "user", text: q }, { k: "scope", text: r.body }]);
      setPhase("static");
      return;
    }
    if (r.kind === "action") {
      setValue("");
      failCount.current = 0;
      setMsgs((m) => [...m, { k: "user", text: q }, { k: "action", preview: r.preview }]);
      setPhase("static");
      return;
    }
    // bucket 4 — not understood; keep the user's text in the composer (do not clear)
    failCount.current += 1;
    setMsgs((m) => [...m, { k: "user", text: q }, { k: "unknown" }]);
    setPhase("static");
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      <ScreenBackdrop />
      <StatusSpacer />
      <TopBar onMenu={onMenu} onNew={onNew} />

      <div ref={ref} onScroll={onScroll} className="no-scrollbar relative z-10 flex flex-1 flex-col overflow-y-auto">
        <div className="mt-auto flex flex-col gap-[12px] px-[16px] pb-[24px] pt-[16px]">
          {msgs.map((m, i) => {
            if (m.k === "user") return <UserBubble key={i} text={m.text} />;
            if (m.k === "trace")
              return (
                <ProgressTrace
                  key={i}
                  steps={[
                    "Reading Sharma's holdings — 18 funds",
                    "Comparing against his mandate",
                    "Checking Q2 statements",
                    "Attributing the drift",
                  ]}
                  reasoning="Equity went from 62% to 71% against a 60% target. Three things moved it, and only one of them was a decision."
                  onDone={traceDone}
                />
              );
            if (m.k === "attribution")
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: EASE }} className="flex flex-col gap-[12px]">
                  <SentinelBlock>
                    <SentinelText text="Two-thirds of the drift is the small-cap rally. You did not cause it, and selling into it has a cost." />
                    <div className="mt-[12px]">
                      <AllocationCard segments={SHARMA_ALLOC} />
                    </div>
                  </SentinelBlock>
                  {/* A1 artifact card — appears in the thread, opens the canvas */}
                  <ArtifactCard onOpen={() => setCanvas(true)} />
                </motion.div>
              );
            if (m.k === "rebalance")
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: EASE }}>
                  <SentinelBlock>
                    <SentinelText text="Two moves, not seven. This alone brings equity from 71% back to 58% and costs ₹11,200." />
                    <div className="mt-[12px] flex flex-col gap-[8px]">
                      <MoveCard n={1} title="Move ₹1,85,000 out of Quant Small Cap" body="Into ICICI Corporate Bond. Brings equity from 67% to 58%." />
                      <MoveCard n={2} title="Redirect her ₹30,000 monthly SIP" body="No exit load, no tax, and it stops the drift returning." />
                    </div>
                  </SentinelBlock>
                </motion.div>
              );
            if (m.k === "success")
              return (
                <SuccessBlock
                  key={i}
                  onTell={() => setSheet(TELL_SHARMA_SHEET)}
                  onPortfolio={() => onOpenCanvas("portfolio")}
                />
              );
            if (m.k === "scope")
              return (
                <SentinelBlock key={i}>
                  <SentinelText text={m.text} />
                  <div className="mt-[12px]">
                    <AnswerChip label="Something else" onClick={() => setSheet(CAPABILITY_SHEET)} />
                  </div>
                </SentinelBlock>
              );
            if (m.k === "action")
              return <ActionConfirmBlock key={i} preview={m.preview} onConfirm={() => setConfirm(true)} />;
            if (m.k === "aborted")
              return (
                <SentinelBlock key={i}>
                  <SentinelText text="Stopped. I kept what I'd worked out so far — I was partway through attributing Sharma's drift." />
                  <div className="mt-[12px]">
                    <AnswerChip label="Continue" variant="primary" onClick={resume} />
                  </div>
                </SentinelBlock>
              );
            if (m.k === "journeycard")
              return (
                <JourneyCard
                  key={i}
                  journey={m.journey}
                  onOpen={() => onOpenJourney(JOURNEY[m.journey], m.seed)}
                />
              );
            if (m.k === "funds")
              return <FundsTurn key={i} onOpen={() => onOpenCanvas("funds")} />;
            if (m.k === "offer")
              return <OfferTurn key={i} onOpen={() => setOffer(true)} />;
            if (m.k === "disambiguate")
              return (
                <SentinelBlock key={i}>
                  <SentinelText text={m.label} />
                  <div className="mt-[12px] flex flex-wrap gap-[8px]">
                    {m.chips.map((c) => (
                      <AnswerChip key={c.label} label={c.label} variant="primary" onClick={() => send(c.seed)} />
                    ))}
                  </div>
                </SentinelBlock>
              );
            // bucket 4 — failure disclosure, never invention
            return (
              <SentinelBlock key={i}>
                <SentinelText text="I did not follow that. I can look up a client, build a proposal, explain a drift, or search funds — which is closest?" />
                <div className="mt-[12px] flex flex-wrap gap-[8px]">
                  <AnswerChip label="Look up a client" onClick={() => send("Meera")} />
                  <AnswerChip label="Explain a drift" onClick={() => send("Why did Sharma's portfolio drift this quarter?")} />
                  <AnswerChip label="Search funds" onClick={() => send("Find a large-cap direct fund")} />
                  {failCount.current >= 2 && <AnswerChip label="Show me what I can ask" variant="tertiary" onClick={() => setSheet(CAPABILITY_SHEET)} />}
                </div>
              </SentinelBlock>
            );
          })}
        </div>
        <ScrollToBottomButton show={showButton} onClick={scrollToBottom} />
      </div>

      {/* three-row dock — chips, CTA, composer; the CTA never replaces the composer */}
      <Dock
        chips={
          phase === "attribution" ? (
            <div className="flex flex-wrap gap-[8px]">
              <AnswerChip label="Why is 71% a problem?" variant="tertiary" onClick={() => setSheet({ title: "Why is 71% a problem?", body: ["Equity is 11% over the 60% you agreed. In a normal year that barely shows.", "In a 20% fall it costs him more than the agreed mix would have — the drift only bites when markets drop."] })} />
              <AnswerChip label="Show the 18 holdings" onClick={() => setCanvas(true)} />
            </div>
          ) : phase === "rebalance" ? (
            <div className="flex flex-wrap gap-[8px]">
              <AnswerChip label="Show the five we skipped" onClick={() => setSheet(SKIPPED_SHEET)} />
            </div>
          ) : undefined
        }
        cta={
          phase === "attribution" ? (
            <DarkButton label="Rebalance to his mandate" onClick={toRebalance} />
          ) : phase === "rebalance" ? (
            <DarkButton label="Approve both moves" onClick={() => setConfirm(true)} />
          ) : undefined
        }
        composer={
          <Composer
            value={value}
            onChange={setValue}
            onSend={() => send(value)}
            placeholder={COMPOSER_PLACEHOLDER.thread}
            streaming={phase === "loading"}
            onStop={stop}
          />
        }
      />
      <HomeIndicator />

      <AnimatePresence>
        {sheet && <ExplainerSheet open title={sheet.title} body={sheet.body} onClose={() => setSheet(null)} />}
      </AnimatePresence>

      {/* drift attribution canvas — a layer above the thread */}
      <AnimatePresence>
        {canvas && <AttributionCanvas onBack={() => setCanvas(false)} onMenu={onMenu} onCost={toRebalance} />}
      </AnimatePresence>

      {/* Plate 4 — review & confirm before acting */}
      <AnimatePresence>
        {confirm && <ConfirmSheet onClose={() => setConfirm(false)} onApprove={approve} />}
      </AnimatePresence>

      {/* v4 §8 — Diwali offer / client-match / WhatsApp-draft canvas */}
      <AnimatePresence>
        {offer && <OfferCanvas onBack={() => setOffer(false)} onMenu={onMenu} />}
      </AnimatePresence>
    </div>
  );
}

/* A1 · artifact card in the thread — skeleton-first, then openable (§7.1) */
function ArtifactCard({ onOpen }: { onOpen: () => void }) {
  return (
    <Pressable onClick={onOpen} className="w-full rounded-[16px] bg-white px-[14px] py-[14px] text-left shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)]">
      <Eyebrow className="mb-[8px]">Drift attribution · Q2 → Q3</Eyebrow>
      <AttributionChart from={62} to={71} contributions={DRIFT_CONTRIB} />
      <div className="mt-[10px]">
        <Provenance text="As of 30 Sep · from his Q3 statement and mandate on file" />
      </div>
      <div className="mt-[12px] flex items-center gap-[16px] border-t-[0.5px] border-line-soft pt-[10px]">
        <span className="font-['Urbanist:Bold',sans-serif] text-[12px] text-bronze-deep">Open ›</span>
        <span className="font-['Urbanist:Bold',sans-serif] text-[12px] text-muted">Why?</span>
        <span className="font-['Urbanist:Bold',sans-serif] text-[12px] text-muted">Share</span>
      </div>
    </Pressable>
  );
}

/* v4 §3 — a journey reached through the thread. Sentinel names what it will
   open and offers the door; the journey never opens silently under the user. */
const JOURNEY_CARD: Record<JourneyId, { reply: string; label: string; meta: string; eyebrow: string }> = {
  risk: {
    reply: "I'll take Meera through the twelve-question risk profile. Each answer is hers — I won't assume any of them.",
    eyebrow: "Risk profile · Meera Nair",
    label: "Start the 12 questions",
    meta: "≈ 4 min",
  },
  proposal: {
    reply: "I'll build Mr. Amit Aggrawal a proposal from the amount and his mandate. You confirm every constraint before it's costed.",
    eyebrow: "Proposal · Mr. Amit Aggrawal",
    label: "Start the proposal",
    meta: "6 funds",
  },
  review: {
    reply: "Here's what Meera holds, drawn from her September statement — 43 funds across the book. I'll open the full review.",
    eyebrow: "Holdings review · Meera Nair",
    label: "Open the review",
    meta: "43 funds",
  },
  rebalance: {
    reply: "I can bring Sharma back to his mandate in two moves, not seven. I'll show the moves and the cost before anything runs.",
    eyebrow: "Rebalance · R. Sharma",
    label: "Show the two moves",
    meta: "2 moves",
  },
};

function JourneyCard({ journey, onOpen }: { journey: JourneyId; onOpen: () => void }) {
  const c = JOURNEY_CARD[journey];
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: EASE }} className="flex flex-col gap-[12px]">
      <SentinelBlock>
        <SentinelText text={c.reply} />
      </SentinelBlock>
      <Pressable onClick={onOpen} className="w-full rounded-[16px] bg-white px-[14px] py-[14px] text-left shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)]">
        <Eyebrow className="mb-[8px]">{c.eyebrow}</Eyebrow>
        <div className="flex items-center justify-between">
          <span className="font-['Urbanist:SemiBold',sans-serif] text-[15px] text-ink">{c.label}</span>
          <span className="flex items-center gap-[8px]">
            <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-muted">{c.meta}</span>
            <span className="font-['Urbanist:Bold',sans-serif] text-[13px] text-bronze-deep">Open ›</span>
          </span>
        </div>
      </Pressable>
    </motion.div>
  );
}

/* v4 §7 — a funds request gets a conversational turn with removable query pills
   before any canvas opens. The pills are the parsed filters; the advisor can
   drop any of them, and "On your shelf" is a self-added constraint. */
function FundsTurn({ onOpen }: { onOpen: () => void }) {
  const [pills, setPills] = useState(["Large cap", "Direct plan", "TER under 1%"]);
  const [shelf, setShelf] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: EASE }} className="flex flex-col gap-[12px]">
      <SentinelBlock>
        <SentinelText text="I read that as a fund search. Here's what I'm filtering on — drop anything that doesn't fit, then open the explorer." />
        <div className="mt-[12px] flex flex-wrap gap-[8px]">
          {pills.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPills((ps) => ps.filter((x) => x !== p))}
              className="flex items-center gap-[6px] rounded-full bg-chip px-[12px] py-[6px] ring-1 ring-line"
            >
              <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-ink">{p}</span>
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
      </SentinelBlock>
      <AnswerChip label="Open the fund explorer" variant="primary" onClick={onOpen} />
    </motion.div>
  );
}

/* v4 §8 — an AMC offer request gets a reply that is honest about its limits,
   then a card that opens the offer / client-match / draft canvas. */
function OfferTurn({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: EASE }} className="flex flex-col gap-[12px]">
      <SentinelBlock>
        <SentinelText text="I can lay out the HDFC Diwali offer and flag which of your clients it fits — but the terms come from the circular, so I've left them locked until you supply them. I won't invent a rate." />
      </SentinelBlock>
      <Pressable onClick={onOpen} className="w-full rounded-[16px] bg-white px-[14px] py-[14px] text-left shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)]">
        <Eyebrow className="mb-[8px]">Offer · HDFC AMC · Diwali</Eyebrow>
        <div className="flex items-center justify-between">
          <span className="font-['Urbanist:SemiBold',sans-serif] text-[15px] text-ink">Open the offer &amp; matches</span>
          <span className="font-['Urbanist:Bold',sans-serif] text-[13px] text-bronze-deep">Open ›</span>
        </div>
      </Pressable>
    </motion.div>
  );
}

/* Success — the drawn check, no confetti (§4.4 item 6) */
function SuccessBlock({ onTell, onPortfolio }: { onTell: () => void; onPortfolio: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: EASE }}>
      <SentinelBlock>
        <div className="flex items-center gap-[12px] rounded-[16px] bg-white px-[14px] py-[13px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)]">
          <DrawnCheck />
          <div>
            <p className="font-['Urbanist:SemiBold',sans-serif] text-[15px] text-ink">Two moves queued</p>
            <p className="mt-[2px] font-['Urbanist:Medium',sans-serif] text-[12px] text-muted">Placed 16 Sep, 9:41 · settles T+2</p>
          </div>
        </div>
        <p className="mt-[10px] font-['Urbanist:Regular',sans-serif] text-[14px] leading-[20px] text-ink-soft">
          Sharma gets a note explaining both moves. Nothing else in his book changed.
        </p>
        <div className="mt-[12px] flex flex-wrap gap-[8px]">
          <AnswerChip label="Tell Sharma now" onClick={onTell} />
          <AnswerChip label="Back to his portfolio" onClick={onPortfolio} />
        </div>
      </SentinelBlock>
    </motion.div>
  );
}

/* Bucket 6 — an instruction that would act; routed to Suggest → Confirm → Execute */
function ActionConfirmBlock({ preview, onConfirm }: { preview: string; onConfirm: () => void }) {
  return (
    <SentinelBlock>
      <SentinelText text="I will not act on a typed instruction on its own. Here is exactly what that would do — review it, then confirm." />
      <div className="mt-[12px] rounded-[16px] bg-chip px-[14px] py-[12px] ring-1 ring-line">
        <Eyebrow className="mb-[4px]">Would run</Eyebrow>
        <p className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">“{preview}”</p>
      </div>
      <div className="mt-[12px]">
        <AnswerChip label="Review and confirm" variant="primary" onClick={onConfirm} />
      </div>
    </SentinelBlock>
  );
}

/* Drift attribution canvas (V3) — a layer above the thread with a docked composer */
function AttributionCanvas({ onBack, onMenu, onCost }: { onBack: () => void; onMenu: () => void; onCost: () => void }) {
  const [ask, setAsk] = useState("");
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
        <CanvasHeader title="Drift attribution" onBack={onBack} onMenu={onMenu} />
        <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto px-[16px] pb-[16px] pt-[12px]">
          <div className="rounded-[16px] bg-white px-[16px] py-[16px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)]">
            <Eyebrow className="mb-[10px]">Q2 → Q3 · Rohan Sharma</Eyebrow>
            <AttributionChart from={62} to={71} contributions={DRIFT_CONTRIB} />
            <div className="mt-[10px]">
              <Provenance text="As of 30 Sep · from his Q3 statement and mandate on file" />
            </div>
          </div>
        </div>
        <Dock
          chips={
            <div className="flex flex-wrap gap-[8px]">
              <AnswerChip label="What would fixing it cost?" variant="primary" onClick={onCost} />
            </div>
          }
          composer={<Composer value={ask} onChange={setAsk} onSend={() => setAsk("")} placeholder={COMPOSER_PLACEHOLDER.canvas} />}
        />
        <HomeIndicator />
      </motion.div>
    </>
  );
}

/* v4 §8 — Diwali offer canvas: offer terms (locked), a client-match table over
   the §5.3 roster, then a WhatsApp draft with the disclosure ABOVE the body.
   AMC terms are unsourced, so they are locked: [PLACEHOLDER — offer terms to
   supply]. The match logic is stated, never a fabricated eligibility. */
const OFFER_MATCHES = [
  { client: "Meera Nair", fit: "Fits", why: "SIP investor · KYC current", tone: "ok" as const },
  { client: "Sunita Nair", fit: "Fits", why: "Holds HDFC Flexi Cap already", tone: "ok" as const },
  { client: "Mr. Amit Aggrawal", fit: "Check", why: "New mandate — confirm eligibility", tone: "req" as const },
  { client: "R. Sharma", fit: "No", why: "Rebalancing this quarter", tone: "off" as const },
];

function OfferCanvas({ onBack, onMenu }: { onBack: () => void; onMenu: () => void }) {
  const [ask, setAsk] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
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
        <CanvasHeader title="Diwali offer · HDFC" onBack={onBack} onMenu={onMenu} />
        <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto px-[16px] pb-[16px] pt-[12px]">
          {/* offer terms — locked until sourced */}
          <div className="rounded-[16px] bg-white px-[14px] py-[13px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)]">
            <Eyebrow className="mb-[10px]">Offer terms</Eyebrow>
            <div className="flex flex-col gap-[8px]">
              {["Offer window", "Eligible schemes", "Benefit / rate", "Conditions"].map((k) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">{k}</span>
                  <span className="rounded-full bg-chip px-[10px] py-[4px] font-['Urbanist:Medium',sans-serif] text-[11px] text-muted ring-1 ring-line">
                    from circular
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-[10px] font-['Urbanist:Regular',sans-serif] text-[11px] leading-[15px] text-muted">
              [PLACEHOLDER — offer terms to supply] · I won't quote a rate the circular hasn't given me.
            </p>
          </div>

          {/* client-match table over the §5.3 roster */}
          <div className="mt-[12px] overflow-hidden rounded-[16px] bg-white">
            <div className="px-[14px] pb-[4px] pt-[12px]">
              <Eyebrow>Who it fits</Eyebrow>
            </div>
            {OFFER_MATCHES.map((m, i) => (
              <div key={m.client} className={`flex items-center justify-between px-[14px] py-[11px] ${i < OFFER_MATCHES.length - 1 ? "border-b-[0.5px] border-line-soft" : ""}`}>
                <div>
                  <p className="font-['Urbanist:SemiBold',sans-serif] text-[13px] text-ink">{m.client}</p>
                  <p className="mt-[1px] font-['Urbanist:Regular',sans-serif] text-[11.5px] text-muted">{m.why}</p>
                </div>
                <span className={`rounded-full px-[10px] py-[3px] font-['Urbanist:SemiBold',sans-serif] text-[11px] ${m.tone === "ok" ? "bg-bubble text-bronze-deep ring-1 ring-bubble-edge" : m.tone === "req" ? "text-danger" : "bg-chip text-muted ring-1 ring-line"}`}>
                  {m.fit}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-[10px]">
            <Provenance text="As of 15 Sep · matched against each client's KYC and holdings on file" />
          </div>

          {/* WhatsApp draft — disclosure ABOVE the message body */}
          {!draft ? (
            <div className="mt-[14px]">
              <AnswerChip label="Draft a note for the two who fit" variant="primary" onClick={() => setDraft("Hi — HDFC has a Diwali offer that suits your plan. I've checked it against your holdings and it fits. Shall I walk you through the terms?")} />
            </div>
          ) : (
            <div className="mt-[14px] rounded-[16px] bg-white px-[14px] py-[13px]">
              <div className="rounded-[12px] bg-bubble px-[12px] py-[10px] ring-1 ring-bubble-edge">
                <Eyebrow className="mb-[4px] text-bronze-deep">Before you send</Eyebrow>
                <p className="font-['Urbanist:Regular',sans-serif] text-[12px] leading-[17px] text-ink-soft">
                  This is a draft. It carries no rate until you add the circular's terms, and it sends from your own WhatsApp under your ARN — Sentinel doesn't send it.
                </p>
              </div>
              <p className="mt-[10px] font-['Urbanist:Regular',sans-serif] text-[13px] leading-[19px] text-ink">{draft}</p>
            </div>
          )}
        </div>
        <Dock composer={<Composer value={ask} onChange={setAsk} onSend={() => setAsk("")} placeholder={COMPOSER_PLACEHOLDER.canvas} />} />
        <HomeIndicator />
      </motion.div>
    </>
  );
}

/* Plate 4 — review & confirm: disclosure ABOVE the numbers, compliance as rows */
function ConfirmSheet({ onClose, onApprove }: { onClose: () => void; onApprove: () => void }) {
  const [ask, setAsk] = useState("");
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE }} onClick={onClose} className="absolute inset-0 z-30 bg-ink/40" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.28, ease: EASE }}
        className="absolute inset-x-0 bottom-0 z-40 flex max-h-[88%] flex-col rounded-t-[24px] bg-canvas"
      >
        <div className="mx-auto mb-[6px] mt-[10px] h-[5px] w-[44px] shrink-0 rounded-full bg-line" />
        <div className="no-scrollbar flex-1 overflow-y-auto px-[20px] pb-[8px]">
          <p className="font-['Urbanist:SemiBold',sans-serif] text-[18px] text-ink">Approve — Rohan Sharma</p>

          {/* disclosure ABOVE the numbers — the first thing on the confirm step */}
          <div className="mt-[12px] rounded-[16px] bg-bubble px-[14px] py-[12px] ring-1 ring-bubble-edge">
            <Eyebrow className="mb-[4px] text-bronze-deep">Before you approve</Eyebrow>
            <p className="font-['Urbanist:Regular',sans-serif] text-[13px] leading-[19px] text-ink-soft">
              These two switches execute under your ARN. Sharma receives a note explaining both moves and the cost — nothing else in his book changes.
            </p>
          </div>

          {/* three-row compliance card — status stated, not implied */}
          <div className="mt-[12px] rounded-[16px] bg-white px-[14px]">
            {[
              { k: "Compliance shelf", v: "Passed", tone: "ok" as const },
              { k: "Single-fund ceiling", v: "No fund over 25%", tone: "ok" as const },
              { k: "Client consent", v: "Required", tone: "req" as const },
            ].map((r, i) => (
              <div key={r.k} className={`flex h-[52px] items-center justify-between ${i < 2 ? "border-b-[0.5px] border-line-soft" : ""}`}>
                <span className="font-['Urbanist:Medium',sans-serif] text-[14px] text-ink">{r.k}</span>
                <span className={`font-['Urbanist:SemiBold',sans-serif] text-[13px] ${r.tone === "req" ? "text-danger" : "text-ink"}`}>{r.v}</span>
              </div>
            ))}
          </div>

          <div className="mt-[12px] flex flex-col gap-[8px]">
            <MoveCard n={1} title="Move ₹1,85,000 out of Quant Small Cap" body="Into ICICI Corporate Bond. Brings equity from 67% to 58%." />
            <MoveCard n={2} title="Redirect her ₹30,000 monthly SIP" body="No exit load, no tax, and it stops the drift returning." />
          </div>
        </div>

        <div className="shrink-0">
          <Dock
            cta={<DarkButton label="Approve both moves" onClick={onApprove} />}
            composer={<Composer value={ask} onChange={setAsk} onSend={() => setAsk("")} placeholder={COMPOSER_PLACEHOLDER.canvas} />}
          />
          <HomeIndicator tone="dark" />
        </div>
      </motion.div>
    </>
  );
}
