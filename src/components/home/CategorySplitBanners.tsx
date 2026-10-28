import React from 'react';
import { ViewState } from '../../types';
import { ArrowRight } from 'lucide-react';

interface CategorySplitBannersProps {
  onNavigate: (view: ViewState) => void;
}

export const CategorySplitBanners: React.FC<CategorySplitBannersProps> = ({ onNavigate }) => {
  return (
    <section className="bg-[#000000] border-b border-[#222222] select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#222222]">
        {/* Left Column: T-SHIRTS */}
        <div
          onClick={() => onNavigate({ type: 'shop', category: 't-shirts' })}
          className="relative min-h-[220px] sm:min-h-[260px] p-6 sm:p-10 flex items-center justify-between overflow-hidden group cursor-pointer bg-[#050505]"
        >
          {/* Text Content */}
          <div className="relative z-10 max-w-xs space-y-3">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-[0.16em] uppercase text-white leading-none">
                T-SHIRTS
              </h2>
              <div className="w-8 h-[2px] bg-white mt-2 group-hover:w-14 transition-all duration-300" />
            </div>

            <p className="font-mono text-xs sm:text-[13px] tracking-wider text-[#A0A0A0] uppercase leading-relaxed">
              EVERYDAY ESSENTIALS. <br />
              ANYTHING BUT ORDINARY.
            </p>

            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center space-x-2 px-4 py-2 border border-[#444444] group-hover:border-white text-white font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>EXPLORE T-SHIRTS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Model Image on Right from Mockup */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] h-full overflow-hidden">
            <img
              src="/category-tee-new.jpg"
              alt="THE STANE PROJECT T-Shirts"
              className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
          </div>
        </div>

        {/* Right Column: HOODIES */}
        <div
          onClick={() => onNavigate({ type: 'shop', category: 'hoodies' })}
          className="relative min-h-[220px] sm:min-h-[260px] p-6 sm:p-10 flex items-center justify-between overflow-hidden group cursor-pointer bg-[#050505]"
        >
          {/* Text Content */}
          <div className="relative z-10 max-w-xs space-y-3">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-[0.16em] uppercase text-white leading-none">
                HOODIES
              </h2>
              <div className="w-8 h-[2px] bg-white mt-2 group-hover:w-14 transition-all duration-300" />
            </div>

            <p className="font-mono text-xs sm:text-[13px] tracking-wider text-[#A0A0A0] uppercase leading-relaxed">
              MORE THAN COMFORT. <br />
              A DIFFERENT MINDSET.
            </p>

            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center space-x-2 px-4 py-2 border border-[#444444] group-hover:border-white text-white font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>EXPLORE HOODIES</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Model Image on Right from Mockup */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] h-full overflow-hidden">
            <img
              src="/category-hoodie-new.jpg"
              alt="THE STANE PROJECT Hoodies"
              className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
