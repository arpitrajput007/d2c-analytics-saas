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
      <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(248,113,113,0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* --- NAVBAR --- */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'var(--primary-gradient)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 0 20px var(--primary-glow)' }}>🛡️</div>
          <div style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Profit Control
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
          BUILT FOR SHOPIFY BRANDS DOING ₹1L – ₹50L / MONTH
        </div>
        
        <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px 0', letterSpacing: '-1px' }}>
          You're losing money without knowing.<br />
          <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>This fixes it.</span>
        </h1>
        
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
          Not just another analytics dashboard. A <strong>Profit Control System</strong> that actively hunts down margin leakage, RTO losses, and hidden costs before they drain your bank account.
        </p>

        <button className="primary" style={{ fontSize: '18px', padding: '16px 32px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)' }} onClick={() => openAuth(true)}>
          Stop the Margin Leak →
        </button>
        <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-dim)' }}>No credit card required • 14-day free trial</p>

        {/* Dashboard Mockup Placeholder */}
        <div style={{ marginTop: '60px', maxWidth: '1000px', margin: '60px auto 0', background: 'rgba(17,17,24,0.8)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
          {/* Mock Window Header */}
          <div style={{ height: '40px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
          </div>
          {/* Mock Window Body */}
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 0%, rgba(248,113,113,0.05), transparent 70%)' }}>
            <div style={{ textAlign: 'center', opacity: 0.6 }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📉 ➡️ 🛡️</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)' }}>[ Video/Animation of glowing Command Center UI goes here ]</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES & PAIN POINTS --- */}
      <section style={{ padding: '80px 20px', background: 'rgba(255,255,255,0.02)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '60px' }}>Make Decisions. Not Spreadsheets.</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {/* Feature 1 */}
            <div className="card glass">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💸</div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>Expose Margin Leakage</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '15px' }}>
                You think you're profitable, but Return to Origin (RTO), packaging, and hidden logistics fees are eating your margins silently.
              </p>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--loss-color)', fontWeight: 700 }}>Actionable ROI:</span> We calculate true net profit automatically so you know your real break-even ROAS.
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card glass">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🤖</div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>AI Risk Detection</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '15px' }}>
                Looking at 50 columns of data doesn't tell you what to do next. You need immediate alerts when a SKU becomes unprofitable.
              </p>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>Actionable ROI:</span> Get told exactly what to fix. E.g., "SKU A-12 shipping cost rose 4%. Raise SP by ₹50."
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card glass">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🛡️</div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>Total Profit Control</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '15px' }}>
                Stop relying on your CA at the end of the month to know if your business survived. See your financial health in real-time.
              </p>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--profit-color)', fontWeight: 700 }}>Actionable ROI:</span> Instantly sync Shopify. Cut losing products. Double down on winners today.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section style={{ padding: '80px 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Simple, Transparent Pricing</h2>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '60px' }}>
            An investment that pays for itself by catching a single margin leak.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
            
            {/* Free Tier */}
            <div className="card glass" style={{ textAlign: 'left', padding: '32px' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Starter</div>
              <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: '24px' }}>Free<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>/forever</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', color: 'var(--text-muted)', fontSize: '15px', lineHeight: 2 }}>
                <li>✓ Connect 1 Shopify Store</li>
                <li>✓ Daily Feed & Order Sync</li>
                <li>✓ Basic P&L Tracking</li>
                <li>✕ No AI Risk Insights</li>
                <li>✕ 7-Day Data History</li>
              </ul>
              <button className="ghost" style={{ width: '100%', padding: '14px' }} onClick={() => openAuth(true)}>Start Free</button>
            </div>

            {/* Pro Tier */}
            <div className="card" style={{ textAlign: 'left', padding: '40px', background: 'rgba(251,191,36,0.05)', border: '1px solid var(--primary)', transform: 'scale(1.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>MOST POPULAR</div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)' }}>Growth PRO</div>
              <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: '24px' }}>₹1,499<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', color: 'var(--text-main)', fontSize: '15px', lineHeight: 2 }}>
                <li><span style={{ color: 'var(--profit-color)' }}>✓</span> Unlimited Shopify Sync</li>
                <li><span style={{ color: 'var(--profit-color)' }}>✓</span> Full Profit Control System</li>
                <li><span style={{ color: 'var(--profit-color)' }}>✓</span> Real-time AI Risk Alerts</li>
                <li><span style={{ color: 'var(--profit-color)' }}>✓</span> Unlimited Historical Data</li>
                <li><span style={{ color: 'var(--profit-color)' }}>✓</span> Priority Support</li>
              </ul>
              <button className="primary" style={{ width: '100%', padding: '14px' }} onClick={() => openAuth(true)}>Start 14-Day Free Trial</button>
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
              <div className="auth-logo-icon">🛡️</div>
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
