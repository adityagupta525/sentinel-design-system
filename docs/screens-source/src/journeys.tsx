import type { ChipVariant } from "@/lib/ui";
import {
  ConcentrationBar,
  DataTableCard,
  DeltaPill,
  EyebrowDivider,
  FilterChip,
  HeroNumberCard,
  KindTag,
  MoveCard,
  SentinelBlock,
  SentinelText,
} from "@/lib/ui";

/* ── Journey model ────────────────────────────────────────────────────── */
export type Sheet = { title: string; body: string[] };

export type JChip = {
  label: string;
  subtitle?: string; // renders the full-width card chip variant (Plate 3)
  variant?: ChipVariant;
  sheet?: Sheet; // C4 — opens an explainer, does not advance
  goto?: number; // absolute jump (escape hatch)
  external?: boolean; // secondary action, no advance (e.g. WhatsApp)
};

export type Step = {
  name: string; // frame name from the spec
  short?: string; // one-line label used when the Q&A pair collapses
  sentinel?: string | string[];
  sub?: string;
  progress?: [number, number];
  demo?: boolean;
  provenance?: string; // v4 §6 — where the figures on this step came from
  interjection?: boolean;
  callout?: { eyebrow: string; body: string };
  chips?: JChip[];
  money?: boolean;
  composer?: string; // free-text composer placeholder
  result?: "risk" | "proposal" | "review" | "rebalance";
  cta?: string; // sticky primary CTA label (result frames)
};

const c = (label: string, variant: ChipVariant = "outline", extra: Partial<JChip> = {}): JChip => ({
  label,
  variant,
  ...extra,
});

/* Explainer bodies are composed from facts stated elsewhere in the spec. */
const SHEET_25 = {
  title: "Why a 25% cap?",
  body: [
    "No single fund in Meera's mandate may hold more than 25% of her money — it keeps one manager's mistake from sinking the whole book.",
    "To cover large, mid, small, debt and liquid at a Moderate mix, four funds would force one of them to hold 34%. Six is the smallest number that stays under the cap.",
  ],
};
const SHEET_54 = {
  title: "How is 54 worked out?",
  body: [
    "We score three things and take the lowest: what her finances can absorb (71), what she can sit through calmly (54) and what her ₹2 crore goal needs (62).",
    "The lowest is what binds. She is a 54, Moderate — her finances could carry more, but she would not sleep through it.",
  ],
};

