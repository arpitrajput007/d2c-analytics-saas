import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  LayoutDashboard, Link2, Settings, Headphones,
  LogOut, ChevronRight, Unplug, ShieldCheck, Sparkles, SlidersHorizontal, Package, DollarSign,
  BarChart, Calendar, TrendingUp, PieChart, List
} from 'lucide-react';
import Onboarding from './Onboarding';
import AdvancedSettings from './AdvancedSettings';
import ProductsView from './ProductsView';
import PricingView from './PricingView';
import DailyDashboard from './DailyDashboard';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';
import AllTimeView from './AllTimeView';
import BusinessAnalytics from './BusinessAnalytics';
import SheetView from './SheetView';

/* ─────────────────────────────────────────────
   EMPTY STATE — No store connected
───────────────────────────────────────────── */
function NoStoreState({ onConnectClick }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', minHeight: '70vh',
      textAlign: 'center', gap: '28px', padding: '40px',
    }}>
      <div style={{
        width: '110px', height: '110px', borderRadius: '30px',
        background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(56,189,248,0.12))',
        border: '1px solid rgba(167,139,250,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 80px -10px rgba(167,139,250,0.35), 0 0 0 1px rgba(167,139,250,0.1)',
        animation: 'panel-float 4s ease-in-out infinite',
      }}>
        <Unplug size={48} color="rgba(167,139,250,0.85)" strokeWidth={1.5} />
      </div>

      <div>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800,
          color: '#fff', margin: '0 0 12px 0', letterSpacing: '-0.5px',
        }}>
          No store connected yet
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.45)', fontSize: '15px',
          maxWidth: '400px', lineHeight: 1.75, margin: 0,
        }}>
          Connect your Shopify store to unlock real-time profit tracking,
          risk alerts, and your full business analytics dashboard.
        </p>
      </div>

      <button
        onClick={onConnectClick}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '15px 30px', borderRadius: '14px', border: 'none',
          background: 'linear-gradient(135deg, rgba(167,139,250,1), rgba(56,189,248,1))',
          color: '#000', fontWeight: 700, fontSize: '15px',
          cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          boxShadow: '0 0 48px -8px rgba(167,139,250,0.55)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 64px -8px rgba(167,139,250,0.75)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 48px -8px rgba(167,139,250,0.55)'; }}
      >
        <Link2 size={18} />
        Connect your Store
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRO PLAN REQUIRED STATE
───────────────────────────────────────────── */
function ProRequiredState({ onUpgradeClick }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', minHeight: '60vh',
      textAlign: 'center', gap: '22px', padding: '40px',
    }}>
      <div style={{
        width: '84px', height: '84px', borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(245,200,66,0.1), rgba(234,88,12,0.1))',
        border: '1px solid rgba(245,200,66,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 48px -12px rgba(245,200,66,0.3)',
      }}>
        <Sparkles size={38} color="rgba(245,200,66,0.85)" strokeWidth={1.5} />
      </div>
      <div>
        <div style={{
          display: 'inline-block', padding: '4px 14px', borderRadius: '999px',
          background: 'rgba(245,200,66,0.08)', border: '1px solid rgba(245,200,66,0.18)',
          color: 'rgba(245,200,66,0.9)', fontSize: '11px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px',
        }}>
          Pro Feature
        </div>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 800,
          color: '#fff', margin: '0 0 10px 0', letterSpacing: '-0.3px',
        }}>
          Unlock Complete Analytics
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.45)', fontSize: '14px',
          maxWidth: '360px', lineHeight: 1.6, margin: 0,
        }}>
          You're currently on the Starter plan. Upgrade to Pro to unlock SKU-level insights, loss identification, and AI-powered recommendations.
        </p>
      </div>

      <button
        onClick={onUpgradeClick}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', borderRadius: '12px', border: 'none',
          background: 'rgba(245,200,66,0.1)', color: 'rgba(245,200,66,1)',
          border: '1px solid rgba(245,200,66,0.3)',
          fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,200,66,0.15)'; e.currentTarget.style.borderColor = 'rgba(245,200,66,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,200,66,0.1)'; e.currentTarget.style.borderColor = 'rgba(245,200,66,0.3)'; }}
      >
        Upgrade to Pro
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TRIAL EXPIRED STATE
───────────────────────────────────────────── */
function TrialExpiredState({ onUpgradeClick }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', minHeight: '70vh',
      textAlign: 'center', gap: '28px', padding: '40px',
    }}>
      <div style={{
        width: '110px', height: '110px', borderRadius: '30px',
        background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.12))',
        border: '1px solid rgba(239,68,68,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 80px -10px rgba(239,68,68,0.35), 0 0 0 1px rgba(239,68,68,0.1)',
        animation: 'panel-float 4s ease-in-out infinite',
      }}>
        <div style={{ fontSize: '48px' }}>⏳</div>
      </div>

      <div>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800,
          color: '#fff', margin: '0 0 12px 0', letterSpacing: '-0.5px',
        }}>
          Your 14-Day Free Trial has expired
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.45)', fontSize: '15px',
          maxWidth: '440px', lineHeight: 1.75, margin: 0,
        }}>
          Upgrade to a paid plan to continue tracking your real profit,
          optimizing your metrics, and reducing your RTO losses.
        </p>
      </div>

      <button
        onClick={onUpgradeClick}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '15px 30px', borderRadius: '14px', border: 'none',
          background: 'linear-gradient(135deg, rgba(245,200,66,1), rgba(234,88,12,1))',
          color: '#000', fontWeight: 700, fontSize: '15px',
          cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          boxShadow: '0 0 48px -8px rgba(245,200,66,0.55)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 64px -8px rgba(245,200,66,0.75)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 48px -8px rgba(245,200,66,0.55)'; }}
      >
        <DollarSign size={18} />
        View Pricing & Upgrade
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMING SOON PLACEHOLDER
───────────────────────────────────────────── */
function ComingSoon({ icon: Icon, title, description }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', minHeight: '60vh',
      textAlign: 'center', gap: '22px', padding: '40px',
    }}>
      <div style={{
        width: '84px', height: '84px', borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(167,139,250,0.1))',
        border: '1px solid rgba(56,189,248,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 48px -12px rgba(56,189,248,0.3)',
      }}>
        <Icon size={38} color="rgba(56,189,248,0.85)" strokeWidth={1.5} />
      </div>
      <div>
        <div style={{
          display: 'inline-block', padding: '4px 14px', borderRadius: '999px',
          background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)',
          color: 'rgba(167,139,250,0.9)', fontSize: '11px', fontWeight: 700,
          letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px',
        }}>Coming Soon</div>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: '26px', fontWeight: 800,
          color: '#fff', margin: '0 0 10px 0', letterSpacing: '-0.3px',
        }}>{title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', maxWidth: '380px', lineHeight: 1.75, margin: 0 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR NAV ITEM — Premium active state
───────────────────────────────────────────── */
function NavItem({ icon: Icon, label, active, onClick, badge }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        width: '100%', padding: '11px 14px', borderRadius: '12px',
        background: active
          ? 'linear-gradient(135deg, rgba(245,200,66,0.12) 0%, rgba(245,200,66,0.05) 100%)'
          : hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        border: active ? '1px solid rgba(245,200,66,0.22)' : '1px solid transparent',
        color: active ? '#fff' : hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
        cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.2s ease',
        fontFamily: 'Outfit, sans-serif', fontSize: '13.5px', fontWeight: active ? 600 : 500,
        boxShadow: active ? '0 0 24px -8px rgba(245,200,66,0.3), inset 0 0 20px rgba(245,200,66,0.03)' : 'none',
        position: 'relative',
        transform: hovered && !active ? 'translateX(2px)' : 'translateX(0)',
      }}
    >
      {/* Golden left border for active */}
      {active && (
        <div style={{
          position: 'absolute', left: 0, top: '18%', bottom: '18%',
          width: '3px', borderRadius: '0 3px 3px 0',
          background: 'linear-gradient(180deg, #f5c842, #f0a520)',
          boxShadow: '0 0 12px rgba(245,200,66,0.6)',
        }} />
      )}
      <Icon size={17} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
          background: 'rgba(245,200,66,0.15)', color: 'rgba(245,200,66,1)',
          border: '1px solid rgba(245,200,66,0.25)', letterSpacing: '0.5px',
        }}>{badge}</span>
      )}
      {active && <ChevronRight size={13} style={{ opacity: 0.35, flexShrink: 0 }} />}
    </button>
  );
}

