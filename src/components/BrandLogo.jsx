import React from 'react';

/**
 * BrandLogo — Pocket Dashboard brand mark
 *
 * Variants:
 *  "full"    — icon + wordmark + tagline (hero, loading screen)
 *  "compact" — icon + wordmark           (navbar, sidebar, login)
 *  "icon"    — icon only                 (favicon fallback, small spaces)
 *
 * Usage:
 *  <BrandLogo variant="compact" iconSize={40} />
 */
export default function BrandLogo({
  variant = 'compact',
  iconSize = 40,
  style = {},
  className = '',
  onClick,
}) {
  const textScale = iconSize / 40; // base is 40px

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(10 * textScale) + 'px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'opacity 0.25s ease',
        userSelect: 'none',
        ...style,
      }}
      onMouseEnter={e => { if (onClick || style.cursor === 'pointer') e.currentTarget.style.opacity = '0.82'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
    >
      {/* ── Icon mark ── */}
      <div style={{
        width: iconSize + 'px',
        height: iconSize + 'px',
        flexShrink: 0,
        borderRadius: Math.round(iconSize * 0.25) + 'px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #4F46E5 0%, #7C3AED 100%)',
        boxShadow: `0 ${Math.round(iconSize * 0.1)}px ${Math.round(iconSize * 0.4)}px rgba(99,102,241,0.45)`,
      }}>
        <img
          src="/favicon.svg"
          alt=""
          aria-hidden="true"
          style={{
            width: Math.round(iconSize * 0.72) + 'px',
            height: Math.round(iconSize * 0.72) + 'px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* ── Wordmark ── */}
      {variant !== 'icon' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          {/* "pocket" */}
          <span style={{
            fontFamily: "'Outfit', 'Inter', sans-serif",
            fontSize: Math.round(16 * textScale) + 'px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-0.3px',
          }}>
            pocket
          </span>

          {/* "dashboard" — gradient */}
          <span style={{
            fontFamily: "'Outfit', 'Inter', sans-serif",
            fontSize: Math.round(16 * textScale) + 'px',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.3px',
            background: 'linear-gradient(90deg, #818CF8 0%, #A78BFA 50%, #C084FC 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            dashboard
          </span>

          {/* Tagline — only in "full" variant */}
          {variant === 'full' && (
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: Math.round(9 * textScale) + 'px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.38)',
              letterSpacing: '0.2px',
              marginTop: '3px',
              lineHeight: 1,
            }}>
              Your Business. In Your Pocket.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
