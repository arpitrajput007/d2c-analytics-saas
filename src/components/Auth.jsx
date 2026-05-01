import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Shield, Eye, EyeOff } from "lucide-react";

// Import all the newly copied Tailwind components
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

export default function Auth() {
  const [loading, setLoading]             = useState(false);
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [isSignUp, setIsSignUp]           = useState(false);
  const [error, setError]                 = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let err;
    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      err = signUpError;
      if (!err) alert('Check your email for the login link or you may be auto-logged in.');
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      err = signInError;
    }
    if (err) setError(err.message);
    setLoading(false);
  };

  const openAuth = (signup = false) => {
    setIsSignUp(signup);
    setError(null);
    setIsAuthModalOpen(true);
  };

  // Intercept clicks to auth links natively created in these components
  useEffect(() => {
    const handleHrefClicks = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      // Only intercept explicit CTA auth links — let all nav anchors scroll normally
      if (href === '#cta') {
        e.preventDefault();
        openAuth(true); // Open the Supabase sign-up modal
      }
    };
    document.addEventListener('click', handleHrefClicks);
    return () => document.removeEventListener('click', handleHrefClicks);
  }, []);

  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased selection:bg-accent/20">
      <AuroraBackground />
      <SiteNav onSignInClick={() => openAuth(false)} />
      
      <main>
        <RobotIpadHero />
        <LogoMarquee />
        <Features />
        <CopilotShowcase />
        <Pricing />
        <CtaFooter />
      </main>

      {/* ══════════════════════════════════════════════════════════
          SUPABASE AUTH MODAL
      ══════════════════════════════════════════════════════════ */}
      {isAuthModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)', display: 'grid', placeItems: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsAuthModalOpen(false); }}
        >
          <div style={{ position: 'relative', background: '#0a0a0f', borderRadius: '24px', padding: '40px', maxWidth: '440px', width: '100%', boxShadow: '0 0 60px -10px rgba(56, 189, 248, 0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
            
            <button
              onClick={() => setIsAuthModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, rgba(167, 139, 250, 1), rgba(56, 189, 248, 1))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                <Shield color="#000" />
              </div>
              <div style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 800, color: '#fff' }}>Profit Control</div>
            </div>

            <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>
              {isSignUp ? 'Launch your Command Center' : 'Welcome back'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '15px' }}>
              {isSignUp
                ? 'Create an account to securely sync your Shopify data.'
                : 'Sign in to access your real-time risk dashboard.'}
            </p>

            <form onSubmit={handleAuth}>
              <div style={{ marginBottom: '16px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>✉️</span>
                <input
                  id="auth-email"
                  type="email"
                  style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none' }}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>🔒</span>
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  style={{ width: '100%', padding: '14px 44px 14px 44px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none' }}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <div style={{ color: '#fb7185', fontSize: '13px', marginBottom: '16px', padding: '12px', background: 'rgba(251,113,133,0.08)', borderRadius: '8px', border: '1px solid rgba(251,113,133,0.2)' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                id="auth-submit"
                type="submit"
                style={{ width: '100%', padding: '16px', fontSize: '15px', background: 'linear-gradient(135deg, rgba(167, 139, 250, 1), rgba(56, 189, 248, 1))', color: '#000', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', border: 'none' }}
                disabled={loading}
              >
                {loading
                  ? '⟳ Processing...'
                  : isSignUp ? '🚀 Create Account' : '→ Sign In'}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              {isSignUp ? 'Already have an account? ' : 'New brand owner? '}
              <span
                style={{ color: 'rgba(56, 189, 248, 1)', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              >
                {isSignUp ? 'Sign in' : 'Sign up free'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
