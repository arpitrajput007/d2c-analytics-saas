import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const STEPS = ['Store Info', 'Connect Shopify', 'Brand'];

export default function Onboarding({ session, isEmbedded = false }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [storeName, setStoreName] = useState('');
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [themeColor, setThemeColor] = useState('#fbbf24');
  const navigate = useNavigate();

  const handleOnboard = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('stores')
      .insert([{
        owner_id: session.user.id,
        store_name: storeName,
        shopify_domain: shopifyDomain,
        shopify_access_token: accessToken,
        primary_color: themeColor,
        dashboard_style: 'dark-modern'
      }]);

    setLoading(false);

    if (error) {
      alert('Error creating store: ' + error.message);
    } else {
      navigate('/');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div style={isEmbedded ? {} : { minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header for Escape Hatch — only shown in standalone mode */}
      {!isEmbedded && (
        <header style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'rgba(10, 10, 16, 0.8)', backdropFilter: 'blur(24px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--primary-gradient)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', boxShadow: '0 0 16px var(--primary-glow)' }}>📊</div>
            <div style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              D2C Analytics
            </div>
          </div>
          <button className="ghost" style={{ fontSize: '13px', padding: '8px 16px' }} onClick={handleSignOut}>
            Sign Out / Back to Login
          </button>
        </header>
      )}

      <div className="onboard-page" style={isEmbedded ? { padding: '0' } : { flex: 1, padding: '40px 20px' }}>
        <div className="onboard-card" style={isEmbedded ? { background: 'transparent', border: 'none', boxShadow: 'none', padding: '0' } : {}}>
          <h1 style={{ margin: '0 0 32px 0', fontFamily: 'Outfit', fontSize: '26px', fontWeight: 800 }}>
            Let's build your dashboard
          </h1>

          {/* Step Indicators */}
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

          <form onSubmit={handleOnboard}>
            {/* Step 0 — Store Name */}
            {step === 0 && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <h2 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit', fontSize: '22px', fontWeight: 800 }}>
                  Name your store
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                  This will appear on your dashboard and analytics reports.
                </p>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Store Name
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    placeholder="e.g. Acme Apparel Co."
                    style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', boxSizing: 'border-box', fontSize: '14px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <button type="button" className="primary" style={{ width: '100%', padding: '13px' }} onClick={nextStep} disabled={!storeName.trim()}>
                  Continue →
                </button>
              </div>
            )}

            {/* Step 1 — Shopify */}
            {step === 1 && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <h2 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit', fontSize: '22px', fontWeight: 800 }}>
                  Connect Shopify
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                  We need read-only access to your orders and products data.
                </p>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shopify Domain</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      required
                      value={shopifyDomain}
                      onChange={e => setShopifyDomain(e.target.value)}
                      placeholder="your-store-name"
                      style={{ flex: 1, padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '8px 0 0 8px', color: 'white', borderRight: 'none', boxSizing: 'border-box', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
                    />
                    <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '0 8px 8px 0', color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      .myshopify.com
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Custom App Access Token
                  </label>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px', lineHeight: 1.5 }}>
                    Create a custom app in Shopify Admin with <code style={{ background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '4px' }}>read_orders</code> & <code style={{ background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '4px' }}>read_products</code> scopes.
                  </p>
                  <input
                    type="password"
                    required
                    value={accessToken}
                    onChange={e => setAccessToken(e.target.value)}
                    placeholder="shpat_..."
                    style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" className="ghost" style={{ flex: 1, padding: '13px' }} onClick={prevStep}>← Back</button>
                  <button type="button" className="primary" style={{ flex: 2, padding: '13px' }} onClick={nextStep} disabled={!shopifyDomain.trim() || !accessToken.trim()}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Brand Color */}
            {step === 2 && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <h2 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit', fontSize: '22px', fontWeight: 800 }}>
                  Set your brand color
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                  This color will be used throughout your dashboard to match your brand identity.
                </p>

                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <input
                      type="color"
                      value={themeColor}
                      onChange={e => setThemeColor(e.target.value)}
                      style={{ width: '56px', height: '56px', padding: '0', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                    />
                    <div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '16px', color: themeColor }}>{themeColor.toUpperCase()}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Click the swatch to change</div>
                    </div>
                    <div style={{ marginLeft: 'auto', width: '80px', height: '40px', borderRadius: '8px', background: `linear-gradient(135deg, ${themeColor}, #111)`, boxShadow: `0 0 20px ${themeColor}40` }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" className="ghost" style={{ flex: 1, padding: '13px' }} onClick={prevStep}>← Back</button>
                  <button type="submit" className="primary" style={{ flex: 2, padding: '13px', fontSize: '15px' }} disabled={loading}>
                    {loading ? '⟳ Setting up your dashboard...' : '🚀 Launch Analytics'}
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
