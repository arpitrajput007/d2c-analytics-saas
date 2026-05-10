import { Send, Sparkles } from "lucide-react";

const turns = [
  { from: "you", text: "Which product is actually making me profit this week?" },
  {
    from: "ai",
    text: "Your 'Hydra Serum' SKU has the highest net margin at 38%. 'Daily Cleanser' is currently losing ₹12 per order after shipping and RTO costs. Want a detailed breakdown?",
  },
  { from: "you", text: "Show me my RTO trend for this month vs last month." },
];

export function CopilotShowcase() {
  return (
    <section id="copilot" className="relative pt-12 sm:pt-16 pb-24 sm:pb-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent" />
            Smart Insights
          </div>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Ask your business{" "}
            <span className="text-gradient">anything, instantly.</span>
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Get simple, actionable answers from your own data. No complex dashboards, no manual
            digging. Identify what needs attention before it becomes a problem.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Ask in plain language, get clear answers",
              "Instant profit, loss and RTO breakdowns",
              "Weekly summaries sent automatically",
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
              <div className="text-sm font-medium">Business Insight</div>
              <span className="ml-auto text-[11px] text-muted-foreground">
                Connected · Shopify, Shiprocket
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
                <span className="ml-2 text-[11px]">Analyzing…</span>
              </div>
            </div>

            {/* Input */}
            <div className="glass mt-5 flex items-center gap-2 rounded-full px-4 py-2.5">
              <input
                disabled
                placeholder="Ask anything about your business…"
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
