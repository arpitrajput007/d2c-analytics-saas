import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import ConnectShopifyStep from './ConnectShopifyStep';

const STEPS = ['Store Info', 'Connect Shopify', 'Brand'];

const FAQ_ITEMS = [
  {
    q: 'How do I find my Shopify Domain?',
    a: (
      <>
        Your Shopify domain is the URL you use to access your admin panel. It always ends in{' '}
        <code style={codeStyle}>.myshopify.com</code>.<br /><br />
        <strong style={{ color: '#eeeef8' }}>Example:</strong> If you log into{' '}
        <code style={codeStyle}>acme-store.myshopify.com/admin</code>, just enter{' '}
        <code style={codeStyle}>acme-store</code> in the field above — we handle the rest automatically.
      </>
    ),
  },
  {
    q: 'How do I create a Custom App and get the Access Token?',
    a: (
      <>
        This takes about <strong style={{ color: '#eeeef8' }}>2 minutes</strong>. Follow these steps:
        <ol style={{ margin: '10px 0 0 0', paddingLeft: '18px', lineHeight: 2 }}>
          <li>Go to <strong style={{ color: '#eeeef8' }}>Shopify Admin → Settings → Apps and sales channels</strong></li>
          <li>Click <strong style={{ color: '#eeeef8' }}>"Develop apps"</strong> (top-right corner)</li>
          <li>Click <strong style={{ color: '#eeeef8' }}>"Create an app"</strong> → name it anything (e.g. <em>Pocket Dashboard</em>)</li>
          <li>Go to <strong style={{ color: '#eeeef8' }}>"Configuration" → "Admin API integration" → Edit</strong></li>
          <li>Enable only these two scopes: <code style={codeStyle}>read_orders</code> &amp; <code style={codeStyle}>read_products</code></li>
          <li>Click <strong style={{ color: '#eeeef8' }}>Save</strong>, then navigate to <strong style={{ color: '#eeeef8' }}>"API credentials"</strong></li>
          <li>Click <strong style={{ color: '#eeeef8' }}>"Install app"</strong> and confirm</li>
          <li>Copy the <strong style={{ color: '#eeeef8' }}>Admin API access token</strong> — it starts with <code style={codeStyle}>shpat_</code></li>
        </ol>
        <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)', borderRadius: '8px', fontSize: '12px', color: '#fb7185' }}>
          ⚠️ <strong>Important:</strong> Shopify shows this token only once. Copy it before leaving the page.
        </div>
      </>
    ),
  },
  {
    q: 'Why not use OAuth or the Shopify App Store?',
    a: (
      <>
        Custom App tokens are actually <strong style={{ color: '#eeeef8' }}>more private</strong> than OAuth — they
        exist only inside your store and are never publicly listed on any marketplace. They also:
        <ul style={{ margin: '10px 0 0 0', paddingLeft: '18px', lineHeight: 2 }}>
          <li>Don't require Shopify App Store review or approval</li>
          <li>Give you a working integration in under 2 minutes</li>
          <li>Can be revoked instantly from your Shopify admin at any time</li>
        </ul>
      </>
    ),
  },
  {
    q: 'Can Pocket Dashboard edit or delete my store data?',
    a: (
      <>
        <strong style={{ color: '#2dd4a0' }}>Absolutely not.</strong> We only request{' '}
        <code style={codeStyle}>read_orders</code> and <code style={codeStyle}>read_products</code> — both are
        strictly read-only permissions. This means:
        <ul style={{ margin: '10px 0 0 0', paddingLeft: '18px', lineHeight: 2 }}>
          <li>✅ We can read your orders and product catalogue</li>
          <li>❌ We cannot create, edit, or delete orders</li>
          <li>❌ We cannot modify your product listings or inventory</li>
          <li>❌ We cannot access customer passwords or payment details</li>
          <li>❌ We cannot access your Shopify billing or payout data</li>
        </ul>
        Your store operations are completely untouched.
      </>
    ),
  },
];

const codeStyle = {
  background: 'rgba(255,255,255,0.07)',
  padding: '1px 6px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '12px',
  color: 'var(--primary)',
};

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          all: 'unset',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '13px 16px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 600,
          color: open ? '#eeeef8' : '#9090b8',
          transition: 'color 0.2s',
          boxSizing: 'border-box',
          gap: '12px',
        }}
      >
        <span>{q}</span>
        <span
          style={{
            flexShrink: 0,
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: open ? 'var(--primary-dim)' : 'rgba(255,255,255,0.05)',
            color: open ? 'var(--primary)' : 'var(--text-dim)',
            fontSize: '14px',
            transition: 'all 0.25s ease',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            fontFamily: 'monospace',
            fontWeight: 300,
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? '600px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            padding: '4px 16px 16px 16px',
            fontSize: '13px',
            lineHeight: 1.7,
            color: '#6b6b90',
          }}
        >
          {a}
        </div>
      </div>
    </div>
  );
}

