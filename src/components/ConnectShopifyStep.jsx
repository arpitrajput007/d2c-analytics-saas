import { useState } from "react";

const trustBadges = [
  {
    icon: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 7l1.8 1.8L9.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    label: "Read-only access", color: "#10b981",
  },
  {
    icon: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="6" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 6V4.5a2 2 0 014 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
    label: "Token encrypted at rest", color: "var(--primary)",
  },
  {
    icon: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L2 5v4c0 2.2 2.1 4.1 5 4.9 2.9-.8 5-2.7 5-4.9V5L7 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4.5 7l1.8 1.8L9.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    label: "No write permissions", color: "#ef4444",
  },
];

const securityPoints = [
  "Your token is encrypted and stored securely. Never exposed in the browser or shared.",
  "You can revoke access at any time from your Shopify Admin → Apps",
  "We only sync data. Your live store is never touched.",
  "This platform exists purely to save you manual work and surface insights with AI intelligence",
];

const faqItems = [
  { q: "How do I create a Custom App in Shopify?", a: "Go to Shopify Admin → Settings → Apps and sales channels → Develop apps → Create an app. Then under API credentials, install the app and generate the access token with read_orders and read_products scopes." },
  { q: "What permissions does the token need?", a: "You only need read_orders and read_products scopes. We never request write access, so your store data is completely safe." },
  { q: "Can I use this with multiple stores?", a: "Yes, you can connect multiple Shopify stores. Each store requires its own Custom App token." },
];

