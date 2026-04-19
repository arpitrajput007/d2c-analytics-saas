import { Send, Sparkles } from "lucide-react";

const turns = [
  { from: "you", text: "Which SKU drove the most profit last week, and why?" },
  {
    from: "ai",
    text:
      "Hydra Serum — $42.1k net (+38% WoW). Driver: a 0.6× drop in Meta CPM combined with a 12% bundle attach rate. Want me to scale spend by 25%?",
  },
  { from: "you", text: "Show me CAC by channel for new customers this month." },
];

export function CopilotShowcase() {
  return (
    <section id="copilot" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent" />
            AI Co-Pilot
          </div>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Talk to your business{" "}
            <span className="text-gradient">like it's 2050.</span>
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Ask anything — from "what's my blended ROAS?" to "draft my investor update." The
            Co-Pilot reads every signal in your store and answers with charts, numbers, and
            actions you can ship in one click.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Natural-language queries against your live data",
              "One-click budget reallocations to Meta & Google",
              "Auto-generated weekly LP-ready reports",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: "var(--gradient-button)" }}
                />
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="gradient-border shadow-glass rounded-3xl">
          <div className="glass-strong rounded-3xl p-5">
            <div className="mb-4 flex items-center gap-2">
              <span
                className="grid h-8 w-8 place-items-center rounded-full"
                style={{ background: "var(--gradient-button)" }}
              >
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <div className="text-sm font-medium">Co-Pilot</div>
              <span className="ml-auto text-[11px] text-muted-foreground">
                Connected · Shopify, Meta, Google
              </span>
            </div>

            <div className="space-y-3">
              {turns.map((t, i) => (
                <div
                  key={i}
                  className={`flex ${t.from === "you" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      t.from === "you"
                        ? "bg-glass-strong text-foreground"
                        : "text-foreground"
                    }`}
                    style={
                      t.from === "ai"
                        ? {
                            background:
                              "linear-gradient(135deg, oklch(0.78 0.18 305 / 18%), oklch(0.82 0.16 210 / 14%))",
                            border: "1px solid var(--glass-border)",
                          }
                        : undefined
                    }
                  >
                    {t.text}
                  </div>
                </div>
              ))}

              {/* typing */}
              <div className="flex items-center gap-1.5 pl-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent" />
                <span
                  className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent"
                  style={{ animationDelay: "300ms" }}
                />
                <span className="ml-2 text-[11px]">Thinking…</span>
              </div>
            </div>

            {/* Input */}
            <div className="glass mt-5 flex items-center gap-2 rounded-full px-4 py-2.5">
              <input
                disabled
                placeholder="Ask anything about your store…"
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                className="btn-aurora grid h-8 w-8 place-items-center rounded-full"
                aria-label="Send"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
