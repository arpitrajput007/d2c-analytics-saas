import React, { useState } from 'react';

const QUICK_FILTERS = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'];

export default function DailyDashboard() {
  const [activeFilter, setActiveFilter] = useState('Last 30 Days');

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease forwards' }}>
      
      {/* --- AI RISK PANEL (Inline) --- */}
      <div style={{ 
        marginBottom: '24px', 
        background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.08), rgba(139, 92, 246, 0.05))',
        border: '1px solid rgba(248, 113, 113, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{ width: '48px', height: '48px', background: 'rgba(248,113,113,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0, boxShadow: '0 0 20px rgba(248,113,113,0.2)' }}>⚠️</div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--loss-color)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--loss-color)', borderRadius: '50%', animation: 'pulse-glow 2s infinite' }}></span>
            AI MARGIN LEAK DETECTED
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.5 }}>
            <strong>SKU 'A-12'</strong> logistics cost increased by 4% this week while RTOs jumped to 21%. You are losing ₹42 per order on this item.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="primary" style={{ padding: '6px 14px', fontSize: '13px', background: 'var(--loss-color)', color: '#fff', boxShadow: 'none' }}>Optimize Pricing →</button>
            <button className="ghost" style={{ padding: '6px 14px', fontSize: '13px' }}>Dismiss</button>
          </div>
        </div>
      </div>

      {/* Scoreboard Controls */}
      <div className="controls-bar" style={{ marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px', fontFamily: 'Outfit' }}>
            Profit Command Center
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time margin control and tracking</div>
        </div>
        <div className="filter-chips" style={{ marginRight: '16px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="date" style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', fontSize: '13px', outline: 'none' }} />
          <span style={{ color: 'var(--text-dim)' }}>→</span>
          <input type="date" style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', fontSize: '13px', outline: 'none' }} />
          <button className="primary" style={{ padding: '7px 18px', fontSize: '13px' }}>Sync</button>
        </div>
      </div>

      {/* CORE METRICS GRID */}
      <div className="metrics-grid">
        <div className="metric-card glow-green">
          <div className="metric-label">Net Profit (True ROI)</div>
          <div className="metric-value text-profit">₹0</div>
          <div className="metric-sub" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>After all deductions</span>
            <span style={{ color: 'var(--profit-color)' }}>+0.0%</span>
          </div>
        </div>

        <div className="metric-card glow-red">
          <div className="metric-label" style={{ color: 'var(--loss-color)' }}>Margin Leaked</div>
          <div className="metric-value text-loss">₹0</div>
          <div className="metric-sub" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Lost to RTO & Shipping</span>
            <span style={{ color: 'var(--loss-color)' }}>-0.0%</span>
          </div>
        </div>

        <div className="metric-card glow-yellow">
          <div className="metric-label">Net Margin %</div>
          <div className="metric-value" style={{ color: 'var(--primary)' }}>0.0%</div>
          <div className="metric-sub">Healthy threshold: > 20%</div>
        </div>
        
        <div className="metric-card glow-white">
          <div className="metric-label">Gross Revenue</div>
          <div className="metric-value">₹0</div>
          <div className="metric-sub">Delivered Only</div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ margin: 0 }}>Live Transaction Feed</h3>
          <span className="badge live">Listening for Shopfiy Webhooks...</span>
        </div>
        <div className="daily-feed-container" style={{ padding: '24px' }}>
          <div className="empty-state">
            <div className="empty-state-icon" style={{ fontSize: '48px', color: 'var(--text-dim)' }}>🛡️</div>
            <div className="empty-state-text">Your system is ready.</div>
            <div className="empty-state-sub">Click "Sync" to pull your orders and reveal your exact profitability.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
