import React from 'react';

interface NightonLogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'default' | 'light' | 'navy';
}

export const NightonLogo: React.FC<NightonLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  tone = 'default',
}) => {
  // Dimension maps
  const heightMap = {
    sm: variant === 'icon' ? 24 : 22,
    md: variant === 'icon' ? 32 : 28,
    lg: variant === 'icon' ? 44 : 38,
    xl: variant === 'icon' ? 60 : 52,
  };

  const h = heightMap[size];

  // Color selection
  const iconColor =
    tone === 'navy'
      ? '#0A1838'
      : tone === 'light'
      ? '#FFFFFF'
      : 'currentColor';

  const textColor =
    tone === 'navy'
      ? '#0A1838'
      : tone === 'light'
      ? '#FFFFFF'
      : 'currentColor';

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      aria-label="NIGHTON"
    >
      {/* Crescent Moon Icon */}
      <svg
        height={h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ color: iconColor }}
      >
        <path
          d="M 54 13 C 27 13 11 29 11 50 C 11 71 27 87 54 87 C 61 87 67 85.5 73 83 C 49 78.5 35 62 35 50 C 35 38 49 21.5 73 17 C 67 14.5 61 13 54 13 Z"
          fill="currentColor"
        />
      </svg>

      {/* NIGHTON Wordmark */}
      {variant === 'full' && (
        <span
          className="font-display font-black tracking-wider transition-colors duration-200"
          style={{
            fontSize: size === 'sm' ? '1.1rem' : size === 'md' ? '1.35rem' : size === 'lg' ? '1.85rem' : '2.5rem',
            lineHeight: 1,
            color: textColor,
            letterSpacing: '0.06em',
          }}
        >
          NIGHTON
        </span>
      )}
    </div>
  );
};
