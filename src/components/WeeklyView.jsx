import React from 'react';

export default function WeeklyView() {
  return (
    <div className="view-content active" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
      <div className="controls-bar">
        <div className="date-picker">
          <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Select Week: </label>
          <input type="date" style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white' }} />
        </div>
        <button className="primary" style={{ padding: '8px 16px' }}>Fetch Orders</button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card"><div className="metric-label">Total Revenue</div><div className="metric-value">₹0</div></div>
        <div className="metric-card"><div className="metric-label">Total Orders</div><div className="metric-value">0</div></div>
        <div className="metric-card"><div className="metric-label">Net P&L</div><div className="metric-value text-profit">₹0</div></div>
      </div>

      <div className="main-grid">
        <div className="card full-width">
          <h3>Weekly Trend</h3>
          <div style={{ position: 'relative', width: '100%', height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Chart rendering module</span>
          </div>
        </div>

        <div className="card">
          <h3>Daily Breakdown</h3>
          <table className="sheet-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Orders</th>
                <th>Delivered</th>
                <th>Canceled</th>
                <th>Net P&L</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No data</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Weekly P&L <span className="badge live">Profit: ₹0</span></h3>
          <table className="pnll-table" style={{ width: '100%', marginTop: '16px' }}>
             <tbody>
              <tr><td>Gross Revenue (Delivered)</td><td style={{ textAlign: 'right' }}>₹0</td></tr>
              <tr><td>− Total Product Cost</td><td style={{ textAlign: 'right' }}>₹0</td></tr>
              <tr><td>− Total Logistics Cost</td><td style={{ textAlign: 'right' }}>₹0</td></tr>
              <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ paddingTop: '12px', fontWeight: 'bold' }}>Estimated Net Profit</td><td className="text-profit" style={{ textAlign: 'right', paddingTop: '12px', fontWeight: 'bold' }}>₹0</td></tr>
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
