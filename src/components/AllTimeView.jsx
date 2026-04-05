import React from 'react';

export default function AllTimeView() {
  return (
    <div className="view-content active" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
      <div className="controls-bar glass">
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Lifetime / Custom Analytics</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>Loading historical map...</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>From</label>
            <input type="date" style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>To</label>
            <input type="date" style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <button className="primary" style={{ alignSelf: 'flex-end', padding: '7px 16px' }}>Apply</button>
          <button style={{ alignSelf: 'flex-end', padding: '7px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '8px', cursor: 'pointer' }}>🔄 Force Sync</button>
        </div>
      </div>

      <div className="metrics-grid">
         <div className="metric-card"><div className="metric-label">Lifetime Revenue</div><div className="metric-value">₹0</div></div>
         <div className="metric-card"><div className="metric-label">Total Orders</div><div className="metric-value">0</div></div>
         <div className="metric-card"><div className="metric-label">Lifetime P&L</div><div className="metric-value text-profit">₹0</div></div>
      </div>

      <div className="main-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '24px' }}>
        <div className="card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Lifetime Orders</h3>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'white', marginTop: '4px' }}>0</div>
            </div>
            <div style={{ color: 'var(--text-muted)', cursor: 'help', fontSize: '18px' }}>ⓘ</div>
          </div>
          <div style={{ position: 'relative', width: '100%', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Chart rendering module</span>
          </div>
        </div>
      </div>
      
      <div className="card glass">
        <h3>Performance by Month</h3>
        <table className="pnll-table" style={{ marginTop: '10px', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Month</th>
              <th style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Orders</th>
              <th style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Delivered</th>
              <th style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Canceled</th>
              <th style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Net P&L</th>
            </tr>
          </thead>
          <tbody>
             <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No data</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
