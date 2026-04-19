import { AlertTriangle, BarChart3, Brain, Clock, ShieldAlert, TrendingDown } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    label: "Complete Business Visibility",
    desc: "Orders, revenue, profit — all in one dashboard. Daily, weekly, monthly views with no more switching between tools.",
    points: ["Orders & revenue in one place", "Daily, weekly, monthly views", "No more switching between tools"],
  },
  {
    icon: TrendingDown,
    label: "Profit Tracking That Actually Matters",
    desc: "See your real profit after ads, shipping, and COD losses. Know which products make or lose money.",
    points: ["Real profit after all costs", "SKU-level profitability", "Know what makes vs. loses money"],
  },
  {
    icon: ShieldAlert,
    label: "Loss & Risk Identification",
    desc: "Spot high-risk orders — COD, unreachable, failed deliveries. Track RTO trends and identify where losses are coming from.",
    points: ["High-risk order detection", "RTO trend tracking", "Loss source identification"],
  },
  {
    icon: Brain,
    label: "Smart Insights (AI-Assisted)",
    desc: "Get simple, actionable suggestions. Highlights unusual trends or issues so you know what needs attention today.",
    points: ["Actionable suggestions", "Unusual trend detection", "Daily attention list"],
  },
  {
    icon: AlertTriangle,
    label: "Clarity Leads to Better Decisions",
    desc: "Spend more on what works. Cut losses early. Improve cash flow. Scale only when the numbers make sense.",
    points: ["Double down on what's working", "Cut losses early", "Scale with confidence"],
  },
  {
    icon: Clock,
    label: "Save Hours Every Day",
    desc: "No more manual tracking. No spreadsheets. No jumping between tools. Your entire business in one place.",
    points: ["Zero manual data entry", "No spreadsheets needed", "Everything in one place"],
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-glass-border bg-glass px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            Features
          </div>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            One dashboard to run{" "}
            <span className="text-gradient">your entire business.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Bring all your data into one place and understand exactly what's happening — in real time.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="gradient-border rounded-2xl">
                <div className="glass h-full rounded-2xl p-6">
                  <div
                    className="mb-4 grid h-10 w-10 place-items-center rounded-xl"
                    style={{ background: "var(--gradient-button)" }}
                  >
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="text-[15px] font-medium">{f.label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                          className="h-1 w-1 shrink-0 rounded-full"
                          style={{ background: "var(--gradient-button)" }}
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
      </div>
    </section>
  );
}