/* ── The flat step list — four journeys chained for the prototype flow ─── */
export const STEPS: Step[] = [
  // ── Journey A · Risk Profiling ──────────────────────────────────────
  {
    name: "Risk / 01 Intro",
    short: "Start Meera's risk profile",
    provenance: "As of 15 Sep · from her account record and September statement",
    sentinel: [
      "Meera Nair, 38, Kochi. Your client since 2019. ₹18.4 L across 43 funds.",
      "Her risk profile was never completed, so nothing after it can be checked against anything. Let us fix that first — twelve short questions, mostly one tap each.",
    ],
    chips: [
      c("Let's go", "primary"),
      c("Why twelve questions?", "tertiary", {
        sheet: {
          title: "Why twelve questions?",
          body: [
            "Twelve short questions — mostly one tap each — are the minimum needed to score her finances, her temperament and her goal.",
            "With a real risk number, everything after it (the proposal, the drift, the rebalance) can be checked against something.",
          ],
        },
      }),
      c("Skip to the result", "muted", { goto: 15 }),
    ],
  },
  {
    name: "Risk / 02 Q1 Age",
    short: "How old is Meera?",
    progress: [1, 12],
    sentinel: "How old is Meera?",
    chips: [c("Use her KYC age — 38", "smart"), c("Type it instead")],
    composer: "or type an age",
  },
  {
    name: "Risk / 03 Q2 Income",
    short: "How steady is her income?",
    progress: [2, 12],
    sentinel: "How steady is her income?",
    chips: [c("Fixed salary"), c("Salary plus bonus"), c("Own business"), c("Freelance, varies"), c("Rent or pension")],
    composer: "or type your answer",
  },
  {
    name: "Risk / 04 Q3 Income",
    short: "What does she earn a month?",
    progress: [3, 12],
    sentinel: "What does she earn a month?",
    chips: [c("From her last ITR — ₹1,80,000", "smart"), c("₹1,50,000"), c("₹2,00,000")],
    money: true,
  },
  {
    name: "Risk / 05 Q4 Spend",
    short: "And what does she spend a month?",
    progress: [4, 12],
    sentinel: "And what does she spend a month?",
    chips: [c("₹75,000"), c("₹95,000"), c("₹1,20,000")],
    money: true,
  },
  {
    name: "Risk / 06 Q5 Emergency",
    short: "How much for emergencies?",
    progress: [5, 12],
    sentinel: "How much has she kept aside for emergencies?",
    sub: "Money she could reach by tomorrow.",
    chips: [c("₹3,00,000"), c("₹6,00,000"), c("₹10,00,000")],
    money: true,
  },
  {
    name: "Risk / 07 Reflect",
    progress: [5, 12],
    interjection: true,
    sentinel: "That is about six months of her spending. Comfortable — it means a fall in the market will not force her to sell.",
    chips: [c("Carry on", "primary")],
  },
  {
    name: "Risk / 08 Q6 Dependents",
    short: "How many people depend on this?",
    progress: [6, 12],
    sentinel: "How many people depend on this income?",
    chips: [c("Nobody"), c("1"), c("2"), c("3"), c("4 or more")],
  },
  {
    name: "Risk / 09 Q7 Horizon",
    short: "When will she need this money?",
    progress: [7, 12],
    sentinel: "When will she need this money?",
    chips: [c("Within a year"), c("1 to 3 years"), c("3 to 7 years"), c("7 to 15 years"), c("More than 15 years")],
  },
  {
    name: "Risk / 10 Q8 Goal",
    short: "What is she saving towards?",
    progress: [8, 12],
    sentinel: "What is she saving towards, in rupees?",
    sub: "Without a figure we cannot work out the return she needs, and the risk number.",
    chips: [c("₹50 lakh"), c("₹1 crore"), c("₹2 crore"), c("She isn't sure yet", "muted")],
    money: true,
  },
  {
    name: "Risk / 11 Q9 Behaviour",
    short: "The last 20% fall — what did she do?",
    progress: [9, 12],
    sentinel: "The last time markets fell 20% or more — what did she actually do?",
    sub: "What she did, not what she says she would do.",
    chips: [c("Invested more"), c("Stayed put"), c("Sold some"), c("Sold everything")],
  },
  {
    name: "Risk / 12 Reflect",
    progress: [9, 12],
    interjection: true,
    sentinel: "Good — that is the most useful answer in the whole set. Saying you can handle a fall and living through one are different things.",
    chips: [c("Carry on", "primary")],
  },
  {
    name: "Risk / 13 Q10 Drawdown",
    short: "How big a fall could she sit through?",
    progress: [10, 12],
    sentinel: "How big a fall could she sit through without calling you?",
    chips: [c("Almost none"), c("About 10%"), c("About 20%"), c("About 30%"), c("More than that")],
  },
  {
    name: "Risk / 14 Q11 Objective",
    short: "What is this money asked to do?",
    progress: [11, 12],
    sentinel: "What is she asking this money to do?",
    chips: [c("Protect it"), c("Give steady income"), c("Grow steadily"), c("Grow it properly"), c("Push for the most")],
  },
  {
    name: "Risk / 15 Q12 Knowledge",
    short: "How well does she understand it?",
    progress: [12, 12],
    sentinel: "How well does she understand what she holds?",
    sub: "This limits how complicated the portfolio may get — not how much risk she takes.",
    chips: [c("New to this"), c("Knows the basics"), c("Fairly experienced"), c("Works in finance")],
  },
  {
    name: "Risk / 16 Result",
    result: "risk",
    chips: [c("How is 54 worked out?", "tertiary", { sheet: SHEET_54 }), c("Share with Meera on WhatsApp", "outline", { external: true })],
    cta: "Build her a portfolio",
  },

  // ── Journey B · Proposal ────────────────────────────────────────────
  {
    name: "Proposal / 01 Amount",
    short: "How much is going in?",
    sentinel: "How much is going in?",
    chips: [c("₹10 lakh"), c("₹25 lakh"), c("₹50 lakh"), c("A monthly SIP instead")],
    money: true,
  },
  {
    name: "Proposal / 02 Funds",
    short: "How many funds should he hold?",
    sentinel: "How many funds should he hold?",
    chips: [c("Just 4 — keep it simple"), c("6 or 7"), c("You decide")],
  },
  {
    name: "Proposal / 03 Constraint",
    short: "Six is the smallest number that works.",
    callout: {
      eyebrow: "Cannot build this",
      body: "Four funds will not fit. To cover large, mid, small, debt and liquid at a Moderate mix, one of them would have to hold 34% of his money — past the 25% ceiling on any single fund.",
    },
    sentinel: "Six is the smallest number that works here.",
    chips: [c("Go with 6", "primary"), c("Why a 25% cap?", "tertiary", { sheet: SHEET_25 })],
  },
  {
    name: "Proposal / 04 Result",
    result: "proposal",
    chips: [
      c("Which 312 did you look at?", "tertiary", {
        sheet: {
          title: "Which 312 did you look at?",
          body: [
            "The 312 are every fund that passes your compliance shelf — the mandate's allowed categories, expense limits and single-fund ceilings.",
            "Six came through as the smallest set that covers large, mid, small, debt and liquid without any fund crossing 25%.",
          ],
        },
      }),
      c("Send this to Mr. Aggrawal on WhatsApp", "outline", { external: true }),
    ],
    cta: "Now check what he already holds",
  },

  // ── Journey C · Review ──────────────────────────────────────────────
  {
    name: "Review / 01 Response",
    result: "review",
    chips: [
      c("How bad is 12%, really?", "tertiary", {
        sheet: {
          title: "How bad is 12%, really?",
          body: [
            "Equity is 12% over the mix you agreed. In a normal year that barely shows.",
            "In a 20% fall it costs her about ₹4,38,600 more than the agreed mix would have — the drift only bites when markets drop.",
          ],
        },
      }),
      c("What about the 34 tiny funds?", "tertiary", {
        sheet: {
          title: "What about the 34 tiny funds?",
          body: [
            "Twenty-nine funds are under 1.5% each — too small to move the needle, but they still cost her fees.",
            "No single trade fixes them; they are best cleaned up gradually as other moves happen.",
          ],
        },
      }),
    ],
    cta: "Fix it",
  },

  // ── Journey D · Rebalance ───────────────────────────────────────────
  {
    name: "Rebalance / 01 Moves",
    result: "rebalance",
    chips: [c("Show the five we skipped"), c("Send this to Meera on WhatsApp", "outline", { external: true })],
    cta: "Approve both moves",
  },
];

