import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Onboarding({ session }) {
  const [loading, setLoading] = useState(false);
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
      .insert([
        {
          owner_id: session.user.id,
          store_name: storeName,
          shopify_domain: shopifyDomain,
          shopify_access_token: accessToken,
          primary_color: themeColor,
          dashboard_style: 'dark-modern'
        }
      ]);

    setLoading(false);

    if (error) {
      alert('Error creating store: ' + error.message);
    } else {
      // Trigger a visual reload to apply the theme in App
      navigate('/');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="card glass" style={{ maxWidth: '500px', width: '100%', padding: '40px' }}>
        <h2 style={{ margin: '0 0 16px 0', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Connect Your Store
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px', lineHeight: '1.6' }}>
          Welcome aboard! Let's link your Shopify account and customize your brand style before we build your dashboard.
        </p>

        <form onSubmit={handleOnboard}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Store Name</label>
            <input type="text" required value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="e.g. Acme Co" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Shopify Domain</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="text" required value={shopifyDomain} onChange={e => setShopifyDomain(e.target.value)} placeholder="acme-store" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px 0 0 8px', color: 'white', borderRight: 'none', boxSizing: 'border-box' }} />
              <div style={{ padding: '12px 16px', background: '#1a1a1a', border: '1px solid var(--border)', borderRadius: '0 8px 8px 0', color: 'var(--text-muted)', fontSize: '13px' }}>.myshopify.com</div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Custom App Access Token</label>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Create a custom app in Shopify Admin with `read_orders` & `read_products` scopes.</p>
            <input type="password" required value={accessToken} onChange={e => setAccessToken(e.target.value)} placeholder="shpat_..." style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', boxSizing: 'border-box', fontFamily: 'monospace' }} />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Brand Primary Color</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} style={{ width: '50px', height: '40px', padding: '0', background: 'none', border: 'none', cursor: 'pointer' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{themeColor.toUpperCase()}</span>
            </div>
          </div>

          <button type="submit" className="primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }} disabled={loading}>
            {loading ? 'Configuring your dashboard...' : 'Launch Analytics'}
          </button>
        </form>
      </div>
    </div>
  );
}
