import { AlertTriangle, BarChart3, Brain, Clock, Link2, ShieldAlert, TrendingDown, Zap } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    label: "Complete Business Visibility",
    desc: "Every order, every rupee, every trend — tracked automatically. Daily, weekly, and monthly views in one unified dashboard.",
    points: ["Orders and revenue in one place", "Daily, weekly, monthly breakdowns", "Zero manual data entry"],
    accent: "oklch(0.78 0.18 210)",
  },
  {
    icon: TrendingDown,
    label: "True Profit After Every Cost",
    desc: "See what you actually made after ads, shipping, COD returns, and fulfilment. Not revenue. Real profit.",
    points: ["Ad spend deducted automatically", "SKU-level profit and loss", "COD vs prepaid margin split"],
    accent: "oklch(0.78 0.18 305)",
  },
  {
    icon: ShieldAlert,
    label: "Loss and Risk Detection",
    desc: "Catch high-risk orders before they drain your margins. COD non-confirmations, RTO surges, and failed deliveries flagged in real time.",
    points: ["High-risk order detection", "RTO trend tracking", "Loss source identification"],
    accent: "oklch(0.78 0.18 25)",
  },
  {
    icon: Brain,
    label: "AI Co-Pilot for Smarter Decisions",
    desc: "Ask anything about your business in plain language. Get clear answers on what to fix, cut, or double down on today.",
    points: ["Plain-language business queries", "Unusual trend detection", "Daily priority attention list"],
    accent: "oklch(0.78 0.18 280)",
  },
  {
    icon: AlertTriangle,
    label: "ROAS, MER and Ad Efficiency",
    desc: "Know exactly what your ad spend is returning. Track ROAS and MER by day, week, or month and spend only where it works.",
    points: ["ROAS and MER tracking", "Channel-level ad breakdown", "Scale with data, not guesswork"],
    accent: "oklch(0.78 0.18 60)",
  },
  {
    icon: Clock,
    label: "Save Hours Every Single Day",
    desc: "No spreadsheets. No copy-pasting from five tabs. Your entire business updates automatically the moment an order moves.",
    points: ["Live Shopify and Shiprocket sync", "No spreadsheets needed", "Everything in one place"],
    accent: "oklch(0.78 0.18 150)",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">

        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-glass-border bg-glass px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            Features
          </div>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            One dashboard to run{" "}
            <span className="text-gradient">your entire business.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Connect your store and ad accounts in one click. See every number that matters, live.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="gradient-border rounded-2xl feature-card-hover"
                style={{ "--card-accent": f.accent } as React.CSSProperties}
              >
                <div className="glass h-full rounded-2xl p-6 transition-all duration-300">
                  <div
                    className="mb-4 grid h-10 w-10 place-items-center rounded-xl"
                    style={{ background: "var(--gradient-button)" }}
                  >
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="text-[15px] font-semibold text-foreground">{f.label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: f.accent }}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* One-click connect strip — below cards */}
        <div
          className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-5 rounded-2xl border px-8 py-8"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(34,211,238,0.05) 100%)",
            borderColor: "rgba(99,102,241,0.18)",
            boxShadow: "0 0 40px -16px rgba(99,102,241,0.35)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)" }}
            >
              <Zap className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-semibold text-foreground">One-click connect</span>
          </div>
          <p className="text-center text-sm text-muted-foreground max-w-lg">
            Link your Shopify store and Meta Ads account in seconds. Your numbers go live instantly. No setup, no CSV exports, no waiting.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { name: "Shopify",      live: true  },
              { name: "Meta Ads",     live: true  },
              { name: "Google Ads",   live: false },
              { name: "Shiprocket",   live: false },
              { name: "WooCommerce",  live: false },
            ].map((s) => (
              <span
                key={s.name}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-mono tracking-wide"
                style={{
                  borderColor: s.live ? "rgba(34,211,238,0.35)" : "rgba(255,255,255,0.08)",
                  background:  s.live ? "rgba(34,211,238,0.07)"  : "rgba(255,255,255,0.03)",
                  color:       s.live ? "rgba(34,211,238,0.9)"   : "rgba(255,255,255,0.35)",
                }}
              >
                <Link2 className="h-2.5 w-2.5" />
                {s.name}
                {!s.live && (
                  <span
                    className="ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}
                  >
                    Soon
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Hover animation styles */}
      <style>{`
        .feature-card-hover {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          cursor: default;
        }
        .feature-card-hover:hover {
          transform: translateY(-6px) scale(1.025);
          box-shadow:
            0 20px 60px -12px color-mix(in oklch, var(--card-accent) 40%, transparent),
            0 0 0 1px color-mix(in oklch, var(--card-accent) 35%, transparent);
          z-index: 2;
          position: relative;
        }
        .feature-card-hover:hover .glass {
          background: color-mix(in oklch, var(--card-accent) 6%, rgba(255,255,255,0.04));
        }
      `}</style>
    </section>
  );
}
