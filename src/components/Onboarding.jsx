import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import ConnectShopifyStep from './ConnectShopifyStep';
import BrandLogo from './BrandLogo';

const STEPS = [
  { label: 'Store Info',       desc: 'Your business name'      },
  { label: 'Connect Shopify',  desc: 'Secure read-only sync'   },
  { label: 'Personalize',      desc: 'Brand your dashboard'    },
];

const REASSURANCES = [
  'Setup takes less than 2 minutes',
  'No coding required',
  'Read-only secure access',
  'Disconnect anytime from Shopify',
];

/* ── shared input styles ── */
const inp = {
  width: '100%', boxSizing: 'border-box',
  padding: '15px 18px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 14, color: '#e2e8f0',
  fontSize: 15, fontFamily: 'inherit', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
const inpFocus = e => {
  e.target.style.borderColor = 'rgba(99,102,241,0.6)';
  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
};
const inpBlur = e => {
  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
  e.target.style.boxShadow = 'none';
};

const labelSt = {
  display: 'block', fontSize: 11.5, fontWeight: 700,
  color: '#64748b', letterSpacing: '0.08em',
  textTransform: 'uppercase', marginBottom: 10,
};

/* ── Left panel – stepper ── */
function Stepper({ step }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {STEPS.map((s, i) => {
        const done   = i < step;
        const active = i === step;
        return (
          <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Circle */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                background: done ? 'rgba(16,185,129,0.15)' : active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                border: done ? '1.5px solid rgba(16,185,129,0.5)' : active ? '1.5px solid rgba(99,102,241,0.6)' : '1.5px solid rgba(255,255,255,0.1)',
                color: done ? '#10b981' : active ? '#a5b4fc' : '#475569',
                boxShadow: active ? '0 0 20px rgba(99,102,241,0.25)' : 'none',
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 1.5, height: 40, marginTop: 4,
                  background: done ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.07)',
                  transition: 'background 0.4s',
                }} />
              )}
            </div>
            <div style={{ paddingTop: 7, paddingBottom: i < STEPS.length - 1 ? 40 : 0 }}>
              <div style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? '#f1f5f9' : done ? '#94a3b8' : '#475569', transition: 'color 0.3s' }}>
                {s.label}
              </div>
              <div style={{ fontSize: 12, color: active ? '#6366f1' : '#334155', marginTop: 2 }}>
                {s.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════
   MAIN EXPORT
══════════════════════════════════ */
export default function Onboarding({ session, isEmbedded = false }) {
  const [step, setStep]               = useState(0);
  const [storeName, setStoreName]     = useState('');
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [themeColor, setThemeColor]   = useState('#6366f1');
  const [showToken, setShowToken]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleOnboard = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_id: session.user.id,
          store_name: storeName,
          shopify_domain: shopifyDomain,
          shopify_access_token: accessToken,
          primary_color: themeColor,
          dashboard_style: 'dark-modern',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      if (data?.id) {
        try { await fetch(`${apiUrl}/api/sync/${data.id}`, { method: 'POST' }); }
        catch (e) { console.warn('sync failed (non-critical)'); }
      }
    } catch (err) {
      setLoading(false);
      alert('Error: ' + err.message);
      return;
    }
    setLoading(false);
    navigate('/');
  };

  /* ── Embedded mode (inside dashboard) ── */
  if (isEmbedded) {
    const handleEmbeddedSubmit = async () => {
      if (!storeName.trim() || !shopifyDomain.trim() || !accessToken.trim()) return;
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/store`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            owner_id: session.user.id,
            store_name: storeName,
            shopify_domain: shopifyDomain,
            shopify_access_token: accessToken,
            primary_color: themeColor,
            dashboard_style: 'dark-modern',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data?.id) {
          try { await fetch(`${apiUrl}/api/sync/${data.id}`, { method: 'POST' }); }
          catch (e) { console.warn('sync failed (non-critical)'); }
        }
      } catch (err) {
        setLoading(false);
        alert('Error: ' + err.message);
        return;
      }
      setLoading(false);
      navigate('/');
    };
    return (
      <div style={{ padding: '24px 0', maxWidth: 640, margin: '0 auto' }}>
        <ConnectShopifyStep
          storeName={storeName}         setStoreName={setStoreName}
          shopifyDomain={shopifyDomain} setShopifyDomain={setShopifyDomain}
          accessToken={accessToken}     setAccessToken={setAccessToken}
          showToken={showToken}         setShowToken={setShowToken}
          loading={loading}
          onBack={() => {}}
          onContinue={handleEmbeddedSubmit}
        />
      </div>
    );
  }

  /* ── Full-page onboarding ── */
  return (
    <>
      <style>{`
        @keyframes ob-float { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-18px) scale(1.03); } }
        @keyframes ob-drift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-20px); } }
        @keyframes ob-spin  { to { transform: rotate(360deg); } }
        @keyframes ob-fadein { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        @keyframes ob-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ob-input:focus { border-color: rgba(99,102,241,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; }
        .ob-btn-primary {
          width: 100%; padding: 16px; border-radius: 14px; border: none;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: inherit; transition: all 0.2s;
          box-shadow: 0 4px 24px rgba(99,102,241,0.35), 0 0 0 1px rgba(99,102,241,0.3);
        }
        .ob-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(99,102,241,0.45), 0 0 0 1px rgba(99,102,241,0.4); }
        .ob-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .ob-btn-ghost {
          width: 100%; padding: 14px; border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: #94a3b8;
          font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .ob-btn-ghost:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
        @media (max-width: 900px) {
          .ob-left { display: none !important; }
          .ob-right { padding: 32px 20px !important; }
        }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#060610', fontFamily: "'Inter','Outfit',sans-serif" }}>

        {/* ══ LEFT PANEL ══ */}
        <div className="ob-left" style={{
          width: 420, flexShrink: 0, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(160deg, #07071a 0%, #0a0825 60%, #060616 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', padding: '48px 44px',
        }}>
          {/* Ambient orbs */}
          <div style={{ position: 'absolute', top: -80, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', animation: 'ob-drift 12s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 40, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)', animation: 'ob-drift 16s ease-in-out infinite reverse', pointerEvents: 'none' }} />
          {/* Grid overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

          {/* Brand */}
          <div style={{ position: 'relative', marginBottom: 56 }}>
            <BrandLogo variant="full" iconSize={38} />
          </div>

          {/* Headline */}
          <div style={{ position: 'relative', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Secure Setup</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', margin: '0 0 14px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              Connect your store<br />
              <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>in under 2 minutes.</span>
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, margin: 0 }}>
              Securely sync your Shopify data and unlock real-time profit tracking, AI insights and operational analytics.
            </p>
          </div>

          {/* Stepper */}
          <div style={{ position: 'relative', marginBottom: 52 }}>
            <Stepper step={step} />
          </div>

          {/* Trust badges */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
            {[
              { icon: '🔒', label: 'Read-only access — your store is never modified' },
              { icon: '🛡️', label: '256-bit encryption on all stored credentials' },
              { icon: '↩️', label: 'Revoke access instantly from Shopify Admin' },
            ].map(t => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 14 }}>{t.icon}</span>
                <span style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.6 }}>{t.label}</span>
              </div>
            ))}
          </div>

          {/* Reassurance strip */}
          <div style={{ position: 'relative', marginTop: 'auto', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {REASSURANCES.map(r => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 9, color: '#10b981' }}>✓</div>
                  <span style={{ fontSize: 12, color: '#475569' }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="ob-right" style={{
          flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '60px 64px',
          background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%), #070714',
        }}>
          {/* Mobile badge */}
          <div style={{ display: 'none', marginBottom: 32, alignSelf: 'flex-start' }} className="ob-mobile-badge">
            <BrandLogo variant="compact" iconSize={32} />
          </div>

          <div style={{ width: '100%', maxWidth: step === 1 ? 720 : 520, animation: 'ob-fadein 0.35s ease' }}>

            {/* ── Step 0: Store Name ── */}
            {step === 0 && (
              <div>
                <div style={{ marginBottom: 40 }}>
                  <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px', letterSpacing: '-0.4px' }}>What's your store called?</h2>
                  <p style={{ fontSize: 15, color: '#64748b', margin: 0, lineHeight: 1.7 }}>This appears on your dashboard, analytics reports, and AI insights.</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 40px', backdropFilter: 'blur(20px)', boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)' }}>
                  <div style={{ marginBottom: 28 }}>
                    <label style={labelSt}>Store Name</label>
                    <input className="ob-input" style={inp} type="text" required value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="e.g. Acme Apparel Co." onFocus={inpFocus} onBlur={inpBlur} />
                  </div>

                  <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', marginBottom: 28, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16 }}>🛡️</span>
                    <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                      <strong style={{ color: '#e2e8f0' }}>Your data stays yours.</strong> Pocket Dashboard is a read-only analytics tool. We never edit, delete, or share your store data.
                    </p>
                  </div>

                  <button type="button" className="ob-btn-primary" onClick={nextStep} disabled={!storeName.trim()}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 1: Connect Shopify ── */}
            {step === 1 && (
              <ConnectShopifyStep
                shopifyDomain={shopifyDomain} setShopifyDomain={setShopifyDomain}
                accessToken={accessToken}     setAccessToken={setAccessToken}
                showToken={showToken}         setShowToken={setShowToken}
                onBack={prevStep}             onContinue={nextStep}
              />
            )}

            {/* ── Step 2: Brand Color ── */}
            {step === 2 && (
              <form onSubmit={handleOnboard}>
                <div style={{ marginBottom: 40 }}>
                  <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px', letterSpacing: '-0.4px' }}>Set your brand color</h2>
                  <p style={{ fontSize: 15, color: '#64748b', margin: 0, lineHeight: 1.7 }}>Personalise your dashboard to match your brand identity.</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 40px', backdropFilter: 'blur(20px)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', background: 'rgba(0,0,0,0.2)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', marginBottom: 32 }}>
                    <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} style={{ width: 60, height: 60, padding: 0, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 12 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: themeColor, marginBottom: 4, fontFamily: 'monospace' }}>{themeColor.toUpperCase()}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>Click the swatch to change your brand accent</div>
                    </div>
                    <div style={{ width: 80, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${themeColor}, #111)`, boxShadow: `0 0 24px ${themeColor}50` }} />
                  </div>

                  <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', marginBottom: 32, display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>✅</span>
                    <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                      Almost done! Your store data will be synced automatically after setup. <strong style={{ color: '#e2e8f0' }}>No store data is ever modified.</strong>
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" className="ob-btn-ghost" onClick={prevStep} style={{ width: 'auto', flex: 1 }}>← Back</button>
                    <button type="submit" className="ob-btn-primary" style={{ flex: 2 }} disabled={loading}>
                      {loading
                        ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ob-spin 0.7s linear infinite', display: 'inline-block' }} />Setting up your dashboard…</span>
                        : '🚀 Launch My Dashboard'
                      }
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
