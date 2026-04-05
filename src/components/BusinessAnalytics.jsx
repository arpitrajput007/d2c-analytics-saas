import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BusinessAnalytics() {
  const chartData = {
    labels: ['Delivered', 'In Transit', 'RTO', 'Canceled', 'Failed'],
    datasets: [{
      data: [65, 15, 8, 10, 2],
      backgroundColor: [
        '#34d399', // Delivered
        '#60a5fa', // In Transit
        '#ef4444', // RTO
        '#f87171', // Canceled
        '#f97316', // Failed
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 40 },
    color: '#ffffff',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#a1a1aa', padding: 20, font: { family: 'Inter', size: 12 } }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="view-content active" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
      <div className="controls-bar glass">
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Business Analytics Overview</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>Select a date range</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
            <button className="btn-preset" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', transition: '0.2s' }}>Today</button>
            <button className="btn-preset" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', transition: '0.2s' }}>7 Days</button>
            <button className="btn-preset" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', transition: '0.2s' }}>30 Days</button>
            <button className="btn-preset" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', transition: '0.2s' }}>This Month</button>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>From</label>
            <input type="date" style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>To</label>
            <input type="date" style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <button className="primary" style={{ alignSelf: 'flex-end', padding: '7px 16px' }}>Fetch Data</button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card"><div className="metric-label">Delivery Rate</div><div className="metric-value text-profit">65.0%</div></div>
        <div className="metric-card"><div className="metric-label">RTO Rate</div><div className="metric-value text-loss">8.0%</div></div>
        <div className="metric-card"><div className="metric-label">Cancellation Rate</div><div className="metric-value text-loss">10.0%</div></div>
      </div>

      <div className="main-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="card glass">
          <h3>Order Status Distribution</h3>
          <div style={{ position: 'relative', width: '100%', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
