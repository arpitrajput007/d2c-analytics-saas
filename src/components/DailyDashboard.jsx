import React, { useState, useEffect, useRef } from 'react';

const QUICK_FILTERS = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'];

/* ─── 3D Tilt metric card ────────────────────────────────────── */
function MetricCard({ label, value, sub, subRight, glowClass, labelColor, children, className = '', onClick }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transition = 'transform 0.08s ease';
      el.style.transform  = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`;
    };

    const handleLeave = () => {
      el.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
      el.style.transform  = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`metric-card ${glowClass} ${className}`}
      onClick={onClick}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children || (
        <>
          <div className="metric-label" style={labelColor ? { color: labelColor } : {}}>{label}</div>
          <div className="metric-value">{value}</div>
          {(sub || subRight) && (
            <div className="metric-sub" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {sub && <span>{sub}</span>}
              {subRight && <span>{subRight}</span>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Animated scan-line component ──────────────────────────── */
function ScanLine() {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
      overflow: 'hidden', borderRadius: '12px', pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(251,113,133,0.6), transparent)',
        animation: 'scan-line 3s ease-in-out infinite',
        animationDelay: '0.5s',
      }} />
    </div>
  );
}

/* ─── Pulse dot ─────────────────────────────────────────────── */
function PulseDot({ color = 'var(--loss-color)' }) {
  return (
    <div style={{
      position: 'relative', width: '10px', height: '10px', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: color,
        animation: 'pulse-live 1.5s ease infinite',
        opacity: 0.4,
        transform: 'scale(2)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 8px ${color}`,
      }} />
    </div>
  );
}

