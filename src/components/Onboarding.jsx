import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

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
          <li>Click <strong style={{ color: '#eeeef8' }}>"Create an app"</strong> → name it anything (e.g. <em>D2C Analytics</em>)</li>
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
    q: 'Can D2C Analytics edit or delete my store data?',
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
  color: '#f5c842',
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
            background: open ? 'rgba(245,200,66,0.15)' : 'rgba(255,255,255,0.05)',
            color: open ? '#f5c842' : '#6b6b90',
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

    const { data: insertData, error } = await supabase
      .from('stores')
      .insert([{
        owner_id: session.user.id,
        store_name: storeName,
        shopify_domain: shopifyDomain,
        shopify_access_token: accessToken,
        primary_color: themeColor,
        dashboard_style: 'dark-modern'
      }])
      .select()
      .single();

    if (error) {
      setLoading(false);
      alert('Error creating store: ' + error.message);
      return;
    }

    if (insertData?.id) {
      try {
        await fetch(`/api/sync/${insertData.id}`, { method: 'POST' });
      } catch (syncErr) {
        console.warn('Initial auto-sync failed (non-critical):', syncErr.message);
      }
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
    e.target.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.12)';
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
              fontSize: '17px',
              boxShadow: '0 0 20px var(--primary-glow)',
            }}>📊</div>
            <div style={{
              fontFamily: 'Outfit', fontSize: '18px', fontWeight: 800,
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              D2C Analytics
            </div>
          </div>
          <button className="ghost" style={{ fontSize: '13px', padding: '7px 16px' }} onClick={handleSignOut}>
            ← Back to Login
          </button>
        </header>
      )}

      <div className="onboard-page" style={isEmbedded ? { padding: '0' } : { flex: 1, padding: '40px 20px' }}>
        <div
          className="onboard-card"
          style={isEmbedded
            ? { background: 'transparent', border: 'none', boxShadow: 'none', padding: '0' }
            : { maxWidth: step === 1 ? '560px' : '480px', transition: 'max-width 0.3s ease' }
          }
        >

          {/* ── Title + step indicators ── */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '4px 12px', borderRadius: '20px',
              background: 'rgba(245,200,66,0.08)', border: '1px solid rgba(245,200,66,0.18)',
              fontSize: '11px', fontWeight: 700, color: 'var(--primary)',
              letterSpacing: '0.4px', textTransform: 'uppercase',
              marginBottom: '14px',
            }}>
              <span>🔒</span> Secure Setup
            </div>
            <h1 style={{ margin: '0 0 24px 0', fontFamily: 'Outfit', fontSize: '26px', fontWeight: 800, lineHeight: 1.2 }}>
              Let's build your dashboard
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
                    <strong style={{ color: '#eeeef8' }}>Your data stays yours.</strong> D2C Analytics is a
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
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <h2 style={{ margin: '0 0 6px 0', fontFamily: 'Outfit', fontSize: '21px', fontWeight: 800 }}>
                  Connect your Shopify store
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '22px', lineHeight: 1.65 }}>
                  We need <strong style={{ color: '#eeeef8' }}>read-only</strong> access to pull your orders &amp;
                  products data. We cannot make any changes to your store.
                </p>

                {/* Security Trust Bar */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', marginBottom: '22px',
                  background: 'rgba(45,212,160,0.05)',
                  border: '1px solid rgba(45,212,160,0.15)',
                  borderRadius: '10px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  {[
                    { icon: '🔍', text: 'Read-only access' },
                    { icon: '🔒', text: 'Token encrypted at rest' },
                    { icon: '🚫', text: 'No write permissions' },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#2dd4a0', fontWeight: 600 }}>
                      <span>{icon}</span> {text}
                    </div>
                  ))}
                </div>

                {/* Shopify Domain */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>Shopify Domain</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      required
                      value={shopifyDomain}
                      onChange={e => setShopifyDomain(e.target.value)}
                      placeholder="your-store-name"
                      style={{ ...inputStyle, borderRadius: '8px 0 0 8px', borderRight: 'none', flex: 1 }}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                    <div style={{
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border)',
                      borderRadius: '0 8px 8px 0',
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                    }}>
                      .myshopify.com
                    </div>
                  </div>
                </div>

                {/* Access Token */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Custom App Access Token</label>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px', lineHeight: 1.5, marginTop: 0 }}>
                    Create a custom app in Shopify Admin with{' '}
                    <code style={codeStyle}>read_orders</code> &amp;{' '}
                    <code style={codeStyle}>read_products</code> scopes. See the FAQ below for step-by-step instructions.
                  </p>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showToken ? 'text' : 'password'}
                      required
                      value={accessToken}
                      onChange={e => setAccessToken(e.target.value)}
                      placeholder="shpat_..."
                      style={{ ...inputStyle, fontFamily: 'monospace', paddingRight: '44px' }}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(v => !v)}
                      style={{
                        all: 'unset', position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)', cursor: 'pointer',
                        fontSize: '15px', color: 'var(--text-muted)',
                        transition: 'color 0.2s',
                      }}
                      title={showToken ? 'Hide token' : 'Show token'}
                    >
                      {showToken ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Disclaimer Box */}
                <DisclaimerBox />

                {/* FAQ Accordion */}
                <div style={{
                  marginTop: '22px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  <div style={{
                    padding: '12px 16px',
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
                    textTransform: 'uppercase', color: 'var(--text-dim)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', gap: '7px',
                  }}>
                    <span>❓</span> Frequently Asked Questions
                  </div>
                  {FAQ_ITEMS.map((item, i) => (
                    <FaqItem key={i} q={item.q} a={item.a} />
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '22px' }}>
                  <button type="button" className="ghost" style={{ flex: 1, padding: '13px' }} onClick={prevStep}>
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="primary"
                    style={{ flex: 2, padding: '13px' }}
                    onClick={nextStep}
                    disabled={!shopifyDomain.trim() || !accessToken.trim()}
                  >
                    Continue →
                  </button>
                </div>
              </div>
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
        fontWeight: 700, color: '#f5c842', fontSize: '12px',
        textTransform: 'uppercase', letterSpacing: '0.4px',
        marginBottom: '8px',
      }}>
        <span>🔐</span> Security &amp; Privacy Guarantee
      </div>
      <p style={{ margin: '0 0 8px 0' }}>
        <strong style={{ color: '#eeeef8' }}>D2C Analytics is a read-only dashboard tool.</strong> We use your
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
