import { useState } from "react";

const securityPoints = [
  { icon: "🔒", text: "Your token is encrypted and stored securely — never exposed in the browser or shared." },
  { icon: "↩️", text: "You can revoke access at any time from your Shopify Admin → Apps." },
  { icon: "📡", text: "We only sync data. Your live store is never touched." },
  { icon: "🤖", text: "This platform exists purely to surface AI-powered insights from your own business data." },
];

const unlockItems = [
  { emoji: "📦", label: "Live Order Feed",   desc: "Real-time order tracking"    },
  { emoji: "💰", label: "True Profit View",  desc: "Revenue minus all costs"     },
  { emoji: "🔄", label: "RTO Visibility",    desc: "Return-to-origin rates"      },
  { emoji: "📊", label: "SKU Analytics",     desc: "Per-product breakdown"       },
  { emoji: "🧠", label: "AI Co-Pilot",       desc: "Smart business insights"     },
  { emoji: "📈", label: "Growth Trends",     desc: "Weekly & monthly views"      },
];

const faqItems = [
  {
    q: "How do I create a Custom App in Shopify?",
    a: "Go to Shopify Admin → Settings → Apps and sales channels → Develop apps → Create an app. Then under API credentials, install the app and generate the access token with read_orders and read_products scopes.",
  },
  {
    q: "What permissions does the token need?",
    a: "You only need read_orders and read_products scopes. We never request write access, so your store data is completely safe.",
  },
  {
    q: "Can I use this with multiple stores?",
    a: "Yes, you can connect multiple Shopify stores. Each store requires its own Custom App token.",
  },
];

