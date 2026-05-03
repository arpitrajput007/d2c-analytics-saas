import React, { useState, useEffect, useRef } from 'react';

const QUICK_FILTERS = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'];

/* ─── Skeleton loader rows ─────────────────────────────────── */
function SkeletonFeed() {
  return (
    <div style={{ padding: '8px 0' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton-row">
          <div className="skeleton skeleton-circle" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="skeleton skeleton-line" style={{ width: `${60 + i * 10}%` }} />
            <div className="skeleton skeleton-line" style={{ width: `${30 + i * 8}%`, height: '9px', opacity: 0.6 }} />
          </div>
          <div className="skeleton skeleton-line" style={{ width: '64px', height: '20px', borderRadius: '10px' }} />
        </div>
      ))}
    </div>
  );
}

/* ─── 3D Tilt metric card ────────────────────────────────────── */
function MetricCard({ label, value, sub, subRight, glowClass, labelColor, children, className = '', onClick }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transition = 'transform 0.08s ease';
      el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(12px)`;
    };
    const handleLeave = () => {
      el.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
      el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
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

/* ─── Animated scan-line ─────────────────────────────────────── */
function ScanLine() {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden', borderRadius: '14px', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(251,113,133,0.5), transparent)',
        animation: 'scan-line 3.5s ease-in-out infinite', animationDelay: '0.5s',
      }} />
    </div>
  );
}

/* ─── Pulse dot ─────────────────────────────────────────────── */
function PulseDot({ color = 'var(--loss-color)' }) {
  return (
    <div style={{ position: 'relative', width: '10px', height: '10px', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, animation: 'pulse-live 1.5s ease infinite', opacity: 0.4, transform: 'scale(2)' }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
    </div>
  );
}

export default function DailyDashboard() {
  const [activeFilter, setActiveFilter] = useState('Last 30 Days');
  const [dismissed, setDismissed] = useState(false);
  const [riskVisible, setRiskVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRiskVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.23,1,0.32,1) forwards' }}>

      {/* ─── AI Risk Detection Panel ─── */}
      {!dismissed && (
        <div style={{
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(251,113,133,0.07) 0%, rgba(139,92,246,0.05) 100%)',
          border: '1px solid rgba(251,113,133,0.22)',
          borderRadius: '16px',
          padding: '22px 24px',
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
          position: 'relative',
          overflow: 'hidden',
          opacity: riskVisible ? 1 : 0,
          transform: riskVisible ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.23,1,0.32,1)',
          boxShadow: '0 8px 40px rgba(251,113,133,0.08), 0 0 0 1px rgba(251,113,133,0.05) inset',
        }}>
          <ScanLine />
          <div style={{
            width: '50px', height: '50px', flexShrink: 0,
            background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)',
            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', boxShadow: '0 0 28px rgba(251,113,133,0.18)',
          }}>⚠️</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--loss-color)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter' }}>
              <PulseDot />
              AI Margin Leak Detected
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '14.5px', color: 'var(--text-main)', lineHeight: 1.65 }}>
              <strong>SKU 'A-12'</strong> logistics cost increased by 4% this week while RTOs jumped to 21%.
              You are losing <strong style={{ color: 'var(--loss-color)' }}>₹42 per order</strong> on this item.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="primary" style={{ padding: '8px 18px', fontSize: '13px', background: 'linear-gradient(135deg, var(--loss-color), #e55)', color: '#fff', boxShadow: '0 4px 20px rgba(251,113,133,0.3)', border: 'none' }}>
                Optimize Pricing →
              </button>
              <button className="ghost" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={() => setDismissed(true)}>
                Dismiss
              </button>
            </div>
          </div>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,113,133,0.12), transparent 70%)', pointerEvents: 'none' }} />
        </div>
      )}

      {/* ─── Controls Bar ─── */}
      <div className="controls-bar" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px', fontFamily: 'Outfit', letterSpacing: '-0.4px' }}>
            Profit Command Center
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Real-time margin control &amp; tracking</div>
        </div>

        <div className="filter-chips">
          {QUICK_FILTERS.map(f => (
            <div
              key={f}
              id={`filter-${f.toLowerCase().replace(/\s+/g, '-')}`}
              className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >{f}</div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="date" style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', fontSize: '13px', outline: 'none', fontFamily: 'Inter', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
          <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>→</span>
          <input type="date" style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', fontSize: '13px', outline: 'none', fontFamily: 'Inter', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
          <button className="primary" style={{ padding: '8px 18px', fontSize: '13px' }}>Apply</button>
        </div>
      </div>

      {/* ─── Core Metrics Grid ─── */}
      <div className="metrics-grid">
        <MetricCard glowClass="glow-green clickable">
          <div className="metric-label">Net Profit (True ROI)</div>
          <div className="metric-value text-profit" style={{ fontSize: '34px' }}>₹0</div>
          <div className="metric-sub" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>After all deductions</span>
            <span style={{ color: 'var(--profit-color)', fontWeight: 700 }}>+0.0%</span>
          </div>
          <div style={{ marginTop: '14px', height: '30px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[40, 55, 45, 70, 60, 80, 65, 90].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px', background: `rgba(45,212,160,${0.12 + i * 0.11})`, transition: 'height 0.5s ease' }} />
            ))}
          </div>
        </MetricCard>

        <MetricCard glowClass="glow-red clickable">
          <div className="metric-label" style={{ color: 'var(--loss-color)' }}>Margin Leaked</div>
          <div className="metric-value text-loss" style={{ fontSize: '34px' }}>₹0</div>
          <div className="metric-sub" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Lost to RTO &amp; Shipping</span>
            <span style={{ color: 'var(--loss-color)', fontWeight: 700 }}>-0.0%</span>
          </div>
          <div style={{ marginTop: '14px', height: '30px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[60, 45, 70, 50, 40, 55, 35, 45].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px', background: `rgba(251,113,133,${0.12 + i * 0.07})` }} />
            ))}
          </div>
        </MetricCard>

        <MetricCard glowClass="glow-yellow clickable">
          <div className="metric-label">Net Margin %</div>
          <div className="metric-value" style={{ fontSize: '34px', color: 'var(--primary)' }}>0.0%</div>
          <div className="metric-sub">Healthy threshold: &gt; 20%</div>
          <div style={{ marginTop: '14px', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '0%', background: 'var(--primary-gradient)', borderRadius: '3px', transition: 'width 1.2s cubic-bezier(0.23,1,0.32,1)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-dim)' }}>
            <span>0%</span><span>Healthy: 20%</span><span>50%</span>
          </div>
        </MetricCard>

        <MetricCard glowClass="glow-white clickable">
          <div className="metric-label">Gross Revenue</div>
          <div className="metric-value" style={{ fontSize: '34px' }}>₹0</div>
          <div className="metric-sub">Delivered Orders Only</div>
          <div style={{ marginTop: '14px', height: '30px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[50, 65, 55, 75, 65, 80, 70, 85].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px', background: `rgba(255,255,255,${0.05 + i * 0.025})` }} />
            ))}
          </div>
        </MetricCard>
      </div>

      {/* ─── Live Transaction Feed ─── */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', background: 'rgba(15,15,26,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255,255,255,0.015)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, fontFamily: 'Outfit', letterSpacing: '-0.2px' }}>
            Live Transaction Feed
          </h3>
          <span className="badge live">Listening for Shopify Webhooks</span>
        </div>

        {/* Skeleton loader rows instead of empty state */}
        <div style={{ padding: '0' }}>
          <SkeletonFeed />
          <div style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.7 }}>
              Your system is ready. Click <strong style={{ color: 'var(--text-muted)' }}>"Sync"</strong> in the top bar to pull your orders and reveal your exact profitability.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
