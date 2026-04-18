import React, { useState } from 'react';

const STATUS_FILTERS = ['All Statuses', 'Delivered', 'Paid', 'Pending', 'Canceled'];

export default function SheetView() {
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease forwards' }}>
      {/* Top controls */}
      <div className="controls-bar">
        <div className="date-picker">
          <input type="date" />
          <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>→</span>
          <input type="date" />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <button className="primary" style={{ fontSize: '13px', padding: '8px 16px' }}>Fetch Details</button>
          <button style={{ fontSize: '12px', padding: '8px 14px' }}>⬇ Export CSV</button>
          <button style={{ fontSize: '12px', padding: '8px 14px' }}>⬆ Import CSV</button>
        </div>
      </div>

      {/* Filter row */}
      <div className="controls-bar" style={{ marginTop: '-8px', gap: '12px' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', opacity: 0.4, pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            placeholder="Search orders, customers, tags..."
            style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Status chips */}
        <div className="filter-chips">
          {STATUS_FILTERS.map(s => (
            <div
              key={s}
              className={`filter-chip ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="sheet-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="sheet-table">
            <thead>
              <tr>
                <th style={{ width: '100px', cursor: 'pointer' }}>Order ↕</th>
                <th style={{ width: '150px', cursor: 'pointer' }}>Customer ↕</th>
                <th style={{ width: '110px', cursor: 'pointer' }}>Total ↕</th>
                <th style={{ width: '100px' }}>Status</th>
                <th>Tags</th>
                <th style={{ width: '130px', cursor: 'pointer' }}>Date ↕</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <div className="empty-state-text">No orders found</div>
                    <div className="empty-state-sub">Select a date range and click "Fetch Details" to load orders</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
