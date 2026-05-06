import { ArrowRight } from "lucide-react";

export function CtaFooter() {
  return (
    <section id="cta" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="gradient-border relative overflow-hidden rounded-3xl">
          <div
            className="glass-strong relative rounded-3xl px-8 py-16 text-center sm:px-16"
          >
            {/* Background glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, oklch(0.78 0.18 305), transparent 70%)",
              }}
            />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Stop guessing your numbers.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Start running your business with clarity and control.
              </p>

              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#"
                  className="btn-aurora group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium"
                >
                  Start Your 14-Day Free Trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#dashboard"
                  className="glass inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium hover:bg-glass-strong"
                >
                  Request Demo
                </a>
              </div>
              <div className="relative mt-6 text-xs text-muted-foreground">
                No credit card required · Cancel anytime · Built for Indian D2C businesses
              </div>
            </div>
          </div>
        </div>

        <footer className="mx-auto mt-16 max-w-6xl px-4 text-xs text-muted-foreground">
          <div className="flex flex-col items-center justify-between gap-3 border-t border-glass-border pt-6 sm:flex-row">
            <div>
              <div className="text-sm font-medium text-foreground/80 mb-1">Revenue is vanity. Profit is sanity.</div>
              <div>We help you track what actually matters. © {new Date().getFullYear()} PocketDashboard.</div>
            </div>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
