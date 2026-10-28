import React, { useState } from 'react';
import { ViewState } from '../../types';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (view: ViewState) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: "01",
      subtitle: "THE STANE PROJECT",
      headlineLine1: "BUILT DIFFERENT.",
      headlineLine2: "WORN WITH PURPOSE.",
      tagline: "CARVED FOR THE UNCOMMON.",
      image: "/hero-models-notext.jpg",
    },
    {
      id: "02",
      subtitle: "THE STANE PROJECT",
      headlineLine1: "ARCHITECTURAL FIT.",
      headlineLine2: "TIMELESS ARMOR.",
      tagline: "CARVED FOR THE UNCOMMON.",
      image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "03",
      subtitle: "THE STANE PROJECT",
      headlineLine1: "DENSE COMBED YARN.",
      headlineLine2: "ZERO DISTORTION.",
      tagline: "CARVED FOR THE UNCOMMON.",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1600&auto=format&fit=crop",
    }
  ];

  const currentSlide = slides[activeSlide];

  return (
    <section className="relative w-full bg-[#000000] border-b border-[#222222] overflow-hidden select-none">
      <div className="relative min-h-[500px] sm:min-h-[540px] lg:h-[530px] flex items-center">
        {/* Right Half: Clean Streetwear Photography - 100% free of any text in image */}
        <div className="absolute top-0 right-0 w-full lg:w-[50%] xl:w-[48%] h-full z-0 overflow-hidden pointer-events-none">
          <img
            src={currentSlide.image}
            alt="THE STANE PROJECT - Streetwear in Stone"
            className="w-full h-full object-cover object-center filter contrast-110 brightness-95 transition-all duration-700"
          />
          {/* Smooth gradient blend into pure solid black on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/40 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-black/60 to-transparent lg:hidden" />
        </div>

        {/* Left Half: Typography & Direct Action Buttons on Pure Solid Black (No ghost text or reflections) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full py-12 sm:py-16">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Pre-title */}
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.3em] uppercase text-[#888888] block mb-3">
              {currentSlide.subtitle}
            </span>

            {/* Giant Monolithic Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-[68px] tracking-[0.03em] uppercase text-white leading-[0.98]">
              {currentSlide.headlineLine1} <br />
              <span className="text-white">
                {currentSlide.headlineLine2}
              </span>
            </h1>

            {/* Horizontal Line Accent */}
            <div className="w-16 h-[2px] bg-[#555555] my-4 sm:my-5" />

            {/* Tagline */}
            <p className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-[#DDDDDD] font-bold mb-7 sm:mb-9">
              {currentSlide.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-8">
              {/* Solid White Button: SHOP T-SHIRTS */}
              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', category: 't-shirts' })}
                className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white hover:bg-[#E5E5E5] text-black font-display font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center space-x-2.5 cursor-pointer shadow-lg group"
              >
                <span>SHOP T-SHIRTS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Outlined Black Button: SHOP HOODIES */}
              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', category: 'hoodies' })}
                className="px-6 sm:px-7 py-3 sm:py-3.5 bg-black/60 hover:bg-white/10 text-white border border-[#444444] hover:border-white font-display font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center space-x-2.5 cursor-pointer group"
              >
                <span>SHOP HOODIES</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Slide Indicators: 01 / 03 — —— — — */}
            <div className="flex items-center space-x-4 font-mono text-xs tracking-widest text-[#777777]">
              <span className="text-white font-bold">
                0{activeSlide + 1} <span className="text-[#555555]">/</span> 03
              </span>
              <div className="flex items-center space-x-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlide(i)}
                    className={`h-[2px] transition-all cursor-pointer ${
                      activeSlide === i ? 'w-8 bg-white' : 'w-4 bg-[#444444] hover:bg-[#777777]'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
