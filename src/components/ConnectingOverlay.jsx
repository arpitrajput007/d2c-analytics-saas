import { useEffect, useState } from 'react';

const STEPS = [
  { id: 'verify',  label: 'Verifying Shopify credentials',  icon: '🔐' },
  { id: 'connect', label: 'Establishing secure connection',  icon: '🔗' },
  { id: 'sync',    label: 'Syncing orders from Shopify',     icon: '📦' },
  { id: 'done',    label: 'Store connected successfully',    icon: '🎉' },
];

// Map connectStatus message → step index
function statusToStep(status) {
  if (!status) return 0;
  if (status.includes('Verifying'))  return 0;
  if (status.includes('Establishing') || status.includes('credentials')) return 1;
  if (status.includes('Syncing') || status.includes('orders')) return 2;
  if (status.includes('connected') || status.includes('🎉')) return 3;
  return 1;
}

export default function ConnectingOverlay({ visible, connectStatus }) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [dots, setDots] = useState('');

  // Animate dots
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(t);
  }, [visible]);

  // Drive progress bar and active step from connectStatus
  useEffect(() => {
    if (!visible) { setProgress(0); setActiveStep(0); return; }
    const step = statusToStep(connectStatus);
    setActiveStep(step);
    // Progress targets: verify=15, connect=40, sync=75, done=100
    const targets = [15, 40, 75, 100];
    setProgress(targets[step] ?? 15);
  }, [connectStatus, visible]);

  if (!visible) return null;

  const isDone = activeStep === 3;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(4,4,18,0.92)',
      backdropFilter: 'blur(18px) saturate(0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      animation: 'overlay-in 0.3s ease',
    }}>
      <style>{`
        @keyframes overlay-in   { from{opacity:0} to{opacity:1} }
        @keyframes orb-pulse    { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.18);opacity:1} }
        @keyframes orb-ring     { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(1.6);opacity:0} }
        @keyframes spin-ring    { to{transform:rotate(360deg)} }
        @keyframes step-pop     { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes bar-glow     { 0%,100%{box-shadow:0 0 8px rgba(99,102,241,0.5)} 50%{box-shadow:0 0 20px rgba(99,102,241,0.9)} }
        @keyframes float-card   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes tick-in      { from{transform:scale(0) rotate(-45deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 480,
        background: 'linear-gradient(160deg, #0d0d24 0%, #090915 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 28,
        padding: '48px 40px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        animation: 'float-card 4s ease-in-out infinite',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background aurora blobs */}
        <div style={{ position:'absolute', top:-60, left:-60, width:200, height:200, borderRadius:'50%', background:'rgba(99,102,241,0.08)', filter:'blur(40px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(139,92,246,0.06)', filter:'blur(30px)', pointerEvents:'none' }} />

        {/* Animated orb */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom: 36, position:'relative' }}>
          {/* Expanding ring */}
          {!isDone && (
            <div style={{
              position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%)',
              width:90, height:90, borderRadius:'50%',
              border: '2px solid rgba(99,102,241,0.5)',
              animation: 'orb-ring 1.6s ease-out infinite',
            }} />
          )}
          {/* Spinning arc */}
          {!isDone && (
            <div style={{
              position:'absolute', top:'50%', left:'50%',
              marginTop:-38, marginLeft:-38,
              width:76, height:76, borderRadius:'50%',
              border: '2.5px solid transparent',
              borderTopColor: '#6366f1',
              borderRightColor: 'rgba(99,102,241,0.3)',
              animation: 'spin-ring 1s linear infinite',
            }} />
          )}
          {/* Core orb */}
          <div style={{
            width:68, height:68, borderRadius:'50%',
            background: isDone
              ? 'radial-gradient(circle at 40% 35%, #10b981, #059669)'
              : 'radial-gradient(circle at 40% 35%, #818cf8, #4f46e5)',
            boxShadow: isDone
              ? '0 0 32px rgba(16,185,129,0.6), 0 0 64px rgba(16,185,129,0.2)'
              : '0 0 32px rgba(99,102,241,0.6), 0 0 64px rgba(99,102,241,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 28,
            animation: 'orb-pulse 2s ease-in-out infinite',
            transition: 'background 0.5s, box-shadow 0.5s',
            zIndex:1,
          }}>
            {isDone ? (
              <span style={{ animation:'tick-in 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>✓</span>
            ) : (
              <span>🔗</span>
            )}
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign:'center', marginBottom: 32 }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:'#f1f5f9', margin:'0 0 8px', letterSpacing:'-0.4px' }}>
            {isDone ? 'Store Connected!' : 'Connecting your store'}
          </h2>
          <p style={{ fontSize:14, color:'#64748b', margin:0, minHeight:20 }}>
            {isDone ? 'Redirecting to your dashboard…' : `${connectStatus || 'Initializing'}${dots}`}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width:'100%', height:6, borderRadius:999,
            background:'rgba(255,255,255,0.06)',
            overflow:'hidden',
          }}>
            <div style={{
              height:'100%', borderRadius:999,
              width:`${progress}%`,
              background: isDone
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : 'linear-gradient(90deg, #4f46e5, #818cf8, #a5b4fc)',
              transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1), background 0.5s',
              animation: !isDone ? 'bar-glow 2s ease-in-out infinite' : 'none',
            }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
            <span style={{ fontSize:11, color:'#475569' }}>0%</span>
            <span style={{ fontSize:11, color: isDone ? '#10b981' : '#6366f1', fontWeight:600, transition:'color 0.5s' }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Step list */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {STEPS.map((s, i) => {
            const done    = i < activeStep;
            const active  = i === activeStep;
            const pending = i > activeStep;
            return (
              <div key={s.id} style={{
                display:'flex', alignItems:'center', gap:14,
                padding:'11px 16px', borderRadius:14,
                background: active
                  ? 'rgba(99,102,241,0.1)'
                  : done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${active ? 'rgba(99,102,241,0.3)' : done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}`,
                transition: 'all 0.4s',
                animation: active ? 'step-pop 0.3s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
              }}>
                {/* Icon / check */}
                <div style={{
                  width:32, height:32, borderRadius:10, flexShrink:0,
                  background: active ? 'rgba(99,102,241,0.2)' : done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:15, transition:'all 0.4s',
                }}>
                  {done ? '✓' : active
                    ? <span style={{ width:14, height:14, border:'2px solid rgba(99,102,241,0.3)', borderTopColor:'#818cf8', borderRadius:'50%', animation:'spin-ring 0.8s linear infinite', display:'block' }} />
                    : <span style={{ fontSize:14, opacity:0.4 }}>{s.icon}</span>
                  }
                </div>
                {/* Label */}
                <span style={{
                  fontSize:13.5, fontWeight: active ? 600 : 500,
                  color: done ? '#34d399' : active ? '#e2e8f0' : '#334155',
                  transition:'color 0.4s',
                }}>
                  {s.label}
                  {done && <span style={{ marginLeft:6, fontSize:12, color:'#10b981' }}>✓</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
