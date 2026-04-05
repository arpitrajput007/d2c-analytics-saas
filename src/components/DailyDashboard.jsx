import React from 'react';

export default function DailyDashboard() {
  return (
    <div className="view-content active" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
      <div className="controls-bar glass" style={{ marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Profit/Loss Scoreboard</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Start Date</label>
            <input type="date" className="date-input" style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white', colorScheme: 'dark', cursor: 'pointer' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>End Date</label>
            <input type="date" className="date-input" style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white', colorScheme: 'dark', cursor: 'pointer' }} />
          </div>
          <button className="primary" style={{ alignSelf: 'flex-end', padding: '7px 16px' }}>Calculate</button>
        </div>
      </div>

      <div className="controls-bar">
        <h2 style={{ margin: 0, fontSize: '18px', flex: 1 }}>Daily Feed</h2>
        <div className="date-picker">
          <label style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Start Date:</label>
          <input type="date" />
        </div>
        <div className="date-picker">
          <label style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>End Date:</label>
          <input type="date" />
        </div>
        <button className="primary">Fetch Feed</button>
      </div>

      <div className="daily-feed-container">
        {/* Day blocks will render here */}
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No daily feed data currently loaded. Sync database to view.
        </div>
      </div>
    </div>
  );
}
