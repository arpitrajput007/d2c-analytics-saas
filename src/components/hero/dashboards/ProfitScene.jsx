import React from "react";
import { ArrowUpRight, ShoppingBag, Zap, Activity, DollarSign } from "lucide-react";
import Sparkline from "../Sparkline";

const kpis = [
  {
    label: "NET PROFIT",
    value: "$184,920",
    delta: "+24.6%",
    icon: DollarSign,
    color: "#10b981",
    spark: [12, 14, 13, 18, 22, 21, 26, 30, 28, 34, 40, 45],
  },
  {
    label: "ORDERS",
    value: "12,408",
    delta: "+8.1%",
    icon: ShoppingBag,
    color: "#22d3ee",
    spark: [10, 12, 14, 13, 16, 18, 20, 19, 22, 24, 25, 27],
  },
  {
    label: "ROAS",
    value: "4.82×",
    delta: "+0.34",
    icon: Zap,
    color: "#a855f7",
    spark: [3, 3.2, 3.4, 3.6, 3.8, 4.0, 3.9, 4.2, 4.4, 4.5, 4.7, 4.82],
  },
  {
    label: "MER",
    value: "3.41",
    delta: "+0.12",
    icon: Activity,
    color: "#ec4899",
    spark: [2.4, 2.6, 2.8, 2.9, 3.0, 3.1, 3.2, 3.1, 3.2, 3.3, 3.35, 3.41],
  },
];

const bars = [34, 48, 42, 56, 62, 58, 74, 80, 68, 88, 95, 92, 104, 112, 108];

export default function ProfitScene() {
  return (
    <div className="p-3 h-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[7px] font-mono tracking-[0.22em] text-white/50">
            DASHBOARD · P&amp;L
          </div>
          <div className="text-[11px] font-display font-semibold text-white leading-tight">
            Real profit, last 30 days
          </div>
        </div>
        <div className="flex gap-1">
          {["7D", "30D", "90D"].map((t, i) => (
            <span
              key={t}
              className={`px-1.5 py-[2px] rounded text-[7px] font-mono ${
                i === 1
                  ? "bg-white/90 text-black"
                  : "bg-white/5 text-white/60 border border-white/10"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* KPI row — 4 across (landscape) */}
      <div className="grid grid-cols-4 gap-1.5">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="rounded-md border border-white/10 bg-white/[0.03] p-1.5 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="text-[6px] font-mono tracking-[0.18em] text-white/50 truncate">
                  {k.label}
                </div>
                <div
                  className="h-3 w-3 rounded grid place-items-center"
                  style={{ background: `${k.color}22`, color: k.color }}
                >
                  <Icon size={7} />
                </div>
              </div>
              <div className="mt-0.5 font-display text-[11px] font-semibold leading-none text-white">
                {k.value}
              </div>
              <div className="flex items-center gap-0.5 text-[6px] font-mono text-emerald-400">
                <ArrowUpRight size={7} /> {k.delta}
              </div>
              <div className="-mx-0.5 mt-0.5">
                <Sparkline data={k.spark} color={k.color} height={14} width={100} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Profit chart */}
      <div className="rounded-md border border-white/10 bg-white/[0.03] p-2 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[7px] font-mono tracking-[0.18em] text-white/50">
            PROFIT · DAILY
          </div>
          <div className="text-[6px] font-mono text-white/40">
            after ads · COGS · fees
          </div>
        </div>
        <div className="flex items-end gap-[2px] flex-1 min-h-[36px]">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bar-grow"
              style={{
                height: `${(h / 112) * 100}%`,
                background:
                  i === bars.length - 1
                    ? "linear-gradient(180deg,#22d3ee,#a855f7)"
                    : "linear-gradient(180deg,rgba(168,85,247,.55),rgba(34,211,238,.2))",
                animationDelay: `${i * 40}ms`,
                boxShadow:
                  i === bars.length - 1
                    ? "0 0 10px rgba(168,85,247,.55)"
                    : "none",
              }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[6px] font-mono text-white/30">
          <span>Nov 01</span>
          <span>Nov 15</span>
          <span>Nov 30</span>
        </div>
      </div>
    </div>
  );
}
