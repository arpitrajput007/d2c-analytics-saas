import React from 'react';

export default function ProductsView() {
  return (
    <div className="view-content active" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
      <div className="controls-bar">
        <div className="date-picker">
          <input type="date" style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white' }} />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <input type="date" style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white' }} />
        </div>
        <button className="primary" style={{ padding: '8px 16px' }}>Analyze Products</button>
      </div>

      <div className="sheet-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Product Title</th>
                <th style={{ width: '100px' }}>Sold</th>
                <th style={{ width: '120px' }}>Revenue</th>
                <th style={{ width: '120px' }}>Cost</th>
                <th style={{ width: '120px' }}>Net Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No product data to display for selected date range.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
