import React from 'react';

export default function AllTimeView() {
  return (
    <div className="view-content active" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>

      {/* Controls */}
      <div className="controls-bar glass">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', letterSpacing: '-0.4px' }}>
            Lifetime / Custom Analytics
          </div>
          <p style={{ margin: '3px 0 0 0', color: 'var(--text-muted)', fontSize: '11.5px' }}>Full historical performance across all synced orders</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From</label>
            <input type="date" style={{ padding: '8px 12px', borderRadius: '9px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', outline: 'none', fontSize: '13px', transition: 'border-color 0.2s, box-shadow 0.2s' }}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To</label>
            <input type="date" style={{ padding: '8px 12px', borderRadius: '9px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', outline: 'none', fontSize: '13px', transition: 'border-color 0.2s, box-shadow 0.2s' }}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <button className="primary" style={{ padding: '9px 20px', fontSize: '13px', fontFamily: 'Outfit', fontWeight: 700 }}>Apply</button>
          <button style={{ padding: '9px 16px', fontSize: '13px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', borderRadius: '9px', cursor: 'pointer', fontFamily: 'Inter', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.14)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)'; }}
          >🔄 Force Sync</button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card glow-green clickable">
          <div className="metric-label">Lifetime Revenue</div>
          <div className="metric-value text-profit">₹0</div>
          <div className="metric-sub">All delivered orders ever</div>
          <div style={{ marginTop: '14px', height: '28px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[40, 55, 48, 68, 58, 72, 65, 85].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px', background: `rgba(45,212,160,${0.1 + i * 0.11})` }} />
            ))}
          </div>
        </div>
        <div className="metric-card glow-white clickable">
          <div className="metric-label">Total Orders</div>
          <div className="metric-value">0</div>
          <div className="metric-sub">Across all time</div>
          <div style={{ marginTop: '14px', height: '28px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[50, 38, 60, 45, 62, 52, 68, 58].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px', background: `rgba(255,255,255,${0.04 + i * 0.02})` }} />
            ))}
          </div>
        </div>
        <div className="metric-card glow-yellow clickable">
          <div className="metric-label">Lifetime P&amp;L</div>
          <div className="metric-value text-profit">₹0</div>
          <div className="metric-sub">Revenue − All Costs</div>
          <div style={{ marginTop: '14px', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '0%', background: 'var(--primary-gradient)', borderRadius: '3px' }} />
          </div>
        </div>
      </div>

      {/* Lifetime Orders Card */}
      <div className="main-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '24px' }}>
        <div className="card glass" style={{ background: 'rgba(15,15,26,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Lifetime Orders</h3>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'white', fontFamily: 'Outfit', letterSpacing: '-1.5px' }}>0</div>
            </div>
            <div style={{ color: 'var(--text-dim)', cursor: 'help', fontSize: '18px', opacity: 0.5 }}>ⓘ</div>
          </div>
          <div style={{ position: 'relative', width: '100%', height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(56,189,248,0.08))',
              border: '1px solid rgba(167,139,250,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', opacity: 0.6,
            }}>📈</div>
            <span style={{ color: 'var(--text-dim)', fontSize: '13.5px', textAlign: 'center' }}>Chart renders after sync</span>
          </div>
        </div>
      </div>

      {/* Performance by Month table */}
      <div className="card glass" style={{ background: 'rgba(15,15,26,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, fontFamily: 'Outfit' }}>Performance by Month</h3>
        <table className="pnll-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              {['Month', 'Orders', 'Delivered', 'Canceled', 'Net P&L'].map((col, i) => (
                <th key={i} style={{ textAlign: i === 4 ? 'right' : 'left', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '10.5px', letterSpacing: '0.8px' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-dim)', fontSize: '13.5px', lineHeight: 1.7 }}>
                <div style={{ opacity: 0.5, fontSize: '28px', marginBottom: '10px' }}>🗓️</div>
                No data synced yet — click <strong style={{ color: 'var(--text-muted)' }}>Force Sync</strong> to load historical data
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
