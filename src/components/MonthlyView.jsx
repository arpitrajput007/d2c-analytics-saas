import React from 'react';

export default function MonthlyView() {
  return (
    <div className="view-content active" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
      <div className="controls-bar">
        <select style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4" selected>April</option>
          <option value="5">May</option>
        </select>
        <select style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}>
          <option value="2025">2025</option>
          <option value="2026" selected>2026</option>
        </select>
        <button className="primary" style={{ padding: '8px 16px' }}>Fetch Orders</button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card"><div className="metric-label">Monthly Revenue</div><div className="metric-value">₹0</div></div>
        <div className="metric-card"><div className="metric-label">Total Orders</div><div className="metric-value">0</div></div>
        <div className="metric-card"><div className="metric-label">Net P&L</div><div className="metric-value text-profit">₹0</div></div>
      </div>

      <div className="main-grid">
        <div className="card full-width">
          <h3>Monthly Trend</h3>
          <div style={{ position: 'relative', width: '100%', height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Chart rendering module</span>
          </div>
        </div>

        <div className="card full-width">
          <h3>Monthly P&L <span className="badge live">Profit: ₹0</span></h3>
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
