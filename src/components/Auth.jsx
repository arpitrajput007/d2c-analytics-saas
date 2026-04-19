import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Activity, ArrowUpRight, CircleDollarSign, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";

/* ─── SVG Icons ─────────────────────────────────────────────── */
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000' }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ─── Aurora Background Component ───────────────────────────── */
function AuroraBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Base aurora gradient */}
      <div className="bg-aurora animate-aurora-shift" style={{ position: 'absolute', inset: 0 }} />

      {/* Floating blurred orbs */}
      <div
        className="animate-float"
        style={{ position: 'absolute', top: '-160px', left: '-160px', height: '520px', width: '520px', borderRadius: '50%', opacity: 0.6, filter: 'blur(64px)', background: 'radial-gradient(circle, var(--aurora-violet), transparent 70%)' }}
      />
      <div
        className="animate-float-slow"
        style={{ position: 'absolute', top: '33%', right: '-160px', height: '600px', width: '600px', borderRadius: '50%', opacity: 0.5, filter: 'blur(64px)', background: 'radial-gradient(circle, var(--aurora-cyan), transparent 70%)' }}
      />
      <div
        className="animate-float"
        style={{ position: 'absolute', bottom: '-160px', left: '25%', height: '520px', width: '520px', borderRadius: '50%', opacity: 0.4, filter: 'blur(64px)', background: 'radial-gradient(circle, var(--aurora-pink), transparent 70%)' }}
      />

      {/* Subtle grid overlay */}
      <div className="grid-bg-aurora" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, var(--bg-color) 100%)",
        }}
      />
    </div>
  );
}

/* ─── Dashboard Preview Component ───────────────────────────── */
const kpis = [
  { label: "Net Profit", value: "$184,920", delta: "+24.6%", icon: CircleDollarSign },
  { label: "Orders", value: "12,408", delta: "+8.1%", icon: ShoppingBag },
  { label: "ROAS", value: "4.82×", delta: "+0.34", icon: TrendingUp },
  { label: "MER", value: "3.41", delta: "+0.12", icon: Activity },
];

const PATH = "M0,140 C60,120 100,90 160,80 C220,70 260,110 320,95 C380,80 420,40 480,55 C540,70 580,30 640,20 C700,12 740,40 800,30";

