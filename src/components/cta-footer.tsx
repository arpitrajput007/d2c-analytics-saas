import { ArrowRight } from "lucide-react";

export function CtaFooter() {
  return (
    <section id="cta" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <div className="gradient-border relative overflow-hidden rounded-[2rem]">
          <div className="glass-strong relative rounded-[2rem] px-6 py-16 text-center sm:px-12">
            {/* glow */}
            <div
              className="absolute inset-x-10 -top-24 h-56 rounded-full opacity-60 blur-3xl"
              style={{ background: "var(--gradient-button)" }}
            />
            <h2 className="relative mx-auto max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Run your store from <span className="text-gradient">the future.</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Connect Shopify in 60 seconds. See your real profit before your next ad spend
              decision.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#"
                className="btn-aurora group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium"
              >
                Start free for 14 days
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#dashboard"
                className="glass inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium hover:bg-glass-strong"
              >
                Book a demo
              </a>
            </div>
            <div className="relative mt-6 text-xs text-muted-foreground">
              No credit card · Cancel anytime · Your data stays yours
            </div>
          </div>
        </div>
      </div>

      <footer className="mx-auto mt-16 max-w-6xl px-4 text-xs text-muted-foreground">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-glass-border pt-6 sm:flex-row">
          <div>© {new Date().getFullYear()} Profit Control. Built for the next era of commerce.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Status</a>
          </div>
        </div>
      </footer>
    </section>
  );
}