export default function DailyDashboard() {
  const [activeFilter, setActiveFilter] = useState('Last 30 Days');
  const [dismissed, setDismissed]       = useState(false);
  const [riskVisible, setRiskVisible]   = useState(false);

  /* Stagger-reveal AI panel on mount */
  useEffect(() => {
    const t = setTimeout(() => setRiskVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.23,1,0.32,1) forwards' }}>

      {/* ─── AI Risk Detection Panel ─── */}
      {!dismissed && (
        <div style={{
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(251,113,133,0.07) 0%, rgba(139,92,246,0.04) 100%)',
          border: '1px solid rgba(251,113,133,0.25)',
          borderRadius: '16px',
          padding: '20px 22px',
          display: 'flex',
          gap: '18px',
          alignItems: 'flex-start',
          position: 'relative',
          overflow: 'hidden',
          opacity: riskVisible ? 1 : 0,
          transform: riskVisible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.23,1,0.32,1)',
          boxShadow: '0 8px 32px rgba(251,113,133,0.08)',
        }}>
          {/* Animated scan-line */}
          <ScanLine />

          {/* Icon */}
          <div style={{
            width: '48px', height: '48px', flexShrink: 0,
            background: 'rgba(251,113,133,0.12)',
            border: '1px solid rgba(251,113,133,0.2)',
            borderRadius: '13px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 0 24px rgba(251,113,133,0.2)',
          }}>
            ⚠️
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--loss-color)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter' }}>
              <PulseDot />
              AI Margin Leak Detected
            </div>
            <p style={{ margin: '0 0 14px 0', fontSize: '14.5px', color: 'var(--text-main)', lineHeight: 1.6 }}>
              <strong>SKU 'A-12'</strong> logistics cost increased by 4% this week while RTOs jumped to 21%.
              You are losing <strong style={{ color: 'var(--loss-color)' }}>₹42 per order</strong> on this item.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className="primary"
                style={{ padding: '7px 16px', fontSize: '13px', background: 'linear-gradient(135deg, var(--loss-color), #e55)', color: '#fff', boxShadow: '0 4px 16px rgba(251,113,133,0.3)', border: 'none' }}
              >
                Optimize Pricing →
              </button>
              <button className="ghost" style={{ padding: '7px 14px', fontSize: '13px' }} onClick={() => setDismissed(true)}>
                Dismiss
              </button>
            </div>
          </div>

          {/* Corner glow */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,113,133,0.15), transparent 70%)', pointerEvents: 'none' }} />
        </div>
      )}

      {/* ─── Controls Bar ─── */}
      <div className="controls-bar" style={{ marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px', fontFamily: 'Outfit', letterSpacing: '-0.3px' }}>
            Profit Command Center
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time margin control and tracking</div>
        </div>

        <div className="filter-chips">
          {QUICK_FILTERS.map(f => (
            <div
              key={f}
              id={`filter-${f.toLowerCase().replace(/\s+/g, '-')}`}
              className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="date"
            style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', fontSize: '13px', outline: 'none', fontFamily: 'Inter' }}
          />
          <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>→</span>
          <input
            type="date"
            style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', fontSize: '13px', outline: 'none', fontFamily: 'Inter' }}
          />
          <button className="primary" style={{ padding: '7px 18px', fontSize: '13px' }}>Apply</button>
        </div>
      </div>

      {/* ─── Core Metrics Grid (3D tilt cards) ─── */}
      <div className="metrics-grid">
        <MetricCard
          glowClass="glow-green clickable"
          label="Net Profit (True ROI)"
          value={<span className="text-profit">₹0</span>}
          sub="After all deductions"
          subRight={<span style={{ color: 'var(--profit-color)' }}>+0.0%</span>}
        >
          <div className="metric-label">Net Profit (True ROI)</div>
          <div className="metric-value text-profit" style={{ fontSize: '28px' }}>₹0</div>
          <div className="metric-sub" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>After all deductions</span>
            <span style={{ color: 'var(--profit-color)' }}>+0.0%</span>
          </div>
          {/* Mini sparkline placeholder */}
          <div style={{ marginTop: '12px', height: '28px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
            {[40,55,45,70,60,80,65,90].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '2px', background: `rgba(45,212,160,${0.15 + i * 0.1})` }} />
            ))}
          </div>
        </MetricCard>

        <MetricCard
          glowClass="glow-red clickable"
          label="Margin Leaked"
          labelColor="var(--loss-color)"
        >
          <div className="metric-label" style={{ color: 'var(--loss-color)' }}>Margin Leaked</div>
          <div className="metric-value text-loss" style={{ fontSize: '28px' }}>₹0</div>
          <div className="metric-sub" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Lost to RTO &amp; Shipping</span>
            <span style={{ color: 'var(--loss-color)' }}>-0.0%</span>
          </div>
          <div style={{ marginTop: '12px', height: '28px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
            {[60,45,70,50,40,55,35,45].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '2px', background: `rgba(251,113,133,${0.15 + i * 0.05})` }} />
            ))}
          </div>
        </MetricCard>

        <MetricCard glowClass="glow-yellow clickable">
          <div className="metric-label">Net Margin %</div>
          <div className="metric-value" style={{ fontSize: '28px', color: 'var(--primary)' }}>0.0%</div>
          <div className="metric-sub">Healthy threshold: &gt; 20%</div>
          <div style={{
            marginTop: '12px',
            height: '4px',
            background: 'var(--border)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{ height: '100%', width: '0%', background: 'var(--primary-gradient)', borderRadius: '2px', transition: 'width 1s ease' }} />
          </div>
        </MetricCard>

        <MetricCard glowClass="glow-white clickable">
          <div className="metric-label">Gross Revenue</div>
          <div className="metric-value" style={{ fontSize: '28px' }}>₹0</div>
          <div className="metric-sub">Delivered Orders Only</div>
          <div style={{ marginTop: '12px', height: '28px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
            {[50,65,55,75,65,80,70,85].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '2px', background: `rgba(255,255,255,${0.06 + i * 0.02})` }} />
            ))}
          </div>
        </MetricCard>
      </div>

      {/* ─── Live Transaction Feed ─── */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Card header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255,255,255,0.015)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, fontFamily: 'Outfit', letterSpacing: '-0.2px' }}>
            Live Transaction Feed
          </h3>
          <span className="badge live">
            Listening for Shopify Webhooks
          </span>
        </div>

        {/* Empty state */}
        <div className="daily-feed-container" style={{ padding: '24px' }}>
          <div className="empty-state">
            <div style={{
              width: '72px', height: '72px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(245,200,66,0.1) 0%, rgba(245,200,66,0.04) 100%)',
              border: '1px solid rgba(245,200,66,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px',
              marginBottom: '20px',
              boxShadow: '0 0 32px rgba(245,200,66,0.1)',
              animation: 'float-slow 3s ease-in-out infinite',
            }}>
              🛡️
            </div>
            <div className="empty-state-text">Your system is ready.</div>
            <div className="empty-state-sub" style={{ maxWidth: '300px', lineHeight: 1.6 }}>
              Click <strong style={{ color: 'var(--text-main)' }}>"Sync"</strong> in the top bar to pull your orders and reveal your exact profitability.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
