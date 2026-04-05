import React from 'react';

export default function Paywall({ children, isPro }) {
  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="view-content active" style={{ animation: 'fadeInUp 0.4s ease forwards', position: 'relative' }}>
      <div style={{ filter: 'blur(8px)', opacity: 0.4, pointerEvents: 'none' }}>
        {children}
      </div>
      
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        background: 'rgba(24, 24, 27, 0.95)', 
        border: '1px solid var(--primary)', 
        padding: '40px', 
        borderRadius: '16px', 
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        zIndex: 10,
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ margin: '0 0 12px 0', color: 'white' }}>Unlock PRO Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
          This module requires an active PRO subscription. Upgrade now to get deeper insights, pricing management, and full historical analytics.
        </p>
        <button className="primary" style={{ width: '100%', padding: '14px 20px', fontSize: '15px' }} onClick={() => alert('Initiating Stripe Checkout Flow...')}>
          Upgrade to PRO - ₹1,499/mo
        </button>
      </div>
    </div>
  );
}
