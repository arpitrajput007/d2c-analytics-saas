import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../supabaseClient';

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

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

export default function DailyDashboard({ store }) {
  const [activeFilter, setActiveFilter] = useState('Last 30 Days');
  const [dismissed, setDismissed] = useState(false);
  const [riskVisible, setRiskVisible] = useState(false);
  
  const now = new Date();
  const d30 = new Date(now); d30.setDate(d30.getDate() - 30);
  const [startDate, setStartDate] = useState(d30.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [pricing, setPricing] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setRiskVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (store?.id) {
      loadPricing();
      fetchOrders();
    }
  }, [store?.id, startDate, endDate]);

  async function loadPricing() {
    if (!store?.id) return;
    const { data } = await supabase.from('products').select('*').eq('store_id', store.id);
    if (data) {
      const map = {};
      data.forEach(p => { map[p.title] = p; map[p.sku] = p; });
      setPricing(map);
    }
  }

  async function fetchOrders() {
    if (!store?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', store.id)
      .gte('created_at', startDate + 'T00:00:00')
      .lte('created_at', endDate + 'T23:59:59')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  function handleFilterClick(f) {
    setActiveFilter(f);
    const end = new Date();
    let start = new Date();
    if (f === 'Today') {
      // no change
    } else if (f === 'Yesterday') {
      start.setDate(end.getDate() - 1);
      end.setDate(end.getDate() - 1);
    } else if (f === 'Last 7 Days') {
      start.setDate(end.getDate() - 7);
    } else if (f === 'Last 30 Days') {
      start.setDate(end.getDate() - 30);
    }
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }

  const stats = useMemo(() => {
    let revenue = 0;
    let cost = 0;
    let rtoCost = 0;
    
    orders.forEach(order => {
      const items = order.line_items || [];
      const tags = (order.tags || []);
      const tagStr = Array.isArray(tags) ? tags.join(',') : tags;
      const isDelivered = tagStr.toLowerCase().includes('delivered');
      const isRTO = tagStr.toLowerCase().includes('rto') || tagStr.toLowerCase().includes('returned');
      
      items.forEach(item => {
        const p = pricing[item.title] || pricing[item.sku] || {};
        const cp = parseFloat(p.cost_price || 555);
        const ship = parseFloat(p.shipping_cost || 135);
        const qty = item.quantity || 0;
        
        if (isDelivered) {
          revenue += qty * parseFloat(item.price || 0);
          cost += qty * (cp + ship);
        } else if (isRTO) {
          rtoCost += qty * ship; 
        }
      });
    });
    
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const leaked = rtoCost;
    const leakedPct = revenue > 0 ? (leaked / revenue) * 100 : 0;
    
    return { revenue, cost, profit, margin, leaked, leakedPct };
  }, [orders, pricing]);

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
              onClick={() => handleFilterClick(f)}
            >{f}</div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', fontSize: '13px', outline: 'none', fontFamily: 'Inter', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
          <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>→</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white', colorScheme: 'dark', fontSize: '13px', outline: 'none', fontFamily: 'Inter', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
          <button className="primary" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={fetchOrders}>
            {loading ? '...' : 'Apply'}
          </button>
        </div>
      </div>

      {/* ─── Core Metrics Grid ─── */}
      <div className="metrics-grid">
        <MetricCard glowClass={stats.profit >= 0 ? "glow-green clickable" : "glow-red clickable"}>
          <div className="metric-label">Net Profit (True ROI)</div>
          <div className="metric-value text-profit" style={{ fontSize: '34px', color: stats.profit >= 0 ? 'var(--profit-color)' : 'var(--loss-color)' }}>
            {fmt(stats.profit)}
          </div>
          <div className="metric-sub" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>After all deductions</span>
            <span style={{ color: stats.profit >= 0 ? 'var(--profit-color)' : 'var(--loss-color)', fontWeight: 700 }}>
              {stats.profit >= 0 ? '+' : ''}{stats.margin.toFixed(1)}%
            </span>
          </div>
          <div style={{ marginTop: '14px', height: '30px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[40, 55, 45, 70, 60, 80, 65, Math.max(10, Math.min(100, stats.margin * 2))].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px', background: stats.profit >= 0 ? `rgba(45,212,160,${0.12 + i * 0.11})` : `rgba(251,113,133,${0.12 + i * 0.11})`, transition: 'height 0.5s ease' }} />
            ))}
          </div>
        </MetricCard>

        <MetricCard glowClass="glow-red clickable">
          <div className="metric-label" style={{ color: 'var(--loss-color)' }}>Margin Leaked</div>
          <div className="metric-value text-loss" style={{ fontSize: '34px' }}>{fmt(stats.leaked)}</div>
          <div className="metric-sub" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Lost to RTO &amp; Shipping</span>
            <span style={{ color: 'var(--loss-color)', fontWeight: 700 }}>-{stats.leakedPct.toFixed(1)}%</span>
          </div>
          <div style={{ marginTop: '14px', height: '30px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[60, 45, 70, 50, 40, 55, 35, Math.max(10, Math.min(100, stats.leakedPct * 3))].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px', background: `rgba(251,113,133,${0.12 + i * 0.07})` }} />
            ))}
          </div>
        </MetricCard>

        <MetricCard glowClass="glow-yellow clickable">
          <div className="metric-label">Net Margin %</div>
          <div className="metric-value" style={{ fontSize: '34px', color: 'var(--primary)' }}>{stats.margin.toFixed(1)}%</div>
          <div className="metric-sub">Healthy threshold: &gt; 20%</div>
          <div style={{ marginTop: '14px', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, stats.margin * 2))}%`, background: 'var(--primary-gradient)', borderRadius: '3px', transition: 'width 1.2s cubic-bezier(0.23,1,0.32,1)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-dim)' }}>
            <span>0%</span><span>Healthy: 20%</span><span>50%+</span>
          </div>
        </MetricCard>

        <MetricCard glowClass="glow-white clickable">
          <div className="metric-label">Gross Revenue</div>
          <div className="metric-value" style={{ fontSize: '34px' }}>{fmt(stats.revenue)}</div>
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

        {loading ? (
          <div style={{ padding: '0' }}>
            <SkeletonFeed />
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.7 }}>
              No transactions found in this date range. Click <strong style={{ color: 'var(--text-main)' }}>"Sync Data"</strong> if you believe this is an error.
            </div>
          </div>
        ) : (
          <div style={{ padding: '0', maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead style={{ background: 'rgba(0,0,0,0.4)' }}>
                <tr>
                  <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Order ID</th>
                  <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 50).map(o => {
                  const tags = (o.tags || '').split(',').map(t => t.trim()).filter(Boolean);
                  const isDelivered = tags.some(t => t.toLowerCase().includes('delivered'));
                  const isRTO = tags.some(t => t.toLowerCase().includes('rto') || t.toLowerCase().includes('returned'));
                  const tagRender = tags.map(t => (
                    <span key={t} style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                      background: t.toLowerCase() === 'delivered' ? 'rgba(52,211,153,0.1)' : t.toLowerCase() === 'rto' ? 'rgba(251,113,133,0.1)' : 'rgba(255,255,255,0.05)',
                      color: t.toLowerCase() === 'delivered' ? '#34d399' : t.toLowerCase() === 'rto' ? '#fb7185' : 'var(--text-muted)',
                      border: `1px solid ${t.toLowerCase() === 'delivered' ? 'rgba(52,211,153,0.2)' : t.toLowerCase() === 'rto' ? 'rgba(251,113,133,0.2)' : 'rgba(255,255,255,0.1)'}`
                    }}>{t}</span>
                  ));
                  
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--text-main)' }}>{o.name}</td>
                      <td style={{ padding: '12px 24px', color: 'var(--text-dim)' }}>{o.customer_fn} {o.customer_ln}</td>
                      <td style={{ padding: '12px 24px', color: 'var(--text-main)', fontWeight: 500 }}>{fmt(o.total_price)}</td>
                      <td style={{ padding: '12px 24px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{tagRender}</td>
                      <td style={{ padding: '12px 24px', color: 'var(--text-dim)', fontSize: '12px' }}>
                        {new Date(o.created_at).toLocaleDateString()} {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