/* v4 Part 2.1 — the entry variant that was missing. A journey target names a
   STEPS index and the seed bubble to open it with, so the four finished
   journeys finally have doors. Indices are derived by frame name (2.1) so an
   inserted step cannot silently re-point a door. */
export type EntryTarget =
  | { kind: "journey"; index: number; seed: string }
  | { kind: "drift" }
  | { kind: "scope" };

const idx = (name: string) => {
  const i = STEPS.findIndex((s) => s.name === name);
  if (i < 0) throw new Error(`Journey step not found: ${name}`);
  return i;
};

export const JOURNEY = {
  risk: idx("Risk / 01 Intro"),
  proposal: idx("Proposal / 01 Amount"),
  review: idx("Review / 01 Response"),
  rebalance: idx("Rebalance / 01 Moves"),
} as const;

/* v4 Part 2.2 — the "Jump back in" rows. Each is a door to one built journey,
   labelled by its own client (§5.3). The three aspirational capability rows
   live in Home.tsx; these are the four things that actually work. */
export type JumpRow = { label: string; meta: string; target: EntryTarget };

export const JUMP_ROWS: JumpRow[] = [
  { label: "Meera's risk profile", meta: "12 questions", target: { kind: "journey", index: JOURNEY.risk, seed: "Start with Meera" } },
  { label: "₹25 L proposal", meta: "6 funds", target: { kind: "journey", index: JOURNEY.proposal, seed: "Build a proposal for Mr. Amit Aggrawal" } },
  { label: "What Meera holds", meta: "43 funds", target: { kind: "journey", index: JOURNEY.review, seed: "What does Meera hold?" } },
  { label: "Sharma's rebalance", meta: "2 moves", target: { kind: "journey", index: JOURNEY.rebalance, seed: "Rebalance Sharma to his mandate" } },
];

/* ══════════════════════════════════════════════════════════════════════
   Result views — composed entirely from the C-series components.
   ═════════════════════════════════════════════════════════════════════ */

function Trailing({ text }: { text: string }) {
  return (
    <SentinelBlock>
      <SentinelText text={text} />
    </SentinelBlock>
  );
}

