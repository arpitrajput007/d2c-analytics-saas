import React from "react";
import useLiveCounter from "../useLiveCounter";

const fmt = (n) => n.toLocaleString("en-IN");
const fmtInr = (n) => "₹" + n.toLocaleString("en-IN");
// Compact Indian notation for crowded tiles (L / Cr). Uses commas for values < 1L.
const compactInr = (n) => {
  const v = Math.round(n);
  const abs = Math.abs(v);
  if (abs >= 10000000) return "₹" + (v / 10000000).toFixed(1) + "Cr";
  if (abs >= 100000) return "₹" + (v / 100000).toFixed(1) + "L";
  return "₹" + v.toLocaleString("en-IN");
};

/**
 * Compact tile used in the live dashboard.
 * size: "sm" | "md" | "lg"
 */
export function Tile({
  label,
  value,
  color = "#ffffff",
  glow = false,
  size = "sm",
  children,
  className = "",
}) {
  const sizeMap = {
    sm: { value: "text-[18px]", label: "text-[8px]" },
    md: { value: "text-[17px]", label: "text-[8px]" },
    lg: { value: "text-[26px]", label: "text-[9px]" },
  }[size];
  return (
    <div
      className={`relative rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5 flex flex-col justify-between overflow-hidden ${className}`}
      style={glow ? { boxShadow: `0 0 40px -12px ${color}66` } : undefined}
    >
      <div
        className={`font-mono tracking-[0.22em] text-white/55 uppercase ${sizeMap.label} truncate`}
      >
        {label}
      </div>
      <div
        className={`font-display font-semibold leading-none ${sizeMap.value} mt-2`}
        style={{
          color,
          textShadow: glow ? `0 0 18px ${color}99` : "none",
        }}
      >
        {value}
      </div>
      {children}
    </div>
  );
}

/**
 * Single scene that mirrors the user's reference screenshot.
 * Drives live tickers via useLiveCounter.
 * `dataset` controls the baseline numbers — parent scene index maps to Today / Week / Month.
 */
