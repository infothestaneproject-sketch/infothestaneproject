import React, { useState, useEffect } from 'react';

interface LogoIntroAnimationProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const LogoIntroAnimation: React.FC<LogoIntroAnimationProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const [stage, setStage] = useState<'entering' | 'holding' | 'exiting' | 'hidden'>('entering');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if user already saw the intro in this session (unless forced)
    const hasSeenIntro = sessionStorage.getItem('stane_intro_played');
    if (hasSeenIntro && !forceShow) {
      setStage('hidden');
      if (onComplete) onComplete();
      return;
    }

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    // Timeline:
    // 0ms - 800ms: entering & expanding
    // 800ms - 1300ms: holding & gleaming
    // 1300ms - 1800ms: smooth dissolve fade-out
    // 1800ms: unmount
    const holdTimer = setTimeout(() => {
      setStage('holding');
    }, 700);

    const exitTimer = setTimeout(() => {
      setStage('exiting');
    }, 1450);

    const completeTimer = setTimeout(() => {
      setStage('hidden');
      sessionStorage.setItem('stane_intro_played', 'true');
      if (onComplete) onComplete();
    }, 1950);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        dismissIntro();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [forceShow]);

  const dismissIntro = () => {
    setStage('exiting');
    setTimeout(() => {
      setStage('hidden');
      sessionStorage.setItem('stane_intro_played', 'true');
      if (onComplete) onComplete();
    }, 400);
  };

  if (stage === 'hidden') return null;

  return (
    <div
      onClick={dismissIntro}
      role="banner"
      aria-label="The Stane Project Opening Animation"
      className={`fixed inset-0 z-[999] bg-[#000000] flex flex-col items-center justify-center cursor-pointer transition-all duration-700 ease-out select-none overflow-hidden ${
        stage === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle background ambient radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,40,40,0.4)_0%,rgba(0,0,0,0.95)_70%,#000000_100%)] pointer-events-none" />

      {/* Grid crosshair accents */}
      <div className="absolute top-8 left-8 text-[9px] font-mono tracking-widest text-[#444444] uppercase pointer-events-none hidden sm:block">
        ATELIER INITIALIZATION // STANE-01
      </div>
      <div className="absolute top-8 right-8 text-[9px] font-mono tracking-widest text-[#444444] uppercase pointer-events-none hidden sm:block">
        PAN-INDIA STREETWEAR
      </div>

      {/* Main Animated Logo Showcase */}
      <div className="relative z-10 flex flex-col items-center max-w-sm sm:max-w-md px-6 text-center">
        {/* Logo Container with Glow & Light Sweep Effect */}
        <div className="relative overflow-hidden group">
          <img
            src="/brand-logo.jpg"
            alt="THE STANE PROJECT - CARVED FOR THE UNCOMMON."
            className="w-56 sm:w-72 md:w-80 h-auto object-contain brightness-110 drop-shadow-[0_0_35px_rgba(255,255,255,0.15)] animate-logo-pulse"
          />

          {/* Diagonal high-speed gleaming beam */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] animate-logo-gleam" />
          </div>
        </div>

        {/* Tagline Reveal with tracked typography */}
        <div className="mt-5 flex flex-col items-center space-y-2">
          <span className="font-brand font-bold text-base sm:text-lg tracking-[0.24em] text-white uppercase animate-tracking-expand">
            THE STANE PROJECT
          </span>
          <div className="h-px w-16 bg-white/30 my-1" />
          <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.35em] text-[#CCCCCC] uppercase">
            CARVED FOR THE UNCOMMON.
          </p>
          <p className="text-[9px] font-mono tracking-widest text-[#666666] uppercase">
            HEAVYWEIGHT ARCHITECTURAL STREETWEAR
          </p>
        </div>

        {/* Minimalist Progress Meter */}
        <div className="w-48 sm:w-56 h-[1.5px] bg-[#222222] mt-8 relative overflow-hidden rounded-full">
          <div
            className="h-full bg-white transition-all duration-75 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* User-friendly skip helper */}
      <div className="absolute bottom-8 flex flex-col items-center space-y-1 text-center z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismissIntro();
          }}
          className="text-[10px] font-mono tracking-[0.25em] text-[#777777] hover:text-white uppercase transition-colors px-3 py-1 border border-[#222222] hover:border-white rounded-none cursor-pointer"
        >
          ENTER STORE [ESC]
        </button>
        <span className="text-[8px] font-mono tracking-widest text-[#444444] uppercase">
          TAP ANYWHERE TO SKIP
        </span>
      </div>
    </div>
  );
};
