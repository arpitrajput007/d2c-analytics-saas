import React, { useEffect, useRef, useState } from "react";
import IpadFrame from "./IpadFrame";
import ModernDashboard from "./dashboards/ModernDashboard";

const datasets = ["today", "week", "month"];

/**
 * Landscape iPad stage — renders a single live dashboard whose numbers constantly drift.
 * `sceneIndex` swaps the underlying time-period dataset (Today / Week / Month) with a crossfade.
 */
export default function DashboardScroller({ sceneIndex = 0 }) {
  const [active, setActive] = useState(sceneIndex);
  const [prev, setPrev] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (sceneIndex === active) return;
    setPrev(active);
    setActive(sceneIndex);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPrev(null), 600);
    return () => clearTimeout(timerRef.current);
  }, [sceneIndex, active]);

  return (
    <IpadFrame>
      <div
        key={`a-${active}`}
        className="absolute inset-0 pt-3"
        style={{ animation: "fadeInUp 550ms ease both" }}
      >
        <ModernDashboard dataset={datasets[active]} />
      </div>

      {prev !== null && (
        <div
          key={`p-${prev}`}
          className="absolute inset-0 pt-3 pointer-events-none"
          style={{ animation: "fadeOutDown 550ms ease both" }}
        >
          <ModernDashboard dataset={datasets[prev]} />
        </div>
      )}

      {/* Scene dots */}
      <div className="absolute bottom-1.5 left-0 right-0 z-30 flex justify-center gap-1">
        {datasets.map((_, i) => (
          <span
            key={i}
            data-testid={`ipad-scene-dot-${i}`}
            className={`h-[3px] rounded-full transition-all duration-500 ${
              i === active ? "w-5 bg-white" : "w-1 bg-white/30"
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOutDown {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-8px); }
        }
      `}</style>
    </IpadFrame>
  );
}
