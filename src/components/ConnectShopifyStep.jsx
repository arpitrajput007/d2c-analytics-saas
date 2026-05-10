import { useState } from "react";

const inp = {
  width: '100%', boxSizing: 'border-box', padding: '15px 18px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 14, color: '#e2e8f0', fontSize: 15, fontFamily: 'inherit', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
const inpFocus = e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; };
const inpBlur  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; };
const labelSt  = { display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 };
const code = txt => <code style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 4, padding: '1px 7px', fontSize: 12, color: '#a5b4fc', fontFamily: 'monospace' }}>{txt}</code>;

const UNLOCK = [
  { e: '📦', l: 'Live Order Feed',   d: 'Real-time order tracking'   },
  { e: '💰', l: 'True Profit View',  d: 'Revenue minus all costs'    },
  { e: '🔄', l: 'RTO Visibility',    d: 'Return-to-origin rates'     },
  { e: '📊', l: 'SKU Analytics',     d: 'Per-product breakdown'      },
  { e: '🧠', l: 'AI Co-Pilot',       d: 'Smart business insights'    },
  { e: '📈', l: 'Growth Trends',     d: 'Weekly & monthly views'     },
];

const FAQ = [
  { q: 'How do I create a Custom App in Shopify?', a: 'Go to Shopify Admin → Settings → Apps and sales channels → Develop apps → Create an app. Under API credentials, install the app and generate an access token with read_orders and read_products scopes.' },
  { q: 'What permissions does the token need?', a: 'Only read_orders and read_products. We never request write access — your store data is completely safe.' },
  { q: 'Can I revoke access later?', a: 'Yes, anytime. Go to Shopify Admin → Settings → Apps and remove the custom app. This immediately cuts access.' },
];

export default function ConnectShopifyStep({ storeName = '', setStoreName, shopifyDomain, setShopifyDomain, accessToken, setAccessToken, showToken, setShowToken, onBack, onContinue, loading = false }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const canContinue = shopifyDomain.trim() && accessToken.trim() && (!setStoreName || storeName.trim());

  const handleContinue = () => {
    if (!canContinue) return;
    setConnecting(true);
    setTimeout(() => { setConnecting(false); onContinue(); }, 800);
  };

  const card = (children, extra = {}) => ({
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: '32px 36px', backdropFilter: 'blur(20px)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)',
    ...extra,
  });

  return (
    <div>
      {/* Page headline */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px', letterSpacing: '-0.4px' }}>
          Connect your Shopify store
        </h2>
        <p style={{ fontSize: 15, color: '#64748b', margin: 0, lineHeight: 1.7 }}>
          We need <strong style={{ color: '#e2e8f0' }}>read-only</strong> access to pull orders &amp; product data. We cannot make any changes to your store.
        </p>
      </div>

      {/* Trust pill strip */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
        {[
          { label: 'Read-only access', color: '#10b981' },
          { label: '256-bit encrypted', color: '#a5b4fc' },
          { label: 'No write permissions', color: '#f87171' },
        ].map(b => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: b.color, boxShadow: `0 0 6px ${b.color}` }} />
            <span style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 500 }}>{b.label}</span>
          </div>
        ))}
      </div>

      {/* Main form card */}
      <div style={card({})}>
        {/* Store name – only shown in embedded/dashboard mode */}
        {setStoreName && (
          <div style={{ marginBottom: 28 }}>
            <label style={labelSt}>Store Display Name</label>
            <p style={{ fontSize: 12.5, color: '#64748b', margin: '0 0 10px', lineHeight: 1.6 }}>
              This name will appear on your dashboard header and analytics reports.
            </p>
            <input
              className="ob-input" style={inp}
              type="text" required
              placeholder="e.g. Acme Apparel Co."
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              onFocus={inpFocus} onBlur={inpBlur}
            />
          </div>
        )}

        {/* Shopify domain */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelSt}>Shopify Domain</label>
          <div style={{ display: 'flex', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
            <input
              style={{ ...inp, border: 'none', borderRadius: 0, flex: 1 }}
              placeholder="your-store-name"
              value={shopifyDomain}
              onChange={e => setShopifyDomain(e.target.value)}
              onFocus={inpFocus} onBlur={inpBlur}
            />
            <div style={{ padding: '15px 18px', fontSize: 14, color: '#475569', background: 'rgba(255,255,255,0.03)', borderLeft: '1px solid rgba(255,255,255,0.07)', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
              .myshopify.com
            </div>
          </div>
        </div>

        {/* Access token */}
        <div style={{ marginBottom: 32 }}>
          <label style={labelSt}>Custom App Access Token</label>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px', lineHeight: 1.65 }}>
            Create a custom app in Shopify Admin with {code('read_orders')} &amp; {code('read_products')} scopes.
          </p>
          <div style={{ display: 'flex', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', alignItems: 'center' }}>
            <input
              style={{ ...inp, border: 'none', borderRadius: 0, flex: 1 }}
              type={showToken ? 'text' : 'password'}
              placeholder="shpat_..."
              value={accessToken}
              onChange={e => setAccessToken(e.target.value)}
              onFocus={inpFocus} onBlur={inpBlur}
            />
            <button type="button" onClick={() => setShowToken(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '15px 18px', color: '#475569', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              {showToken
                ? <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                : <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" onClick={onBack}
            style={{ flex: 1, padding: '15px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#e2e8f0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}
          >← Back</button>
          <button type="button" onClick={handleContinue} disabled={!canContinue}
            style={{ flex: 2, padding: '15px', borderRadius: 14, border: 'none', background: canContinue ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.05)', color: canContinue ? '#fff' : '#475569', fontSize: 15, fontWeight: 700, cursor: canContinue ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: canContinue ? '0 4px 24px rgba(99,102,241,0.35)' : 'none' }}
            onMouseEnter={e => { if (canContinue) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.45)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = canContinue ? '0 4px 24px rgba(99,102,241,0.35)' : 'none'; }}
          >
            {connecting
              ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ob-spin 0.7s linear infinite', display: 'inline-block' }} />Connecting…</span>
              : 'Connect Store & Continue →'
            }
          </button>
        </div>
      </div>

      {/* What you unlock */}
      <div style={{ marginTop: 28, ...card({}) }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 20px' }}>What you unlock after connecting</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {UNLOCK.map(u => (
            <div key={u.l} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{u.e}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: '0 0 3px' }}>{u.l}</p>
                <p style={{ fontSize: 11.5, color: '#64748b', margin: 0 }}>{u.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 20, ...card({}) }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Frequently asked questions</p>
        {FAQ.map((item, i) => (
          <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)', paddingTop: i === 0 ? 16 : 14, marginTop: i === 0 ? 0 : 4 }}>
            <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: openFaq === i ? '#e2e8f0' : '#94a3b8', fontSize: 14, fontWeight: 500, textAlign: 'left', fontFamily: 'inherit', transition: 'color 0.2s' }}
            >
              <span>{item.q}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {openFaq === i && <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, margin: '12px 0 4px' }}>{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
