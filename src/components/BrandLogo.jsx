import React from 'react';

/**
 * BrandLogo — Pocket Dashboard brand mark
 *
 * Variants:
 *  "full"    — complete transparent horizontal SVG lockup with tagline (hero)
 *  "compact" — transparent pocket icon SVG + wordmark text (navbar, sidebar, login)
 *  "icon"    — P-mark color SVG only (favicon fallback, small spaces)
 *
 * iconSize for "full"    = reference icon height; full lockup width scales ~5.5×
 * iconSize for "compact" = icon height in px
 * iconSize for "icon"    = icon width/height in px
 *
 * Usage:
 *  <BrandLogo variant="full" iconSize={60} />
 *  <BrandLogo variant="compact" iconSize={40} />
 */
export default function BrandLogo({
  variant = 'compact',
  iconSize = 40,
  style = {},
  className = '',
  onClick,
}) {
  const textScale = iconSize / 40;

  /* ── ICON ONLY: transparent P-mark SVG ── */
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
          src="/P_mark_color.svg"
          alt="Pocket Dashboard"
          style={{
            width: iconSize + 'px',
            height: iconSize + 'px',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 4px 16px rgba(99,102,241,0.65))',
          }}
        />
      </div>
    );
  }

  /* ── FULL: complete transparent horizontal SVG lockup (icon + text + tagline) ── */
  if (variant === 'full') {
    /* Drive by width so the entire tagline is always legible.
       iconSize × 5.5 gives a natural proportional width for the horizontal lockup. */
    const logoWidth = Math.round(iconSize * 5.5);
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
        onMouseEnter={e => { if (onClick) e.currentTarget.style.opacity = '0.85'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      >
        <img
          src="/Pocket-Dashboard_white_hor.svg"
          alt="Pocket Dashboard — Your Business. In Your Pocket."
          draggable={false}
          style={{
            width: logoWidth + 'px',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            maxWidth: '100%',
            /* Subtle glow to pop the 3D pocket icon off dark backgrounds */
            filter: 'drop-shadow(0 6px 28px rgba(99,102,241,0.40))',
          }}
        />
      </div>
    );
  }

  /* ── COMPACT (default): transparent pocket icon SVG + stacked wordmark ── */
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
      {/* Transparent pocket icon SVG — no background box */}
      <img
        src="/Logo_icon_white.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          width: iconSize + 'px',
          height: iconSize + 'px',
          objectFit: 'contain',
          display: 'block',
          flexShrink: 0,
          filter: 'drop-shadow(0 4px 14px rgba(99,102,241,0.55))',
        }}
      />

      {/* Stacked wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
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