export default function Onboarding({ session, isEmbedded = false }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [storeName, setStoreName] = useState('');
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [themeColor, setThemeColor] = useState('#fbbf24');
  const [showToken, setShowToken] = useState(false);
  const navigate = useNavigate();

  const handleOnboard = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          owner_id: session.user.id,
          store_name: storeName,
          shopify_domain: shopifyDomain,
          shopify_access_token: accessToken,
          primary_color: themeColor,
          dashboard_style: 'dark-modern'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create store');
      }

      if (data?.id) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || '';
          await fetch(`${apiUrl}/api/sync/${data.id}`, { method: 'POST' });
        } catch (syncErr) {
          console.warn('Initial auto-sync failed (non-critical):', syncErr.message);
        }
      }
    } catch (err) {
      setLoading(false);
      alert('Error creating store: ' + err.message);
      return;
    }

    setLoading(false);
    navigate('/');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  /* ─── Shared input style ─── */
  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'white',
    boxSizing: 'border-box',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const inputFocus = (e) => {
    e.target.style.borderColor = 'var(--primary)';
    e.target.style.boxShadow = '0 0 0 3px var(--primary-dim)';
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = 'var(--border)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={isEmbedded ? {} : { minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Header ── */}
      {!isEmbedded && (
        <header style={{
          padding: '18px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10,10,16,0.85)',
          backdropFilter: 'blur(24px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px',
              background: 'var(--primary-gradient)',
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px var(--primary-glow)',
            }}>
              <img src="/logo.svg" alt="Logo" style={{ width: '20px', height: '20px' }} />
            </div>
            <div style={{
              fontFamily: 'Outfit', fontSize: '18px', fontWeight: 800,
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Pocket Dashboard
            </div>
          </div>

          <button className="ghost" style={{ fontSize: '13px', padding: '7px 16px' }} onClick={handleSignOut}>
            ← Back to Login
          </button>
        </header>
      )}

      <div style={isEmbedded ? { padding: '0' } : {
        flex: 1,
        padding: step === 1 ? '48px 48px 80px' : '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: step === 1 ? 'stretch' : 'center',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={isEmbedded
          ? { background: 'transparent', border: 'none', boxShadow: 'none', padding: '0', width: '100%' }
          : step === 1
            ? { width: '100%' }
            : { maxWidth: '500px', width: '100%', background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-2xl)', padding: '44px', boxShadow: 'var(--shadow-xl)', position: 'relative' }
        }>

          {/* ── Title + step indicators ── */}
          <div style={{ marginBottom: '40px', maxWidth: step === 1 ? 'none' : '100%' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'var(--primary-dim)', border: '1px solid var(--primary-glow)',
              borderRadius: '20px', padding: '5px 12px',
              fontSize: '11px', fontWeight: 600, color: 'var(--primary)',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--primary)' }}><path d="M7 1L1.5 4v4.5C1.5 11.5 4 13.5 7 14c3-.5 5.5-2.5 5.5-5.5V4L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
              Secure Setup
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#f1f5f9', margin: '0 0 24px', lineHeight: 1.2, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif' }}>
              Let's build your <span style={{ background: 'linear-gradient(135deg,#10b981,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>dashboard</span>
            </h1>
            <div className="onboard-steps">
              {STEPS.map((label, i) => (
                <React.Fragment key={i}>
                  <div className={`onboard-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                    <div className="onboard-step-num">{i < step ? '✓' : i + 1}</div>
                    <div className="onboard-step-label">{label}</div>
                  </div>
                  {i < STEPS.length - 1 && <div className="onboard-step-line" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleOnboard}>

            {/* ══════════════════════════════════
                STEP 0 — Store Name
            ══════════════════════════════════ */}
            {step === 0 && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <h2 style={{ margin: '0 0 6px 0', fontFamily: 'Outfit', fontSize: '21px', fontWeight: 800 }}>
                  What's your store called?
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '24px', lineHeight: 1.65 }}>
                  This will appear on your dashboard and analytics reports.
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Store Name</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    placeholder="e.g. Acme Apparel Co."
                    style={inputStyle}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                </div>

                {/* Trust note */}
                <div style={trustBoxStyle}>
                  <span style={{ fontSize: '15px' }}>🛡️</span>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <strong style={{ color: '#eeeef8' }}>Your data stays yours.</strong> Pocket Dashboard is a
                    read-only analytics tool. We never edit, delete, or share your store data.
                  </span>
                </div>

                <button
                  type="button"
                  className="primary"
                  style={{ width: '100%', padding: '13px', marginTop: '20px', fontSize: '14px' }}
                  onClick={nextStep}
                  disabled={!storeName.trim()}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* ══════════════════════════════════
                STEP 1 — Connect Shopify
            ══════════════════════════════════ */}
            {step === 1 && (
              <ConnectShopifyStep
                shopifyDomain={shopifyDomain}
                setShopifyDomain={setShopifyDomain}
                accessToken={accessToken}
                setAccessToken={setAccessToken}
                showToken={showToken}
                setShowToken={setShowToken}
                onBack={prevStep}
                onContinue={nextStep}
              />
            )}

            {/* ══════════════════════════════════
                STEP 2 — Brand Color
            ══════════════════════════════════ */}
            {step === 2 && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <h2 style={{ margin: '0 0 6px 0', fontFamily: 'Outfit', fontSize: '21px', fontWeight: 800 }}>
                  Set your brand color
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '24px', lineHeight: 1.65 }}>
                  Personalise your dashboard to match your brand identity.
                </p>

                <div style={{ marginBottom: '28px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '20px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  }}>
                    <input
                      type="color"
                      value={themeColor}
                      onChange={e => setThemeColor(e.target.value)}
                      style={{ width: '56px', height: '56px', padding: '0', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                    />
                    <div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '16px', color: themeColor }}>
                        {themeColor.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Click the swatch to change
                      </div>
                    </div>
                    <div style={{
                      marginLeft: 'auto', width: '80px', height: '40px',
                      borderRadius: '8px',
                      background: `linear-gradient(135deg, ${themeColor}, #111)`,
                      boxShadow: `0 0 20px ${themeColor}40`,
                    }} />
                  </div>
                </div>

                {/* Final trust reminder */}
                <div style={{ ...trustBoxStyle, marginBottom: '20px' }}>
                  <span style={{ fontSize: '15px' }}>✅</span>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Almost done! Your store data will be synced automatically after setup.{' '}
                    <strong style={{ color: '#eeeef8' }}>No store data is ever modified — this is a pure analytics tool.</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" className="ghost" style={{ flex: 1, padding: '13px' }} onClick={prevStep}>
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="primary"
                    style={{ flex: 2, padding: '13px', fontSize: '15px' }}
                    disabled={loading}
                  >
                    {loading
                      ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
                          Setting up your dashboard…
                        </span>
                      : '🚀 Launch My Dashboard'
                    }
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Shared style objects ── */
const labelStyle = {
  display: 'block',
  fontSize: '11.5px',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const trustBoxStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '10px',
};

function DisclaimerBox() {
  return (
    <div style={{
      padding: '14px 16px',
      background: 'rgba(245,200,66,0.04)',
      border: '1px solid rgba(245,200,66,0.15)',
      borderRadius: '12px',
      fontSize: '12.5px',
      lineHeight: 1.7,
      color: 'var(--text-muted)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        fontWeight: 700, color: 'var(--primary)', fontSize: '12px',
        textTransform: 'uppercase', letterSpacing: '0.4px',
        marginBottom: '8px',
      }}>
        <span>🔐</span> Security &amp; Privacy Guarantee
      </div>
      <p style={{ margin: '0 0 8px 0' }}>
        <strong style={{ color: '#eeeef8' }}>Pocket Dashboard is a read-only dashboard tool.</strong> We use your
        access token solely to fetch order and product data for display purposes. We{' '}
        <strong style={{ color: '#fb7185' }}>cannot</strong> and{' '}
        <strong style={{ color: '#fb7185' }}>will not</strong> make any changes to your Shopify store.
      </p>
      <ul style={{ margin: 0, paddingLeft: '18px' }}>
        <li>Your token is <strong style={{ color: '#eeeef8' }}>encrypted and stored securely</strong> — never exposed in the browser or shared</li>
        <li>You can <strong style={{ color: '#eeeef8' }}>revoke access at any time</strong> from your Shopify Admin → Apps</li>
        <li>We only sync data — your live store is never touched</li>
        <li>This platform exists purely to <strong style={{ color: '#eeeef8' }}>save you manual work</strong> and surface insights with AI intelligence</li>
      </ul>
    </div>
  );
}
