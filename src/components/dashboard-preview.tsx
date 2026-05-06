import {
  Activity,
  ArrowUpRight,
  CircleDollarSign,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const kpis = [
  { label: "Net Profit", value: "$184,920", delta: "+24.6%", icon: CircleDollarSign },
  { label: "Orders", value: "12,408", delta: "+8.1%", icon: ShoppingBag },
  { label: "ROAS", value: "4.82×", delta: "+0.34", icon: TrendingUp },
  { label: "MER", value: "3.41", delta: "+0.12", icon: Activity },
];

// Smooth profit curve (SVG path), pre-baked
const PATH = "M0,140 C60,120 100,90 160,80 C220,70 260,110 320,95 C380,80 420,40 480,55 C540,70 580,30 640,20 C700,12 740,40 800,30";

export function DashboardPreview() {
  return (
    <div className="gradient-border shadow-glass relative overflow-hidden rounded-3xl">
      <div className="glass-strong rounded-3xl p-3 sm:p-5">
        {/* Window chrome */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--aurora-cyan)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--aurora-violet)" }} />
          </div>
          <div className="text-[11px] tracking-wider text-muted-foreground">
            pocketdashboard.app / command-center
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-glass px-2.5 py-1 text-[10px] text-accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            LIVE
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3 px-1 sm:grid-cols-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div
                key={k.label}
                className="glass rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {k.label}
                  </span>
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-accent">
                  <ArrowUpRight className="h-3 w-3" />
                  {k.delta}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="glass mt-3 rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Profit, last 30 days</div>
              <div className="text-[11px] text-muted-foreground">After ad spend, COGS, fees</div>
            </div>
            <div className="hidden gap-1 sm:flex">
              {["7D", "30D", "90D", "All"].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-full px-2.5 py-1 text-[10px] ${
                    i === 1
                      ? "bg-glass-strong text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <svg viewBox="0 0 800 180" className="h-40 w-full sm:h-52">
            <defs>
              <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.18 305)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="oklch(0.78 0.18 305)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="profitStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="oklch(0.82 0.16 210)" />
                <stop offset="100%" stopColor="oklch(0.78 0.20 350)" />
              </linearGradient>
            </defs>

            {/* grid */}
            {[40, 80, 120, 160].map((y) => (
              <line
                key={y}
                x1="0"
                x2="800"
                y1={y}
                y2={y}
                stroke="oklch(1 0 0 / 6%)"
                strokeDasharray="3 6"
              />
            ))}

            {/* area */}
            <path d={`${PATH} L800,180 L0,180 Z`} fill="url(#profitFill)" />

            {/* line */}
            <path
              d={PATH}
              fill="none"
              stroke="url(#profitStroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* glowing dot */}
            <circle cx="800" cy="30" r="5" fill="oklch(0.82 0.16 210)" />
            <circle cx="800" cy="30" r="10" fill="oklch(0.82 0.16 210 / 30%)">
              <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* AI insight strip */}
        <div className="glass mt-3 flex items-start gap-3 rounded-2xl p-4">
          <span
            className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full"
            style={{ background: "var(--gradient-button)" }}
          >
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <div className="text-sm">
            <span className="text-muted-foreground">Co-Pilot · </span>
            Your <span className="text-foreground font-medium">"Hydra Serum"</span> SKU is your
            top-margin product this week. Reallocate{" "}
            <span className="text-accent">$1,840</span> of Meta spend from{" "}
            <span className="text-foreground">"Daily Cleanser"</span> for an estimated{" "}
            <span className="text-accent">+$6,210 net profit</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
