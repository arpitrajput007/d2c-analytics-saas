import React, { useState } from 'react';

const QUICK_FILTERS = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'];

export default function DailyDashboard() {
  const [activeFilter, setActiveFilter] = useState('Last 30 Days');

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease forwards' }}>
      {/* Scoreboard Controls */}
      <div className="controls-bar" style={{ marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1px' }}>
            P&L Scoreboard
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calculate profit & loss across any date range</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start</label>
            <input type="date" style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>End</label>
            <input type="date" style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <button className="primary" style={{ alignSelf: 'flex-end', padding: '7px 18px', fontSize: '13px' }}>
            Calculate
          </button>
        </div>
      </div>

      {/* Daily Feed Controls */}
      <div className="controls-bar">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1px' }}>
            Daily Order Feed
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>View day-by-day order breakdown</div>
        </div>
        <div className="filter-chips">
          {QUICK_FILTERS.map(f => (
            <div
              key={f}
              className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </div>
          ))}
        </div>
        <button className="primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
          Fetch Feed
        </button>
      </div>

      {/* Feed Content */}
      <div className="daily-feed-container">
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-text">No daily feed data loaded</div>
          <div className="empty-state-sub">Select a date range and click "Fetch Feed" to load your orders</div>
        </div>
      </div>
    </div>
  );
}
