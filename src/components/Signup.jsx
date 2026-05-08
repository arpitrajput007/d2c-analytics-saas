import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import { AuroraBackground } from './aurora-background';

export default function Signup() {
  const [loading, setLoading]             = useState(false);
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [error, setError]                 = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      alert('Check your email for the login link or you may be auto-logged in.');
      navigate('/login');
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased selection:bg-accent/20 relative flex items-center justify-center p-4">
      <AuroraBackground />
      
      <div style={{ 
        position: 'relative', 
        background: '#0a0a0f', 
        borderRadius: '24px', 
        padding: '40px', 
        maxWidth: '440px', 
        width: '100%', 
        boxShadow: '0 0 60px -10px rgba(56, 189, 248, 0.4)', 
        border: '1px solid rgba(255,255,255,0.1)',
        zIndex: 10
      }}>
        
        <Link
          to="/"
          style={{ position: 'absolute', top: '16px', left: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '14px' }}
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', marginTop: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, rgba(167, 139, 250, 1), rgba(56, 189, 248, 1))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <Shield color="#000" />
          </div>
          <div style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 800, color: '#fff' }}>Pocket Dashboard</div>
        </div>

        <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>
          Launch your Command Center
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '15px' }}>
          Create an account to securely sync your Shopify data.
        </p>

        <form onSubmit={handleSignUp}>
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
            {loading ? '⟳ Processing...' : '🚀 Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          Already have an account? {' '}
          <Link
            to="/login"
            style={{ color: 'rgba(56, 189, 248, 1)', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
