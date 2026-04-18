import React from 'react';

export default function Paywall({ children, isPro }) {
  if (isPro) {
    return <>{children}</>;
  }

  const features = [
    'Advanced pricing management & margin calculator',
    'Full business analytics with cohort insights',
    'Unlimited historical data & export',
  ];

  return (
    <div style={{ position: 'relative', minHeight: '400px' }}>
      {/* Blurred background content */}
      <div style={{ filter: 'blur(8px)', opacity: 0.3, pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>

      {/* Paywall Card */}
      <div className="paywall-card">
        <div className="paywall-icon">🚀</div>

        <h2 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit', fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
          Unlock PRO Analytics
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px', lineHeight: 1.6 }}>
          Get access to advanced features built for scaling D2C brands.
        </p>

        <div className="paywall-features">
          {features.map((f, i) => (
            <div key={i} className="paywall-feature">
              <div className="paywall-feature-check">✓</div>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <button
          className="shimmer-btn"
          onClick={() => alert('Initiating Stripe Checkout Flow...')}
        >
          ✦ Upgrade to PRO — ₹1,499/mo
        </button>

        <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-dim)' }}>
          Cancel anytime · Instant access · Secure via Stripe
        </div>
      </div>
    </div>
  );
}
