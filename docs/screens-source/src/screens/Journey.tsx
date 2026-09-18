import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  AnswerChip,
  ChipRow,
  Composer,
  COMPOSER_PLACEHOLDER,
  ConstraintCallout,
  DarkButton,
  DetourBanner,
  Dock,
  EASE,
  ExplainerSheet,
  HomeIndicator,
  MoneyComposer,
  ParseNote,
  ProgressRail,
  Provenance,
  QAPair,
  RejectCallout,
  ScreenBackdrop,
  ScrollToBottomButton,
  SentinelBlock,
  SentinelText,
  SentinelThinking,
  StatusSpacer,
  TopBar,
  UserBubble,
  useStickyScroll,
} from "@/lib/ui";
import { ResultView, STEPS } from "@/journeys";
import type { JChip, Sheet, Step } from "@/journeys";
import { route } from "@/lib/router";

type Answered = { q?: string; a: string; note?: string };

/* Journey A (Meera risk) is not entered from Home this session — it is kept
   here, router-wired and correct, ready for when Journeys A/C/D are built. */
export function Journey({
  startIndex = 0,
  seed = "Start with Meera",
  onMenu,
  onNew,
}: {
  startIndex?: number;
  seed?: string;
  onMenu: () => void;
  onNew: () => void;
}) {
  const [cursor, setCursor] = useState(startIndex);
  const [answered, setAnswered] = useState<Answered[]>([{ a: seed || "Start with Meera" }]);
  const [thinking, setThinking] = useState(true);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [text, setText] = useState("");
  const [reject, setReject] = useState<{ eyebrow: string; body: string; chips: string[] } | null>(null);
  const [detour, setDetour] = useState<{ from: number; total: number } | null>(null);

  const step: Step | undefined = STEPS[cursor];
  const { ref, showButton, onScroll, scrollToBottom } = useStickyScroll([answered, thinking, cursor]);

  useEffect(() => {
    setThinking(true);
    const t = setTimeout(() => setThinking(false), 620);
    return () => clearTimeout(t);
  }, [cursor]);

  if (!step) return <Done onMenu={onMenu} onNew={onNew} />;

  /* advance() is reachable only from bucket 1 (a parsed answer) or a chip tap. */
  function advance(label: string, questionShort?: string, goto?: number, note?: string) {
    setReject(null);
    setDetour(null);
    setAnswered((a) => [...a, { q: questionShort, a: label, note }]);
    setCursor((cur) => (goto != null ? goto : cur + 1));
    setText("");
  }

  function onChip(chip: JChip) {
    if (chip.sheet) return setSheet(chip.sheet);
    // v4 §5 — an external action (share / send) previews what would leave the
    // app rather than dead-ending; this build drafts, it does not send.
    if (chip.external)
      return setSheet({
        title: `Share — ${chip.label}`,
        body: [
          "This build prepares the document and hands it to your own share sheet — it doesn't send anything on its own.",
          "Nothing leaves the app until you pick a channel and confirm outside Sentinel.",
        ],
      });
    advance(chip.label, step!.short, chip.goto);
  }

  /* Route free text through the six buckets before anything advances. */
  function onFree(raw: string, money: boolean) {
    const r = route(raw, money ? { mode: "money" } : { mode: "choice" });
    if (r.kind === "parse") return advance(r.parsed, step!.short, undefined, r.note || undefined);
    if (r.kind === "reject") return setReject({ eyebrow: r.eyebrow, body: r.body, chips: r.chips }); // hold; keep text
    if (r.kind === "detour") return setDetour({ from: step!.progress?.[0] ?? cursor, total: step!.progress?.[1] ?? 12 });
    // unknown mid-journey — hold position, do not advance, keep the text
    setReject({
      eyebrow: "That does not fit",
      body: "I did not follow that as an answer. Tap one of the options, or type it another way.",
      chips: [],
    });
  }

  const sentinelLines = Array.isArray(step.sentinel) ? step.sentinel : step.sentinel ? [step.sentinel] : [];
  const isResult = !!step.result;

  return (
    <div className="relative flex h-full w-full flex-col">
      <ScreenBackdrop />
      <StatusSpacer />
      <TopBar onMenu={onMenu} onNew={onNew} />

      {/* A7 detour banner — pinned below the header while paused */}
      <AnimatePresence>
        {detour && <DetourBanner label={`Paused — risk profile, question ${detour.from} of ${detour.total}`} onResume={() => setDetour(null)} />}
      </AnimatePresence>

      {/* C1 progress rail — drops to 40% opacity on a detour (paused, not lost) */}
      <AnimatePresence>
        {step.progress && (
          <motion.div
            key="rail"
            initial={{ opacity: 0 }}
            animate={{ opacity: detour ? 0.4 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="relative z-10"
          >
            <ProgressRail n={step.progress[0]} total={step.progress[1]} />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={ref} onScroll={onScroll} className="no-scrollbar relative z-10 flex flex-1 flex-col overflow-y-auto">
        <div className="mt-auto flex flex-col gap-[14px] px-[16px] pb-[24px] pt-[14px]">
          {answered.map((p, i) => (
            <div key={i} className="flex flex-col gap-[6px]">
              <QAPair question={p.q} answer={p.a} />
              {p.note && <ParseNote text={p.note} />}
            </div>
          ))}

          {thinking ? (
            <SentinelThinking />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: EASE }}
              className="flex flex-col gap-[12px]"
            >
              {step.callout && <ConstraintCallout eyebrow={step.callout.eyebrow} body={step.callout.body} />}

              {isResult ? (
                <ResultView which={step.result!} />
              ) : (
                <SentinelBlock>
                  <div className="flex flex-col gap-[8px]">
                    {sentinelLines.map((line, i) => (
                      <SentinelText key={i} text={line} weight={i === 0 ? "Medium" : "Regular"} />
                    ))}
                    {step.sub && (
                      <p className="font-['Urbanist:Regular',sans-serif] text-[13px] leading-[18px] text-muted">{step.sub}</p>
                    )}
                  </div>
                  {step.provenance && (
                    <div className="mt-[12px]">
                      <Provenance text={step.provenance} />
                    </div>
                  )}
                </SentinelBlock>
              )}

              {/* bucket 2/4 — rejection held in place, the user's text stays in the composer */}
              {reject && <RejectCallout eyebrow={reject.eyebrow} body={reject.body} chips={reject.chips} onChip={(c) => advance(c, step!.short)} />}

              {/* bucket 3 — detour paused; Sentinel keeps the place and offers the way back */}
              {detour && (
                <SentinelBlock>
                  <SentinelText text="I've kept your place in the profile. Answering side questions is limited in this build — when it is not, I'll answer inline and bring you straight back here." />
                  <div className="mt-[12px]">
                    <AnswerChip label={`‹ Back to question ${detour.from} of ${detour.total}`} variant="primary" onClick={() => setDetour(null)} />
                  </div>
                </SentinelBlock>
              )}
            </motion.div>
          )}
        </div>
        <ScrollToBottomButton show={showButton} onClick={scrollToBottom} />
      </div>

      {/* three-row dock — chips, CTA, composer; the CTA never replaces the composer */}
      {!thinking && (
        <Dock
          chips={
            step.chips && step.chips.length > 0 ? (
              <ChipRow>
                {step.chips.map((chip) => (
                  <AnswerChip key={chip.label} label={chip.label} subtitle={chip.subtitle} variant={chip.variant} onClick={() => onChip(chip)} />
                ))}
              </ChipRow>
            ) : undefined
          }
          cta={isResult ? <DarkButton label={`${step.cta} →`} onClick={() => advance(step.cta!)} /> : undefined}
          composer={
            step.money && !isResult ? (
              <MoneyComposer onSend={(v) => onFree(v, true)} />
            ) : (
              <Composer
                value={text}
                onChange={setText}
                onSend={() => text.trim() && onFree(text.trim(), false)}
                placeholder={isResult ? COMPOSER_PLACEHOLDER.canvas : step.composer ?? COMPOSER_PLACEHOLDER.answer}
              />
            )
          }
        />
      )}

      <HomeIndicator tone={isResult ? "dark" : "bronze"} />

      <AnimatePresence>
        {sheet && <ExplainerSheet open title={sheet.title} body={sheet.body} onClose={() => setSheet(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Done({ onMenu, onNew }: { onMenu: () => void; onNew: () => void }) {
  return (
    <div className="relative flex h-full w-full flex-col">
      <ScreenBackdrop />
      <StatusSpacer />
      <TopBar onMenu={onMenu} onNew={onNew} />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-[10px] px-[32px] text-center">
        <UserBubble text="Approve both moves" />
        <SentinelBlock>
          <SentinelText text="Both moves are queued for Meera's approval. I will let you know the moment she signs off." />
        </SentinelBlock>
      </div>
      <HomeIndicator />
    </div>
  );
}