/* ─────────────────────────────────────────────
   MAIN PERSONAL PANEL
───────────────────────────────────────────── */
export default function PersonalPanel({ session, store }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userEmail = session?.user?.email || '';
  const userInitial = userEmail.charAt(0).toUpperCase();
  const isConnected = !!store;
  
  const trialDuration = 14 * 24 * 60 * 60 * 1000;
  const storeCreatedAt = store?.created_at ? new Date(store.created_at).getTime() : Date.now();
  const isTrialExpired = isConnected && (Date.now() - storeCreatedAt > trialDuration) && store.subscription_status !== 'active';

  const handleSignOut = () => supabase.auth.signOut();

  const tabTitles = {
    dashboard: 'Business Dashboard',
    weekly: 'Weekly Performance',
    monthly: 'Monthly Overview',
    'all-time': 'All-Time Analytics',
    analytics: 'Business Analytics',
    sheet: 'Sheet View',
    connect: 'Connect your Store',
    products: 'Products',
    pricing: 'Pricing Management',
    advanced: 'Advanced Settings',
    settings: 'Settings',
    support: 'Talk to Support',
  };

  return (
    <>
      <style>{`
        @keyframes panel-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes orb-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.08); }
          66% { transform: translate(-25px, 20px) scale(0.92); }
        }
        @keyframes orb-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-35px, 25px) scale(1.05); }
          66% { transform: translate(30px, -20px) scale(0.95); }
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(45,212,160,0.8); }
          50% { opacity: 0.5; box-shadow: 0 0 2px rgba(45,212,160,0.3); }
        }
        .panel-shell {
          display: flex; height: 100vh; overflow: hidden;
          background: #07071a;
          font-family: 'Outfit', 'Inter', sans-serif;
          position: relative;
        }
        .panel-shell::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 65% 45% at 8% 8%, rgba(167,139,250,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 92% 15%, rgba(56,189,248,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 50% 45% at 50% 98%, rgba(236,72,153,0.08) 0%, transparent 60%);
        }
        .panel-sidebar {
          width: 256px; flex-shrink: 0;
          background: rgba(7,7,22,0.82);
          backdrop-filter: blur(32px) saturate(160%);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          z-index: 10; position: relative;
          transition: transform 0.3s ease;
        }
        /* Subtle right-edge catchlight */
        .panel-sidebar::after {
          content: '';
          position: absolute; top: 0; right: -1px;
          width: 1px; height: 100%;
          background: linear-gradient(180deg,
            transparent 0%,
            rgba(245,200,66,0.25) 20%,
            rgba(245,200,66,0.1) 50%,
            rgba(167,139,250,0.15) 80%,
            transparent 100%
          );
          pointer-events: none;
        }
        .panel-main {
          flex: 1; display: flex; flex-direction: column;
          overflow: hidden; z-index: 1; position: relative;
        }
        .panel-topbar {
          height: 66px; flex-shrink: 0;
          background: rgba(7,7,22,0.75);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center;
          padding: 0 28px; gap: 16px;
          position: relative;
        }
        /* Gold underline gradient on topbar */
        .panel-topbar::after {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,200,66,0.18) 30%, rgba(167,139,250,0.12) 70%, transparent);
          pointer-events: none;
        }
        .panel-content {
          flex: 1; overflow-y: auto; padding: 32px;
        }
        .panel-content::-webkit-scrollbar { width: 4px; }
        .panel-content::-webkit-scrollbar-track { background: transparent; }
        .panel-content::-webkit-scrollbar-thumb {
          background: rgba(245,200,66,0.2);
          border-radius: 99px;
        }
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0; background: rgba(0,0,0,0.65);
          backdrop-filter: blur(4px); z-index: 9;
        }
        @media (max-width: 768px) {
          .panel-sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); }
          .panel-sidebar.open { transform: translateX(0); }
          .sidebar-overlay.visible { display: block; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      <div className="panel-shell">
        <div className={`sidebar-overlay ${mobileSidebarOpen ? 'visible' : ''}`} onClick={() => setMobileSidebarOpen(false)} />

        {/* ══════ SIDEBAR ══════ */}
        <aside className={`panel-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
          {/* Brand */}
          <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0,
                background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 24px -4px rgba(167,139,250,0.65), 0 0 0 1px rgba(167,139,250,0.2)',
              }}>
                <ShieldCheck size={19} color="#000" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                  Pocket Dashboard
                </div>
                <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.3)', marginTop: '1px', letterSpacing: '0.3px' }}>
                  Your Command Center
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
            <div style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '1.2px', textTransform: 'uppercase', padding: '8px 10px 6px', marginBottom: '2px' }}>
              Analytics
            </div>
            <NavItem icon={LayoutDashboard} label="Daily Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }} />
            <NavItem icon={BarChart} label="Weekly Performance" active={activeTab === 'weekly'} onClick={() => { setActiveTab('weekly'); setMobileSidebarOpen(false); }} />
            <NavItem icon={Calendar} label="Monthly Overview" active={activeTab === 'monthly'} onClick={() => { setActiveTab('monthly'); setMobileSidebarOpen(false); }} />
            <NavItem icon={TrendingUp} label="All-Time Analytics" active={activeTab === 'all-time'} onClick={() => { setActiveTab('all-time'); setMobileSidebarOpen(false); }} />
            <NavItem icon={PieChart} label="Business Analytics" active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setMobileSidebarOpen(false); }} />
            <NavItem icon={List} label="Sheet View" active={activeTab === 'sheet'} onClick={() => { setActiveTab('sheet'); setMobileSidebarOpen(false); }} />

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 4px' }} />
            
            <div style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '1.2px', textTransform: 'uppercase', padding: '8px 10px 6px', marginBottom: '2px' }}>
              Management
            </div>
            <NavItem icon={Package} label="Products" active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); }} />
            <NavItem icon={DollarSign} label="Pricing" active={activeTab === 'pricing'} onClick={() => { setActiveTab('pricing'); setMobileSidebarOpen(false); }} />
            <NavItem icon={Link2} label="Connect your Store" active={activeTab === 'connect'} onClick={() => { setActiveTab('connect'); setMobileSidebarOpen(false); }} badge={isConnected ? null : 'Setup'} />

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 4px' }} />
            <div style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '1.2px', textTransform: 'uppercase', padding: '4px 10px 6px' }}>
              Account
            </div>
            <NavItem icon={SlidersHorizontal} label="Advanced Settings" active={activeTab === 'advanced'} onClick={() => { setActiveTab('advanced'); setMobileSidebarOpen(false); }} />
            <NavItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }} />
            <NavItem icon={Headphones} label="Talk to Support" active={activeTab === 'support'} onClick={() => { setActiveTab('support'); setMobileSidebarOpen(false); }} />
          </nav>

          {/* User footer */}
          <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onClick={handleSignOut}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,113,133,0.06)'; e.currentTarget.style.borderColor = 'rgba(251,113,133,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              title="Sign Out"
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(167,139,250,0.8), rgba(56,189,248,0.8))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 800, color: '#000',
                boxShadow: '0 0 12px rgba(167,139,250,0.25)',
              }}>{userInitial}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
                <div style={{ fontSize: '10.5px', color: 'rgba(251,113,133,0.7)', marginTop: '1px', fontWeight: 500 }}>Sign out</div>
              </div>
              <LogOut size={14} color="rgba(251,113,133,0.4)" />
            </div>
          </div>
        </aside>

        {/* ══════ MAIN ══════ */}
        <div className="panel-main">
          {/* Topbar */}
          <header className="panel-topbar">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
              className="mobile-menu-btn"
            >☰</button>

            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
                {tabTitles[activeTab]}
              </div>
              {!isConnected && activeTab === 'dashboard' && (
                <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>
                  Connect a store to see your data
                </div>
              )}
              {isConnected && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'rgba(45,212,160,0.85)', marginTop: '2px', fontWeight: 500 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2dd4a0', animation: 'live-pulse 2s ease infinite' }} />
                  {store?.store_name} — Live
                </div>
              )}
            </div>

            {/* AI Co-Pilot CTA */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '8px 16px', borderRadius: '11px',
              background: 'linear-gradient(135deg, rgba(167,139,250,1), rgba(56,189,248,1))',
              color: '#000', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              boxShadow: '0 0 28px -6px rgba(167,139,250,0.55), 0 0 0 1px rgba(167,139,250,0.2)',
              fontFamily: 'Outfit, sans-serif',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 44px -4px rgba(167,139,250,0.75), 0 0 0 1px rgba(167,139,250,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 28px -6px rgba(167,139,250,0.55), 0 0 0 1px rgba(167,139,250,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Sparkles size={14} />
              Co-Pilot
            </div>
          </header>

          {/* Content */}
          <div className="panel-content">
            {isTrialExpired && !['pricing', 'connect', 'support', 'settings'].includes(activeTab) ? (
              <TrialExpiredState onUpgradeClick={() => setActiveTab('pricing')} />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  isConnected ? <DailyDashboard store={store} /> : <NoStoreState onConnectClick={() => setActiveTab('connect')} />
                )}
                {activeTab === 'sheet' && isConnected && <SheetView store={store} />}
                
                {['weekly', 'monthly', 'all-time', 'analytics', 'products', 'advanced'].includes(activeTab) && isConnected && store.subscription_plan === 'starter' && (
                  <ProRequiredState onUpgradeClick={() => setActiveTab('pricing')} />
                )}

                {activeTab === 'weekly' && isConnected && store.subscription_plan !== 'starter' && <WeeklyView store={store} />}
                {activeTab === 'monthly' && isConnected && store.subscription_plan !== 'starter' && <MonthlyView store={store} />}
                {activeTab === 'all-time' && isConnected && store.subscription_plan !== 'starter' && <AllTimeView store={store} />}
                {activeTab === 'analytics' && isConnected && store.subscription_plan !== 'starter' && <BusinessAnalytics store={store} />}
                {activeTab === 'products' && store.subscription_plan !== 'starter' && <ProductsView store={store} />}
                {activeTab === 'advanced' && store.subscription_plan !== 'starter' && <AdvancedSettings store={store} />}

                {['weekly', 'monthly', 'all-time', 'analytics', 'sheet', 'products', 'advanced'].includes(activeTab) && !isConnected && (
                  <NoStoreState onConnectClick={() => setActiveTab('connect')} />
                )}
                {activeTab === 'connect' && (
                  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <Onboarding session={session} isEmbedded />
                  </div>
                )}
                {activeTab === 'pricing' && <PricingView store={store} />}
                {activeTab === 'settings' && (
                  <ComingSoon icon={Settings} title="Settings" description="Manage your account preferences, notifications, and billing options — coming very soon." />
                )}
                {activeTab === 'support' && (
                  <ComingSoon icon={Headphones} title="Talk to Support" description="Live chat and priority support for all brand owners. Launching shortly — you'll be notified." />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
