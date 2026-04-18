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

const NAV_ITEMS = [
  { id: 'daily',     label: 'Command Center',      icon: '🛡️', section: 'Analytics' },
  { id: 'sheet',     label: 'Sheet View',           icon: '📋', section: 'Analytics' },
  { id: 'products',  label: 'Products',             icon: '📦', section: 'Analytics' },
  { id: 'weekly',    label: 'Weekly',               icon: '📅', section: 'Reports' },
  { id: 'monthly',   label: 'Monthly',              icon: '🗓️', section: 'Reports' },
  { id: 'all-time',  label: 'All Time',             icon: '📈', section: 'Reports' },
  { id: 'pricing',   label: 'Pricing',              icon: '💰', section: 'PRO', pro: true },
  { id: 'analytics', label: 'Business Analytics',   icon: '🧠', section: 'PRO', pro: true },
];

function Dashboard({ store, session }) {
  const [activeTab, setActiveTab] = useState('daily');
  const [intelDrawerOpen, setIntelDrawerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isPro = store?.plan_type === 'pro';

  const activeNav = NAV_ITEMS.find(n => n.id === activeTab);
  const sections = [...new Set(NAV_ITEMS.map(n => n.section))];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${mobileSidebarOpen ? 'visible' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🛡️</div>
          <div>
            <div className="sidebar-logo-text">Profit Control</div>
            <div className="sidebar-logo-sub">POWERED BY GEMINI AI</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sections.map(section => (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {NAV_ITEMS.filter(n => n.section === section).map(item => (
                <div
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.pro && !isPro && <span className="nav-lock">🔒</span>}
                  {item.pro && isPro && <span className="nav-badge">PRO</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-store-info" onClick={() => supabase.auth.signOut()}>
            <div className="store-avatar">
              {store.store_name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="store-name-small">{store.store_name}</div>
              <div className="store-plan">{isPro ? '✦ PRO Plan' : 'Free Plan'}</div>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>↩</span>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
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
            <div className="pro-badge">
              ✦ PRO
            </div>
            <button
              id="btn-intel-toggle"
              onClick={() => setIntelDrawerOpen(!intelDrawerOpen)}
            >
              ✨ Co-Pilot
            </button>
            <button
              id="btn-sync-now"
              className="primary"
              style={{ padding: '8px 16px', fontSize: '13px' }}
              onClick={() => alert('Trigger Backend Shopify Sync here!')}
            >
              ⟳ Sync
            </button>
          </div>
        </header>

        {/* Page Views */}
        <div className="page-content">
          <div style={{ animation: 'fadeInUp 0.35s ease forwards' }}>
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

      {/* AI Co-Pilot Drawer */}
      <div id="intel-drawer" className={`intel-drawer ${intelDrawerOpen ? 'active' : ''}`}>
        <div className="intel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', boxShadow: '0 0 16px rgba(139,92,246,0.3)'
            }}>✨</div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '16px' }}>AI Co-Pilot</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Powered by Gemini</div>
            </div>
          </div>
          <button
            id="btn-intel-close"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '22px', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}
            onClick={() => setIntelDrawerOpen(false)}
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
  const [store, setStore] = useState(null);
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
      else {
        setStore(null);
        setLoading(false);
      }
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
      <div className="spinner" />
      <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Loading your analytics...</div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={
        !session ? <Auth /> :
        !store ? <Navigate to="/onboard" /> :
        <Dashboard store={store} session={session} />
      } />
      <Route path="/onboard" element={
        !session ? <Navigate to="/" /> :
        store ? <Navigate to="/" /> :
        <Onboarding session={session} />
      } />
    </Routes>
  );
}
