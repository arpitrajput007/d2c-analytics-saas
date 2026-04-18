import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

/* ─── SVG Icons ─────────────────────────────────────────────── */
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000' }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ─── Mouse-tilt 3D effect hook ─────────────────────────────── */
function useTilt(ref, intensity = 12) {
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(8px)`;
    };
    const handleLeave = () => {
      el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    };
    const handleEnter = () => {
      el.style.transition = 'transform 0.1s ease';
    };
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('mouseenter', handleEnter);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('mouseenter', handleEnter);
    };
  }, [ref, intensity]);
}

/* ─── Feature Card ───────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, roi, roiColor, gradient, delay }) {
  const ref = useRef(null);
  useTilt(ref, 10);
  return (
    <div
      ref={ref}
      className="feature-card"
      style={{ animationDelay: delay, animation: 'fadeInUp 0.6s ease forwards', opacity: 0 }}
    >
      <div
        className="feature-icon-wrap"
        style={{ background: gradient, boxShadow: `0 0 24px ${roiColor}30` }}
      >
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="feature-roi">
        <span style={{ color: roiColor, fontWeight: 700 }}>Actionable ROI: </span>
        {roi}
      </div>
    </div>
  );
}

/* ─── Stat counter ───────────────────────────────────────────── */
function StatNum({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 900, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.3px', marginTop: '2px' }}>{label}</div>
    </div>
  );
}

/* ─── Main Auth Component ────────────────────────────────────── */
export default function Auth() {
  const [loading, setLoading]             = useState(false);
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [isSignUp, setIsSignUp]           = useState(false);
  const [error, setError]                 = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  /* Pricing card tilt refs */
  const proCardRef = useRef(null);
  const freeCardRef = useRef(null);
  useTilt(proCardRef, 8);
  useTilt(freeCardRef, 8);

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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)', position: 'relative', overflowX: 'hidden' }}>

      {/* ── Animated ambient orbs ── */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {/* ── Particle dots ── */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: '3px', height: '3px',
          borderRadius: '50%',
          background: i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--purple)' : 'var(--profit-color)',
          top: `${10 + i * 7.5}%`,
          left: `${5 + i * 8}%`,
          opacity: 0.35,
          animation: `particle-float ${6 + i * 0.7}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(4,4,10,0.8)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--primary-gradient)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(245,200,66,0.3), 0 0 24px rgba(245,200,66,0.35)',
          }}>
            <ShieldIcon />
          </div>
          <div style={{ fontFamily: 'Outfit', fontSize: '19px', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px' }}>
            Profit Control
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {['Features', 'Pricing', 'Blog'].map(l => (
            <span key={l} style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-main)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >{l}</span>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="ghost" style={{ padding: '9px 20px', fontSize: '13.5px' }} onClick={() => openAuth(false)}>Log In</button>
          <button className="primary" style={{ padding: '9px 22px', fontSize: '13.5px' }} onClick={() => openAuth(true)}>Get Started →</button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="hero-section">

        {/* Eyebrow */}
        <div className="hero-eyebrow">
          Built for Shopify brands doing ₹1L – ₹50L / month
        </div>

        {/* Headline */}
        <h1 className="hero-headline">
          You're losing money<br />without knowing it.<br />
          <span>This fixes that.</span>
        </h1>

        {/* Sub */}
        <p className="hero-sub">
          Not just another analytics dashboard. A <strong>Profit Control System</strong> that actively
          hunts down margin leakage, RTO losses, and hidden costs — before they drain your bank account.
        </p>

        {/* CTAs */}
        <div className="hero-cta-group">
          <button
            className="primary"
            style={{ fontSize: '16px', padding: '15px 36px', borderRadius: '12px', boxShadow: '0 12px 36px rgba(245,200,66,0.35)' }}
            onClick={() => openAuth(true)}
          >
            Stop the Margin Leak →
          </button>
          <button
            className="ghost"
            style={{ fontSize: '14px', padding: '15px 28px', borderRadius: '12px' }}
            onClick={() => openAuth(false)}
          >
            See a Demo
          </button>
        </div>
        <div className="hero-trust">
          <span>✦ No credit card required</span>
          <span>✦ 14-day free trial</span>
          <span>✦ Setup in 2 minutes</span>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '60px',
          marginTop: '56px', marginBottom: '0',
          padding: '24px 40px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          maxWidth: '600px',
          margin: '56px auto 0',
        }}>
          <StatNum value="₹2.4Cr+" label="Profit Tracked" />
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <StatNum value="340+" label="Brands Trust Us" />
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <StatNum value="4.9★" label="Satisfaction" />
        </div>

        {/* 3D Dashboard Mockup */}
        <div className="hero-mockup-wrapper">
          <div className="hero-mockup">
            {/* Title bar */}
            <div className="hero-mockup-titlebar">
              <div className="mockup-dot mockup-dot-red" />
              <div className="mockup-dot mockup-dot-yellow" />
              <div className="mockup-dot mockup-dot-green" />
              <div className="hero-mockup-url">
                <span style={{ opacity: 0.3, fontSize: '11px' }}>🔒</span>
                <span className="mockup-url-text">profitcontrol.app/dashboard</span>
              </div>
            </div>

            {/* Body: sidebar + content */}
            <div className="hero-mockup-body">
              {/* Sidebar */}
              <div className="mockup-sidebar">
                {['🛡️','📋','📦','📅','🗓️','📈'].map((icon, i) => (
                  <div key={i} className={`mockup-nav-dot ${i === 0 ? 'active-dot' : ''}`}>
                    <div className={`mockup-nav-bar ${i === 0 ? 'active' : ''}`} />
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="mockup-content">
                {/* Metric cards */}
                <div className="mockup-metrics">
                  <div className="mockup-metric-card m-green">
                    <div className="mockup-metric-label" />
                    <div className="mockup-metric-value" />
                  </div>
                  <div className="mockup-metric-card m-red">
                    <div className="mockup-metric-label" />
                    <div className="mockup-metric-value" />
                  </div>
                  <div className="mockup-metric-card m-yellow">
                    <div className="mockup-metric-label" />
                    <div className="mockup-metric-value" />
                  </div>
                  <div className="mockup-metric-card m-purple">
                    <div className="mockup-metric-label" />
                    <div className="mockup-metric-value" />
                  </div>
                </div>

                {/* AI Risk panel */}
                <div className="mockup-ai-panel">
                  <div className="mockup-ai-icon" />
                  <div className="mockup-ai-lines">
                    <div className="mockup-line l-80" />
                    <div className="mockup-line l-60" />
                  </div>
                </div>

                {/* Chart */}
                <div className="mockup-chart">
                  <div className="mockup-chart-bars">
                    {[35,55,42,68,50,72,45,80,60,90,70,85].map((h, i) => (
                      <div key={i} className={`mockup-bar ${h > 75 ? 'bar-high' : i === 9 ? 'bar-red' : ''}`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Inter' }}>
              Why Profit Control
            </div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900, letterSpacing: '-1px', margin: '0 0 18px 0' }}>
              Make Decisions. Not Spreadsheets.
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              Built for brand owners who want to know their real profit — not their accountant's version of it.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <FeatureCard
              icon="💸"
              title="Expose Margin Leakage"
              desc="You think you're profitable, but Return to Origin (RTO), packaging, and hidden logistics fees are eating your margins silently every single day."
              roi="We calculate true net profit automatically so you know your real break-even ROAS."
              roiColor="var(--loss-color)"
              gradient="linear-gradient(135deg, rgba(251,113,133,0.15), rgba(251,113,133,0.05))"
              delay="0s"
            />
            <FeatureCard
              icon="🤖"
              title="AI Risk Detection"
              desc="Looking at 50 columns of data doesn't tell you what to do next. You need immediate alerts when a SKU becomes unprofitable before it destroys your margins."
              roi='Get told exactly what to fix. E.g., "SKU A-12 shipping cost rose 4%. Raise SP by ₹50."'
              roiColor="var(--purple)"
              gradient="linear-gradient(135deg, rgba(167,139,250,0.15), rgba(139,92,246,0.05))"
              delay="0.1s"
            />
            <FeatureCard
              icon="🛡️"
              title="Total Profit Control"
              desc="Stop relying on your CA at month-end to know if your business survived. See your full financial health in real-time, synced directly from Shopify."
              roi="Instantly sync Shopify. Cut losing products. Double down on winners — today."
              roiColor="var(--profit-color)"
              gradient="linear-gradient(135deg, rgba(45,212,160,0.15), rgba(45,212,160,0.05))"
              delay="0.2s"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 20px', position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Inter' }}>
            Pricing
          </div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900, letterSpacing: '-1px', margin: '0 0 14px 0' }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-muted)', marginBottom: '72px', lineHeight: 1.7 }}>
            An investment that pays for itself by catching a single margin leak.
          </p>

          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.08fr', gap: '24px', alignItems: 'center' }}>

            {/* Free Tier */}
            <div
              ref={freeCardRef}
              style={{
                background: 'rgba(12,12,22,0.8)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                padding: '36px',
                textAlign: 'left',
                backdropFilter: 'blur(20px)',
                transition: 'box-shadow 0.3s ease',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
              <div style={{ fontFamily: 'Outfit', fontSize: '22px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>Starter</div>
              <div style={{ fontFamily: 'Outfit', fontSize: '42px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-2px' }}>
                Free<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: 0 }}>/forever</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '28px' }}>Perfect to get started, no commitment.</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', fontSize: '14.5px', lineHeight: 2.2 }}>
                {['Connect 1 Shopify Store', 'Daily Feed & Order Sync', 'Basic P&L Tracking'].map(f => (
                  <li key={f} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--profit-color)', fontSize: '12px' }}>✓</span> {f}
                  </li>
                ))}
                {['No AI Risk Insights', '7-Day Data History Only'].map(f => (
                  <li key={f} style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ opacity: 0.4 }}>✕</span> {f}
                  </li>
                ))}
              </ul>
              <button className="ghost" style={{ width: '100%', padding: '13px', borderRadius: '10px', fontWeight: 600 }} onClick={() => openAuth(true)}>
                Start Free
              </button>
            </div>

            {/* PRO Tier — animated gradient border */}
            <div className="pricing-card-pro" ref={proCardRef} style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="pricing-card-pro-inner">
                {/* Most Popular badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center', gap: '6px',
                  background: 'var(--primary-gradient)',
                  color: '#000',
                  fontSize: '10px', fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  marginBottom: '20px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontFamily: 'Outfit',
                  boxShadow: '0 4px 16px rgba(245,200,66,0.3)',
                }}>
                  ✦ Most Popular
                </div>

                <div style={{ fontFamily: 'Outfit', fontSize: '22px', fontWeight: 800, color: 'var(--primary)', marginBottom: '6px' }}>Growth PRO</div>
                <div style={{ fontFamily: 'Outfit', fontSize: '42px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-2px' }}>
                  ₹1,499<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: 0 }}>/mo</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '28px' }}>
                  Save 30% vs. individual tools. ROI in week 1.
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', fontSize: '14.5px', lineHeight: 2.2 }}>
                  {[
                    'Unlimited Shopify Sync',
                    'Full Profit Control System',
                    'Real-time AI Risk Alerts',
                    'Unlimited Historical Data',
                    'Priority Support (24h response)',
                  ].map(f => (
                    <li key={f} style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: 'var(--profit-color)', fontSize: '12px', textShadow: '0 0 8px var(--profit-color)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="primary"
                  style={{ width: '100%', padding: '15px', borderRadius: '10px', fontSize: '15px', letterSpacing: '0.2px' }}
                  onClick={() => openAuth(true)}
                >
                  Start 14-Day Free Trial →
                </button>

                <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '12px', color: 'var(--text-dim)' }}>
                  No credit card required. Cancel anytime.
                </div>
              </div>
            </div>
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '52px', flexWrap: 'wrap' }}>
            {['🔒 Secure & Encrypted', '📊 Shopify Official Partner', '🚀 Setup in 2 mins', '💬 Chat Support'].map(t => (
              <span key={t} style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer style={{ padding: '40px 48px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--primary-gradient)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(245,200,66,0.3)' }}>
            <ShieldIcon />
          </div>
          <span style={{ fontFamily: 'Outfit', fontSize: '15px', fontWeight: 700, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Profit Control
          </span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
          © 2026 Profit Control · Built for D2C brands that want to win.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer', fontWeight: 500 }}>{l}</span>
          ))}
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════
          AUTH MODAL
      ══════════════════════════════════════════════════════════ */}
      {isAuthModalOpen && (
        <div
          className="modal-overlay active"
          style={{ zIndex: 9999 }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsAuthModalOpen(false); }}
        >
          <div className="auth-card" style={{ position: 'relative' }}>
            {/* Close */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-main)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >✕</button>

            {/* Logo */}
            <div className="auth-logo">
              <div className="auth-logo-icon">
                <ShieldIcon />
              </div>
              <div className="auth-logo-name">Profit Control</div>
            </div>

            {/* Heading */}
            <h1 className="auth-title">
              {isSignUp ? 'Launch your Command Center' : 'Welcome back'}
            </h1>
            <p className="auth-subtitle">
              {isSignUp
                ? 'Create an account to securely sync your Shopify data.'
                : 'Sign in to access your real-time risk dashboard.'}
            </p>

            <form onSubmit={handleAuth}>
              {/* Email */}
              <div className="auth-input-group">
                <span className="auth-input-icon">✉️</span>
                <input
                  id="auth-email"
                  type="email"
                  className="auth-input"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="auth-input-group">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="auth-password"
                  type="password"
                  className="auth-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ color: 'var(--loss-color)', fontSize: '13px', marginBottom: '14px', padding: '10px 14px', background: 'rgba(251,113,133,0.08)', borderRadius: '8px', border: '1px solid rgba(251,113,133,0.2)' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                id="auth-submit"
                type="submit"
                className="primary auth-submit"
                disabled={loading}
              >
                {loading
                  ? '⟳ Processing...'
                  : isSignUp ? '🚀 Create Account' : '→ Sign In'}
              </button>
            </form>

            {/* Social proof */}
            <div className="auth-social-proof">
              <div className="auth-avatars">
                {['R', 'A', 'S', 'K', 'M'].map((l, i) => (
                  <div key={i} className="auth-avatar" style={{ background: ['#f5c842','#a78bfa','#2dd4a0','#fb7185','#60a5fa'][i], color: i===0?'#000':'#fff' }}>
                    {l}
                  </div>
                ))}
              </div>
              <div className="auth-social-proof-text">Trusted by 340+ Shopify brands across India</div>
            </div>

            {/* Toggle */}
            <div className="auth-toggle">
              {isSignUp ? 'Already have an account? ' : 'New brand owner? '}
              <span
                className="auth-toggle-link"
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
