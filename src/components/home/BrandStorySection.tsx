import React from 'react';
import { ViewState } from '../../types';
import { ArrowRight } from 'lucide-react';

interface BrandStorySectionProps {
  onNavigate: (view: ViewState) => void;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ onNavigate }) => {
  return (
    <section className="bg-[#000000] border-b border-[#222222] overflow-hidden select-none">
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        {/* Left Column: Vertical Mountain Peak Image */}
        <div className="md:col-span-3 relative min-h-[300px] md:min-h-[360px] overflow-hidden border-b md:border-b-0 md:border-r border-[#222222]">
          <img
            src="/story-mountain-peak.jpg"
            alt="THE STANE PROJECT - Mountain Peak"
            className="w-full h-full object-cover object-center filter grayscale contrast-125"
          />
        </div>

        {/* Middle Column: Narrative Text & Clean Solid OUR STORY Button */}
        <div className="md:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-5 bg-[#050505]">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#777777]">
            OUR STORY
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-display font-black uppercase tracking-[0.06em] text-white leading-[1.05]">
            MORE THAN <br />
            CLOTHING.
          </h2>

          <p className="font-mono text-xs sm:text-sm text-[#AAAAAA] leading-relaxed max-w-md">
            THE STANE PROJECT is a streetwear label from Trichy, built on individuality, resilience and timeless design. We create pieces for people who choose a different path.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'about' })}
              className="inline-flex items-center space-x-2.5 px-6 py-2.5 bg-transparent border border-[#555555] hover:border-white text-white font-mono text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer group shadow-none"
            >
              <span className="text-white group-hover:text-white font-semibold">OUR STORY</span>
              <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Close-up Textile Woven Label */}
        <div className="md:col-span-4 relative min-h-[300px] md:min-h-[360px] overflow-hidden border-t md:border-t-0 md:border-l border-[#222222]">
          <img
            src="/story-woven-label.jpg"
            alt="THE STANE PROJECT - Woven Label"
            className="w-full h-full object-cover object-center filter contrast-110"
          />
        </div>
      </div>
    </section>
  );
};
