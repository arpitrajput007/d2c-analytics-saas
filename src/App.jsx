import React, { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from './supabaseClient';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load pages for better performance
const Landing = lazy(() => import('./components/Landing'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const PersonalPanel = lazy(() => import('./components/PersonalPanel'));

const LoadingFallback = () => (
  <div style={{
    height: '100vh',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    gap: '20px',
    background: '#07071a',
  }}>
    <div style={{
      width: '52px', height: '52px',
      background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
      borderRadius: '14px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 40px rgba(167, 139, 250, 0.3)',
      animation: 'pulse 2s ease-in-out infinite',
    }}>
      <img src="/logo.svg" alt="Pocket Dashboard Logo" style={{ width: '28px', height: '28px' }} />
    </div>

    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.2px' }}>
      Loading...
    </div>
    <style>{`
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
      }
    `}</style>
  </div>
);

export default function App() {
  const [session, setSession] = useState(null);
  const [store,   setStore]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkOnboarding(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkOnboarding(session.user.id);
      else { setStore(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboarding = async (userId) => {
    const { data } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', userId)
      .single();

    if (data) {
      setStore(data);
      if (data.primary_color) {
        document.documentElement.style.setProperty('--primary', data.primary_color);
        document.documentElement.style.setProperty('--primary-hover', data.primary_color);
        document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${data.primary_color} 0%, #111 100%)`);
      }
    }
    setLoading(false);
  };

  if (loading) return <LoadingFallback />;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={session ? <Navigate to="/dashboard" /> : <Signup />} 
        />
        <Route 
          path="/dashboard" 
          element={session ? <PersonalPanel session={session} store={store} /> : <Navigate to="/login" />} 
        />
        
        {/* Compatibility routes */}
        <Route path="/onboard" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

