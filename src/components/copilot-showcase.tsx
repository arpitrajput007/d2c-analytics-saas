import { Brain, Database, Lock, Sparkles, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* ─── Conversation turns that cycle through ─── */
const conversations = [
  {
    question: "Which product is actually making me profit this week?",
    answer: "Hydra Serum has the highest net margin at 38% with ₹4.2L revenue. Daily Cleanser is losing ₹12 per order after shipping and RTO. Recommend pausing ad spend on Daily Cleanser and shifting ₹1,840 to Hydra Serum campaigns.",
  },
  {
    question: "Why did my RTO spike this week?",
    answer: "RTO increased 19% driven by 6 Tier-3 PIN code clusters. 91% of flagged orders are COD-only. Switching these regions to prepaid-only could save approximately ₹48,200 per month based on your current volume.",
  },
  {
    question: "Show me my real profit after all costs",
    answer: "After deducting ad spend (₹1.54L), shipping (₹42K), RTO losses (₹18K), and COD handling: your true net profit this month is ₹4.38L on ₹18.4L revenue. That's a 23.8% net margin, up from 21.2% last month.",
  },
  {
    question: "What should I double down on this month?",
    answer: "Three clear actions: 1) Scale Hydra Serum — 38% margins with room to grow. 2) Enable prepaid incentives in Tier-3 — your data shows ₹50 discount converts 14% more orders. 3) Pause Daily Cleanser ads — negative ROI for 12 consecutive days.",
  },
  {
    question: "How is my COD vs prepaid ratio trending?",
    answer: "Prepaid share improved from 31% to 38% over the last 30 days. The ₹50 prepaid incentive you enabled on March 12 is the primary driver. Each prepaid order saves ₹67 in net margin compared to COD. At current volume, that's ₹2.1L extra monthly profit.",
  },
];

/* ─── Typing simulation hook ─── */
function useTypingSimulation() {
  const [convIndex, setConvIndex] = useState(0);
  const [phase, setPhase] = useState<"typing-q" | "sent-q" | "thinking" | "typing-a" | "done">("typing-q");
  const [displayedQ, setDisplayedQ] = useState("");
  const [displayedA, setDisplayedA] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const conv = conversations[convIndex];

  useEffect(() => {
    // Clean up on unmount
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (phase === "typing-q") {
      const q = conv.question;
      if (displayedQ.length < q.length) {
        timerRef.current = setTimeout(() => {
          setDisplayedQ(q.slice(0, displayedQ.length + 1));
        }, 35 + Math.random() * 25);
      } else {
        timerRef.current = setTimeout(() => setPhase("sent-q"), 400);
      }
    } else if (phase === "sent-q") {
      timerRef.current = setTimeout(() => setPhase("thinking"), 200);
    } else if (phase === "thinking") {
      timerRef.current = setTimeout(() => setPhase("typing-a"), 1200);
    } else if (phase === "typing-a") {
      const a = conv.answer;
      if (displayedA.length < a.length) {
        const chunkSize = Math.floor(Math.random() * 3) + 2;
        timerRef.current = setTimeout(() => {
          setDisplayedA(a.slice(0, displayedA.length + chunkSize));
        }, 18 + Math.random() * 12);
      } else {
        timerRef.current = setTimeout(() => setPhase("done"), 3000);
      }
    } else if (phase === "done") {
      // Move to next conversation
      setConvIndex((prev) => (prev + 1) % conversations.length);
      setDisplayedQ("");
      setDisplayedA("");
      setPhase("typing-q");
    }
  }, [phase, displayedQ, displayedA, conv]);

  return { phase, displayedQ, displayedA, fullQuestion: conv.question };
}

export function CopilotShowcase() {
  const { phase, displayedQ, displayedA, fullQuestion } = useTypingSimulation();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [displayedA, phase]);

  return (
    <section id="copilot" className="relative pt-12 sm:pt-16 pb-24 sm:pb-32 overflow-hidden">
      {/* Subtle ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 65% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* ── LEFT — Clean positioning ── */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
              <Brain className="h-3 w-3 text-accent" />
              AI Co-Pilot
            </div>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-[44px] sm:leading-[1.1]">
              Your own AI that learns{" "}
              <span className="text-gradient">from your store.</span>
            </h2>

            <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed max-w-md">
              Pocket Dashboard's Co-Pilot is trained on your own business data. It studies your orders, margins, ad performance, and fulfilment patterns to give you insights no generic tool can.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Database,
                  title: "Built from your data",
                  sub: "Every answer comes from your own orders, products, and ad accounts. Not a generic model.",
                },
                {
                  icon: Sparkles,
                  title: "Gets smarter over time",
                  sub: "The longer you use it, the better it understands your brand's patterns and seasonality.",
                },
                {
                  icon: Lock,
                  title: "Private and secure",
                  sub: "Your data is never shared or used to train public models. Fully private intelligence.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: "rgba(129,140,248,0.9)" }} />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT — Premium live chat window ── */}
          <div>
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                borderColor: "rgba(99,102,241,0.2)",
                background: "rgba(8,8,20,0.9)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 32px 80px -20px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.08)",
              }}
            >
              {/* Chat header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-xl"
                    style={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)" }}
                  >
                    <Brain className="h-4 w-4 text-white" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Pocket Co-Pilot</div>
                    <div className="text-[10px] text-muted-foreground">Trained on your store data</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </div>
              </div>

              {/* Chat body */}
              <div
                className="px-5 py-5 space-y-4 overflow-y-auto"
                ref={chatContainerRef}
                style={{ height: "380px" }}
              >
                {/* User question bubble */}
                {(phase !== "typing-q" || displayedQ.length > 0) && (
                  <div className="flex justify-end" style={{ animation: "fadeUp 0.3s ease both" }}>
                    <div
                      className="rounded-2xl rounded-tr-md px-4 py-2.5 text-sm text-foreground max-w-[85%]"
                      style={{
                        background: "rgba(99,102,241,0.15)",
                        border: "1px solid rgba(99,102,241,0.25)",
                      }}
                    >
                      {phase === "typing-q" ? (
                        <>
                          {displayedQ}
                          <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 align-text-bottom" style={{ animation: "blink 0.8s step-end infinite" }} />
                        </>
                      ) : (
                        fullQuestion
                      )}
                    </div>
                  </div>
                )}

                {/* AI thinking dots */}
                {phase === "thinking" && (
                  <div className="flex justify-start" style={{ animation: "fadeUp 0.2s ease both" }}>
                    <div
                      className="rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                          style={{ animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* AI answer bubble */}
                {(phase === "typing-a" || phase === "done") && (
                  <div className="flex justify-start" style={{ animation: "fadeUp 0.3s ease both" }}>
                    <div
                      className="rounded-2xl rounded-tl-md px-4 py-3 text-sm max-w-[90%]"
                      style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(34,211,238,0.05))",
                        border: "1px solid rgba(99,102,241,0.15)",
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="h-3 w-3" style={{ color: "rgba(129,140,248,0.8)" }} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(129,140,248,0.7)" }}>Co-Pilot</span>
                      </div>
                      <div className="text-[13px] text-muted-foreground leading-relaxed">
                        {displayedA}
                        {phase === "typing-a" && (
                          <span className="inline-block w-0.5 h-3.5 bg-indigo-400 ml-0.5 align-text-bottom" style={{ animation: "blink 0.8s step-end infinite" }} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat input bar */}
              <div
                className="border-t px-4 py-3"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
              >
                <div
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {phase === "typing-q" ? (
                    <span className="flex-1 text-sm text-foreground/80">
                      {displayedQ}
                      <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 align-text-bottom" style={{ animation: "blink 0.8s step-end infinite" }} />
                    </span>
                  ) : (
                    <span className="flex-1 text-sm text-muted-foreground/50">Ask anything about your business…</span>
                  )}
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                    style={{
                      background: phase === "typing-q" ? "linear-gradient(135deg, #6366f1, #22d3ee)" : "rgba(255,255,255,0.06)",
                      transition: "background 0.3s ease",
                    }}
                  >
                    <Send className="h-3.5 w-3.5 text-white" />
                  </span>
                </div>
              </div>
            </div>

            {/* Trust line below */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Lock className="h-2.5 w-2.5" />
                Private to your store
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Never trains public models</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Read-only access</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
