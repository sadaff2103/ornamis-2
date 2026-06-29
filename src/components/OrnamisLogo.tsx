interface OrnamisLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'full' | 'icon' | 'horizontal';
}

export function OrnamisLogo({
  size = 80,
  className = "",
  showText = true,
  variant = 'full'
}: OrnamisLogoProps) {

  if (variant === 'horizontal') {
    return (
      <svg
        width={size * 4}
        height={size}
        viewBox="0 0 320 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          {/* Gold Metallic Gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9d77e" />
            <stop offset="25%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#f4e4c1" />
            <stop offset="75%" stopColor="#c9a961" />
            <stop offset="100%" stopColor="#8b6914" />
          </linearGradient>

          {/* Deep Gold Gradient */}
          <linearGradient id="deepGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c9a961" />
            <stop offset="50%" stopColor="#8b6914" />
            <stop offset="100%" stopColor="#6b4e0e" />
          </linearGradient>

          {/* Light Highlight Gradient */}
          <linearGradient id="highlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f9d77e" stopOpacity="0.3" />
          </linearGradient>

          {/* Radial Glow */}
          <radialGradient id="glow">
            <stop offset="0%" stopColor="#f9d77e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>

          {/* Drop Shadow Filter */}
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft Glow Filter */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Icon Symbol - Left Side */}
        <g transform="translate(5, 15)" filter="url(#dropShadow)">
          {/* Central Diamond Jewel */}
          <path
            d="M 25 5 L 35 20 L 25 35 L 15 20 Z"
            fill="url(#goldGradient)"
            stroke="url(#deepGold)"
            strokeWidth="0.5"
            filter="url(#softGlow)"
          />

          {/* Diamond Facets */}
          <path d="M 25 5 L 30 20 L 25 20 Z" fill="url(#highlight)" opacity="0.6" />
          <path d="M 25 5 L 20 20 L 25 20 Z" fill="url(#deepGold)" opacity="0.3" />
          <path d="M 25 35 L 30 20 L 25 20 Z" fill="url(#deepGold)" opacity="0.4" />
          <path d="M 25 35 L 20 20 L 25 20 Z" fill="url(#deepGold)" opacity="0.5" />

          {/* Left Wing - Abstract Geometric Pattern */}
          <g opacity="0.95">
            <path
              d="M 15 20 Q 5 15, 0 18 Q 3 22, 15 22 Z"
              fill="url(#goldGradient)"
              stroke="url(#deepGold)"
              strokeWidth="0.4"
            />
            <path
              d="M 15 21 Q 8 17, 3 19 Q 5 21, 15 22 Z"
              fill="url(#highlight)"
              opacity="0.4"
            />
          </g>

          {/* Right Wing - Abstract Geometric Pattern */}
          <g opacity="0.95">
            <path
              d="M 35 20 Q 45 15, 50 18 Q 47 22, 35 22 Z"
              fill="url(#goldGradient)"
              stroke="url(#deepGold)"
              strokeWidth="0.4"
            />
            <path
              d="M 35 21 Q 42 17, 47 19 Q 45 21, 35 22 Z"
              fill="url(#highlight)"
              opacity="0.4"
            />
          </g>

          {/* Top Crown Element */}
          <circle cx="25" cy="3" r="1.5" fill="url(#goldGradient)" filter="url(#softGlow)" />

          {/* Side Accent Sparkles */}
          <circle cx="12" cy="12" r="0.8" fill="url(#highlight)" opacity="0.8" />
          <circle cx="38" cy="12" r="0.8" fill="url(#highlight)" opacity="0.8" />

          {/* Bottom Accents */}
          <path d="M 20 35 L 25 40 L 30 35" stroke="url(#goldGradient)" strokeWidth="0.8" fill="none" />
        </g>

        {/* ORNAMIS Text */}
        <g transform="translate(70, 40)" filter="url(#dropShadow)">
          <text
            fontFamily="Cinzel, serif"
            fontSize="32"
            fontWeight="700"
            fill="#000000"
            letterSpacing="2"
          >
            ORNAMIS
          </text>
        </g>
      </svg>
    );
  }

  if (variant === 'icon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="goldGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9d77e" />
            <stop offset="25%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#f4e4c1" />
            <stop offset="75%" stopColor="#c9a961" />
            <stop offset="100%" stopColor="#8b6914" />
          </linearGradient>
          <linearGradient id="deepGoldIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c9a961" />
            <stop offset="50%" stopColor="#8b6914" />
            <stop offset="100%" stopColor="#6b4e0e" />
          </linearGradient>
          <linearGradient id="highlightIcon" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f9d77e" stopOpacity="0.3" />
          </linearGradient>
          <filter id="dropShadowIcon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="0" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(0, 5)" filter="url(#dropShadowIcon)">
          {/* Central Diamond */}
          <path
            d="M 25 5 L 35 20 L 25 35 L 15 20 Z"
            fill="url(#goldGradientIcon)"
            stroke="url(#deepGoldIcon)"
            strokeWidth="0.5"
          />
          <path d="M 25 5 L 30 20 L 25 20 Z" fill="url(#highlightIcon)" opacity="0.6" />
          <path d="M 25 35 L 30 20 L 25 20 Z" fill="url(#deepGoldIcon)" opacity="0.4" />

          {/* Wings */}
          <path d="M 15 20 Q 5 15, 0 18 Q 3 22, 15 22 Z" fill="url(#goldGradientIcon)" />
          <path d="M 35 20 Q 45 15, 50 18 Q 47 22, 35 22 Z" fill="url(#goldGradientIcon)" />

          {/* Accent */}
          <circle cx="25" cy="3" r="1.5" fill="url(#goldGradientIcon)" />
        </g>
      </svg>
    );
  }

  // Full vertical variant (default)
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 240 156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gold Metallic Gradient */}
        <linearGradient id="goldGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9d77e" />
          <stop offset="25%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f4e4c1" />
          <stop offset="75%" stopColor="#c9a961" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>

        <linearGradient id="deepGoldFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a961" />
          <stop offset="50%" stopColor="#8b6914" />
          <stop offset="100%" stopColor="#6b4e0e" />
        </linearGradient>

        <linearGradient id="highlightFull" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f9d77e" stopOpacity="0.3" />
        </linearGradient>

        <filter id="dropShadowFull" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="softGlowFull">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Icon Symbol */}
      <g transform="translate(95, 10)" filter="url(#dropShadowFull)">
        {/* Central Diamond Jewel */}
        <path
          d="M 25 5 L 38 25 L 25 45 L 12 25 Z"
          fill="url(#goldGradientFull)"
          stroke="url(#deepGoldFull)"
          strokeWidth="0.8"
          filter="url(#softGlowFull)"
        />

        {/* Diamond Facets for 3D effect */}
        <path d="M 25 5 L 31 25 L 25 25 Z" fill="url(#highlightFull)" opacity="0.7" />
        <path d="M 25 5 L 19 25 L 25 25 Z" fill="url(#deepGoldFull)" opacity="0.3" />
        <path d="M 25 45 L 31 25 L 25 25 Z" fill="url(#deepGoldFull)" opacity="0.4" />
        <path d="M 25 45 L 19 25 L 25 25 Z" fill="url(#deepGoldFull)" opacity="0.5" />

        {/* Left Wing - Geometric Abstract */}
        <g opacity="0.95">
          <path
            d="M 12 25 Q 2 18, -3 22 Q 0 28, 12 28 Z"
            fill="url(#goldGradientFull)"
            stroke="url(#deepGoldFull)"
            strokeWidth="0.5"
          />
          <path
            d="M 12 26 Q 6 21, 1 23 Q 3 26, 12 27 Z"
            fill="url(#highlightFull)"
            opacity="0.5"
          />
          {/* Wing details */}
          <path d="M 8 24 L 5 23 M 6 26 L 3 25" stroke="url(#deepGoldFull)" strokeWidth="0.3" opacity="0.6" />
        </g>

        {/* Right Wing - Geometric Abstract */}
        <g opacity="0.95">
          <path
            d="M 38 25 Q 48 18, 53 22 Q 50 28, 38 28 Z"
            fill="url(#goldGradientFull)"
            stroke="url(#deepGoldFull)"
            strokeWidth="0.5"
          />
          <path
            d="M 38 26 Q 44 21, 49 23 Q 47 26, 38 27 Z"
            fill="url(#highlightFull)"
            opacity="0.5"
          />
          {/* Wing details */}
          <path d="M 42 24 L 45 23 M 44 26 L 47 25" stroke="url(#deepGoldFull)" strokeWidth="0.3" opacity="0.6" />
        </g>

        {/* Top Crown Element */}
        <circle cx="25" cy="2" r="2" fill="url(#goldGradientFull)" filter="url(#softGlowFull)" />
        <path d="M 23 1 L 25 -2 L 27 1" stroke="url(#goldGradientFull)" strokeWidth="0.8" fill="none" />

        {/* Side Accent Sparkles */}
        <circle cx="10" cy="15" r="1" fill="url(#highlightFull)" opacity="0.9" />
        <circle cx="40" cy="15" r="1" fill="url(#highlightFull)" opacity="0.9" />
        <circle cx="8" cy="28" r="0.8" fill="url(#highlightFull)" opacity="0.7" />
        <circle cx="42" cy="28" r="0.8" fill="url(#highlightFull)" opacity="0.7" />

        {/* Bottom Geometric Accent */}
        <path d="M 18 45 L 25 52 L 32 45" stroke="url(#goldGradientFull)" strokeWidth="1" fill="none" strokeLinecap="round" />
        <circle cx="25" cy="52" r="1.5" fill="url(#goldGradientFull)" />
      </g>

      {/* ORNAMIS Text */}
      {showText && (
        <>
          <g transform="translate(120, 95)" filter="url(#dropShadowFull)">
            <text
              fontFamily="Cinzel, serif"
              fontSize="40"
              fontWeight="700"
              fill="#000000"
              letterSpacing="2.5"
              textAnchor="middle"
            >
              ORNAMIS
            </text>
          </g>

          {/* Decorative Line */}
          <line
            x1="30"
            y1="108"
            x2="90"
            y2="108"
            stroke="#000000"
            strokeWidth="0.5"
            opacity="0.3"
          />



        </>
      )}
    </svg>
  );
}