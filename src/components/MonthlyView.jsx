import React from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEARS  = ['2024','2025','2026'];

export default function MonthlyView() {
  const now = new Date();
  return (
    <div style={{ animation: 'fadeInUp 0.35s ease forwards' }}>

      {/* Controls */}
      <div className="controls-bar">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px', fontFamily: 'Outfit', letterSpacing: '-0.4px' }}>Monthly Report</div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Month-over-month performance overview</div>
        </div>
        <select
          defaultValue={String(now.getMonth() + 1)}
          style={{ padding: '9px 14px', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border)', color: 'white', borderRadius: '9px', fontSize: '13px', colorScheme: 'dark', outline: 'none', cursor: 'pointer', fontFamily: 'Inter', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        >
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select
          defaultValue={String(now.getFullYear())}
          style={{ padding: '9px 14px', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border)', color: 'white', borderRadius: '9px', fontSize: '13px', colorScheme: 'dark', outline: 'none', cursor: 'pointer', fontFamily: 'Inter', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        >
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button className="primary" style={{ padding: '9px 20px', fontSize: '13px', fontFamily: 'Outfit', fontWeight: 700 }}>Fetch Orders</button>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card glow-green clickable">
          <div className="metric-label">Monthly Revenue</div>
          <div className="metric-value text-profit">₹0</div>
          <div className="metric-sub">Delivered orders</div>
          <div style={{ marginTop: '14px', height: '28px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[45, 60, 50, 75, 65, 80, 70, 88].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px', background: `rgba(45,212,160,${0.12 + i * 0.11})` }} />
            ))}
          </div>
        </div>
        <div className="metric-card glow-white clickable">
          <div className="metric-label">Total Orders</div>
          <div className="metric-value">0</div>
          <div className="metric-sub">All statuses</div>
          <div style={{ marginTop: '14px', height: '28px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[55, 40, 65, 48, 70, 58, 75, 62].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px', background: `rgba(255,255,255,${0.05 + i * 0.025})` }} />
            ))}
          </div>
        </div>
        <div className="metric-card glow-yellow clickable">
          <div className="metric-label">Net P&amp;L</div>
          <div className="metric-value text-profit">₹0</div>
          <div className="metric-sub">Revenue − Costs</div>
          <div style={{ marginTop: '14px', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '0%', background: 'var(--primary-gradient)', borderRadius: '3px' }} />
          </div>
        </div>
      </div>

      {/* P&L Table */}
      <div className="card" style={{ marginBottom: '20px', background: 'rgba(15,15,26,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, fontFamily: 'Outfit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Monthly P&amp;L
          <span className="badge live">Profit: ₹0</span>
        </h3>
        <table className="pnll-table" style={{ width: '100%' }}>
          <tbody>
            {[
              ['Gross Revenue (Delivered)', '₹0', null],
              ['− Total Product Cost', '₹0', 'var(--loss-color)'],
              ['− Total Logistics Cost', '₹0', 'var(--loss-color)'],
            ].map(([label, val, color], i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text-muted)', fontSize: '13.5px', padding: '13px 0' }}>{label}</td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: color || 'var(--text-main)', padding: '13px 0' }}>{val}</td>
              </tr>
            ))}
            <tr style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <td style={{ paddingTop: '16px', fontWeight: 800, fontFamily: 'Outfit', fontSize: '15px' }}>Estimated Net Profit</td>
              <td className="text-profit" style={{ textAlign: 'right', paddingTop: '16px', fontWeight: 800, fontSize: '20px', fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>₹0</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Monthly Trend placeholder */}
      <div className="card" style={{ background: 'rgba(15,15,26,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 style={{ margin: '0 0 0 0', fontSize: '15px', fontWeight: 700, fontFamily: 'Outfit' }}>Monthly Trend</h3>
        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(245,200,66,0.08), rgba(245,200,66,0.03))',
            border: '1px solid rgba(245,200,66,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', opacity: 0.6,
          }}>📊</div>
          <span style={{ color: 'var(--text-dim)', fontSize: '13.5px', lineHeight: 1.65, textAlign: 'center', maxWidth: '280px' }}>
            Chart renders after data is fetched.<br />
            <span style={{ color: 'var(--text-muted)' }}>Click "Fetch Orders" above to load your monthly trend.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
