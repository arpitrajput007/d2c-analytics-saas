import React from "react";

/**
 * Landscape iPad shell with top status bar.
 * Screen area is the children's render target.
 */
export default function IpadFrame({ children, className = "" }) {
  return (
    <div
      className={`ipad-shell ${className}`}
      data-testid="ipad-frame"
      style={{ width: "100%" }}
    >
      <span className="ipad-camera" aria-hidden />
      <div className="ipad-screen">
        {/* top status bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 pt-1.5 text-[8px] font-mono text-white/60">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-emerald-400 live-dot" />
            LIVE · pocketdashboard.app
          </span>
          <span>100%</span>
        </div>
        {children}
      </div>
    </div>
  );
}
