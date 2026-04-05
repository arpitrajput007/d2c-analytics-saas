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

function Dashboard({ store, session }) {
  const [activeTab, setActiveTab] = useState('daily');
  const [intelDrawerOpen, setIntelDrawerOpen] = useState(false);

  // A real implementation would check store.plan_type === 'pro'
  // For demo logic, we'll hardcode it to check if they specifically upgraded
  const isPro = store?.plan_type === 'pro';

  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'sheet', label: 'Sheet View' },
    { id: 'products', label: 'Products' },
    { id: 'pricing', label: 'Pricing 🔒' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'all-time', label: 'All Time' },
    { id: 'analytics', label: 'Business Analytics 🔒' }
  ];

  return (
    <div className="container">
      <header>
        <h1>{store.store_name} Analytics <span style={{fontSize: '12px', background: 'var(--primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle', marginLeft: '8px'}}>PRO</span></h1>
        <div className="header-controls">
          <button 
            id="btn-intel-toggle" 
            onClick={() => setIntelDrawerOpen(!intelDrawerOpen)}
          >
            <span>✨</span> Co-Pilot
          </button>
          <button id="btn-sync-now" className="primary" onClick={() => alert('Trigger Backend Shopify Sync here!')}>
            Sync Data
          </button>
          <button onClick={() => supabase.auth.signOut()} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>Logout</button>
        </div>
      </header>

      <div className="tabs">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {activeTab === 'daily' && <DailyDashboard />}
      {activeTab === 'sheet' && <SheetView />}
      {activeTab === 'products' && <ProductsView />}
      {activeTab === 'weekly' && <WeeklyView />}
      {activeTab === 'monthly' && <MonthlyView />}
      {activeTab === 'all-time' && <AllTimeView />}
      
      {/* Monetized Features wrapped in Paywall */}
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

      {/* Intelligence Drawer powered by AI Co-Pilot */}
      <div id="intel-drawer" className={`intel-drawer ${intelDrawerOpen ? 'active' : ''}`}>
        <div className="intel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>✨ AI Co-Pilot</h3>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button id="btn-intel-close" style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }} onClick={() => setIntelDrawerOpen(false)}>&times;</button>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <AICopilot store={store} />
        </div>
      </div>
    </div>
  );
}

export default App = () => {
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

  if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;

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
};
