import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';

import DailyDashboard from './components/DailyDashboard';
import SheetView from './components/SheetView';
import PricingView from './components/PricingView';
import BusinessAnalytics from './components/BusinessAnalytics';
import ProductsView from './components/ProductsView';
import WeeklyView from './components/WeeklyView';
import MonthlyView from './components/MonthlyView';
import AllTimeView from './components/AllTimeView';

import Paywall from './components/Paywall';
import AICopilot from './components/AICopilot';

/* ─── SVG Icon System ──────────────────────────────────────── */
const icons = {
  shield:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  table:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  box:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  trend:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  dollar:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  brain:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.58A3 3 0 016.5 9a2.5 2.5 0 013-2.46A2.5 2.5 0 019.5 2z"/><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.58A3 3 0 0017.5 9a2.5 2.5 0 00-3-2.46A2.5 2.5 0 0014.5 2z"/></svg>,
  logout:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  refresh:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  sparkle:  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
};

const NAV_ITEMS = [
  { id: 'daily',     label: 'Command Center',    icon: 'shield',   section: 'Analytics' },
  { id: 'sheet',     label: 'Sheet View',         icon: 'table',    section: 'Analytics' },
  { id: 'products',  label: 'Products',           icon: 'box',      section: 'Analytics' },
  { id: 'weekly',    label: 'Weekly',             icon: 'calendar', section: 'Reports' },
  { id: 'monthly',   label: 'Monthly',            icon: 'clock',    section: 'Reports' },
  { id: 'all-time',  label: 'All Time',           icon: 'trend',    section: 'Reports' },
  { id: 'pricing',   label: 'Pricing',            icon: 'dollar',   section: 'PRO', pro: true },
  { id: 'analytics', label: 'Business Analytics', icon: 'brain',    section: 'PRO', pro: true },
];

function NavIcon({ name }) {
  return (
    <span className="nav-icon">
      {icons[name]}
    </span>
  );
}

function Dashboard({ store, session }) {
  const [activeTab, setActiveTab]           = useState('daily');
  const [intelDrawerOpen, setIntelDrawerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [syncing, setSyncing]               = useState(false);

  const isPro = store?.plan_type === 'pro';
  const activeNav = NAV_ITEMS.find(n => n.id === activeTab);
  const sections  = [...new Set(NAV_ITEMS.map(n => n.section))];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileSidebarOpen(false);
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
    alert('Trigger Backend Shopify Sync here!');
  };

  return (
    <div className="app-shell">
      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay ${mobileSidebarOpen ? 'visible' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* ════════ SIDEBAR ════════ */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" style={{ fontSize: '0', background: 'var(--gradient-button)', boxShadow: '0 0 0 1px rgba(167, 139, 250, 0.3), var(--shadow-glow-aurora)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <div className="sidebar-logo-text" style={{ background: 'var(--text-main)' }}>ProfitControl</div>
            <div className="sidebar-logo-sub">Powered by Gemini AI</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {sections.map(section => (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {NAV_ITEMS.filter(n => n.section === section).map((item, idx) => (
                <div
                  key={item.id}
                  id={`nav-${item.id}`}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  <NavIcon name={item.icon} />
                  <span className="nav-label">{item.label}</span>
                  {item.pro && !isPro && <span className="nav-lock">🔒</span>}
                  {item.pro && isPro  && <span className="nav-badge">PRO</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer / Store Info */}
        <div className="sidebar-footer">
          <div className="sidebar-store-info" onClick={() => supabase.auth.signOut()}>
            {/* Avatar with rotating gradient ring */}
            <div className="store-avatar-wrap">
              <div className="store-avatar">
                {store.store_name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="store-name-small">{store.store_name}</div>
              <div className="store-plan">{isPro ? '✦ PRO Plan' : 'Free Plan'}</div>
            </div>
            <span className="nav-icon" style={{ opacity: 0.4 }}>
              {icons.logout}
            </span>
          </div>
        </div>
      </aside>

      {/* ════════ MAIN CONTENT ════════ */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              id="btn-mobile-nav"
              className="mobile-nav-toggle"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
            <div>
              <div className="page-title">{activeNav?.label || 'Dashboard'}</div>
            </div>
          </div>

          <div className="topbar-right">
            {/* Live indicator */}
            <div className="live-dot" style={{ display: 'none' }}></div>

            <div className="pro-badge">
              ✦ PRO
            </div>

            <button
              id="btn-intel-toggle"
              className="btn-aurora"
              onClick={() => setIntelDrawerOpen(!intelDrawerOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', fontSize: '13px' }}
            >
              <span style={{ display: 'flex', width: '16px', height: '16px', color: '#000' }}>
                {icons.sparkle}
              </span>
              Co-Pilot
            </button>

            <button
              id="btn-sync-now"
              className="primary"
              onClick={handleSync}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                animation: syncing ? 'spin 1s linear infinite' : 'none',
              }}
            >
              <span style={{ display: 'flex', width: '14px', height: '14px', animation: syncing ? 'spin 1s linear infinite' : 'none' }}>
                {icons.refresh}
              </span>
              {syncing ? 'Syncing…' : 'Sync'}
            </button>
          </div>
        </header>

        {/* Page Views */}
        <div className="page-content">
          <div
            key={activeTab}
            style={{ animation: 'fadeInUp 0.35s cubic-bezier(0.23,1,0.32,1) forwards' }}
          >
            {activeTab === 'daily'    && <DailyDashboard />}
            {activeTab === 'sheet'    && <SheetView />}
            {activeTab === 'products' && <ProductsView />}
            {activeTab === 'weekly'   && <WeeklyView />}
            {activeTab === 'monthly'  && <MonthlyView />}
            {activeTab === 'all-time' && <AllTimeView />}

            {activeTab === 'pricing' && (
              <Paywall isPro={isPro}>
                <PricingView />
              </Paywall>
            )}

            {activeTab === 'analytics' && (
              <Paywall isPro={isPro}>
                <BusinessAnalytics />
              </Paywall>
            )}
          </div>
        </div>
      </div>

      {/* ════════ AI CO-PILOT DRAWER ════════ */}
      <div id="intel-drawer" className={`intel-drawer ${intelDrawerOpen ? 'active' : ''}`}>
        <div className="intel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px',
              boxShadow: '0 0 20px rgba(139,92,246,0.4)',
            }}>
              <span style={{ display: 'flex', width: '18px', height: '18px', color: 'white' }}>
                {icons.sparkle}
              </span>
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.2px' }}>AI Co-Pilot</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Powered by Gemini</div>
            </div>
          </div>
          <button
            id="btn-intel-close"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'color 0.2s' }}
            onClick={() => setIntelDrawerOpen(false)}
            onMouseEnter={e => e.target.style.color = 'var(--text-main)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <AICopilot store={store} />
        </div>
      </div>
    </div>
  );
}

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
        !session ? <Auth /> :
        !store   ? <Navigate to="/onboard" /> :
                   <Dashboard store={store} session={session} />
      } />
      <Route path="/onboard" element={
        !session ? <Navigate to="/" /> :
        store    ? <Navigate to="/" /> :
                   <Onboarding session={session} />
      } />
    </Routes>
  );
}
