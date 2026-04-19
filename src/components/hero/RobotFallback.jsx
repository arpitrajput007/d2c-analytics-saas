import React from "react";

/**
 * Fallback CSS robot used when /robot-mascot.png isn't available yet.
 * Cute mascot with glowing gradient visor, off-white body, stubby arms/legs.
 */
export default function RobotFallback({ className = "" }) {
  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{ width: "100%", aspectRatio: "1 / 1" }}
      data-testid="robot-fallback"
    >
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full float-slow"
      >
        <defs>
          <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4f5f7" />
            <stop offset="100%" stopColor="#b8bcc9" />
          </linearGradient>
          <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#22d3ee" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* halo */}
        <ellipse cx="200" cy="170" rx="170" ry="150" fill="url(#halo)" />

        {/* arms (behind body) */}
        <rect x="60" y="200" width="40" height="90" rx="18" fill="url(#body)" />
        <rect x="300" y="200" width="40" height="90" rx="18" fill="url(#body)" />
        {/* hands */}
        <circle cx="80" cy="300" r="22" fill="#e7e9f0" />
        <circle cx="320" cy="300" r="22" fill="#e7e9f0" />

        {/* legs */}
        <rect x="155" y="330" width="34" height="50" rx="12" fill="url(#body)" />
        <rect x="211" y="330" width="34" height="50" rx="12" fill="url(#body)" />
        <rect x="145" y="370" width="54" height="18" rx="6" fill="#2b2e3d" />
        <rect x="201" y="370" width="54" height="18" rx="6" fill="#2b2e3d" />

        {/* body */}
        <rect x="120" y="190" width="160" height="150" rx="36" fill="url(#body)" />
        <circle cx="200" cy="260" r="10" fill="#2b2e3d" />

        {/* head */}
        <rect x="110" y="70" width="180" height="140" rx="34" fill="#14151f" />
        <rect
          x="120"
          y="80"
          width="160"
          height="120"
          rx="26"
          fill="url(#visor)"
          opacity="0.9"
        />
        <rect x="130" y="90" width="140" height="100" rx="20" fill="#0a0b14" />
        {/* eyes */}
        <circle cx="170" cy="140" r="10" fill="#ffffff">
          <animate
            attributeName="r"
            values="10;2;10"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="230" cy="140" r="10" fill="#ffffff">
          <animate
            attributeName="r"
            values="10;2;10"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        {/* antenna */}
        <rect x="196" y="50" width="8" height="28" rx="3" fill="#2b2e3d" />
        <circle cx="200" cy="46" r="8" fill="#22d3ee">
          <animate
            attributeName="fill"
            values="#22d3ee;#ec4899;#a855f7;#22d3ee"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
