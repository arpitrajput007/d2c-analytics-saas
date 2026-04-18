import React from 'react';

export default function WeeklyView() {
  return (
    <div style={{ animation: 'fadeInUp 0.35s ease forwards' }}>
      <div className="controls-bar">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Weekly Report</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Select a date to see the full week's performance</div>
        </div>
        <div className="date-picker">
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Week of:</label>
          <input type="date" />
        </div>
        <button className="primary" style={{ padding: '8px 18px', fontSize: '13px' }}>Fetch Orders</button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-icon">💰</span>
          <div className="metric-label">Total Revenue</div>
          <div className="metric-value">₹0</div>
          <div className="metric-sub">Delivered orders only</div>
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

      <div className="main-grid">
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
              <tr>
                <td colSpan="5">
                  <div className="empty-state" style={{ padding: '32px' }}>
                    <div className="empty-state-icon" style={{ fontSize: '28px' }}>📅</div>
                    <div className="empty-state-text">No data yet</div>
                    <div className="empty-state-sub">Fetch orders for a selected week</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>
            Weekly P&L
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
      </div>

      {/* Chart placeholder */}
      <div className="card">
        <h3>Weekly Trend</h3>
        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '32px', opacity: 0.3 }}>📊</div>
          <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>Chart renders after data is fetched</span>
        </div>
      </div>
    </div>
  );
}
