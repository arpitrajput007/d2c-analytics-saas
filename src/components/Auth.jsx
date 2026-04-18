import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth({ setSession }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="auth-page">
      {/* Ambient orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card">
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
            ? 'Connect your Shopify store and start optimizing your D2C margins today.'
            : 'Sign in to access your real-time store analytics dashboard.'}
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
            {loading ? '⟳  Processing...' : isSignUp ? '🚀  Create Account' : '→  Sign In'}
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

        {/* Social Proof */}
        <div className="auth-social-proof">
          <div className="auth-avatars">
            {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
              <div key={i} className="auth-avatar" style={{ marginLeft: i === 0 ? 0 : '-6px' }}>{l}</div>
            ))}
          </div>
          <div className="auth-social-proof-text">
            Trusted by <strong style={{ color: 'var(--text-main)' }}>200+ D2C brands</strong> across India
          </div>
        </div>
      </div>
    </div>
  );
}
