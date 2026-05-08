import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from './aurora-background';
import { SiteNav } from './site-nav';
import RobotIpadHero from './hero/RobotIpadHero';
import { LogoMarquee } from './logo-marquee';
import { Features } from './features';
import { CopilotShowcase } from './copilot-showcase';
import { Pricing } from './pricing';
import { CtaFooter } from './cta-footer';

// Import the specific tailwind-driven styles
import '../landing-styles.css';

export default function Landing() {
  const navigate = useNavigate();

  // Intercept clicks to auth links natively created in these components
  useEffect(() => {
    const handleHrefClicks = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      // Only intercept explicit CTA auth links
      if (href === '#cta') {
        e.preventDefault();
        navigate('/signup');
      }
    };
    document.addEventListener('click', handleHrefClicks);
    return () => document.removeEventListener('click', handleHrefClicks);
  }, [navigate]);

  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased selection:bg-accent/20">
      <AuroraBackground />
      <SiteNav onSignInClick={() => navigate('/login')} />
      
      <main>
        <RobotIpadHero />
        <LogoMarquee />
        <Features />
        <CopilotShowcase />
        <Pricing />
        <CtaFooter />
      </main>
    </div>
  );
}
