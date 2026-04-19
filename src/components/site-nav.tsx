import { Sparkles } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "AI Co-Pilot", href: "#copilot" },
  { label: "Pricing", href: "#pricing" },
];

export function SiteNav({ onSignInClick }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass shadow-glass flex w-full max-w-6xl items-center justify-between rounded-full px-3 py-2.5 sm:px-5">
        <a href="#top" className="flex items-center gap-2 pl-2">
          <span
            className="grid h-8 w-8 place-items-center rounded-full"
            style={{ background: "var(--gradient-button)" }}
          >
            <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Profit<span className="text-gradient">Control</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-glass-strong hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSignInClick}
            className="hidden rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </button>
          <button
            onClick={() => onSignInClick && onSignInClick()}
            className="btn-aurora inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium"
          >
            Launch app
          </button>
        </div>
      </nav>
    </header>
  );
}
