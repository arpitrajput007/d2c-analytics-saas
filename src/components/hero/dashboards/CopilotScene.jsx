import React from "react";
import { Sparkles, ArrowRight, Wand2 } from "lucide-react";

const insights = [
  {
    tone: "win",
    title: "Hydra Serum is your profit engine",
    body: "Net margin 38%. Reallocate $1,840 Meta spend from Daily Cleanser for est. +$6,210 this week.",
    meta: "+$6,210",
  },
  {
    tone: "risk",
    title: "RTO rising in Tier-3 PIN codes",
    body: "12 PIN codes show >22% RTO. Switch to prepaid-only to save ₹48,200/mo.",
    meta: "-₹48,200",
  },
];

const toneMap = {
  win: { dot: "bg-emerald-400", pill: "text-emerald-300 border-emerald-400/20 bg-emerald-400/10" },
  risk: { dot: "bg-rose-400", pill: "text-rose-300 border-rose-400/20 bg-rose-400/10" },
};

export default function CopilotScene() {
  return (
    <div className="p-3 h-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[7px] font-mono tracking-[0.22em] text-white/50 flex items-center gap-1">
            <Sparkles size={7} className="text-cyan-300" /> AI CO-PILOT
          </div>
          <div className="text-[11px] font-display font-semibold text-white leading-tight">
            Today's attention list
          </div>
        </div>
        <span className="text-[6px] font-mono text-white/40">2 new</span>
      </div>

      {/* Split: chat left, insights right */}
      <div className="grid grid-cols-5 gap-2 flex-1">
        <div className="col-span-2 rounded-md border border-white/10 bg-white/[0.03] p-2 flex flex-col gap-1.5">
          <div className="text-[6px] font-mono tracking-[0.18em] text-white/40">
            YOU · ASK ANYTHING
          </div>
          <div className="text-[9px] text-white/85 leading-snug">
            "Which product is actually making me profit this week?"
          </div>
          <div className="rounded border border-cyan-300/20 bg-cyan-400/5 p-1.5 flex-1">
            <div className="text-[6px] font-mono tracking-[0.18em] text-cyan-200 mb-0.5 flex items-center gap-1">
              <Wand2 size={7} /> CO-PILOT
            </div>
            <div className="text-[8px] leading-snug text-white/85">
              <span className="text-emerald-300">Hydra Serum</span> has the
              highest net margin at <b>38%</b>. Daily Cleanser is losing ₹12/order after RTO.
            </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-1.5">
          {insights.map((i) => {
            const t = toneMap[i.tone];
            return (
              <div
                key={i.title}
                className="rounded-md border border-white/10 bg-white/[0.03] p-2"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    <span className={`h-1 w-1 rounded-full ${t.dot}`} />
                    <span className="text-[6px] font-mono tracking-[0.18em] text-white/50">
                      INSIGHT
                    </span>
                  </div>
                  <span className={`text-[6px] font-mono px-1 py-[1px] rounded border ${t.pill}`}>
                    {i.meta}
                  </span>
                </div>
                <div className="text-[9px] font-display font-semibold text-white leading-snug">
                  {i.title}
                </div>
                <div className="mt-0.5 text-[7px] text-white/60 leading-relaxed line-clamp-2">
                  {i.body}
                </div>
                <div className="mt-1 flex items-center gap-0.5 text-[6px] font-mono text-cyan-200">
                  Apply <ArrowRight size={7} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
