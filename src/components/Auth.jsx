import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Auth({ setSession }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let error;

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
      if (!error) alert('Check your email for the login link or you may be auto-logged in.');
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
    }

    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <div className="login-box" style={{ background: 'rgba(24, 24, 27, 0.8)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 8px 0', color: 'white', fontSize: '24px' }}>
          {isSignUp ? 'Launch your SaaS' : 'Welcome Back'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
          {isSignUp ? 'Create an account to onboard your store.' : 'Sign in to access your analytics.'}
        </p>
        
        <form onSubmit={handleAuth}>
          <input 
            type="email" 
            className="login-input" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', background: '#09090b', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', marginBottom: '16px', boxSizing: 'border-box' }}
            required
          />
          <input 
            type="password" 
            className="login-input" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', background: '#09090b', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', marginBottom: '16px', boxSizing: 'border-box' }}
            required
          />
          
          {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
          
          <button type="submit" className="primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {isSignUp ? 'Already have an account? ' : 'New store? '}
          <span 
            onClick={() => setIsSignUp(!isSignUp)} 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </span>
        </div>
      </div>
    </div>
  );
}