export default function LiveDashboard({ dataset = "today" }) {
  const seeds = {
    today: {
      dateLabel: "Tuesday, March 31, 2026",
      orders: 44, fulfilled: 37, delivered: 31, transit: 2, outDel: 1, failed: 0,
      canceled: 4, possRto: 5, rto: 5, unreach: 1,
      revenue: 61062, adSpend: 22270, prepaid: 8, cash: 36, net: 15077,
    },
    week: {
      dateLabel: "Mar 25 to Mar 31, 2026",
      orders: 318, fulfilled: 274, delivered: 241, transit: 14, outDel: 9, failed: 3,
      canceled: 21, possRto: 28, rto: 26, unreach: 7,
      revenue: 428910, adSpend: 154200, prepaid: 63, cash: 255, net: 108420,
    },
    month: {
      dateLabel: "March 2026",
      orders: 1324, fulfilled: 1189, delivered: 1041, transit: 58, outDel: 34, failed: 12,
      canceled: 84, possRto: 112, rto: 104, unreach: 31,
      revenue: 1842030, adSpend: 612400, prepaid: 274, cash: 1050, net: 438120,
    },
  };
  const s = seeds[dataset] || seeds.today;

  const orders   = useLiveCounter({ seed: s.orders,   min: s.orders * 0.96, max: s.orders * 1.08, driftMs: 1500 });
  const fulfilled= useLiveCounter({ seed: s.fulfilled,min: s.fulfilled*0.95,max: s.fulfilled*1.05, driftMs: 1800 });
  const delivered= useLiveCounter({ seed: s.delivered,min: s.delivered*0.95,max: s.delivered*1.04, driftMs: 1800 });
  const transit  = useLiveCounter({ seed: s.transit,  min: Math.max(0, s.transit - 3), max: s.transit + 6, driftMs: 1400 });
  const outDel   = useLiveCounter({ seed: s.outDel,   min: 0, max: s.outDel + 4, driftMs: 1400 });
  const failed   = useLiveCounter({ seed: s.failed,   min: 0, max: s.failed + 4, driftMs: 2200 });
  const canceled = useLiveCounter({ seed: s.canceled, min: Math.max(0, s.canceled - 2), max: s.canceled + 4, driftMs: 2400 });
  const possRto  = useLiveCounter({ seed: s.possRto,  min: Math.max(0, s.possRto - 3), max: s.possRto + 4, driftMs: 2000 });
  const rto      = useLiveCounter({ seed: s.rto,      min: Math.max(0, s.rto - 2), max: s.rto + 5, driftMs: 2000 });
  const unreach  = useLiveCounter({ seed: s.unreach,  min: 0, max: s.unreach + 3, driftMs: 1700 });
  const revenue  = useLiveCounter({ seed: s.revenue,  min: s.revenue * 0.97, max: s.revenue * 1.06, driftMs: 1200 });
  const adSpend  = useLiveCounter({ seed: s.adSpend,  min: s.adSpend * 0.98, max: s.adSpend * 1.03, driftMs: 2600 });
  const prepaid  = useLiveCounter({ seed: s.prepaid,  min: Math.max(0, s.prepaid - 2), max: s.prepaid + 5, driftMs: 1600 });
  const cash     = useLiveCounter({ seed: s.cash,     min: s.cash * 0.94, max: s.cash * 1.06, driftMs: 1800 });
  const net      = useLiveCounter({ seed: s.net,      min: s.net * 0.95, max: s.net * 1.08, driftMs: 1100 });

  return (
    <div className="p-3 h-full flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          className="font-display font-semibold text-white text-[13px] tracking-tight"
          data-testid="dash-date"
        >
          {s.dateLabel}
        </div>
        <div
          className="px-2.5 py-1 rounded-full border border-emerald-400/40 text-emerald-300 text-[9px] font-mono flex items-center gap-1.5"
          data-testid="dash-net-pill"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 live-dot" />
          Net: ▲ {compactInr(net)}
        </div>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Row 1 — status tiles */}
      <div className="grid grid-cols-6 gap-2">
        <Tile label="Orders"         value={fmt(orders)}    color="#ffffff" />
        <Tile label="Fulfilled"      value={fmt(fulfilled)} color="#10b981" glow />
        <Tile label="Delivered"      value={fmt(delivered)} color="#10b981" glow />
        <Tile label="In Transit"     value={fmt(transit)}   color="#3b82f6" />
        <Tile label="Out for Delivery" value={fmt(outDel)}  color="#a855f7" />
        <Tile label="Failed Delivery"  value={fmt(failed)}  color="#f97316" />
      </div>

      {/* Row 2 — risk + money tiles */}
      <div className="grid grid-cols-6 gap-2">
        <Tile label="Canceled"  value={fmt(canceled)} color="#ec4899" />
        <Tile label="Poss. of RTO" value={fmt(possRto)} color="#facc15" />
        <Tile label="RTO / Undelivered" value={fmt(rto)} color="#ef4444" />
        <Tile label="Unreachable" value={fmt(unreach)} color="#facc15" />
        <Tile label="Revenue" value={compactInr(revenue)} color="#ffffff" size="md" />
        <Tile label="Ad Spend" value={compactInr(adSpend)} color="#f59e0b" size="md">
          <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
            <span className="text-[7px] font-mono text-white/30">META</span>
            <span className="px-1.5 py-[2px] rounded bg-amber-400 text-black text-[7px] font-semibold">
              Save
            </span>
          </div>
        </Tile>
      </div>

      {/* Row 3 — payment split + highlight net profit */}
      <div className="grid grid-cols-6 gap-2 flex-1">
        <Tile label="Prepaid Orders" value={fmt(prepaid)} color="#8b5cf6" />
        <Tile label="Cash Orders"    value={fmt(cash)}    color="#f97316" />
        <div className="col-span-2 relative rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] px-4 py-3 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: "radial-gradient(circle at 20% 0%, rgba(16,185,129,.3), transparent 55%)" }} />
          <div className="relative font-mono tracking-[0.22em] text-emerald-200/80 uppercase text-[9px]">
            Net Profit
          </div>
          <div
            className="relative font-display font-semibold text-[30px] text-emerald-300 leading-none"
            style={{ textShadow: "0 0 22px rgba(16,185,129,.7)" }}
            data-testid="dash-net-profit"
          >
            {compactInr(net)}
          </div>
          <div className="relative text-[9px] font-mono text-emerald-200/60">
            margin ~ {Math.round((net / revenue) * 100)}% · updated live
          </div>
        </div>
        {/* Mini tasks/insight column */}
        <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 flex flex-col gap-1.5">
          <div className="font-mono tracking-[0.22em] text-white/50 text-[8px]">
            CO-PILOT · ATTENTION
          </div>
          <div className="text-[9px] leading-snug text-white/85">
            Hydra Serum margin at{" "}
            <span className="text-emerald-300 font-semibold">38%</span>. Shift{" "}
            <span className="text-cyan-200">₹1,840</span> Meta spend for{" "}
            <span className="text-emerald-300">+₹6,210</span>.
          </div>
          <div className="text-[8px] font-mono text-white/45 mt-auto flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            12 PIN codes need prepaid-only
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-[9px] font-mono text-white/50 flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-emerald-400 live-dot" />
          LIVE · Shopify · Shiprocket · Meta
        </div>
        <div className="flex items-center gap-1.5">
          <button className="px-2 py-1 rounded-md border border-white/15 text-[8px] font-mono text-white/75">
            View Orders
          </button>
          <span className="px-1.5 py-[2px] rounded bg-white/10 text-[8px] font-mono text-white/70">
            ▼ {fmt(orders)}
          </span>
        </div>
      </div>
    </div>
  );
}
