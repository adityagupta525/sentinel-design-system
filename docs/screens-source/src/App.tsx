import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useState } from "react";
import { EASE, PhoneFrame } from "@/lib/ui";
import { Home } from "@/screens/Home";
import { Chat } from "@/screens/Chat";
import { Portfolio } from "@/screens/Portfolio";
import { Proposal } from "@/screens/Proposal";
import { FundExplorer } from "@/screens/FundExplorer";
import { Drawer } from "@/screens/Drawer";
import { Journey } from "@/screens/Journey";
import { JOURNEY } from "@/journeys";
import type { EntryTarget } from "@/journeys";
import { route } from "@/lib/router";

/* portfolio, proposal and funds are artifact canvases in a layer above the
   thread; only the true conversation surfaces are in the Screen union. */
type Screen = "home" | "chat" | "journey";
type Canvas = "portfolio" | "proposal" | "funds";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [seed, setSeed] = useState("");
  const [journey, setJourney] = useState<{ index: number; seed: string }>({ index: JOURNEY.risk, seed: "" });
  const [drawer, setDrawer] = useState(false);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [dir, setDir] = useState(1);

  function go(next: Screen, direction = 1) {
    setDir(direction);
    setScreen(next);
  }

  function openJourney(index: number, journeySeed: string) {
    setJourney({ index, seed: journeySeed });
    go("journey");
  }

  function openChat(text: string) {
    setSeed(text);
    go("chat", 1);
  }

  /* v4 Part 3 — typed input from Home. A journey keyword opens the built
     journey directly; everything else lands in the thread, which routes it. */
  function openText(text: string) {
    const r = route(text, { mode: "free" });
    if (r.kind === "journey") return openJourney(JOURNEY[r.journey], r.seed);
    openChat(text);
  }

  /* v4 Part 2.2 / 2.3 — a "Jump back in" or drawer door resolves its target. */
  function openEntry(target: EntryTarget, entrySeed: string) {
    setDrawer(false);
    if (target.kind === "journey") return openJourney(target.index, target.seed);
    openChat(entrySeed); // drift / scope — the thread gives the reply
  }

  /* v4 Part 2.4 — a quick-action chip is a conversational turn, never a jump
     straight to a canvas. The label posts to the thread and Sentinel replies. */
  function handleChip(label: string) {
    openChat(label);
  }

  function newChat() {
    setDrawer(false);
    setCanvas(null);
    go("home", -1);
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-30%", opacity: 0.6 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-30%" : "100%", opacity: 0.6 }),
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <PhoneFrame>
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={screen}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: EASE }}
                className="absolute inset-0"
              >
                {screen === "home" && (
                  <Home onMenu={() => setDrawer(true)} onSubmit={openText} onChip={handleChip} onEntry={openEntry} />
                )}
                {screen === "chat" && (
                  <Chat
                    seed={seed}
                    onMenu={() => setDrawer(true)}
                    onNew={newChat}
                    onOpenJourney={openJourney}
                    onOpenCanvas={(c) => setCanvas(c)}
                  />
                )}
                {screen === "journey" && (
                  <Journey startIndex={journey.index} seed={journey.seed} onMenu={() => setDrawer(true)} onNew={newChat} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* the artifact-canvas layer, above the thread */}
            <AnimatePresence>
              {canvas && (
                <motion.div
                  key={canvas}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.38, ease: EASE }}
                  className="absolute inset-0 z-20"
                  style={{ transformOrigin: "center 40%" }}
                >
                  {canvas === "portfolio" && (
                    <Portfolio onMenu={() => setDrawer(true)} onBack={() => setCanvas(null)} onProposal={() => setCanvas("proposal")} />
                  )}
                  {canvas === "proposal" && (
                    <Proposal onMenu={() => setDrawer(true)} onBack={() => setCanvas(null)} />
                  )}
                  {canvas === "funds" && (
                    <FundExplorer onMenu={() => setDrawer(true)} onBack={() => setCanvas(null)} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <Drawer
              open={drawer}
              onClose={() => setDrawer(false)}
              onNew={newChat}
              onEntry={openEntry}
              onPortfolio={() => {
                setDrawer(false);
                setCanvas("portfolio");
              }}
            />
          </div>
        </PhoneFrame>
      </div>
    </MotionConfig>
  );
}
