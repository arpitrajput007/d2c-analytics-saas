import React from "react";
import { Truck, AlertTriangle, PhoneOff, CheckCircle2 } from "lucide-react";

const funnel = [
  { label: "Placed", value: "12,408", pct: 100, color: "#22d3ee" },
  { label: "Confirmed", value: "11,172", pct: 90, color: "#60a5fa" },
  { label: "Shipped", value: "10,014", pct: 81, color: "#a855f7" },
  { label: "Delivered", value: "8,709", pct: 70, color: "#10b981" },
];

const issues = [
  { label: "RTO", value: "612", trend: "-14%", color: "#fb7185", icon: Truck },
  { label: "Unreach.", value: "248", trend: "-8%", color: "#f59e0b", icon: PhoneOff },
  { label: "Failed", value: "194", trend: "+3%", color: "#f43f5e", icon: AlertTriangle, bad: true },
  { label: "Recovered", value: "311", trend: "+22%", color: "#10b981", icon: CheckCircle2 },
];

const skuRows = [
  { sku: "Hydra Serum", margin: 38, rev: "₹4.82L", status: "Top" },
  { sku: "Daily Cleanser", margin: -4, rev: "₹3.11L", status: "Loss" },
  { sku: "Night Cream", margin: 29, rev: "₹2.64L", status: "Good" },
  { sku: "Vit C Booster", margin: 24, rev: "₹1.92L", status: "Good" },
];

export default function OrdersScene() {
  return (
    <div className="p-3 h-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[7px] font-mono tracking-[0.22em] text-white/50">
            OPS · RTO &amp; LOSSES
          </div>
          <div className="text-[11px] font-display font-semibold text-white leading-tight">
            Where is money leaking?
          </div>
        </div>
        <div className="flex items-center gap-1 text-[6px] font-mono text-emerald-400">
          <span className="h-1 w-1 rounded-full bg-emerald-400 live-dot" />
          SHIPROCKET · SYNC
        </div>
      </div>

      {/* Main split: funnel left, issues right */}
      <div className="grid grid-cols-5 gap-2 flex-1">
        <div className="col-span-3 rounded-md border border-white/10 bg-white/[0.03] p-2 flex flex-col gap-1.5">
          <div className="text-[7px] font-mono tracking-[0.18em] text-white/50">
            ORDER FUNNEL
          </div>
          {funnel.map((f, i) => (
            <div key={f.label} className="space-y-0.5">
              <div className="flex justify-between text-[8px] font-mono text-white/70 leading-none">
                <span>{f.label}</span>
                <span>
                  {f.value}{" "}
                  <span className="text-white/40">· {f.pct}%</span>
                </span>
              </div>
              <div className="h-[4px] rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bar-grow"
                  style={{
                    width: `${f.pct}%`,
                    background: `linear-gradient(90deg, ${f.color}, ${f.color}88)`,
                    animationDelay: `${i * 120}ms`,
                    transformOrigin: "left",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-1.5">
          {issues.map((i) => {
            const Icon = i.icon;
            return (
              <div
                key={i.label}
                className="rounded-md border border-white/10 bg-white/[0.03] p-1.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="h-3 w-3 rounded grid place-items-center"
                    style={{ background: `${i.color}22`, color: i.color }}
                  >
                    <Icon size={7} />
                  </div>
                  <span
                    className={`text-[6px] font-mono ${
                      i.bad ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {i.trend}
                  </span>
                </div>
                <div>
                  <div className="font-display text-[11px] font-semibold leading-none text-white">
                    {i.value}
                  </div>
                  <div className="text-[6px] font-mono text-white/50">
                    {i.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SKU row */}
      <div className="rounded-md border border-white/10 bg-white/[0.03] p-2">
        <div className="text-[7px] font-mono tracking-[0.18em] text-white/50 mb-1">
          SKU · PROFITABILITY
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {skuRows.map((s) => (
            <div
              key={s.sku}
              className="flex items-center justify-between rounded bg-white/[0.02] border border-white/5 px-1.5 py-1"
            >
              <div>
                <div className="text-[7px] font-mono text-white/80 truncate leading-none">
                  {s.sku}
                </div>
                <div className="text-[6px] font-mono text-white/40 mt-0.5">
                  {s.rev}
                </div>
              </div>
              <div
                className={`font-display font-semibold text-[10px] ${
                  s.margin > 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {s.margin > 0 ? "+" : ""}
                {s.margin}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
