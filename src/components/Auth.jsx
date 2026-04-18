import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth({ setSession }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)', position: 'relative', overflowX: 'hidden' }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* --- NAVBAR --- */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'var(--primary-gradient)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 0 20px var(--primary-glow)' }}>📊</div>
          <div style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            D2C Analytics
          </div>
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="ghost" style={{ padding: '10px 20px' }} onClick={() => openAuth(false)}>Log In</button>
          <button className="primary" style={{ padding: '10px 24px' }} onClick={() => openAuth(true)}>Register</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{ padding: '80px 20px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '0.5px' }}>
          NEW: GEMINI AI CO-PILOT IS LIVE ✨
        </div>
        
        <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px 0', letterSpacing: '-1px' }}>
          Stop Guessing Your Margins.<br />
          <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Know Your Real Profit.</span>
        </h1>
        
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
          A modern analytics suite built for scaling D2C brands. Sync Shopify instantly, uncover hidden logistical costs, and let AI reveal your most profitable growth paths.
        </p>

        <button className="primary" style={{ fontSize: '18px', padding: '16px 32px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)' }} onClick={() => openAuth(true)}>
          Start your free trial →
        </button>

        {/* Dashboard Mockup Placeholder */}
        <div style={{ marginTop: '60px', maxWidth: '1000px', margin: '60px auto 0', background: 'rgba(17,17,24,0.8)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
          {/* Mock Window Header */}
          <div style={{ height: '40px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
          </div>
          {/* Mock Window Body */}
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 0%, rgba(251,191,36,0.05), transparent 70%)' }}>
            <div style={{ textAlign: 'center', opacity: 0.6 }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📉 ➡️ 📈</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)' }}>[ Video/Animation of glowing dashboard UI goes here ]</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES & PAIN POINTS --- */}
      <section style={{ padding: '80px 20px', background: 'rgba(255,255,255,0.02)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '60px' }}>Why D2C Brands are Switching</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {/* Feature 1 */}
            <div className="card glass">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💸</div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>The Pain: Hidden RTO Losses</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '15px' }}>
                You think you're profitable, but Return to Origin (RTO) and shipping fees are eating your margins silently before the month ends.
              </p>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--profit-color)', fontWeight: 700 }}>Our Solution:</span> Real-time P&L scoreboard automatically deducts true logistics mapping.
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card glass">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🤖</div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>The Pain: Information Overload</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '15px' }}>
                Spreadsheets with 50 columns are great for accountants, but terrible for quick decisions when running ad campaigns.
              </p>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>Our Solution:</span> Ask your AI Co-Pilot exact questions and get pinpoint actionable advice.
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card glass">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>The Pain: Manual Syncing</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '15px' }}>
                Downloading CSVs from Shopify everyday to calculate basic metrics is burning your valuable time.
              </p>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--info-color)', fontWeight: 700 }}>Our Solution:</span> 1-Click secure Shopify sync pulls thousands of orders instantly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- AUTH MODAL OVERLAY --- */}
      {isAuthModalOpen && (
        <div className="modal-overlay active" style={{ zIndex: 9999 }}>
          <div className="auth-card" style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}
            >
              ✕
            </button>
            
            {/* Logo */}
            <div className="auth-logo">
              <div className="auth-logo-icon">📊</div>
              <div className="auth-logo-name">D2C Analytics</div>
            </div>

            {/* Heading */}
            <h1 className="auth-title">
              {isSignUp ? 'Start your journey' : 'Welcome back'}
            </h1>
            <p className="auth-subtitle">
              {isSignUp
                ? 'Create an account to securely sync your Shopify data.'
                : 'Sign in to access your real-time store dashboard.'}
            </p>

            <form onSubmit={handleAuth}>
              {/* Email */}
              <div className="auth-input-group">
                <span className="auth-input-icon">✉️</span>
                <input
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
                  type="password"
                  className="auth-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ color: 'var(--loss-color)', fontSize: '13px', marginBottom: '12px', padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="primary auth-submit"
                disabled={loading}
              >
                {loading ? '⟳ Processing...' : isSignUp ? '🚀 Create Account' : '→ Sign In'}
              </button>
            </form>

            <div className="auth-toggle">
              {isSignUp ? 'Already have an account? ' : 'New store owner? '}
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
