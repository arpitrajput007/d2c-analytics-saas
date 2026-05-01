import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  LayoutDashboard, Link2, Settings, Headphones,
  LogOut, ChevronRight, Unplug, ShieldCheck, Sparkles, SlidersHorizontal
} from 'lucide-react';
import Onboarding from './Onboarding';
import AdvancedSettings from './AdvancedSettings';

/* ─────────────────────────────────────────────
   EMPTY STATE — No store connected
───────────────────────────────────────────── */
function NoStoreState({ onConnectClick }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', minHeight: '70vh',
      textAlign: 'center', gap: '24px', padding: '40px',
    }}>
      {/* Glowing icon */}
      <div style={{
        width: '100px', height: '100px', borderRadius: '28px',
        background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(56,189,248,0.15))',
        border: '1px solid rgba(167,139,250,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 60px -10px rgba(167,139,250,0.4)',
        animation: 'panel-float 4s ease-in-out infinite',
      }}>
        <Unplug size={44} color="rgba(167,139,250,0.9)" strokeWidth={1.5} />
      </div>

      <div>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: '26px', fontWeight: 800,
          color: '#fff', margin: '0 0 10px 0', letterSpacing: '-0.3px',
        }}>
          No store connected yet
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.5)', fontSize: '15px',
          maxWidth: '400px', lineHeight: 1.7, margin: 0,
        }}>
          Connect your Shopify store to unlock real-time profit tracking,
          risk alerts, and your full business analytics dashboard.
        </p>
      </div>

      <button
        onClick={onConnectClick}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '14px 28px', borderRadius: '14px', border: 'none',
          background: 'linear-gradient(135deg, rgba(167,139,250,1), rgba(56,189,248,1))',
          color: '#000', fontWeight: 700, fontSize: '15px',
          cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          boxShadow: '0 0 40px -8px rgba(167,139,250,0.6)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 60px -8px rgba(167,139,250,0.8)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 40px -8px rgba(167,139,250,0.6)'; }}
      >
        <Link2 size={18} />
        Connect your Store
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
      textAlign: 'center', gap: '20px', padding: '40px',
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '22px',
        background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(167,139,250,0.12))',
        border: '1px solid rgba(56,189,248,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 40px -10px rgba(56,189,248,0.3)',
      }}>
        <Icon size={36} color="rgba(56,189,248,0.85)" strokeWidth={1.5} />
      </div>
      <div>
        <div style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: '999px',
          background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
          color: 'rgba(167,139,250,0.9)', fontSize: '11px', fontWeight: 700,
          letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px',
        }}>Coming Soon</div>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 800,
          color: '#fff', margin: '0 0 10px 0',
        }}>{title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', maxWidth: '380px', lineHeight: 1.7, margin: 0 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR NAV ITEM
───────────────────────────────────────────── */
function NavItem({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        width: '100%', padding: '11px 14px', borderRadius: '12px',
        background: active ? 'rgba(167,139,250,0.15)' : 'transparent',
        border: active ? '1px solid rgba(167,139,250,0.3)' : '1px solid transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.55)',
        cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.2s ease',
        fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: active ? 600 : 500,
        boxShadow: active ? '0 0 20px -8px rgba(167,139,250,0.4)' : 'none',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}}
    >
      <Icon size={18} strokeWidth={active ? 2 : 1.8} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '999px',
          background: 'rgba(167,139,250,0.2)', color: 'rgba(167,139,250,1)',
          border: '1px solid rgba(167,139,250,0.3)', letterSpacing: '0.5px',
        }}>{badge}</span>
      )}
      {active && <ChevronRight size={14} style={{ opacity: 0.4 }} />}
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

  const handleSignOut = () => supabase.auth.signOut();

  const tabTitles = {
    dashboard: 'Business Dashboard',
    connect: 'Connect your Store',
    advanced: 'Advanced Settings of Store',
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
        .panel-shell {
          display: flex; height: 100vh; overflow: hidden;
          background: oklch(0.14 0.03 270);
          font-family: 'Outfit', 'Inter', sans-serif;
          position: relative;
        }
        /* Aurora background blobs */
        .panel-shell::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 10% 10%, rgba(167,139,250,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 45% at 90% 20%, rgba(56,189,248,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 55% 50% at 50% 95%, rgba(236,72,153,0.10) 0%, transparent 60%);
        }
        .panel-sidebar {
          width: 260px; flex-shrink: 0;
          background: rgba(10,10,20,0.7);
          backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column;
          z-index: 10; position: relative;
          transition: transform 0.3s ease;
        }
        .panel-main {
          flex: 1; display: flex; flex-direction: column;
          overflow: hidden; z-index: 1; position: relative;
        }
        .panel-topbar {
          height: 64px; flex-shrink: 0;
          background: rgba(10,10,20,0.6);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center;
          padding: 0 28px; gap: 16px;
        }
        .panel-content {
          flex: 1; overflow-y: auto; padding: 32px;
        }
        .panel-content::-webkit-scrollbar { width: 4px; }
        .panel-content::-webkit-scrollbar-track { background: transparent; }
        .panel-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px); z-index: 9;
        }
        @media (max-width: 768px) {
          .panel-sidebar {
            position: fixed; left: 0; top: 0; bottom: 0;
            transform: translateX(-100%);
          }
          .panel-sidebar.open { transform: translateX(0); }
          .sidebar-overlay.visible { display: block; }
        }
      `}</style>

      <div className="panel-shell">
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${mobileSidebarOpen ? 'visible' : ''}`}
          onClick={() => setMobileSidebarOpen(false)}
        />

        {/* ══════ SIDEBAR ══════ */}
        <aside className={`panel-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
          {/* Brand */}
          <div style={{
            padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(167,139,250,1), rgba(56,189,248,1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px -4px rgba(167,139,250,0.6)',
              }}>
                <ShieldCheck size={20} color="#000" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>
                  Profit Control
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>
                  Your Command Center
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '1px', textTransform: 'uppercase', padding: '8px 6px 6px', marginBottom: '2px' }}>
              Main
            </div>
            <NavItem icon={LayoutDashboard} label="Business Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }} />
            <NavItem icon={Link2} label="Connect your Store" active={activeTab === 'connect'} onClick={() => { setActiveTab('connect'); setMobileSidebarOpen(false); }} badge={isConnected ? null : 'Setup'} />

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '10px 0' }} />
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 6px 6px' }}>
              Account
            </div>
            <NavItem icon={SlidersHorizontal} label="Advanced Settings" active={activeTab === 'advanced'} onClick={() => { setActiveTab('advanced'); setMobileSidebarOpen(false); }} />
            <NavItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }} />
            <NavItem icon={Headphones} label="Talk to Support" active={activeTab === 'support'} onClick={() => { setActiveTab('support'); setMobileSidebarOpen(false); }} />
          </nav>

          {/* User footer */}
          <div style={{
            padding: '14px 12px', borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
              onClick={handleSignOut}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              title="Sign Out"
            >
              {/* Avatar */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(167,139,250,0.8), rgba(56,189,248,0.8))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 800, color: '#000',
              }}>{userInitial}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>Sign out</div>
              </div>
              <LogOut size={15} color="rgba(255,255,255,0.3)" />
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
              <div style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
                {tabTitles[activeTab]}
              </div>
              {!isConnected && activeTab === 'dashboard' && (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>
                  No store connected
                </div>
              )}
              {isConnected && (
                <div style={{ fontSize: '12px', color: 'rgba(56,189,248,0.8)', marginTop: '1px' }}>
                  ● {store?.store_name} — Live
                </div>
              )}
            </div>

            {/* AI Co-Pilot badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '7px 14px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(167,139,250,1), rgba(56,189,248,1))',
              color: '#000', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              boxShadow: '0 0 24px -6px rgba(167,139,250,0.6)',
            }}>
              <Sparkles size={14} />
              Co-Pilot
            </div>
          </header>

          {/* Content */}
          <div className="panel-content">
            {activeTab === 'dashboard' && (
              isConnected
                ? <div style={{ color: '#fff' }}>
                    {/* When store connected, full dashboard renders here */}
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>Your analytics dashboard will appear here once data syncs.</p>
                  </div>
                : <NoStoreState onConnectClick={() => setActiveTab('connect')} />
            )}

            {activeTab === 'connect' && (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Onboarding session={session} isEmbedded />
              </div>
            )}

            {activeTab === 'advanced' && (
              <AdvancedSettings store={store} />
            )}

            {activeTab === 'settings' && (
              <ComingSoon
                icon={Settings}
                title="Settings"
                description="Manage your account preferences, notifications, and billing options — coming very soon."
              />
            )}

            {activeTab === 'support' && (
              <ComingSoon
                icon={Headphones}
                title="Talk to Support"
                description="Live chat and priority support for all brand owners. Launching shortly — you'll be notified."
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