function RiskResult() {
  return (
    <div className="flex flex-col gap-[16px]">
      <EyebrowDivider>Risk profile locked</EyebrowDivider>
      <HeroNumberCard
        title="Meera's risk number"
        meta="Locked · 15 Sep 2026"
        value={54}
        badge="Moderate"
        copy="We look at three things and go with the lowest of them. Her money can take more risk than she can."
        rows={[
          { label: "What her finances can absorb", value: 71 },
          { label: "What she can sit through calmly", value: 54, binding: true },
          { label: "What her ₹2 crore goal needs", value: 62 },
        ]}
      />
      <Trailing text="She is a 54, Moderate. Her finances could carry more, but she would not sleep through it — so 54 is what we build against." />
    </div>
  );
}

export const PROPOSAL_ROWS = [
  { fund: "Parag Parikh Flexi Cap", kind: "Flexi cap", share: "22%", amount: "₹5,50,000" },
  { fund: "HDFC Large Cap", kind: "Large cap", share: "18%", amount: "₹4,50,000" },
  { fund: "Motilal Oswal Midcap", kind: "Mid cap", share: "10%", amount: "₹2,50,000" },
  { fund: "Nippon Small Cap", kind: "Small cap", share: "5%", amount: "₹1,25,000" },
  { fund: "ICICI Corporate Bond", kind: "Debt", share: "30%", amount: "₹7,50,000" },
  { fund: "SBI Liquid", kind: "Liquid", share: "15%", amount: "₹3,75,000" },
];

function ProposalResult() {
  return (
    <div className="flex flex-col gap-[16px]">
      <EyebrowDivider>Proposal ready</EyebrowDivider>
      <DataTableCard
        title="Where ₹25 lakh would go"
        meta="6 funds"
        description="Chosen from 312 funds that pass your compliance shelf. Six came through."
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
        footer="55 in equity, 45 in debt and liquid · no fund crosses 25%"
      />
      <Trailing text="Put it in over three months rather than in one go — ₹4,58,333 a month into the equity side, with the debt and liquid portions going in straight away." />
    </div>
  );
}

const MIX_ROWS = [
  { bucket: "Equity", agreed: "55%", actual: "67%", pill: "12% over", tone: "over" as const },
  { bucket: "Debt", agreed: "30%", actual: "21%", pill: "9% under", tone: "under" as const },
  { bucket: "Liquid", agreed: "15%", actual: "12%", pill: "Close enough", tone: "ok" as const },
];

const HOLDING_ROWS = [
  { fund: "Quant Small Cap", kind: "Equity", share: "31%", over: true, value: "₹5.7 L", vs: "+2.1%" },
  { fund: "Axis Bluechip", kind: "Liquid", share: "4.8%", over: false, value: "₹88,613", vs: "+1.7%" },
  { fund: "Motilal Oswal Midcap", kind: "Equity", share: "4.6%", over: false, value: "₹84,294", vs: "+1.4%" },
  { fund: "Edelweiss Mid Cap", kind: "Equity", share: "4.5%", over: false, value: "₹83,138", vs: "+4.3%" },
  { fund: "Franklin India Prima", kind: "Liquid", share: "4.5%", over: false, value: "₹82,888", vs: "+0.7%" },
  { fund: "HDFC Short Term Debt", kind: "Liquid", share: "4.1%", over: false, value: "₹76,264", vs: "+0.1%" },
  { fund: "DSP Small Cap", kind: "Hybrid", share: "3.7%", over: false, value: "₹68,481", vs: "+2.1%" },
  { fund: "UTI Nifty Index", kind: "Equity", share: "3.6%", over: false, value: "₹66,749", vs: "+3.3%" },
];

const CONC_ROWS = [
  { what: "Quant Small Cap", on: "single fund", held: "31%", limit: "25%", over: "6%" },
  { what: "Small cap overall", on: "category", held: "19.4%", limit: "15%", over: "4.4%" },
];

