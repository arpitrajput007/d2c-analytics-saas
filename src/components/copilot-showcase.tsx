import { Brain, Database, Lock, ShieldCheck, Sparkles, TrendingDown, TrendingUp, TriangleAlert, Zap } from "lucide-react";

/* ─── Insight cards shown in the intelligence console ─── */
const insights = [
  {
    type: "warning",
    icon: TrendingDown,
    title: "Margin compression detected",
    body: "Hydra Serum net margin dropped 8% over 12 days. Shipping cost surge in South India is the primary driver.",
    tag: "SKU · Hydra Serum",
    time: "2 hrs ago",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.18)",
  },
  {
    type: "risk",
    icon: TriangleAlert,
    title: "RTO spike in Tier-3 cities",
    body: "RTO rate up 19% over the last 10 days in 6 PIN code clusters. COD-only orders are the common pattern.",
    tag: "Fulfilment · RTO",
    time: "6 hrs ago",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.18)",
  },
  {
    type: "win",
    icon: TrendingUp,
    title: "Prepaid conversion improved",
    body: "COD-to-prepaid shift up 14% since you enabled the ₹50 prepaid incentive. Net margin per order improved by ₹67.",
    tag: "Payments · Prepaid",
    time: "Yesterday",
    color: "#10b981",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.18)",
  },
  {
    type: "intel",
    icon: Sparkles,
    title: "3 SKUs drive 71% of total profit",
    body: "Hydra Serum, Night Repair Cream, and Vitamin C Serum are your profit engine. The other 9 SKUs are margin-neutral.",
    tag: "Products · Profitability",
    time: "Weekly summary",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.06)",
    border: "rgba(129,140,248,0.18)",
  },
];

/* ─── Data source pills ─── */
const dataSources = [
  "Live Orders",
  "Ad Spend",
  "Fulfilment",
  "RTO Patterns",
  "SKU Margins",
  "COD Behaviour",
  "Customer Trends",
];

export function CopilotShowcase() {
  return (
    <section id="copilot" className="relative pt-12 sm:pt-16 pb-24 sm:pb-32 overflow-hidden">

      {/* Subtle ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 60% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4">

        {/* ── Section header ── */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Brain className="h-3 w-3 text-accent" />
            Operational Intelligence
          </div>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Not generic AI.{" "}
            <span className="text-gradient">Your business intelligence layer.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Built from your own operational data. The longer you use Pocket Dashboard, the deeper it understands your brand — and the more precise its guidance becomes.
          </p>
        </div>

        {/* ── Main grid ── */}
        <div className="grid items-start gap-12 lg:grid-cols-2">

          {/* LEFT — Positioning copy */}
          <div className="flex flex-col gap-8">

            {/* Core positioning statement */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(34,211,238,0.04) 100%)",
                borderColor: "rgba(99,102,241,0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)" }}
                >
                  <Database className="h-4 w-4 text-white" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">Built from your own data</div>
                  <div className="text-xs text-muted-foreground">Private operational intelligence</div>
                </div>
                <span
                  className="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every insight is generated from your store's own orders, shipping data, ad spend, and product performance. The system learns your patterns and surfaces what matters — before you think to ask.
              </p>

              {/* Data source pills */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {dataSources.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border px-2.5 py-1 text-[10px] font-mono tracking-wide"
                    style={{ borderColor: "rgba(99,102,241,0.2)", color: "rgba(129,140,248,0.8)", background: "rgba(99,102,241,0.06)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Intelligence properties */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Brain,       label: "Operational memory",       sub: "Remembers your business patterns over time"     },
                { icon: Zap,         label: "Continuously learning",    sub: "Gets smarter as your data grows"                },
                { icon: TrendingUp,  label: "Context-aware guidance",   sub: "Recommendations tuned to your specific brand"   },
                { icon: ShieldCheck, label: "Founder-level clarity",    sub: "Answers structured for decisions, not reports"  },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border p-4"
                    style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
                  >
                    <Icon className="h-4 w-4 text-accent mb-2" />
                    <div className="text-xs font-semibold text-foreground mb-0.5">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground leading-snug">{item.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Trust signals */}
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Privacy guarantee</span>
              </div>
              <div className="space-y-2">
                {[
                  "Your data is never used to train public AI models",
                  "Read-only integrations. Your store is never touched",
                  "Insights are generated exclusively from your own business data",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT — Intelligence console */}
          <div>
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                borderColor: "rgba(99,102,241,0.2)",
                background: "rgba(8,8,20,0.85)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 32px 80px -20px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.1)",
              }}
            >
              {/* Console header */}
              <div
                className="flex items-center justify-between px-5 py-3 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)" }}
                  >
                    <Brain className="h-3.5 w-3.5 text-white" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Intelligence Console</div>
                    <div className="text-[10px] text-muted-foreground">Pocket Dashboard · Co-Pilot</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Analyzing live data
                </div>
              </div>

              {/* Insight feed */}
              <div className="p-4 space-y-3 max-h-[480px] overflow-hidden">
                {insights.map((ins, i) => {
                  const Icon = ins.icon;
                  return (
                    <div
                      key={i}
                      className="rounded-xl border p-4 transition-all duration-300"
                      style={{
                        background: ins.bg,
                        borderColor: ins.border,
                        animation: `fadeSlideIn 0.4s ease ${i * 0.1}s both`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: ins.color }} />
                          <span className="text-xs font-semibold text-foreground">{ins.title}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-mono">{ins.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{ins.body}</p>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-mono tracking-wider font-semibold"
                        style={{ background: `${ins.color}15`, color: ins.color }}
                      >
                        {ins.tag}
                      </span>
                    </div>
                  );
                })}

                {/* Processing indicator */}
                <div
                  className="flex items-center gap-3 rounded-xl border px-4 py-3"
                  style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                        style={{ animation: `dotBounce 1.4s ease-in-out ${i * 0.2}s infinite` }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Scanning today's order patterns…
                  </span>
                  <span className="ml-auto text-[10px] font-mono" style={{ color: "rgba(99,102,241,0.7)" }}>
                    Co-Pilot
                  </span>
                </div>
              </div>

              {/* Console footer — memory indicator */}
              <div
                className="border-t px-5 py-3 flex items-center justify-between"
                style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}
              >
                <div className="text-[10px] text-muted-foreground font-mono">
                  Business memory · <span style={{ color: "rgba(129,140,248,0.8)" }}>127 days of data ingested</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  Accuracy improves over time
                </div>
              </div>
            </div>

            {/* Moat statement — below console */}
            <p className="mt-5 text-center text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              The longer your store runs on Pocket Dashboard, the more it understands your business. Operational intelligence that compounds.
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </section>
  );
}
