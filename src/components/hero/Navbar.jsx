import React from "react";

export default function Navbar() {
  return (
    <header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(94%,1160px)]"
      data-testid="site-navbar"
    >
      <div className="glass-card flex items-center justify-between pl-5 pr-2 py-2">
        <a
          href="#"
          className="flex items-center gap-2.5"
          data-testid="nav-logo"
        >
          <span className="relative h-8 w-8 rounded-lg overflow-hidden grid place-items-center">
            <img src="/icon.svg?v=2" alt="Logo" className="w-full h-full object-cover" />
          </span>
          <span className="font-display font-semibold text-white">
            Pocket<span className="brand-gradient-text"> Dashboard</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-[13px] text-white/70">
          {["Features", "Dashboard", "AI Co-Pilot", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              data-testid={`nav-link-${item.toLowerCase().replace(/\s/g, "-")}`}
              className="hover:text-white transition"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#signin"
            data-testid="nav-signin"
            className="hidden sm:inline px-3 text-[13px] text-white/70 hover:text-white"
          >
            Sign in
          </a>
          <a
            href="#launch"
            data-testid="nav-launch"
            className="brand-gradient text-black font-semibold text-[13px] px-4 py-2 rounded-full"
          >
            Launch app
          </a>
        </div>
      </div>
    </header>
  );
}
