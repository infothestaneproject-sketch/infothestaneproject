import React from 'react';

interface LogoProps {
  variant?: 'full' | 'header' | 'mark-only' | 'stacked';
  className?: string;
  customLogoUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  className = '',
  customLogoUrl
}) => {
  const logoSrc = customLogoUrl || '/brand-logo.jpg';

  // Specific header typography matching the mockup
  if (variant === 'header' || variant === 'full') {
    return (
      <div className={`flex flex-col text-left select-none group cursor-pointer ${className}`}>
        {/* Primary Monolithic Wordmark: THE STANE */}
        <span className="font-display font-black text-xl sm:text-[23px] tracking-[0.22em] uppercase text-white leading-none group-hover:text-white transition-colors">
          THE STANE
        </span>
        {/* Subtitle / Foundation: PROJECT with luxury wide tracking */}
        <span className="text-[9px] sm:text-[10.5px] font-mono font-semibold tracking-[0.48em] uppercase text-[#9E9E9E] group-hover:text-white transition-colors mt-1">
          PROJECT
        </span>
      </div>
    );
  }

  if (variant === 'mark-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src={logoSrc}
          alt="The Stane Project"
          className="h-9 w-auto object-contain brightness-105 transition-all duration-300 hover:scale-105 hover:brightness-115"
        />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center group cursor-pointer ${className}`}>
        <img
          src={logoSrc}
          alt="The Stane Project - Carved For The Uncommon"
          className="h-16 md:h-20 w-auto object-contain brightness-105 transition-all duration-300 group-hover:scale-[1.02] group-hover:brightness-115"
        />
        <div className="mt-2 flex flex-col items-center">
          <span className="font-display font-black text-lg tracking-[0.22em] uppercase text-white">
            THE STANE
          </span>
          <span className="text-[9px] font-mono tracking-[0.45em] uppercase text-[#888888]">
            PROJECT
          </span>
        </div>
      </div>
    );
  }

  return null;
};
