import React, { useEffect, useState, useRef } from "react";
import { ArrowUpRight, TrendingUp, Sparkles, ShoppingBag, Zap, AlertTriangle } from "lucide-react";
import useLiveCounter from "../useLiveCounter";

/* ------------------------------------------------------------------ *
 *  Data                                                              *
 * ------------------------------------------------------------------ */
const DATASETS = {
  today: {
    dateLabel: "Tuesday, March 31, 2026",
    range: "Today",
    deltaLabel: "vs yesterday",
    series: [38, 44, 41, 52, 58, 54, 67, 72, 68, 79, 86, 82, 94, 102, 98],
    series2: [22, 26, 24, 32, 36, 34, 42, 46, 44, 50, 54, 52, 60, 64, 62],
    xLabels: ["10a", "12p", "2p", "4p", "6p", "8p", "now"],
    seeds: {
      orders: 44, revenue: 61062, adSpend: 22270, net: 15077,
      roas: 2.74, mer: 1.91, rto: 5, delivered: 31,
      aovPrepaid: 1284, aovCash: 1120,
    },
  },
  week: {
    dateLabel: "Mar 25 — Mar 31, 2026",
    range: "This Week",
    deltaLabel: "vs last week",
    series: [210, 245, 218, 268, 292, 276, 312],
    series2: [122, 138, 130, 152, 164, 156, 178],
    xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    seeds: {
      orders: 318, revenue: 428910, adSpend: 154200, net: 108420,
      roas: 2.78, mer: 1.94, rto: 26, delivered: 241,
      aovPrepaid: 1342, aovCash: 1180,
    },
  },
  month: {
    dateLabel: "March 2026",
    range: "This Month",
    deltaLabel: "vs last month",
    series: [820, 960, 1140, 1020, 1240, 1380, 1180, 1480, 1620, 1520, 1780, 1840],
    series2: [340, 420, 520, 460, 580, 640, 560, 690, 740, 710, 820, 860],
    xLabels: ["W1", "W2", "W3", "W4"],
    seeds: {
      orders: 1324, revenue: 1842030, adSpend: 612400, net: 438120,
      roas: 3.01, mer: 2.12, rto: 104, delivered: 1041,
      aovPrepaid: 1396, aovCash: 1215,
    },
  },
};

const ACTIVITY_POOL = [
  { icon: "🟢", label: "New prepaid order · Mumbai", amount: "+₹1,284" },
  { icon: "🟢", label: "Delivered · Bengaluru", amount: "+₹1,842" },
  { icon: "🟡", label: "Possibility of RTO · Pin 302001", amount: "flagged" },
  { icon: "🟢", label: "New COD order · Delhi", amount: "+₹1,120" },
  { icon: "🟣", label: "Out for delivery · Hyderabad", amount: "₹2,104" },
  { icon: "🟠", label: "Ad spend crossed daily target", amount: "₹22K / ₹20K" },
  { icon: "🟢", label: "Hydra Serum sold out unit #47", amount: "+₹1,899" },
  { icon: "🔴", label: "Failed delivery · retry queued", amount: "₹980" },
  { icon: "🟢", label: "Net profit target hit (60%)", amount: "on track" },
];

/* ------------------------------------------------------------------ *
 *  Formatters                                                        *
 * ------------------------------------------------------------------ */
const fmt = (n) => Math.round(n).toLocaleString("en-IN");
const fmtInr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const compactInr = (n) => {
  const v = Math.round(n);
  const abs = Math.abs(v);
  if (abs >= 10000000) return "₹" + (v / 10000000).toFixed(1) + "Cr";
  if (abs >= 100000) return "₹" + (v / 100000).toFixed(1) + "L";
  return "₹" + v.toLocaleString("en-IN");
};

/* ------------------------------------------------------------------ *
 *  AreaChart (inline SVG)                                            *
 * ------------------------------------------------------------------ */
