import { Check, ShieldCheck, Zap } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "₹999",
    cadence: "/ month",
    desc: "For new founders who want clarity without manual work",
    features: [
      "1 store connection",
      "Daily business dashboard",
      "Order tracking (COD + prepaid)",
      "Basic profit tracking",
      "Limited data history (30 days)",
      "Email support"
    ],
    highlight: false,
    cta: "Start 14-day free trial"
  },
  {
    name: "Pro",
    price: "₹1,499",
    cadence: "/ month",
    desc: "For brands serious about controlling profit and reducing losses",
    features: [
      "Everything in Starter +",
      "Complete business analytics (no limits)",
      "SKU-level profit tracking",
      "Ad spend vs profit visibility",
      "Loss identification (RTO, failed delivery)",
      "AI-powered insights",
      "Weekly performance summaries",
      "Priority support"
    ],
    highlight: true,
    badge: "Most popular among growing D2C brands",
    cta: "Start 14-day free trial"
  },
  {
    name: "Custom",
    price: "Custom",
    cadence: "",
    desc: "For multi-store and custom requirements",
    features: [
      "Custom dashboard creation",
      "Multi-store dashboards",
      "Custom reporting",
      "API integrations",
      "Dedicated account manager",
      "Workflow automation support"
    ],
    highlight: false,
    cta: "Request Demo"
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
            Simple, <span className="text-gradient">profit-focused</span> pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Upgrade when you're ready to take control.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`gradient-border relative rounded-3xl pricing-card ${
                t.highlight ? "shadow-glow pro-highlight" : "opacity-90 hover:opacity-100"
              }`}
            >
              <div
                className={`relative flex h-full flex-col justify-between rounded-3xl p-7 ${
                  t.highlight ? "glass-strong" : "glass"
                }`}
              >
                <div>
                  {t.highlight && (
                    <span className="absolute -top-3 left-1/2 inline-flex w-max -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground"
                      style={{ background: "var(--gradient-button)" }}
                    >
                      <Zap className="h-3 w-3" fill="currentColor" /> {t.badge}
                    </span>
                  )}
                  <div className="text-lg font-medium text-foreground">{t.name}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight">{t.price}</span>
                    {t.cadence && <span className="text-sm text-muted-foreground">{t.cadence}</span>}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>

                  <a
                    href="#cta"
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-medium ${
                      t.highlight
                        ? "btn-aurora"
                        : "border border-glass-border bg-glass text-foreground hover:bg-glass-strong"
                    }`}
                  >
                    {t.cta}
                  </a>

                  <ul className="mt-8 space-y-3 text-sm">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-muted-foreground text-[13px] leading-tight">
                        <Check className="h-4 w-4 shrink-0 text-accent" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-4xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Works with Shopify, WooCommerce, COD businesses
            </span>
            <span className="hidden sm:inline-block opacity-30">·</span>
            <span className="flex items-center gap-2">
               Setup in under 10 minutes
            </span>
            <span className="hidden sm:inline-block opacity-30">·</span>
            <span className="flex items-center gap-2">
               Cancel anytime
            </span>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              Stop guessing your numbers. Start running your business with clarity.
            </h3>
          </div>
        </div>
      </div>

      <style>{`
        .pricing-card {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: scale(1);
        }
        .pricing-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px -10px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.15);
          z-index: 10;
        }
        .pricing-card.pro-highlight {
          transform: scale(1.05);
          z-index: 5;
          box-shadow: 0 10px 30px -10px rgba(99,102,241,0.3);
        }
        .pricing-card.pro-highlight:hover {
          transform: translateY(-8px) scale(1.07);
          box-shadow: 0 25px 50px -12px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.3);
          z-index: 10;
        }
      `}</style>
    </section>
  );
}