const s = {
  card: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:32, backdropFilter:"blur(12px)" },
  cardHeader: { display:"flex", gap:14, marginBottom:24, alignItems:"flex-start" },
  cardTitle: { fontSize:20, fontWeight:700, color:"#f1f5f9", margin:"0 0 6px", letterSpacing:"-0.3px" },
  cardSubtitle: { fontSize:13, color:"#94a3b8", margin:0, lineHeight:1.6 },
  trustBar: { display:"flex", gap:8, flexWrap:"wrap", marginBottom:28, padding:"12px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10 },
  trustBadge: { display:"flex", alignItems:"center", gap:6 },
  trustLabel: { fontSize:12, color:"#94a3b8", fontWeight:500 },
  field: { marginBottom:24 },
  label: { display:"flex", alignItems:"center", gap:7, fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 },
  labelDot: { width:5, height:5, borderRadius:"50%", background:"var(--primary)" },
  inputGroup: { display:"flex", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden", background:"rgba(255,255,255,0.03)", transition:"border-color 0.2s" },
  input: { flex:1, background:"transparent", border:"none", outline:"none", padding:"12px 16px", fontSize:14, color:"#e2e8f0", fontFamily:"inherit" },
  inputSuffix: { padding:"12px 16px", fontSize:13, color:"#475569", background:"rgba(255,255,255,0.03)", borderLeft:"1px solid rgba(255,255,255,0.08)", fontWeight:500, whiteSpace:"nowrap" },
  fieldHint: { fontSize:12, color:"#64748b", margin:"0 0 10px", lineHeight:1.6 },
  code: { background:"var(--primary-dim)", border:"1px solid var(--primary-glow)", borderRadius:4, padding:"1px 6px", fontSize:11, color:"var(--primary)", fontFamily:"'JetBrains Mono',monospace" },
  tokenWrap: { display:"flex", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden", background:"rgba(255,255,255,0.03)", alignItems:"center" },
  eyeBtn: { background:"none", border:"none", cursor:"pointer", padding:"12px 16px", color:"#475569", display:"flex", alignItems:"center", transition:"color 0.2s" },
  ctaBtn: { width:"100%", padding:"14px 20px", borderRadius:10, border:"none", background:"var(--primary-gradient)", color:"#000", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit", letterSpacing:"-0.2px", transition:"opacity 0.2s,transform 0.1s", marginTop:8, boxShadow: "var(--shadow-brand)" },
  ctaDisabled: { opacity:0.4, cursor:"not-allowed" },
  btnRow: { display:"flex", gap:10, marginTop:8 },
  backBtn: { flex:1, padding:"14px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.03)", color:"#94a3b8", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" },
  right: { display:"flex", flexDirection:"column", gap:16 },
  secCard: { background:"var(--primary-dim)", border:"1px solid var(--primary-glow)", borderRadius:14, padding:20 },
  secHeader: { display:"flex", gap:12, alignItems:"flex-start", marginBottom:16 },
  shieldWrap: { width:36, height:36, background:"var(--primary-dim)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  secTitle: { fontSize:13, fontWeight:700, color:"var(--primary)", margin:"0 0 3px", letterSpacing:"0.03em", textTransform:"uppercase" },
  secSub: { fontSize:12, color:"#78716c", margin:0 },
  secPoints: { display:"flex", flexDirection:"column", gap:10 },
  secPoint: { display:"flex", gap:10, alignItems:"flex-start" },
  checkDot: { width:5, height:5, borderRadius:"50%", background:"var(--primary)", marginTop:6, flexShrink:0 },
  secText: { fontSize:12, color:"#94a3b8", lineHeight:1.6 },
  unlockCard: { background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:20 },
  unlockTitle: { fontSize:12, fontWeight:700, color:"#64748b", letterSpacing:"0.08em", textTransform:"uppercase", margin:"0 0 14px" },
  unlockGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  unlockItem: { display:"flex", gap:10, alignItems:"flex-start", padding:"10px 12px", background:"rgba(255,255,255,0.02)", borderRadius:10, border:"1px solid rgba(255,255,255,0.05)" },
  unlockIcon: { fontSize:16, flexShrink:0 },
  unlockLabel: { fontSize:12, fontWeight:600, color:"#e2e8f0", margin:"0 0 2px" },
  unlockDesc: { fontSize:11, color:"#64748b", margin:0 },
  faqCard: { background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:20 },
  faqTitle: { fontSize:12, fontWeight:700, color:"#64748b", letterSpacing:"0.08em", textTransform:"uppercase", margin:"0 0 14px" },
  faqItem: { borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:12, marginTop:12 },
  faqQ: { width:"100%", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, background:"none", border:"none", cursor:"pointer", padding:0, color:"#cbd5e1", fontSize:13, fontWeight:500, textAlign:"left", lineHeight:1.5, fontFamily:"inherit" },
  faqA: { fontSize:12, color:"#64748b", lineHeight:1.7, margin:"10px 0 0" },
  grid: { display:'grid', gridTemplateColumns:'1fr 440px', gap:28, alignItems:'start', width:'100%' },
  spinner: { width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" },
};

export default function ConnectShopifyStep({ shopifyDomain, setShopifyDomain, accessToken, setAccessToken, showToken, setShowToken, onBack, onContinue }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const handleContinue = () => {
    if (!shopifyDomain || !accessToken) return;
    setConnecting(true);
    setTimeout(() => { setConnecting(false); onContinue(); }, 800);
  };

  return (
    <div style={s.grid}>
      {/* LEFT: Form */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color:"var(--primary)", flexShrink:0, marginTop:2 }}>
            <path d="M10 2L3 6v5c0 4.1 3 7.7 7 8.9 4-1.2 7-4.8 7-8.9V6L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <div>
            <h2 style={s.cardTitle}>Connect your Shopify store</h2>
            <p style={s.cardSubtitle}>We need <strong style={{ color:"#e2e8f0" }}>read-only</strong> access to pull orders &amp; products data. We cannot make any changes to your store.</p>
          </div>
        </div>

        <div style={s.trustBar}>
          {trustBadges.map(b => (
            <div key={b.label} style={s.trustBadge}>
              <span style={{ color:b.color, display:"flex" }}>{b.icon}</span>
              <span style={s.trustLabel}>{b.label}</span>
            </div>
          ))}
        </div>

        <div style={s.field}>
          <label style={s.label}><span style={s.labelDot}/> Shopify Domain</label>
          <div style={s.inputGroup}>
            <input style={s.input} placeholder="your-store-name" value={shopifyDomain} onChange={e => setShopifyDomain(e.target.value)}/>
            <div style={s.inputSuffix}>.myshopify.com</div>
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}><span style={s.labelDot}/> Custom App Access Token</label>
          <p style={s.fieldHint}>Create a custom app in Shopify Admin with <code style={s.code}>read_orders</code> &amp; <code style={s.code}>read_products</code> scopes.</p>
          <div style={s.tokenWrap}>
            <input style={s.input} type={showToken ? "text" : "password"} placeholder="shpat_..." value={accessToken} onChange={e => setAccessToken(e.target.value)}/>
            <button style={s.eyeBtn} type="button" onClick={() => setShowToken(v => !v)}>
              {showToken
                ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
              }
            </button>
          </div>
        </div>

        <div style={s.btnRow}>
          <button type="button" style={s.backBtn} onClick={onBack}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="#e2e8f0"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.color="#94a3b8"; }}>
            ← Back
          </button>
          <button type="button"
            style={{ ...s.ctaBtn, flex:2, ...(!shopifyDomain||!accessToken ? s.ctaDisabled : {}) }}
            onClick={handleContinue}
            disabled={!shopifyDomain || !accessToken}>
            {connecting
              ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><span style={s.spinner}/>Connecting...</span>
              : <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Connect Store &amp; Continue
                </span>
            }
          </button>
        </div>
      </div>

      {/* RIGHT: Security + Unlock + FAQ */}
      <div style={s.right}>
        <div style={s.secCard}>
          <div style={s.secHeader}>
            <div style={s.shieldWrap}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5L2.25 5.25v4.5C2.25 13.65 5.14 17.1 9 18c3.86-.9 6.75-4.35 6.75-8.25v-4.5L9 1.5z" fill="var(--primary)" fillOpacity="0.15" stroke="var(--primary)" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M6 9l2.1 2.1L12 6" stroke="var(--primary)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p style={s.secTitle}>Security &amp; Privacy Guarantee</p>
              <p style={s.secSub}>Pocket Dashboard is a read-only dashboard tool</p>
            </div>
          </div>
          <div style={s.secPoints}>
            {securityPoints.map((pt, i) => (
              <div key={i} style={s.secPoint}><div style={s.checkDot}/><span style={s.secText}>{pt}</span></div>
            ))}
          </div>
        </div>

        <div style={s.unlockCard}>
          <p style={s.unlockTitle}>What you unlock after connecting</p>
          <div style={s.unlockGrid}>
            {[
              { icon:"📦", label:"Live Order Feed", desc:"Real-time order tracking" },
              { icon:"💰", label:"True Profit View", desc:"Revenue minus all costs" },
              { icon:"🔄", label:"RTO Visibility", desc:"Return-to-origin rates" },
              { icon:"📊", label:"SKU Analytics", desc:"Per-product breakdown" },
            ].map(item => (
              <div key={item.label} style={s.unlockItem}>
                <span style={s.unlockIcon}>{item.icon}</span>
                <div><p style={s.unlockLabel}>{item.label}</p><p style={s.unlockDesc}>{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.faqCard}>
          <p style={s.faqTitle}>Frequently Asked Questions</p>
          {faqItems.map((item, i) => (
            <div key={i} style={i === 0 ? { paddingTop:0 } : s.faqItem}>
              <button type="button" style={s.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{item.q}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transition:"transform 0.2s", transform:openFaq===i?"rotate(180deg)":"none", flexShrink:0 }}>
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {openFaq === i && <p style={s.faqA}>{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
