import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import PersonalPanel from './components/PersonalPanel';



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

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkOnboarding(session.user.id);
      else { setStore(null); setLoading(false); }
    });
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

  if (loading) return (
    <div style={{
      height: '100vh',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      gap: '20px',
      background: 'var(--bg-color)',
    }}>
      {/* Animated logo */}
      <div style={{
        width: '52px', height: '52px',
        background: 'var(--gradient-button)',
        borderRadius: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--shadow-glow-aurora)',
        animation: 'float-aurora 2s ease-in-out infinite',
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px' }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div className="spinner" />
      <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.2px' }}>
        Loading your analytics…
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={
        !session
          ? <Auth />
          : <PersonalPanel session={session} store={store} />
      } />
      <Route path="/onboard" element={<Navigate to="/" />} />
    </Routes>
  );
}
