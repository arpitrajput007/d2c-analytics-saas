export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base aurora gradient */}
      <div className="absolute inset-0 bg-aurora animate-aurora-shift" />

      {/* Floating blurred orbs */}
      <div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, var(--aurora-violet), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full opacity-50 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, var(--aurora-cyan), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 left-1/4 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, var(--aurora-pink), transparent 70%)" }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, var(--background) 100%)",
        }}
      />
    </div>
  );
}