function AreaChart({ a, b, xLabels }) {
  const W = 480;
  const H = 128;
  const PAD_X = 8;
  const PAD_Y = 14;
  const max = Math.max(...a, ...b) * 1.08;
  const step = (W - PAD_X * 2) / (a.length - 1);

  const buildPath = (arr, close = false) => {
    const pts = arr.map((v, i) => [
      PAD_X + i * step,
      H - PAD_Y - (v / max) * (H - PAD_Y * 2),
    ]);
    let d = pts
      .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
      .join(" ");
    if (close) d += ` L${W - PAD_X},${H - PAD_Y} L${PAD_X},${H - PAD_Y} Z`;
    return d;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="fill-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fill-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="stroke-a" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* grid */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1={PAD_X}
          x2={W - PAD_X}
          y1={PAD_Y + (H - PAD_Y * 2) * p}
          y2={PAD_Y + (H - PAD_Y * 2) * p}
          stroke="rgba(255,255,255,0.05)"
        />
      ))}

      {/* ad spend area (bottom) */}
      <path d={buildPath(b, true)} fill="url(#fill-b)" />
      <path
        d={buildPath(b)}
        fill="none"
        stroke="#a855f7"
        strokeOpacity="0.55"
        strokeWidth="1.3"
        strokeDasharray="3 3"
      />
      {/* revenue area (top) */}
      <path d={buildPath(a, true)} fill="url(#fill-a)" />
      <path
        d={buildPath(a)}
        fill="none"
        stroke="url(#stroke-a)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 1400,
          strokeDashoffset: 1400,
          animation: "drawLine 1.4s ease-out forwards",
        }}
      />
      {/* last point */}
      {(() => {
        const last = a[a.length - 1];
        const x = PAD_X + (a.length - 1) * step;
        const y = H - PAD_Y - (last / max) * (H - PAD_Y * 2);
        return (
          <>
            <circle cx={x} cy={y} r="3" fill="#10b981" />
            <circle cx={x} cy={y} r="6" fill="#10b981" opacity="0.2">
              <animate attributeName="r" values="4;10;4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
          </>
        );
      })()}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 *  ActivityFeed                                                      *
 * ------------------------------------------------------------------ */
