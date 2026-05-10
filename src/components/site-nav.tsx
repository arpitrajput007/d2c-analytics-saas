import { Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from './BrandLogo';
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const links = [
  { label: "Features", href: "/#features" },
  { label: "Dashboard", href: "/#dashboard" },
  { label: "AI Co-Pilot", href: "/#copilot" },
  { label: "Pricing", href: "/#pricing" },
];

export function SiteNav({ onSignInClick }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const launchHref = session ? "/dashboard" : "/signup";

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
        <Link to="/" className="flex items-center pl-1 no-underline">
          <BrandLogo variant="compact" iconSize={36} onClick={undefined} />
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
            to={launchHref}
            className="btn-aurora inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium no-underline"
          >
            {session ? (
              <>
                <span>Go to Dashboard</span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </>
            ) : (
              <>
                <Sparkles size={13} />
                <span>Start Free Trial</span>
              </>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
