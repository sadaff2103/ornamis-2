import React from 'react';

interface OrnamisLogoAnimatedProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'icon' | 'horizontal';
  autoPlay?: boolean;
}

export function OrnamisLogoAnimated({ 
  size = 80, 
  className = "",
  variant = 'horizontal',
  autoPlay = true
}: OrnamisLogoAnimatedProps) {
  
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
          {/* Animated Gold Metallic Gradient */}
          <linearGradient id="goldGradientAnim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9d77e">
              <animate attributeName="stop-color" 
                values="#f9d77e;#f4e4c1;#f9d77e" 
                dur="3s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="25%" stopColor="#d4af37">
              <animate attributeName="stop-color" 
                values="#d4af37;#f9d77e;#d4af37" 
                dur="3s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#f4e4c1">
              <animate attributeName="stop-color" 
                values="#f4e4c1;#d4af37;#f4e4c1" 
                dur="3s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="75%" stopColor="#c9a961">
              <animate attributeName="stop-color" 
                values="#c9a961;#d4af37;#c9a961" 
                dur="3s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#8b6914">
              <animate attributeName="stop-color" 
                values="#8b6914;#c9a961;#8b6914" 
                dur="3s" 
                repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Animated Shine Sweep */}
          <linearGradient id="shineSweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff9e6" stopOpacity="0">
              <animate attributeName="offset" 
                values="0;0;0.3;0.5;0.7;1;1" 
                dur="4s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#fff9e6" stopOpacity="0.6">
              <animate attributeName="offset" 
                values="0.1;0.3;0.5;0.7;0.9;1;1" 
                dur="4s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#fff9e6" stopOpacity="0">
              <animate attributeName="offset" 
                values="0.2;0.4;0.6;0.8;1;1;1" 
                dur="4s" 
                repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Deep Gold Gradient */}
          <linearGradient id="deepGoldAnim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c9a961" />
            <stop offset="50%" stopColor="#8b6914" />
            <stop offset="100%" stopColor="#6b4e0e" />
          </linearGradient>

          {/* Light Highlight Gradient */}
          <linearGradient id="highlightAnim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f9d77e" stopOpacity="0.3" />
          </linearGradient>

          {/* Radial Glow - Pulsing */}
          <radialGradient id="glowAnim">
            <stop offset="0%" stopColor="#f9d77e" stopOpacity="0.6">
              <animate attributeName="stop-opacity" 
                values="0.6;0.8;0.6" 
                dur="2s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>

          {/* Drop Shadow Filter */}
          <filter id="dropShadowAnim" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Soft Glow Filter - Pulsing */}
          <filter id="softGlowAnim">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Icon Symbol - Left Side with Wing Animation */}
        <g transform="translate(5, 15)" filter="url(#dropShadowAnim)">
          {/* Central Diamond Jewel - Subtle pulse */}
          <path
            d="M 25 5 L 35 20 L 25 35 L 15 20 Z"
            fill="url(#goldGradientAnim)"
            stroke="url(#deepGoldAnim)"
            strokeWidth="0.5"
            filter="url(#softGlowAnim)"
          >
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.03;1"
              dur="3s"
              repeatCount="indefinite"
              additive="sum"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>
          
          {/* Diamond Facets */}
          <path d="M 25 5 L 30 20 L 25 20 Z" fill="url(#highlightAnim)" opacity="0.6" />
          <path d="M 25 5 L 20 20 L 25 20 Z" fill="url(#deepGoldAnim)" opacity="0.3" />
          <path d="M 25 35 L 30 20 L 25 20 Z" fill="url(#deepGoldAnim)" opacity="0.4" />
          <path d="M 25 35 L 20 20 L 25 20 Z" fill="url(#deepGoldAnim)" opacity="0.5" />

          {/* Left Wing - Gentle flutter */}
          <g opacity="0.95">
            <path
              d="M 15 20 Q 5 15, 0 18 Q 3 22, 15 22 Z"
              fill="url(#goldGradientAnim)"
              stroke="url(#deepGoldAnim)"
              strokeWidth="0.4"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -1,-0.5; 0,0"
                dur="2.5s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
              <animate
                attributeName="opacity"
                values="0.95;1;0.95"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M 15 21 Q 8 17, 3 19 Q 5 21, 15 22 Z"
              fill="url(#highlightAnim)"
              opacity="0.4"
            />
          </g>

          {/* Right Wing - Gentle flutter (offset timing) */}
          <g opacity="0.95">
            <path
              d="M 35 20 Q 45 15, 50 18 Q 47 22, 35 22 Z"
              fill="url(#goldGradientAnim)"
              stroke="url(#deepGoldAnim)"
              strokeWidth="0.4"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 1,-0.5; 0,0"
                dur="2.5s"
                begin="0.3s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
              <animate
                attributeName="opacity"
                values="0.95;1;0.95"
                dur="2.5s"
                begin="0.3s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M 35 21 Q 42 17, 47 19 Q 45 21, 35 22 Z"
              fill="url(#highlightAnim)"
              opacity="0.4"
            />
          </g>

          {/* Top Crown Element - Gentle glow */}
          <circle cx="25" cy="3" r="1.5" fill="url(#goldGradientAnim)" filter="url(#softGlowAnim)">
            <animate
              attributeName="r"
              values="1.5;1.7;1.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Side Accent Sparkles - Twinkling */}
          <circle cx="12" cy="12" r="0.8" fill="url(#highlightAnim)" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="38" cy="12" r="0.8" fill="url(#highlightAnim)" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Bottom Accents */}
          <path d="M 20 35 L 25 40 L 30 35" stroke="url(#goldGradientAnim)" strokeWidth="0.8" fill="none" />
        </g>

        {/* Shine Sweep Overlay */}
        <rect x="0" y="0" width="70" height="80" fill="url(#shineSweep)" opacity="0.4" />

        {/* ORNAMIS Text with shimmer */}
        <g transform="translate(70, 40)" filter="url(#dropShadowAnim)">
          <text
            fontFamily="Cinzel, serif"
            fontSize="32"
            fontWeight="600"
            fill="url(#goldGradientAnim)"
            letterSpacing="2"
          >
            ORNAMIS
          </text>
          
          {/* Text Shine Overlay */}
          <text
            fontFamily="Cinzel, serif"
            fontSize="32"
            fontWeight="600"
            fill="url(#shineSweep)"
            letterSpacing="2"
            opacity="0.5"
          >
            ORNAMIS
          </text>
        </g>

        {/* Subtitle with gentle fade */}
        <g transform="translate(75, 58)">
          <text
            fontFamily="Cinzel, serif"
            fontSize="8"
            fontWeight="400"
            fill="url(#goldGradientAnim)"
            letterSpacing="1.5"
            opacity="0.85"
          >
            FASHION METADATA
            <animate
              attributeName="opacity"
              values="0.85;0.95;0.85"
              dur="4s"
              repeatCount="indefinite"
            />
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
          <linearGradient id="goldGradientIconAnim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9d77e">
              <animate attributeName="stop-color" 
                values="#f9d77e;#f4e4c1;#f9d77e" 
                dur="3s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#d4af37">
              <animate attributeName="stop-color" 
                values="#d4af37;#f9d77e;#d4af37" 
                dur="3s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#8b6914">
              <animate attributeName="stop-color" 
                values="#8b6914;#c9a961;#8b6914" 
                dur="3s" 
                repeatCount="indefinite" />
            </stop>
          </linearGradient>
          <linearGradient id="deepGoldIconAnim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c9a961" />
            <stop offset="50%" stopColor="#8b6914" />
            <stop offset="100%" stopColor="#6b4e0e" />
          </linearGradient>
          <linearGradient id="highlightIconAnim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f9d77e" stopOpacity="0.3" />
          </linearGradient>
          <filter id="dropShadowIconAnim">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
            <feOffset dx="0" dy="1" result="offsetblur"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(0, 5)" filter="url(#dropShadowIconAnim)">
          {/* Central Diamond with pulse */}
          <path
            d="M 25 5 L 35 20 L 25 35 L 15 20 Z"
            fill="url(#goldGradientIconAnim)"
            stroke="url(#deepGoldIconAnim)"
            strokeWidth="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.05;1"
              dur="3s"
              repeatCount="indefinite"
              additive="sum"
            />
          </path>
          <path d="M 25 5 L 30 20 L 25 20 Z" fill="url(#highlightIconAnim)" opacity="0.6" />
          <path d="M 25 35 L 30 20 L 25 20 Z" fill="url(#deepGoldIconAnim)" opacity="0.4" />

          {/* Animated Wings */}
          <path d="M 15 20 Q 5 15, 0 18 Q 3 22, 15 22 Z" fill="url(#goldGradientIconAnim)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -0.5,-0.3; 0,0"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M 35 20 Q 45 15, 50 18 Q 47 22, 35 22 Z" fill="url(#goldGradientIconAnim)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0.5,-0.3; 0,0"
              dur="2.5s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Twinkling crown */}
          <circle cx="25" cy="3" r="1.5" fill="url(#goldGradientIconAnim)">
            <animate
              attributeName="opacity"
              values="1;0.7;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    );
  }

  // Full vertical variant
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 120 168"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGradientFullAnim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9d77e">
            <animate attributeName="stop-color" 
              values="#f9d77e;#f4e4c1;#f9d77e" 
              dur="3s" 
              repeatCount="indefinite" />
          </stop>
          <stop offset="25%" stopColor="#d4af37">
            <animate attributeName="stop-color" 
              values="#d4af37;#f9d77e;#d4af37" 
              dur="3s" 
              repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#f4e4c1" />
          <stop offset="75%" stopColor="#c9a961" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>

        <linearGradient id="deepGoldFullAnim">
          <stop offset="0%" stopColor="#c9a961" />
          <stop offset="50%" stopColor="#8b6914" />
          <stop offset="100%" stopColor="#6b4e0e" />
        </linearGradient>

        <linearGradient id="highlightFullAnim">
          <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f9d77e" stopOpacity="0.3" />
        </linearGradient>

        <filter id="softGlowFullAnim">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Icon Symbol */}
      <g transform="translate(35, 10)">
        <path
          d="M 25 5 L 38 25 L 25 45 L 12 25 Z"
          fill="url(#goldGradientFullAnim)"
          stroke="url(#deepGoldFullAnim)"
          strokeWidth="0.8"
          filter="url(#softGlowFullAnim)"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.03;1"
            dur="3s"
            repeatCount="indefinite"
            additive="sum"
          />
        </path>
        
        <path d="M 25 5 L 31 25 L 25 25 Z" fill="url(#highlightFullAnim)" opacity="0.7" />
        
        {/* Animated Wings */}
        <g>
          <path
            d="M 12 25 Q 2 18, -3 22 Q 0 28, 12 28 Z"
            fill="url(#goldGradientFullAnim)"
            stroke="url(#deepGoldFullAnim)"
            strokeWidth="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -1,-0.5; 0,0"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        <g>
          <path
            d="M 38 25 Q 48 18, 53 22 Q 50 28, 38 28 Z"
            fill="url(#goldGradientFullAnim)"
            stroke="url(#deepGoldFullAnim)"
            strokeWidth="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 1,-0.5; 0,0"
              dur="2.5s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        <circle cx="25" cy="2" r="2" fill="url(#goldGradientFullAnim)" filter="url(#softGlowFullAnim)">
          <animate
            attributeName="opacity"
            values="1;0.8;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Text */}
      <g transform="translate(60, 95)">
        <text
          fontFamily="Cinzel, serif"
          fontSize="28"
          fontWeight="600"
          fill="url(#goldGradientFullAnim)"
          letterSpacing="1.5"
          textAnchor="middle"
        >
          ORNAMIS
        </text>
      </g>

      <g transform="translate(60, 122)">
        <text
          fontFamily="Cinzel, serif"
          fontSize="8"
          fontWeight="400"
          fill="url(#goldGradientFullAnim)"
          letterSpacing="1.8"
          textAnchor="middle"
          opacity="0.85"
        >
          FASHION METADATA
          <animate
            attributeName="opacity"
            values="0.85;0.95;0.85"
            dur="4s"
            repeatCount="indefinite"
          />
        </text>
      </g>
    </svg>
  );
}
