import React, { useState, useRef, useEffect } from 'react';
import { Product, ViewState } from '../../types';
import { ArrowRight, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewArrivalsSectionProps {
  products: Product[];
  onNavigate: (view: ViewState) => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products, onNavigate }) => {
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fallback items if products haven't loaded yet
  const displayItems = products.length > 0 ? products : [
    {
      id: "tsp-tee-essence",
      name: "Essence Tee",
      handle: "essence-tee",
      price: 1499,
      images: ["/prod-essence-tee.jpg"],
      colors: [
        { name: "Bone", hex: "#E8E4DA", code: "bone" },
        { name: "Black", hex: "#0E0E0E", code: "black" }
      ]
    },
    {
      id: "tsp-tee-summit",
      name: "Summit Tee",
      handle: "summit-tee",
      price: 1499,
      images: ["/prod-summit-tee.jpg"],
      colors: [
        { name: "Bone", hex: "#E8E4DA", code: "bone" },
        { name: "Black", hex: "#0E0E0E", code: "black" },
        { name: "Slate", hex: "#3B3E42", code: "slate" }
      ]
    },
    {
      id: "tsp-hoodie-core",
      name: "Core Hoodie",
      handle: "core-hoodie",
      price: 2199,
      images: ["/prod-core-hoodie.jpg"],
      colors: [
        { name: "Bone", hex: "#E8E4DA", code: "bone" },
        { name: "Black", hex: "#0E0E0E", code: "black" }
      ]
    },
    {
      id: "tsp-hoodie-shadow",
      name: "Shadow Hoodie",
      handle: "shadow-hoodie",
      price: 2199,
      images: ["/prod-shadow-hoodie.jpg"],
      colors: [
        { name: "Bone", hex: "#E8E4DA", code: "bone" },
        { name: "Black", hex: "#0E0E0E", code: "black" },
        { name: "Slate", hex: "#3B3E42", code: "slate" }
      ]
    }
  ] as Product[];

  // Triple items for seamless continuous infinite horizontal scroll
  const scrollItems = [...displayItems, ...displayItems, ...displayItems];

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Continuous auto-scroll effect
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let animFrame: number;
    const speed = 0.8; // px per tick

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        // When we scrolled past 1 full set of items, wrap back seamlessly
        const maxScroll = el.scrollWidth / 3;
        if (el.scrollLeft >= maxScroll) {
          el.scrollLeft -= maxScroll;
        }
      }
      animFrame = requestAnimationFrame(step);
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [isPaused]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distance = 300;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth'
    });
  };

  return (
    <section className="bg-[#000000] border-b border-[#222222] py-12 sm:py-16 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header Matching Mockup */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <h2 className="font-display font-black text-xl sm:text-2xl tracking-[0.18em] uppercase text-white">
              NEW ARRIVALS
            </h2>
            <div className="w-12 sm:w-20 h-px bg-[#444444]" />
          </div>

          <div className="flex items-center space-x-4">
            {/* Left / Right arrows for user control */}
            <div className="hidden sm:flex items-center space-x-1.5 text-[#888888]">
              <button
                type="button"
                onClick={() => handleManualScroll('left')}
                className="w-7 h-7 flex items-center justify-center border border-[#333333] hover:border-white hover:text-white transition-colors cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleManualScroll('right')}
                className="w-7 h-7 flex items-center justify-center border border-[#333333] hover:border-white hover:text-white transition-colors cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', category: 'all' })}
              className="flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors cursor-pointer group"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Live Scrolling Shelf ("make the new arrival keep scrolling") */}
      <div
        className="w-full relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 sm:space-x-6 overflow-x-scroll no-scrollbar py-2 px-4 sm:px-6 lg:px-12"
          style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
        >
          {scrollItems.map((p, index) => {
            const isLiked = wishlist[p.id];
            const mainImg = p.images && p.images.length > 0 ? p.images[0] : '/prod-essence-tee.jpg';
            const colors = p.colors && p.colors.length > 0 ? p.colors : [
              { name: 'Bone', hex: '#E8E4DA', code: 'bone' },
              { name: 'Black', hex: '#0E0E0E', code: 'black' }
            ];

            return (
              <div
                key={`${p.id}-${index}`}
                onClick={() => onNavigate({ type: 'product', idOrHandle: p.handle || p.id })}
                className="w-[220px] sm:w-[260px] md:w-[280px] flex-shrink-0 flex flex-col group cursor-pointer bg-[#0A0A0A] border border-[#1A1A1A] hover:border-white transition-all duration-300"
              >
                {/* Image Container with Wishlist Heart */}
                <div className="relative aspect-[4/3] w-full bg-[#111111] overflow-hidden flex items-center justify-center">
                  <img
                    src={mainImg}
                    alt={p.name}
                    className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Wishlist Heart Icon (Top Right, matching mockup) */}
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(e, p.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer z-10"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        isLiked ? 'fill-white text-white' : 'text-[#CCCCCC] hover:text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Product Meta below image */}
                <div className="p-3.5 sm:p-4 flex flex-col space-y-2 bg-[#0A0A0A]">
                  <h3 className="font-display font-bold text-xs sm:text-[13px] uppercase tracking-wide text-white group-hover:text-white truncate">
                    {p.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-[#DDDDDD]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>

                    {/* Color Swatch Dots matching mockup */}
                    <div className="flex items-center space-x-1.5">
                      {colors.map((c, ci) => (
                        <span
                          key={ci}
                          title={c.name}
                          className="w-2.5 h-2.5 rounded-full border border-[#444444]"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
