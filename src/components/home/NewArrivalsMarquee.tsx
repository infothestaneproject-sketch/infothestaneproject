import React from 'react';
import { Product, ViewState } from '../../types';
import { ArrowRight, Eye } from 'lucide-react';

interface NewArrivalsMarqueeProps {
  products: Product[];
  onNavigate: (view: ViewState) => void;
}

export const NewArrivalsMarquee: React.FC<NewArrivalsMarqueeProps> = ({
  products,
  onNavigate
}) => {
  // Filter new drops or all active items for the live ticker
  const newArrivals = products.filter(p => p.badge?.includes('NEW') || p.featured).concat(products).slice(0, 8);

  // Duplicate items for infinite seamless scroll loop
  const scrollItems = [...newArrivals, ...newArrivals];

  return (
    <section className="bg-[#000000] border-y border-[#222222] py-8 sm:py-10 overflow-hidden relative">
      {/* Top Banner Tag - Monochrome */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-white flex items-center space-x-2">
            <span>NEW ARRIVALS // LIVE DROPS</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate({ type: 'shop', category: 'all' })}
          className="text-[11px] font-mono uppercase text-[#888888] hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <span>View All Releases</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Marquee Container with pause on hover */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle Edge Vignettes */}
        <div className="absolute left-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-r from-[#000000] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-l from-[#000000] to-transparent z-10 pointer-events-none" />

        {/* Live Scrolling Track */}
        <div className="animate-live-scroll flex items-center gap-4 sm:gap-6 py-2">
          {scrollItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onNavigate({ type: 'product', idOrHandle: item.handle })}
              className="group cursor-pointer shrink-0 w-64 sm:w-72 bg-[#0A0A0A] border border-[#222222] hover:border-white transition-all duration-300 p-3 flex flex-col justify-between"
            >
              {/* Product Visual */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141414] mb-3">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 bg-white text-black text-[9px] font-mono font-bold uppercase tracking-wider">
                    NEW DROP
                  </span>
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <span className="px-1.5 py-0.5 bg-black/80 backdrop-blur-sm border border-[#333333] text-[#CCCCCC] text-[9px] font-mono uppercase">
                    {item.specs.fit.split(' ')[0]}
                  </span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-white text-black text-[10px] font-display font-bold uppercase tracking-widest flex items-center space-x-1 shadow-xl">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>View Piece</span>
                  </span>
                </div>
              </div>

              {/* Garment Details */}
              <div className="space-y-1">
                <div className="text-[9px] font-mono text-[#888888] uppercase tracking-wider">
                  {item.category === 't-shirts' ? 'Heavyweight Tee' : 'Heavy Loopback Hoodie'}
                </div>
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-white truncate group-hover:text-white">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between pt-1.5 border-t border-[#1F1F1F]">
                  <span className="text-xs sm:text-sm font-display font-black text-white">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-mono text-white underline underline-offset-2">
                    In Stock →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