function ReviewResult() {
  return (
    <div className="flex flex-col gap-[16px]">
      {/* Card 1 — comparison */}
      <DataTableCard
        title="Her mix, against what you agreed"
        meta="₹18.4 L"
        columns={[
          { key: "name", header: "Bucket" },
          { key: "agreed", header: "Agreed", align: "right" },
          { key: "actual", header: "Actual", align: "right" },
          { key: "where", header: "Where it stands", align: "right" },
        ]}
        rows={MIX_ROWS.map((r) => ({
          name: <span className="font-['Urbanist:SemiBold',sans-serif] text-[13px] text-ink">{r.bucket}</span>,
          agreed: <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-muted">{r.agreed}</span>,
          actual: <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">{r.actual}</span>,
          where: <DeltaPill text={r.pill} tone={r.tone} />,
        }))}
      />
      <Trailing text="Now the detail. She holds 43 funds — here they are, biggest first." />

      {/* Card 2 — full holdings with filters + concentration bar */}
      <DataTableCard
        title="Everything Meera holds"
        meta="43 of 43 funds"
        description="14 funds hold 80% of her money. The other 29 are under 1.5% each — too small to move the needle, but they still cost her fees."
        filters={
          <div className="no-scrollbar -mx-[2px] flex gap-[8px] overflow-x-auto px-[2px]">
            <FilterChip label="All 43" selected />
            <FilterChip label="Over 2%" />
            <FilterChip label="Under 1.5%" />
            <FilterChip label="Equity" />
            <FilterChip label="Behind its benchmark" />
          </div>
        }
        bar={<ConcentrationBar fraction={0.8} label="Top 14 funds = 80% of ₹18.4 L" />}
        columns={[
          { key: "name", header: "Fund" },
          { key: "share", header: "Share", align: "right" },
          { key: "value", header: "Value", align: "right" },
          { key: "vs", header: "vs Bmk", align: "right" },
        ]}
        rows={HOLDING_ROWS.map((r) => ({
          name: (
            <div className="min-w-0">
              <p className="truncate font-['Urbanist:SemiBold',sans-serif] text-[13px] text-ink">{r.fund}</p>
              <div className="mt-[3px]"><KindTag>{r.kind}</KindTag></div>
            </div>
          ),
          share: r.over ? (
            <DeltaPill text={r.share} tone="over" />
          ) : (
            <span className="font-['Urbanist:Medium',sans-serif] text-[13px] text-ink">{r.share}</span>
          ),
          value: <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-ink">{r.value}</span>,
          vs: <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-[#4b6141]">{r.vs}</span>,
        }))}
        footer="Showing 8 · these are worth ₹18.4 L · 35 smaller ones below"
        showAll="Show all 43"
      />
      <Trailing text="Two things stand out." />

      {/* Card 3 — concentration */}
      <DataTableCard
        title="Where she is too concentrated"
        meta="2 of 15"
        description="Three of these are worth acting on. The other twelve are single stocks that crept 1–3% past the limit because several funds hold the same names — no one trade fixes those."
        filters={
          <div className="no-scrollbar -mx-[2px] flex gap-[8px] overflow-x-auto px-[2px]">
            <FilterChip label="Worth acting on (3)" selected />
            <FilterChip label="All 15" />
          </div>
        }
        columns={[
          { key: "what", header: "What" },
          { key: "on", header: "Limit on", align: "right" },
          { key: "held", header: "Held", align: "right" },
          { key: "limit", header: "Limit", align: "right" },
          { key: "over", header: "Over by", align: "right" },
        ]}
        rows={CONC_ROWS.map((r) => ({
          what: <span className="font-['Urbanist:SemiBold',sans-serif] text-[12px] text-ink">{r.what}</span>,
          on: <span className="font-['Urbanist:Medium',sans-serif] text-[11px] text-muted">{r.on}</span>,
          held: <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-ink">{r.held}</span>,
          limit: <span className="font-['Urbanist:Medium',sans-serif] text-[12px] text-muted">{r.limit}</span>,
          over: <DeltaPill text={r.over} tone="over" />,
        }))}
        footer="All 2 shown"
      />
      <Trailing text="Left alone, a 20% fall costs her roughly ₹4,40,000 more than the agreed mix would have." />
    </div>
  );
}

function RebalanceResult() {
  return (
    <div className="flex flex-col gap-[16px]">
      <EyebrowDivider>Two moves, not seven</EyebrowDivider>
      <div className="flex flex-col gap-[8px]">
        <MoveCard
          n={1}
          title="Move ₹1,85,000 out of Quant Small Cap"
          body="Into ICICI Corporate Bond. This alone brings equity from 67% back to 58%."
        />
        <MoveCard
          n={2}
          title="Redirect her ₹30,000 monthly SIP"
          body="From Quant Small Cap to HDFC Large Cap. No exit load, no tax, and it stops the drift coming back."
        />
      </div>
      <Trailing text="There are five other small gaps. We have left them alone — closing them would cost about ₹4,200 in exit load and tax to correct a 1.2% difference. Not worth it." />
    </div>
  );
}

export function ResultView({ which }: { which: NonNullable<Step["result"]> }) {
  if (which === "risk") return <RiskResult />;
  if (which === "proposal") return <ProposalResult />;
  if (which === "review") return <ReviewResult />;
  return <RebalanceResult />;
}
