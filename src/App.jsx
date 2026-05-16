import React, { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from './supabaseClient';
import { Routes, Route, Navigate } from 'react-router-dom';
import BrandLogo from './components/BrandLogo';

// Lazy load pages for better performance
const Landing = lazy(() => import('./components/Landing'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const PersonalPanel = lazy(() => import('./components/PersonalPanel'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./components/TermsAndConditions'));
const ContactPage = lazy(() => import('./components/ContactPage'));

const LoadingFallback = () => (
  <div style={{
    height: '100vh',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    gap: '28px',
    background: 'var(--bg-primary)',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Ambient glow */}
    <div style={{
      position: 'absolute',
      width: '400px', height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    }} />

    {/* Logo container */}
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px',
      animation: 'logoFadeIn 0.6s ease forwards',
      position: 'relative', zIndex: 1,
    }}>
      {/* Glass backing card */}
      <div style={{
        padding: '20px 32px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 40px rgba(99,102,241,0.12), 0 0 0 1px rgba(99,102,241,0.08)',
        animation: 'pulse 2.4s ease-in-out infinite',
      }}>
        <BrandLogo variant="full" iconSize={56} />
      </div>
    </div>

    {/* Loading dots */}
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.6)',
          animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>

    <style>{`
      @keyframes pulse {
        0%, 100% { transform: scale(1); box-shadow: 0 8px 40px rgba(99,102,241,0.12); }
        50% { transform: scale(1.015); box-shadow: 0 8px 56px rgba(99,102,241,0.22); }
      }
      @keyframes logoFadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes dotBounce {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
        40% { transform: scale(1); opacity: 1; }
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
    try {
      // Use maybeSingle() — safe when 0 rows exist (single() throws an error)
      // Add order+limit to handle edge case of multiple rows for same user
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[checkOnboarding] Supabase error fetching store:', error.message, error.code);
      }

      if (data) {
        console.log('[checkOnboarding] Store found:', data.store_name, data.shopify_domain);
        setStore(data);
        if (data.primary_color) {
          document.documentElement.style.setProperty('--primary', data.primary_color);
          document.documentElement.style.setProperty('--primary-hover', data.primary_color);
          document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${data.primary_color} 0%, #111 100%)`);
        }
      } else {
        console.log('[checkOnboarding] No store found for userId:', userId);
        setStore(null);
      }
    } catch (err) {
      console.error('[checkOnboarding] Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Allow child components (e.g. after onboarding/delete/edit) to trigger a store re-fetch
  // NOTE: do NOT setLoading(true) here — that unmounts PersonalPanel and resets the active tab
  const refreshStore = async () => {
    if (session?.user?.id) {
      await checkOnboarding(session.user.id);
    }
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
          element={session ? <PersonalPanel session={session} store={store} onStoreConnected={refreshStore} /> : <Navigate to="/login" />} 
        />
        
        {/* Compatibility routes */}
        <Route path="/onboard" element={<Navigate to="/dashboard" />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

