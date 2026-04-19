import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <section id="top" className="relative pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 text-center">

        {/* Headline */}
        <h1
          className="animate-fade-up mx-auto max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          The control room for{" "}
          <span className="text-gradient">profitable D2C brands</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Real-time profit, ad spend, and unit economics from Shopify, Meta and Google —
          unified into one luminous dashboard, narrated by an AI co-pilot.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href="#cta"
            className="btn-aurora group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
          >
            Start free for 14 days
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#dashboard"
            className="glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-glass-strong"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            See it in motion
          </a>
        </div>

        {/* Trust row */}
        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          style={{ animationDelay: "320ms" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
            Trusted by 1,200+ Shopify stores
          </span>
          <span className="opacity-40">·</span>
          <span>SOC 2 Type II</span>
          <span className="opacity-40">·</span>
          <span>99.99% uptime</span>
        </div>
      </div>

      {/* Floating dashboard preview */}
      <div
        id="dashboard"
        className="animate-fade-up relative mx-auto mt-16 max-w-6xl px-4"
        style={{ animationDelay: "420ms" }}
      >
        <div
          className="absolute inset-x-12 -top-10 h-40 rounded-full opacity-70 blur-3xl"
          style={{ background: "var(--gradient-button)" }}
        />
        <DashboardPreview />
      </div>
    </section>
  );
}
