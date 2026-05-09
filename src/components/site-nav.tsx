import { Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Features", href: "/#features" },
  { label: "Dashboard", href: "/#dashboard" },
  { label: "AI Co-Pilot", href: "/#copilot" },
  { label: "Pricing", href: "/#pricing" },
];

export function SiteNav({ onSignInClick }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleScroll = (e, href) => {
    if (isHome && href.startsWith("/#")) {
      e.preventDefault();
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass shadow-glass flex w-full max-w-6xl items-center justify-between rounded-full px-3 py-2.5 sm:px-5">
        <Link to="/" className="flex items-center pl-1 no-underline group">
          <img
            src="/pocket-dashboard-logo.svg?v=2"
            alt="Pocket Dashboard"
            style={{
              height: 'clamp(30px, 5vw, 40px)',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              transition: 'opacity 0.2s ease',
              maxWidth: '180px',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          />
        </Link>


        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              onClick={(e) => handleScroll(e, l.href)}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-glass-strong hover:text-foreground no-underline"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex no-underline"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="btn-aurora inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium no-underline"
          >
            Launch app
          </Link>
        </div>
      </nav>
    </header>
  );
}

