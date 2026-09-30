import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

/**
 * Authentic Red Berita Harian (BH) Badge as seen in the template screenshots.
 */
export const BHBadge: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 rounded-[3px]',
    md: 'text-sm px-2.5 py-1 rounded-[4px]',
    lg: 'text-lg px-3 py-1.5 rounded-[5px]',
  };

  return (
    <div
      className={`inline-flex items-center justify-center bg-[#BA081B] text-white font-extrabold tracking-wider shadow-sm select-none font-['Plus_Jakarta_Sans',sans-serif] shrink-0 ${sizeClasses[size]} ${className}`}
      title="Berita Harian"
    >
      BH
    </div>
  );
};

/**
 * Official Vector Pen Nib Icon matching Image 9 / logo.png
 */
export const NSTPPenNibIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size * 1.12}
      viewBox="0 0 110 124"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      {/* Outer rounded border */}
      <rect
        x="3"
        y="3"
        width="104"
        height="118"
        rx="10"
        fill="#FFFFFF"
        stroke="#F5921E"
        strokeWidth="6"
      />
      {/* Orange inner background */}
      <rect x="9" y="9" width="92" height="106" rx="6" fill="#F5921E" />

      {/* White Fountain Pen Silhouette pointing downwards */}
      <path
        d="M 55 106 L 49 106 C 46 80 32 64 30 32 L 30 14 L 55 14 Z"
        fill="#FFFFFF"
      />
      <path
        d="M 55 106 L 61 106 C 64 80 78 64 80 32 L 80 14 L 55 14 Z"
        fill="#FFFFFF"
      />

      {/* Center slit & Breather hole in orange */}
      <rect x="53.5" y="60" width="3" height="46" fill="#F5921E" />
      <circle cx="55" cy="56" r="4.5" fill="#F5921E" />
    </svg>
  );
};

/**
 * Official NSTP (a media prima company) Logo.
 * Built with crisp typography so "company" is 100% visible, sharp, and never clipped.
 */
export const NSTPBrandLogo: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ className = '', size = 'md' }) => {
  // Configurable scale sizes
  const config = {
    sm: {
      iconSize: 28,
      wordmark: 'text-lg',
      tagline: 'text-[9.5px]',
      mediaBox: 'text-[9px] px-1 py-0.2',
      lineWidth: 'h-[2px]',
      gap: 'gap-2',
    },
    md: {
      iconSize: 36,
      wordmark: 'text-2xl',
      tagline: 'text-[11px]',
      mediaBox: 'text-[10px] px-1.5 py-0.5',
      lineWidth: 'h-[2.5px]',
      gap: 'gap-2.5',
    },
    lg: {
      iconSize: 44,
      wordmark: 'text-3xl',
      tagline: 'text-[13px]',
      mediaBox: 'text-[12px] px-2 py-0.5',
      lineWidth: 'h-[3px]',
      gap: 'gap-3',
    },
    xl: {
      iconSize: 56,
      wordmark: 'text-4xl',
      tagline: 'text-[15px]',
      mediaBox: 'text-[14px] px-2.5 py-0.5',
      lineWidth: 'h-[3.5px]',
      gap: 'gap-3.5',
    },
  };

  const current = config[size];

  return (
    <div
      className={`inline-flex items-center ${current.gap} select-none font-['Plus_Jakarta_Sans',sans-serif] shrink-0 ${className}`}
      role="img"
      aria-label="NSTP a media prima company"
    >
      {/* Orange Pen Nib Icon Emblem */}
      <NSTPPenNibIcon size={current.iconSize} />

      {/* Wordmark + Divider Line + Tagline */}
      <div className="flex flex-col justify-center">
        {/* NSTP bold text */}
        <div
          className={`font-black ${current.wordmark} tracking-[-0.04em] text-black leading-none`}
        >
          NSTP
        </div>

        {/* Orange horizontal divider line */}
        <div className={`${current.lineWidth} bg-[#F5921E] w-full my-0.5`} />

        {/* Tagline: a [media] prima company */}
        <div
          className={`flex items-center gap-1.5 ${current.tagline} font-medium text-black leading-none whitespace-nowrap`}
        >
          <span className="text-black font-semibold">a</span>
          {/* Red square with white "media" */}
          <span
            className={`bg-[#E60000] text-white font-extrabold ${current.mediaBox} rounded-[1.5px] leading-tight`}
          >
            media
          </span>
          <span className="font-extrabold text-black">prima</span>
          {/* "company" clearly bold and visible */}
          <span className="font-bold text-black tracking-normal">company</span>
        </div>
      </div>
    </div>
  );
};

export const NSTPLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  return <NSTPBrandLogo size={size} className={className} />;
};

/**
 * Complete Header Brand Combination:
 * NSTP a media prima company logo on the far left, followed by Stringer Claim Portal text.
 * No red BH badge as requested.
 */
export const HeaderBrand: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* NSTP a media prima company Logo on the far left */}
      <div className="flex items-center">
        <NSTPBrandLogo size="md" />
      </div>

      {/* Subtle vertical divider */}
      <div className="h-7 w-px bg-slate-200" />

      {/* Stringer Claim Portal Title */}
      <div className="flex flex-col">
        <span className="font-extrabold text-[15px] tracking-tight text-[#001026] leading-none">
          Stringer Claim
        </span>
        <span className="text-[13px] font-semibold text-[#001026] tracking-tight leading-tight">
          Portal
        </span>
      </div>
    </div>
  );
};

/**
 * Official Media Prima Corporate Logo for Claims Forms (as seen on HR Benefit & Mileage Forms)
 * Red box with "media" in white, followed by "prima" in black.
 */
export const MediaPrimaOfficialFormLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`inline-flex items-center gap-1.5 select-none font-['Plus_Jakarta_Sans',sans-serif] ${className}`}>
      <div
        className={`bg-[#DF1A22] text-white font-black rounded-[2px] flex items-center justify-center tracking-tight ${
          isSm
            ? 'px-1.5 py-0.5 text-xs'
            : isLg
            ? 'px-3 py-1 text-base'
            : 'px-2 py-0.5 text-sm'
        }`}
      >
        media
      </div>
      <span
        className={`font-black text-black tracking-tight ${
          isSm ? 'text-xs' : isLg ? 'text-base' : 'text-sm'
        }`}
      >
        prima
      </span>
    </div>
  );
};