function DashboardPreview() {
  return (
    <div className="gradient-border-aurora shadow-glass-aurora" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', margin: '40px auto', maxWidth: '800px', textAlign: 'left' }}>
      <div className="glass-aurora-strong" style={{ borderRadius: '24px', padding: '20px' }}>
        {/* Window chrome */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ height: '10px', width: '10px', borderRadius: '50%', background: 'rgba(251, 113, 133, 0.8)' }} />
            <span style={{ height: '10px', width: '10px', borderRadius: '50%', background: 'var(--aurora-cyan)' }} />
            <span style={{ height: '10px', width: '10px', borderRadius: '50%', background: 'var(--aurora-violet)' }} />
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '1px', color: 'var(--text-muted)' }}>
            profitcontrol.app / command-center
          </div>
          <div className="gradient-border-aurora" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '4px 10px', fontSize: '10px', color: 'var(--aurora-cyan)' }}>
            <span style={{ position: 'relative', display: 'flex', height: '6px', width: '6px' }}>
              <span className="animate-pulse-glow" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--aurora-cyan)', opacity: 0.75 }} />
              <span style={{ position: 'relative', display: 'inline-flex', height: '6px', width: '6px', borderRadius: '50%', background: 'var(--aurora-cyan)' }} />
            </span>
            LIVE
          </div>
        </div>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '4px' }}>
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div
                key={k.label}
                className="glass-aurora"
                style={{ borderRadius: '16px', padding: '16px', transition: 'transform 300ms', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
                    {k.label}
                  </span>
                  <Icon style={{ height: '16px', width: '16px', color: 'var(--aurora-cyan)' }} />
                </div>
                <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 600, letterSpacing: '-0.5px' }}>{k.value}</div>
                <div style={{ marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--aurora-cyan)' }}>
                  <ArrowUpRight style={{ height: '12px', width: '12px' }} />
                  {k.delta}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="glass-aurora" style={{ marginTop: '12px', borderRadius: '16px', padding: '16px' }}>
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>Profit, last 30 days</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>After ad spend, COGS, fees</div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {["7D", "30D", "90D", "All"].map((t, i) => (
                <span
                  key={t}
                  style={{
                    borderRadius: '999px', padding: '4px 10px', fontSize: '10px',
                    background: i === 1 ? 'var(--glass-strong)' : 'transparent',
                    color: i === 1 ? 'var(--text-main)' : 'var(--text-muted)'
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <svg viewBox="0 0 800 180" style={{ height: '160px', width: '100%', display: 'block' }}>
            <defs>
              <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--aurora-violet)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="var(--aurora-violet)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="profitStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--aurora-cyan)" />
                <stop offset="100%" stopColor="var(--aurora-pink)" />
              </linearGradient>
            </defs>

            {/* grid */}
            {[40, 80, 120, 160].map((y) => (
              <line
                key={y}
                x1="0"
                x2="800"
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 6"
              />
            ))}

            {/* area */}
            <path d={`${PATH} L800,180 L0,180 Z`} fill="url(#profitFill)" />

            {/* line */}
            <path
              d={PATH}
              fill="none"
              stroke="url(#profitStroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* glowing dot */}
            <circle cx="800" cy="30" r="5" fill="var(--aurora-cyan)" />
            <circle cx="800" cy="30" r="10" fill="rgba(56, 189, 248, 0.3)">
              <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* AI insight strip */}
        <div className="glass-aurora" style={{ marginTop: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px', borderRadius: '16px', padding: '16px' }}>
          <span
            style={{ marginTop: '2px', display: 'grid', placeItems: 'center', height: '32px', width: '32px', flexShrink: 0, borderRadius: '50%', background: 'var(--gradient-button)' }}
          >
            <Sparkles style={{ height: '16px', width: '16px', color: 'var(--bg-color)' }} />
          </span>
          <div style={{ fontSize: '14px', lineHeight: 1.5 }}>
            <span style={{ color: 'var(--text-muted)' }}>Co-Pilot · </span>
            Your <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>"Hydra Serum"</span> SKU is your
            top-margin product this week. Reallocate{" "}
            <span style={{ color: 'var(--aurora-cyan)' }}>$1,840</span> of Meta spend from{" "}
            <span style={{ color: 'var(--text-main)' }}>"Daily Cleanser"</span> for an estimated{" "}
            <span style={{ color: 'var(--aurora-cyan)' }}>+$6,210 net profit</span>.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Auth Component (The Landing Page) ─────────────────── */
export default function Auth() {
  const [loading, setLoading]             = useState(false);
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [isSignUp, setIsSignUp]           = useState(false);
  const [error, setError]                 = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let err;
    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      err = signUpError;
      if (!err) alert('Check your email for the login link or you may be auto-logged in.');
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      err = signInError;
    }
    if (err) setError(err.message);
    setLoading(false);
  };

  const openAuth = (signup = false) => {
    setIsSignUp(signup);
    setError(null);
    setIsAuthModalOpen(true);
  };

  const features = [
    { title: "Expose Margin Leakage", desc: "You think you're profitable, but RTO, packaging, and logistics fees are eating your margins silently every single day.", icon: "💸" },
    { title: "AI Risk Detection", desc: "You need immediate alerts when a SKU becomes unprofitable before it destroys your margins.", icon: "🤖" },
    { title: "Total Profit Control", desc: "Stop relying on your CA at month-end. See your full financial health in real-time.", icon: "🛡️" }
  ];

  const logos = [
    "GLOWHAUS", "NORTHWIND", "AURORA CO.", "PEAK & POUR", "VOLT APPAREL",
    "MOSSWOOD", "CINDERLY", "HALOFORM", "OFFGRID", "PRIMA NOTA",
  ];

  return (
    <div className="auth-page-root">
      <AuroraBackground />

      {/* ── SiteNav ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(4,4,10,0.6)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--gradient-button)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(167, 139, 250, 0.3), var(--shadow-glow-aurora)',
          }}>
            <ShieldIcon />
          </div>
          <div style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 800, background: 'var(--text-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px' }}>
            Profit<span className="text-gradient">Control</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Features', 'Pricing', 'Blog'].map(l => (
            <span key={l} style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-main)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >{l}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="ghost" style={{ padding: '9px 20px', fontSize: '13.5px' }} onClick={() => openAuth(false)}>Sign in</button>
          <button className="btn-aurora" style={{ padding: '9px 22px', fontSize: '13.5px', color: '#000' }} onClick={() => openAuth(true)}>Launch app</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: '100px', paddingBottom: '40px', textAlign: 'center', paddingLeft: '20px', paddingRight: '20px' }}>
        <div className="animate-fade-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(48px, 6vw, 76px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '24px' }}>
            <span style={{ color: 'var(--text-main)' }}>The control room for</span>
            <br />
            <span className="text-gradient">profitable D2C brands</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Real-time profit, ad spend, and unit economics from Shopify, Meta and Google — unified into one luminous dashboard, narrated by an AI co-pilot.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-aurora" onClick={() => openAuth(true)}>Start free for 14 days</button>
            <button className="ghost" style={{ padding: '12px 24px', borderRadius: '8px', fontWeight: 600 }} onClick={() => openAuth(false)}>See it in motion</button>
          </div>
        </div>
        
        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <DashboardPreview />
        </div>
      </section>

      {/* ── Logo Marquee ── */}
      <section style={{ padding: '40px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Operating capital for modern commerce
        </div>
        <div style={{ display: 'flex', overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div className="animate-marquee" style={{ display: 'flex', gap: '48px', whiteSpace: 'nowrap', width: 'max-content' }}>
            {[...logos, ...logos].map((name, i) => (
              <span key={i} style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: '16px' }}>Every number you actually care about</h2>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Stop stitching spreadsheets at 1am. Profit Control is the calm, unified layer your finance and growth teams have been waiting for.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => (
            <div key={i} className="glass-aurora feature-card-aurora">
              <div className="feature-icon-aurora" style={{ background: 'var(--gradient-button)', color: '#000', fontSize: '24px' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Copilot Showcase ── */}
      <section style={{ padding: '100px 20px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '64px' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
              Talk to your business <span className="text-gradient">like it's 2050.</span>
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
              Ask anything — from "what's my blended ROAS?" to "draft my investor update." The Co-Pilot reads every signal in your store and answers with charts, numbers, and actions you can ship in one click.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                "Why did my profit drop yesterday?",
                "Which SKU is causing the highest RTO loss?",
                "Is it safe to scale Meta campaigns today?",
              ].map((q, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                  <Sparkles style={{ color: 'var(--aurora-cyan)', width: '20px', height: '20px' }} />
                  <span style={{ fontSize: '15px' }}>{q}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: '1 1 500px', position: 'relative' }}>
             <div className="gradient-border-aurora shadow-glow-aurora" style={{ borderRadius: '24px', padding: '2px' }}>
               <div className="glass-aurora-strong" style={{ borderRadius: '22px', padding: '32px', minHeight: '400px' }}>
                 <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-button)', display: 'grid', placeItems: 'center' }}>
                     <Sparkles style={{ color: '#000', width: '20px', height: '20px' }} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <div style={{ background: 'var(--glass-strong)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '0 16px 16px 16px' }}>
                       I noticed your blended ROAS dipped to 2.4 yesterday due to high Meta spend on "Volume Mascara".
                       <br/><br/>
                       However, your Net Profit actually <strong>increased by 12%</strong> because organic sales of high-margin skincare bundles offset the ad inefficiency.
                     </div>
                   </div>
                 </div>
                 <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                   <div style={{ background: 'var(--aurora-cyan)', color: '#000', padding: '12px 20px', borderRadius: '16px 16px 0 16px', fontWeight: 500 }}>
                     Should I pause the Mascara ads?
                   </div>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-hover)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     U
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: '16px' }}>
            Simple, profit-aligned pricing
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '64px' }}>
            Start free. Upgrade when your dashboard makes you money.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'center' }}>
            {/* Free Tier */}
            <div className="glass-aurora" style={{ borderRadius: '24px', padding: '40px', textAlign: 'left' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Starter</div>
              <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-2px', marginBottom: '12px' }}>
                $0<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0' }}>/mo</span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Perfect for new brands tracking basic profit.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {["1 Store Connection", "Daily Sync", "Basic Metrics", "7-Day History"].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--aurora-cyan)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="ghost" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600 }} onClick={() => openAuth(true)}>Get Started</button>
            </div>

            {/* Pro Tier */}
            <div className="gradient-border-aurora shadow-glow-aurora" style={{ borderRadius: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gradient-button)', color: '#000', padding: '4px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', zIndex: 1 }}>
                Most Popular
              </div>
              <div className="glass-aurora-strong" style={{ borderRadius: '24px', padding: '48px 40px', textAlign: 'left' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--aurora-cyan)' }}>Growth PRO</div>
                <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-2px', marginBottom: '12px' }}>
                  $99<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0' }}>/mo</span>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Everything you need to scale profitably.</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {["Unlimited Store Connections", "Real-time Sync", "AI Co-Pilot Included", "Unlimited History"].map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                      <span style={{ color: 'var(--aurora-violet)', textShadow: '0 0 8px var(--aurora-violet)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="btn-aurora" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px' }} onClick={() => openAuth(true)}>Start 14-day trial</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--glass-border)', background: 'var(--bg-color)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 20px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '24px' }}>
            Run your store from the future.
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '40px' }}>
            Connect Shopify in 60 seconds. See your real profit before your next ad spend decision.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-aurora" onClick={() => openAuth(true)}>Start free for 14 days</button>
            <button className="ghost" style={{ padding: '12px 24px', borderRadius: '8px', fontWeight: 600 }}>Book a demo</button>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid var(--border)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '24px', height: '24px', background: 'var(--gradient-button)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldIcon />
            </div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '18px', color: 'var(--text-main)' }}>ProfitControl</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            © 2026 Profit Control. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Status'].map(l => (
              <span key={l} style={{ fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════
          AUTH MODAL
      ══════════════════════════════════════════════════════════ */}
      {isAuthModalOpen && (
        <div
          className="modal-overlay active"
          style={{ zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsAuthModalOpen(false); }}
        >
          <div className="auth-card gradient-border-aurora" style={{ position: 'relative', background: 'var(--bg-secondary)', borderRadius: '24px', padding: '40px', maxWidth: '440px', width: '100%', boxShadow: 'var(--shadow-glow-aurora)' }}>
            {/* Close */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-main)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >✕</button>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--gradient-button)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldIcon />
              </div>
              <div style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>Profit Control</div>
            </div>

            {/* Heading */}
            <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
              {isSignUp ? 'Launch your Command Center' : 'Welcome back'}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>
              {isSignUp
                ? 'Create an account to securely sync your Shopify data.'
                : 'Sign in to access your real-time risk dashboard.'}
            </p>

            <form onSubmit={handleAuth}>
              {/* Email */}
              <div style={{ marginBottom: '16px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>✉️</span>
                <input
                  id="auth-email"
                  type="email"
                  style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>🔒</span>
                <input
                  id="auth-password"
                  type="password"
                  style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ color: 'var(--loss-color)', fontSize: '13px', marginBottom: '16px', padding: '12px', background: 'rgba(251,113,133,0.08)', borderRadius: '8px', border: '1px solid rgba(251,113,133,0.2)' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                id="auth-submit"
                type="submit"
                className="btn-aurora"
                style={{ width: '100%', padding: '16px', fontSize: '15px' }}
                disabled={loading}
              >
                {loading
                  ? '⟳ Processing...'
                  : isSignUp ? '🚀 Create Account' : '→ Sign In'}
              </button>
            </form>

            {/* Toggle */}
            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
              {isSignUp ? 'Already have an account? ' : 'New brand owner? '}
              <span
                style={{ color: 'var(--aurora-cyan)', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              >
                {isSignUp ? 'Sign in' : 'Sign up free'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
