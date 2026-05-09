import React from 'react';

/**
 * BrandLogo — Pocket Dashboard brand mark
 *
 * Variants:
 *  "full"    — complete horizontal logo image (hero, loading screen)
 *  "compact" — real pocket icon + wordmark text  (navbar, sidebar, login)
 *  "icon"    — P-mark color icon only            (favicon fallback, small spaces)
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

  // ── ICON ONLY variant: P-mark color logo
  if (variant === 'icon') {
    return (
      <div
        className={className}
        onClick={onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'opacity 0.25s ease',
          userSelect: 'none',
          ...style,
        }}
        onMouseEnter={e => { if (onClick) e.currentTarget.style.opacity = '0.82'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      >
        <img
          src="/P_mark_color.png"
          alt="Pocket Dashboard"
          style={{
            width: iconSize + 'px',
            height: iconSize + 'px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    );
  }

  // ── FULL variant: complete horizontal lockup image
  if (variant === 'full') {
    const imgHeight = Math.round(iconSize * 1.6);
    return (
      <div
        className={className}
        onClick={onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'opacity 0.25s ease',
          userSelect: 'none',
          ...style,
        }}
        onMouseEnter={e => { if (onClick) e.currentTarget.style.opacity = '0.82'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      >
        <img
          src="/Pocket-Dashboard_white_hor.png"
          alt="Pocket Dashboard — Your Business. In Your Pocket."
          style={{
            height: imgHeight + 'px',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            maxWidth: '100%',
          }}
        />
      </div>
    );
  }

  // ── COMPACT variant (default): real pocket icon + text wordmark
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
      {/* ── Real pocket icon ── */}
      <img
        src="/Logo_icon_white.png"
        alt=""
        aria-hidden="true"
        style={{
          width: iconSize + 'px',
          height: iconSize + 'px',
          objectFit: 'contain',
          display: 'block',
          flexShrink: 0,
          filter: 'drop-shadow(0 4px 12px rgba(99,102,241,0.5))',
        }}
      />

      {/* ── Wordmark ── */}
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

        {/* "dashboard" — gradient matching the real logo */}
        <span style={{
          fontFamily: "'Outfit', 'Inter', sans-serif",
          fontSize: Math.round(16 * textScale) + 'px',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.3px',
          background: 'linear-gradient(90deg, #6366F1 0%, #818CF8 40%, #A78BFA 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          dashboard
        </span>
      </div>
    </div>
  );
}