function ActivityFeed() {
  const [items, setItems] = useState(() =>
    [0, 1, 2].map((i) => ({ id: Math.random(), ...ACTIVITY_POOL[i] })),
  );
  const idxRef = useRef(3);

  useEffect(() => {
    const iv = setInterval(() => {
      const next = ACTIVITY_POOL[idxRef.current % ACTIVITY_POOL.length];
      idxRef.current += 1;
      setItems((prev) => [{ id: Math.random(), ...next }, ...prev].slice(0, 4));
    }, 2400);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="space-y-1 overflow-hidden">
      {items.map((it, i) => (
        <div
          key={it.id}
          className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.025] px-2 py-1.5"
          style={{
            animation: i === 0 ? "feedIn 400ms ease both" : undefined,
            opacity: 1 - i * 0.18,
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px]">{it.icon}</span>
            <span className="text-[9px] text-white/80 truncate">{it.label}</span>
          </div>
          <span className="text-[9px] font-mono text-white/65 shrink-0">{it.amount}</span>
        </div>
      ))}
      <style>{`
        @keyframes feedIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  CompactKpi                                                        *
 * ------------------------------------------------------------------ */
function CompactKpi({ icon: Icon, label, value, delta, color }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] px-2.5 py-2 flex items-center gap-2">
      <div
        className="h-6 w-6 rounded-md grid place-items-center shrink-0"
        style={{ background: `${color}22`, color }}
      >
        <Icon size={11} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[7.5px] font-mono tracking-[0.2em] text-white/50 uppercase">
          {label}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-display font-semibold text-white text-[14px] leading-none"
            style={{ color }}
          >
            {value}
          </span>
          {delta && (
            <span className="text-[8px] font-mono text-emerald-300 flex items-center gap-0.5">
              <ArrowUpRight size={8} /> {delta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  ModernDashboard                                                   *
 * ------------------------------------------------------------------ */
export default function ModernDashboard({ dataset = "today" }) {
  const d = DATASETS[dataset] || DATASETS.today;
  const s = d.seeds;

  const orders   = useLiveCounter({ seed: s.orders,   min: s.orders * 0.96, max: s.orders * 1.08, driftMs: 1600 });
  const revenue  = useLiveCounter({ seed: s.revenue,  min: s.revenue * 0.97, max: s.revenue * 1.05, driftMs: 1200 });
  const adSpend  = useLiveCounter({ seed: s.adSpend,  min: s.adSpend * 0.98, max: s.adSpend * 1.03, driftMs: 2400 });
  const net      = useLiveCounter({ seed: s.net,      min: s.net * 0.95, max: s.net * 1.08, driftMs: 1100 });
  const roas     = useLiveCounter({ seed: s.roas,     min: s.roas - 0.25, max: s.roas + 0.3, driftMs: 2200, integer: false });
  const mer      = useLiveCounter({ seed: s.mer,      min: s.mer - 0.15, max: s.mer + 0.2, driftMs: 2400, integer: false });
  const rto      = useLiveCounter({ seed: s.rto,      min: Math.max(0, s.rto - 2), max: s.rto + 4, driftMs: 2600 });
  const delivered= useLiveCounter({ seed: s.delivered, min: s.delivered * 0.96, max: s.delivered * 1.04, driftMs: 1800 });
  const margin   = Math.round((net / revenue) * 100);

  return (
    <div className="p-3 h-full flex flex-col gap-2.5">
      {/* ------------------- HEADER ------------------- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="font-display font-semibold text-white text-[12px] tracking-tight"
            data-testid="dash-date"
          >
            {d.dateLabel}
          </div>
          <span className="px-1.5 py-[1px] rounded text-[7px] font-mono tracking-widest bg-white/10 text-white/70">
            {d.range.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="px-2 py-1 rounded-full border border-emerald-400/40 text-emerald-300 text-[9px] font-mono flex items-center gap-1.5"
            data-testid="dash-net-pill"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 live-dot" />
            Net ▲ {compactInr(net)}
          </span>
          <span className="px-1.5 py-1 rounded-md border border-white/10 bg-white/5 text-[9px] font-mono text-white/60">
            •••
          </span>
        </div>
      </div>

      {/* ------------------- MAIN GRID ------------------- */}
      <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
        {/* LEFT column 7/12 */}
        <div className="col-span-8 flex flex-col gap-2 min-h-0">
          {/* Hero net profit card with sparkline */}
          <div
            className="relative rounded-xl border border-emerald-400/25 bg-emerald-400/[0.05] overflow-hidden p-3"
            style={{
              background:
                "radial-gradient(600px 120px at 0% 0%, rgba(16,185,129,.18), transparent 60%), linear-gradient(180deg, rgba(16,185,129,.06), rgba(255,255,255,.015))",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[8px] font-mono tracking-[0.22em] text-emerald-200/80 uppercase">
                  Net Profit
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className="font-display font-semibold text-emerald-300 text-[30px] leading-none"
                    style={{ textShadow: "0 0 22px rgba(16,185,129,.6)" }}
                    data-testid="dash-net-profit"
                  >
                    {compactInr(net)}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 flex items-center gap-0.5">
                    <ArrowUpRight size={10} /> +24.6% {d.deltaLabel}
                  </span>
                </div>
                <div className="mt-0.5 text-[9px] font-mono text-white/45">
                  margin ~ {margin}% · revenue {compactInr(revenue)} · ad {compactInr(adSpend)}
                </div>
              </div>
              <div className="flex gap-1 mt-1">
                {["Today", "Week", "Month"].map((t) => (
                  <span
                    key={t}
                    className={`px-1.5 py-[2px] rounded text-[7px] font-mono ${
                      t.toLowerCase() === dataset.toLowerCase() ||
                      (t === "Today" && dataset === "today") ||
                      (t === "Week" && dataset === "week") ||
                      (t === "Month" && dataset === "month")
                        ? "bg-white/90 text-black"
                        : "bg-white/5 text-white/55 border border-white/10"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Area chart card */}
          <div className="flex-1 min-h-0 rounded-xl border border-white/10 bg-white/[0.025] p-3 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div>
                <div className="text-[8px] font-mono tracking-[0.22em] text-white/50 uppercase">
                  Revenue vs Ad Spend
                </div>
                <div className="text-[11px] font-display text-white">
                  {d.range} performance
                </div>
              </div>
              <div className="flex items-center gap-2 text-[8px] font-mono">
                <span className="flex items-center gap-1 text-white/70">
                  <span className="h-1.5 w-1.5 rounded-sm bg-emerald-400" /> Revenue
                </span>
                <span className="flex items-center gap-1 text-white/50">
                  <span className="h-1.5 w-1.5 rounded-sm bg-violet-400" /> Ad spend
                </span>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <AreaChart a={d.series} b={d.series2} xLabels={d.xLabels} />
            </div>
            <div className="flex justify-between text-[7px] font-mono text-white/30 mt-0.5">
              {d.xLabels.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT column 5/12 */}
        <div className="col-span-4 flex flex-col gap-2 min-h-0">
          <CompactKpi icon={ShoppingBag} label="Orders" value={fmt(orders)} delta="+8.1%" color="#22d3ee" />
          <CompactKpi icon={Zap} label="ROAS" value={roas.toFixed(2) + "×"} delta={`+${(roas - s.roas + 0.1).toFixed(2)}`} color="#a855f7" />
          <CompactKpi icon={TrendingUp} label="MER" value={mer.toFixed(2)} delta={`+${(mer - s.mer + 0.08).toFixed(2)}`} color="#f59e0b" />
          <CompactKpi icon={AlertTriangle} label="RTO Risk" value={fmt(rto)} delta="-14%" color="#ef4444" />

          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-2.5 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[8px] font-mono tracking-[0.22em] text-white/50 uppercase flex items-center gap-1">
                <Sparkles size={8} className="text-cyan-300" /> Live activity
              </div>
              <span className="text-[7px] font-mono text-emerald-300 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-emerald-400 live-dot" /> LIVE
              </span>
            </div>
            <ActivityFeed />
          </div>
        </div>
      </div>

      {/* ------------------- FOOTER ------------------- */}
      <div className="flex items-center justify-between">
        <div className="text-[8px] font-mono text-white/50 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-emerald-400 live-dot" /> Shopify
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-cyan-300" /> Shiprocket
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-amber-300" /> Meta
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-violet-400" /> Razorpay
          </span>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-mono text-white/55">
          <span>Delivered {fmt(delivered)}</span>
          <span>·</span>
          <span>AOV Prepaid {fmtInr(s.aovPrepaid)}</span>
          <span>·</span>
          <span>AOV Cash {fmtInr(s.aovCash)}</span>
        </div>
      </div>
    </div>
  );
}
