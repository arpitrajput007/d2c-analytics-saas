import React from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEARS  = ['2024','2025','2026'];

export default function MonthlyView() {
  const now = new Date();
  return (
    <div style={{ animation: 'fadeInUp 0.35s ease forwards' }}>
      <div className="controls-bar">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Monthly Report</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Month-over-month performance overview</div>
        </div>
        <select defaultValue={String(now.getMonth() + 1)} style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px', fontSize: '13px', colorScheme: 'dark', outline: 'none', cursor: 'pointer' }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select defaultValue={String(now.getFullYear())} style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px', fontSize: '13px', colorScheme: 'dark', outline: 'none', cursor: 'pointer' }}>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button className="primary" style={{ padding: '8px 18px', fontSize: '13px' }}>Fetch Orders</button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-icon">💰</span>
          <div className="metric-label">Monthly Revenue</div>
          <div className="metric-value">₹0</div>
          <div className="metric-sub">Delivered orders</div>
        </div>
        <div className="metric-card">
          <span className="metric-icon">📦</span>
          <div className="metric-label">Total Orders</div>
          <div className="metric-value">0</div>
          <div className="metric-sub">All statuses</div>
        </div>
        <div className="metric-card">
          <span className="metric-icon">📈</span>
          <div className="metric-label">Net P&L</div>
          <div className="metric-value text-profit">₹0</div>
          <div className="metric-sub">Revenue − Costs</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>
          Monthly P&L
          <span className="badge live">Profit: ₹0</span>
        </h3>
        <table className="pnll-table" style={{ width: '100%', marginTop: '8px' }}>
          <tbody>
            <tr>
              <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Gross Revenue (Delivered)</td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>₹0</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>− Total Product Cost</td>
              <td style={{ textAlign: 'right', color: 'var(--loss-color)', fontWeight: 600 }}>₹0</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>− Total Logistics Cost</td>
              <td style={{ textAlign: 'right', color: 'var(--loss-color)', fontWeight: 600 }}>₹0</td>
            </tr>
            <tr style={{ borderTop: '1px solid var(--border)' }}>
              <td style={{ paddingTop: '14px', fontWeight: 800, fontFamily: 'Outfit' }}>Estimated Net Profit</td>
              <td className="text-profit" style={{ textAlign: 'right', paddingTop: '14px', fontWeight: 800, fontSize: '18px' }}>₹0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Monthly Trend</h3>
        <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '36px', opacity: 0.3 }}>📊</div>
          <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>Chart renders after data is fetched</span>
        </div>
      </div>
    </div>
  );
}
