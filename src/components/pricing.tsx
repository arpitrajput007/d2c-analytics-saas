import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    cadence: "forever",
    desc: "For founders just getting their numbers in one place.",
    features: ["Daily dashboard", "Up to 1k orders / mo", "1 store connection", "Community support"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$79",
    cadence: "/ month",
    desc: "Everything growing D2C teams need — including the Co-Pilot.",
    features: [
      "Unlimited orders",
      "Gemini Co-Pilot",
      "Cohorts, SKU economics",
      "Weekly investor reports",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "annual",
    desc: "Multi-brand groups and 8-figure operators.",
    features: ["Multi-store consolidation", "SSO + audit logs", "Dedicated CSM", "Custom integrations"],
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-glass-border bg-glass px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            Pricing
          </div>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple, <span className="text-gradient">profit-aligned</span> pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when your dashboard makes you money.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`gradient-border relative rounded-3xl ${
                t.highlight ? "shadow-glow" : ""
              }`}
            >
              <div
                className={`relative h-full rounded-3xl p-7 ${
                  t.highlight ? "glass-strong" : "glass"
                }`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground"
                    style={{ background: "var(--gradient-button)" }}
                  >
                    <Sparkles className="h-3 w-3" /> Most loved
                  </span>
                )}
                <div className="text-sm text-muted-foreground">{t.name}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-semibold tracking-tight">{t.price}</span>
                  <span className="text-sm text-muted-foreground">{t.cadence}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>

                <a
                  href="#cta"
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium ${
                    t.highlight
                      ? "btn-aurora"
                      : "border border-glass-border bg-glass text-foreground hover:bg-glass-strong"
                  }`}
                >
                  {t.highlight ? "Start 14-day trial" : "Choose plan"}
                </a>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
