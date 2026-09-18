/* ══════════════════════════════════════════════════════════════════════
   The six-bucket free-text intent router (v3 Part 3, Plate 2).

   Every typed input falls into exactly one bucket. In a prototype this is
   keyword + regex matching over a small table of known entities — four
   clients, a fund list, rupee patterns, a verb list. Bucket 4 catches
   everything the table misses and is honest by design, so the failure
   mode to avoid — a catch-all that generates confident prose — never fires.

   Never fabricate. If a number is not in the data, say it is not available.
   ═════════════════════════════════════════════════════════════════════ */

/* The four clients Sentinel knows. One client per journey, never blended. */
const CLIENTS = ["meera", "amit", "aggrawal", "sharma", "sunita"];

/* Verbs that would *act* — these route to Suggest → Confirm → Execute. */
const ACTION_VERBS = /\b(send|approve|execute|file|place|buy|sell|redeem|transfer|submit|rebalance)\b/i;

/* Words that signal a side-question rather than an answer. */
const QUESTION_WORDS = /^(wait|what|what's|whats|how|why|who|when|where|which|show|tell|explain)\b/i;

/* Symbolic journey ids — the concrete STEPS index is resolved by JOURNEY in
   journeys.tsx, so router.ts stays free of any import from journeys (which would
   close a ui → router → journeys → ui cycle). */
export type JourneyId = "risk" | "proposal" | "review" | "rebalance";

export type Route =
  | { kind: "journey"; journey: JourneyId; seed: string } // v4 — opens a built journey
  | { kind: "funds"; seed: string } // v4 Part 7 — opens the Fund Explorer conversational flow
  | { kind: "offer"; seed: string } // v4 Part 8 — opens the AMC offer / client-match flow
  | { kind: "disambiguate"; label: string; chips: { label: string; seed: string }[] } // v4 Part 3 — a name alone is not an intent
  | { kind: "parse"; parsed: string; note: string } // bucket 1 — recognised, maps to the pending question
  | { kind: "reject"; eyebrow: string; body: string; chips: string[] } // bucket 2 — out of bounds, hold position
  | { kind: "detour"; question: string } // bucket 3 — in-domain, not the pending question
  | { kind: "unknown"; repeated?: boolean } // bucket 4 — not understood
  | { kind: "scope"; body: string } // bucket 5 — in-domain but out of scope for this build
  | { kind: "action"; preview: string } // bucket 6 — an instruction that would act
  | { kind: "drift" }; // recognised journey that IS built in this version (Journey B, Sharma)

export type Ctx =
  | { mode: "free" } // general thread, no pending question
  | { mode: "money"; ceiling?: number; ceilingLabel?: string; client?: string } // a rupee question
  | { mode: "choice" }; // a multiple-choice question expecting an answer

/* ── Rupee parsing ────────────────────────────────────────────────────── */
/* Returns paise-free rupees + an Indian-grouped string, or null. */
export function parseRupee(input: string): { value: number; formatted: string } | null {
  const s = input.trim().toLowerCase().replace(/₹|rs\.?|inr/g, "").trim();
  // "50 lakh", "5 crore", "25 l", "1 cr", "30k"
  const unit = s.match(/^([\d,.]+)\s*(lakh|lac|l|crore|cr|k|thousand)?$/);
  if (!unit) return null;
  const num = parseFloat(unit[1].replace(/,/g, ""));
  if (!isFinite(num)) return null;
  const mult =
    unit[2] === "crore" || unit[2] === "cr"
      ? 1e7
      : unit[2] === "lakh" || unit[2] === "lac" || unit[2] === "l"
        ? 1e5
        : unit[2] === "k" || unit[2] === "thousand"
          ? 1e3
          : 1;
  const value = Math.round(num * mult);
  return { value, formatted: groupINR(value) };
}

export function groupINR(value: number): string {
  const str = String(value);
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  return (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," : "") + last3;
}

/* ── The router ───────────────────────────────────────────────────────── */
export function route(input: string, ctx: Ctx): Route {
  const raw = input.trim();
  const lower = raw.toLowerCase();

  if (ctx.mode === "money") {
    const r = parseRupee(raw);
    // letters in a money field → bucket 2, reject and hold
    if (!r) {
      return {
        kind: "reject",
        eyebrow: "That does not fit",
        body: "That is not an amount I can read. Type a number — like 50 lakh or ₹50,00,000.",
        chips: [],
      };
    }
    // above the mandate ceiling → bucket 2
    if (ctx.ceiling != null && r.value > ctx.ceiling) {
      const cl = ctx.ceilingLabel ?? `₹${groupINR(ctx.ceiling)}`;
      const who = ctx.client ?? "this";
      return {
        kind: "reject",
        eyebrow: "That does not fit",
        body: `₹${r.formatted} is above the ${cl} ceiling on ${who}'s mandate. I have not applied it.`,
        chips: [`Use ${cl}`, "Raise the mandate first"],
      };
    }
    // bucket 1 — recognised, with the parse note
    return { kind: "parse", parsed: `₹${r.formatted}`, note: `understood as ₹${r.formatted}` };
  }

  if (ctx.mode === "choice") {
    // a side question mid-journey → bucket 3, detour
    if (QUESTION_WORDS.test(lower) || (lower.includes("?") && CLIENTS.some((c) => lower.includes(c)))) {
      return { kind: "detour", question: raw };
    }
    // otherwise take the typed text as the answer (bucket 1, no conversion note)
    return { kind: "parse", parsed: raw, note: "" };
  }

  // ── free / general thread ──────────────────────────────────────────
  /* v4 Part 3 — keyword routing to the four built journeys. Intent keywords
     resolve by table precedence (risk → proposal → review → rebalance → drift
     → funds); a client name WITHOUT an intent never opens a journey. */
  const riskIntent =
    /\b(risk\s*profil\w*|profiling)\b/.test(lower) ||
    /start.*profil/.test(lower) ||
    (lower.includes("meera") && /\b(risk|profile|profiling)\b/.test(lower));
  const proposalIntent =
    /propos/.test(lower) || /build.*(portfolio|mix)/.test(lower) || /\b25\s*l(akh)?\b.*propos/.test(lower);
  const holdIntent =
    /\bhold(s|ing|ings)?\b/.test(lower) ||
    /what.*(she|he).*hold/.test(lower) ||
    /review.*portfolio/.test(lower) ||
    /\b(her|his)\s+mix\b/.test(lower);
  const rebalanceIntent =
    /\brebalance\b/.test(lower) || /\bfix it\b/.test(lower) || /\btwo moves\b/.test(lower) || /switch.*out of/.test(lower);
  const driftIntent = /\bdrift\b/.test(lower);
  const fundsIntent =
    /fund\s*explorer/.test(lower) ||
    /find.*fund/.test(lower) ||
    /\blarge\s*cap\b/.test(lower) ||
    /\bter\b/.test(lower) ||
    /expense ratio/.test(lower) ||
    /compare.*fund/.test(lower);

  const anyIntent = riskIntent || proposalIntent || holdIntent || rebalanceIntent || driftIntent || fundsIntent;

  // Rule 1 — a client name alone is not an intent; disambiguate with chips.
  const named = CLIENTS.find((c) => lower.includes(c));
  if (named && !anyIntent && !ACTION_VERBS.test(lower)) {
    return { kind: "disambiguate", label: disambiguateLabel(named), chips: disambiguateChips(named) };
  }

  if (riskIntent) return { kind: "journey", journey: "risk", seed: "Start with Meera" };
  if (proposalIntent) return { kind: "journey", journey: "proposal", seed: raw };
  if (holdIntent) return { kind: "journey", journey: "review", seed: raw };
  if (rebalanceIntent) return { kind: "journey", journey: "rebalance", seed: raw };
  if (driftIntent || lower.includes("sharma")) return { kind: "drift" };
  if (fundsIntent) return { kind: "funds", seed: raw };

  // Diwali circular — v4 Part 8 wires the offer / client-match journey.
  if (lower.includes("diwali") || (lower.includes("hdfc") && lower.includes("offer"))) {
    return { kind: "offer", seed: raw };
  }

  if (ACTION_VERBS.test(lower)) return { kind: "action", preview: raw };

  return { kind: "unknown" };
}

/* Rule 1 support — a bare client name offers what Sentinel can start for them,
   rather than guessing a journey. */
function cap(name: string) {
  const map: Record<string, string> = { meera: "Meera", amit: "Amit", aggrawal: "Mr. Aggrawal", sharma: "Sharma", sunita: "Sunita" };
  return map[name] ?? name;
}

function disambiguateLabel(name: string) {
  return `${cap(name)} — what would you like to start?`;
}

function disambiguateChips(name: string): { label: string; seed: string }[] {
  if (name === "sharma") {
    return [
      { label: "Why his book drifted", seed: "Why did Sharma's portfolio drift this quarter?" },
      { label: "Rebalance him", seed: "Rebalance Sharma to his mandate" },
    ];
  }
  if (name === "amit" || name === "aggrawal") {
    return [{ label: "Build a proposal", seed: "Build a proposal for Mr. Amit Aggrawal" }];
  }
  if (name === "sunita") {
    return [{ label: "What she holds", seed: "What does Sunita hold?" }];
  }
  // meera
  return [
    { label: "Her risk profile", seed: "Start Meera's risk profile" },
    { label: "What she holds", seed: "What does Meera hold?" },
    { label: "Build her a proposal", seed: "Build a proposal" },
  ];
}
