import React from 'react';

export default function PricingView() {
  return (
    <div className="view-content active" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
      <div className="controls-bar">
        <h2 style={{ margin: 0, fontSize: '18px' }}>Product Pricing Management</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button style={{ fontSize: '13px' }}>Sync SKUs from Inventory</button>
          <button className="primary">Save All Changes</button>
        </div>
      </div>
      
      <div className="sheet-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Product / SKU</th>
                <th style={{ width: '150px' }}>Cost Price (CP)</th>
                <th style={{ width: '150px' }}>Selling Price (SP)</th>
                <th style={{ width: '180px' }}>Shipping/Fulfillment</th>
                <th style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No products synced. Link your Shopify API to populate inventory.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
