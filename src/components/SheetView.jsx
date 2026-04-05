import React from 'react';

export default function SheetView() {
  return (
    <div className="view-content active" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
      <div className="controls-bar">
        <div className="date-picker">
          <input type="date" />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <input type="date" />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="primary">Fetch Details</button>
          <button style={{ fontSize: '13px' }}>Export CSV</button>
          <button style={{ fontSize: '13px', background: 'var(--secondary)' }}>Import CSV</button>
        </div>
      </div>
      
      <div className="controls-bar" style={{ marginTop: '-16px', background: 'rgba(255,255,255,0.02)', borderTop: 'none' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>🔍</span>
            <input type="text" placeholder="Search orders, customers, or tags..." style={{ width: '100%', padding: '8px 12px 8px 36px', background: '#09090b', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', fontSize: '13px' }} />
          </div>
          <select style={{ padding: '8px 12px', background: '#09090b', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', fontSize: '13px', minWidth: '140px' }}>
            <option value="all">All Statuses</option>
            <option value="delivered">Delivered Only</option>
            <option value="paid">Paid Only</option>
          </select>
        </div>
      </div>

      <div className="sheet-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="sheet-table">
            <thead>
              <tr>
                <th style={{ width: '100px', cursor: 'pointer' }}>Order</th>
                <th style={{ width: '140px', cursor: 'pointer' }}>Customer</th>
                <th style={{ width: '100px', cursor: 'pointer' }}>Total</th>
                <th style={{ width: '80px' }}>Status</th>
                <th>Tags</th>
                <th style={{ width: '120px', cursor: 'pointer' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No data available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