export default function ConnectShopifyStep({
  shopifyDomain, setShopifyDomain,
  accessToken,   setAccessToken,
  showToken,     setShowToken,
  onBack, onContinue,
}) {
  const [openFaq, setOpenFaq] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const handleContinue = () => {
    if (!shopifyDomain || !accessToken) return;
    setConnecting(true);
    setTimeout(() => { setConnecting(false); onContinue(); }, 800);
  };

  const code = (txt) => (
    <code style={{
      background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)",
      borderRadius: 4, padding: "1px 7px", fontSize: 12,
      color: "#a5b4fc", fontFamily: "'JetBrains Mono', monospace",
    }}>{txt}</code>
  );

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 36,
      alignItems: "start",
      width: "100%",
    }}>

      {/* ── LEFT: Form ── */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 20,
        padding: "36px 40px",
        backdropFilter: "blur(16px)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={{ color: "#a5b4fc" }}>
              <path d="M10 2L3 6v5c0 4.1 3 7.7 7 8.9 4-1.2 7-4.8 7-8.9V6L10 2z"
                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px", letterSpacing: "-0.4px" }}>
              Connect your Shopify store
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>
              We need <strong style={{ color: "#e2e8f0" }}>read-only</strong> access to pull orders &amp; product data.
              We cannot make any changes to your store.
            </p>
          </div>
        </div>

        {/* Trust bar */}
        <div style={{
          display: "flex", gap: 10, flexWrap: "wrap",
          padding: "14px 18px", marginBottom: 36,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
        }}>
          {[
            { label: "Read-only access", color: "#10b981" },
            { label: "Token encrypted at rest", color: "#a5b4fc" },
            { label: "No write permissions", color: "#f87171" },
          ].map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: b.color, boxShadow: `0 0 6px ${b.color}` }} />
              <span style={{ fontSize: 12.5, color: "#94a3b8", fontWeight: 500 }}>{b.label}</span>
            </div>
          ))}
        </div>

        {/* Shopify Domain */}
        <div style={{ marginBottom: 28 }}>
          <label style={{
            display: "flex", alignItems: "center", gap: 7,
            fontSize: 11, fontWeight: 700, color: "#64748b",
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
            Shopify Domain
          </label>
          <div style={{
            display: "flex", borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden", background: "rgba(0,0,0,0.25)",
            transition: "border-color 0.2s",
          }}
            onFocusWithin={() => {}}
          >
            <input
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                padding: "14px 18px", fontSize: 14.5, color: "#e2e8f0", fontFamily: "inherit",
              }}
              placeholder="your-store-name"
              value={shopifyDomain}
              onChange={e => setShopifyDomain(e.target.value)}
            />
            <div style={{
              padding: "14px 18px", fontSize: 13.5, color: "#475569",
              background: "rgba(255,255,255,0.04)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              fontWeight: 500, whiteSpace: "nowrap", display: "flex", alignItems: "center",
            }}>
              .myshopify.com
            </div>
          </div>
        </div>

        {/* Access Token */}
        <div style={{ marginBottom: 36 }}>
          <label style={{
            display: "flex", alignItems: "center", gap: 7,
            fontSize: 11, fontWeight: 700, color: "#64748b",
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
            Custom App Access Token
          </label>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px", lineHeight: 1.65 }}>
            Create a custom app in Shopify Admin with {code("read_orders")} &amp; {code("read_products")} scopes.
          </p>
          <div style={{
            display: "flex", borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden", background: "rgba(0,0,0,0.25)",
            alignItems: "center",
          }}>
            <input
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                padding: "14px 18px", fontSize: 14.5, color: "#e2e8f0", fontFamily: "inherit",
              }}
              type={showToken ? "text" : "password"}
              placeholder="shpat_..."
              value={accessToken}
              onChange={e => setAccessToken(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowToken(v => !v)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "14px 18px", color: "#475569", display: "flex",
                alignItems: "center", transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
              onMouseLeave={e => e.currentTarget.style.color = "#475569"}
            >
              {showToken
                ? <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                : <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              flex: 1, padding: "14px 18px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)", color: "#94a3b8",
              fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#e2e8f0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!shopifyDomain || !accessToken}
            style={{
              flex: 2, padding: "14px 20px", borderRadius: 12, border: "none",
              background: shopifyDomain && accessToken
                ? "var(--primary-gradient)"
                : "rgba(255,255,255,0.05)",
              color: shopifyDomain && accessToken ? "#000" : "#475569",
              fontSize: 15, fontWeight: 700, cursor: shopifyDomain && accessToken ? "pointer" : "not-allowed",
              fontFamily: "inherit", transition: "all 0.2s",
              boxShadow: shopifyDomain && accessToken ? "var(--shadow-brand)" : "none",
            }}
          >
            {connecting
              ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Connecting...
                </span>
              : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Connect Store &amp; Continue
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
            }
          </button>
        </div>
      </div>

      {/* ── RIGHT: Info panels ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Security card */}
        <div style={{
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 20, padding: "28px 32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5L2.25 5.25v4.5C2.25 13.65 5.14 17.1 9 18c3.86-.9 6.75-4.35 6.75-8.25v-4.5L9 1.5z"
                  fill="rgba(99,102,241,0.2)" stroke="#a5b4fc" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M6 9l2.1 2.1L12 6" stroke="#a5b4fc" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#a5b4fc", margin: "0 0 3px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Security &amp; Privacy Guarantee
              </p>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Pocket Dashboard is a read-only dashboard tool</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {securityPoints.map((pt, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1.4 }}>{pt.icon}</span>
                <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{pt.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unlock card */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: "28px 32px",
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: "#64748b",
            letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 20px",
          }}>
            What you unlock after connecting
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {unlockItems.map(item => (
              <div key={item.label} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "14px 16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: "0 0 3px" }}>{item.label}</p>
                  <p style={{ fontSize: 11.5, color: "#64748b", margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ card */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: "28px 32px",
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: "#64748b",
            letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px",
          }}>
            Frequently Asked Questions
          </p>
          {faqItems.map((item, i) => (
            <div key={i} style={{
              borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
              paddingTop: i === 0 ? 16 : 14, marginTop: i === 0 ? 0 : 4,
            }}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", gap: 8, background: "none", border: "none",
                  cursor: "pointer", padding: "0 0 0 0", color: openFaq === i ? "#e2e8f0" : "#94a3b8",
                  fontSize: 13.5, fontWeight: 500, textAlign: "left", lineHeight: 1.5,
                  fontFamily: "inherit", transition: "color 0.2s",
                }}
              >
                <span>{item.q}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{
                  flexShrink: 0, marginTop: 3,
                  transition: "transform 0.2s",
                  transform: openFaq === i ? "rotate(180deg)" : "none",
                }}>
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75, margin: "12px 0 4px" }}>
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
