import {
  Boxes,
  Brain,
  CalendarRange,
  LineChart,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: LineChart,
    title: "Command Center",
    desc: "Live profit, ROAS, MER and CAC across every channel — recomputed every 60 seconds.",
  },
  {
    icon: Brain,
    title: "Gemini Co-Pilot",
    desc: "Ask anything in plain English. Get charts, cohorts, and budget reallocations in return.",
  },
  {
    icon: Boxes,
    title: "SKU-level economics",
    desc: "True per-product margin after fees, shipping, returns and ad spend attribution.",
  },
  {
    icon: CalendarRange,
    title: "Daily · Weekly · Monthly",
    desc: "Beautifully scoped reports with cohort retention and rolling growth deltas.",
  },
  {
    icon: Zap,
    title: "Shopify, Meta, Google",
    desc: "One-click syncs. We normalize, dedupe and reconcile so your numbers actually match.",
  },
  {
    icon: ShieldCheck,
    title: "Owner-grade security",
    desc: "SOC 2 Type II, row-level isolation, and read-only API scopes by default.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-glass-border bg-glass px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            Platform
          </div>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Every number you actually <span className="text-gradient">care about</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Stop stitching spreadsheets at 1am. Profit Control is the calm, unified layer your
            finance and growth teams have been waiting for.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="gradient-border group relative overflow-hidden rounded-2xl"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="glass relative h-full rounded-2xl p-6 transition-transform duration-300 group-hover:-translate-y-1">
                  {/* hover glow */}
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(400px circle at 50% 0%, oklch(0.78 0.18 305 / 18%), transparent 60%)",
                    }}
                  />
                  <span
                    className="relative grid h-11 w-11 place-items-center rounded-xl"
                    style={{ background: "var(--gradient-button)" }}
                  >
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </span>
                  <h3 className="relative mt-5 text-lg font-medium">{f.title}</h3>
                  <p className="relative mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
