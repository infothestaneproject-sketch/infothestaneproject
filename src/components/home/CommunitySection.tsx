import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';

export const CommunitySection: React.FC = () => {
  const instaImages = [
    { src: '/insta-1.jpg', alt: 'THE STANE PROJECT Streetwear' },
    { src: '/insta-2.jpg', alt: 'THE STANE PROJECT Hoodie' },
    { src: '/insta-3.jpg', alt: 'THE STANE PROJECT Mountain' },
    { src: '/insta-4.jpg', alt: 'THE STANE PROJECT Tag' },
    { src: '/insta-5.jpg', alt: 'THE STANE PROJECT Concrete' },
    { src: '/insta-6.jpg', alt: 'THE STANE PROJECT Packaging' },
  ];

  return (
    <section className="bg-[#000000] py-12 sm:py-16 border-b border-[#222222] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header matching mockup */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <h2 className="font-display font-black text-lg sm:text-xl tracking-[0.2em] uppercase text-white">
              @THESTANEPROJECT
            </h2>
            <div className="w-12 sm:w-20 h-px bg-[#444444]" />
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors cursor-pointer group"
          >
            <span>FOLLOW US</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 6 Square Photos in Row matching mockup */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {instaImages.map((item, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-[#0A0A0A] border border-[#1A1A1A] hover:border-white transition-all overflow-hidden cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
              {/* Subtle Heart icon in top-right */}
              <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <Heart className="w-3.5 h-3.5 text-white/70" />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
