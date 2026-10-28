import React from 'react';

export const EditorialBanner: React.FC = () => {
  return (
    <section className="relative w-full bg-[#000000] border-b border-[#222222] min-h-[260px] sm:min-h-[300px] lg:h-[300px] flex items-center justify-between overflow-hidden select-none">
      {/* Center Model Only - Clean Photography with zero text in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative h-full w-[360px] sm:w-[460px] overflow-hidden">
          <img
            src="/editorial-model-pure.jpg"
            alt="THE STANE PROJECT Model"
            className="w-full h-full object-cover object-center filter contrast-115 brightness-95"
          />
          {/* Smooth left and right edge gradients into pure black */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#000000] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#000000] to-transparent" />
        </div>
      </div>

      {/* Foreground Content Container - sits on clean black background */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        {/* Left Side: PEOPLE PLACES IDEAS A STRONGER YOU. */}
        <div className="flex flex-col space-y-1 font-mono text-xs sm:text-sm tracking-[0.22em] uppercase text-[#CCCCCC]">
          <span>PEOPLE</span>
          <span>PLACES</span>
          <span>IDEAS</span>
          <span className="text-white font-bold">A STRONGER YOU.</span>
          <div className="w-10 h-px bg-white/60 mt-2" />
        </div>

        {/* Right Side: CARVED FOR THE UNCOMMON. */}
        <div className="flex flex-col items-end text-right space-y-0.5 font-display font-black text-sm sm:text-base lg:text-lg tracking-[0.2em] uppercase text-white">
          <span>CARVED</span>
          <span>FOR THE</span>
          <span>UNCOMMON.</span>
          <div className="w-12 h-px bg-white/60 mt-2" />
        </div>
      </div>
    </section>
  );
};
