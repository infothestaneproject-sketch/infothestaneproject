import React from 'react';
import { ViewState } from '../../types';
import { Instagram, MessageSquare, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/918870123806', '_blank');
  };

  return (
    <footer className="bg-[#000000] border-t border-[#222222] text-[#888888] select-none">
      {/* Main Footer Links matching mockup */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <div>
              <span className="font-brand font-bold text-lg sm:text-xl tracking-[0.2em] text-white block uppercase">
                THE STANE
              </span>
              <div className="flex items-center justify-between max-w-[145px] mt-0.5">
                <span className="font-brand font-medium text-[9px] tracking-[0.52em] text-[#888888] block uppercase">
                  PROJECT
                </span>
                <span className="text-[7px] text-[#444444]">✦</span>
              </div>
            </div>

            <p className="font-mono text-xs tracking-widest text-[#777777] uppercase">
              CARVED FOR THE UNCOMMON.
            </p>

            {/* Social Icons matching mockup */}
            <div className="flex items-center space-x-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded border border-[#333333] hover:border-white flex items-center justify-center text-[#AAAAAA] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={openWhatsApp}
                className="w-8 h-8 rounded border border-[#333333] hover:border-white flex items-center justify-center text-[#AAAAAA] hover:text-white transition-colors cursor-pointer"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 1: SHOP */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-black text-xs uppercase tracking-[0.25em] text-white">
              SHOP
            </h4>
            <ul className="space-y-2 font-mono text-xs text-[#888888]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'shop', category: 't-shirts' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  T-Shirts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'shop', category: 'hoodies' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Hoodies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'shop', category: 'all' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'shop', category: 'all' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Best Sellers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: ABOUT */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-black text-xs uppercase tracking-[0.25em] text-white">
              ABOUT
            </h4>
            <ul className="space-y-2 font-mono text-xs text-[#888888]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'about' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'about', focusContact: true })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'faqs' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'size-guide' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Size Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: POLICY */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-black text-xs uppercase tracking-[0.25em] text-white">
              POLICY
            </h4>
            <ul className="space-y-2 font-mono text-xs text-[#888888]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'policies', initialTab: 'shipping' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'policies', initialTab: 'returns' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'policies', initialTab: 'privacy' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'policies', initialTab: 'terms' })}
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-black text-xs uppercase tracking-[0.25em] text-white">
              CONTACT
            </h4>
            <ul className="space-y-2 font-mono text-xs text-[#888888]">
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-[#AAAAAA]">Trichy, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-white flex-shrink-0" />
                <a href="tel:+918870123806" className="text-[#AAAAAA] hover:text-white transition-colors">
                  +91 8870123806
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-white flex-shrink-0" />
                <a href="mailto:thestaneproject@gmail.com" className="text-[#AAAAAA] hover:text-white transition-colors truncate">
                  thestaneproject@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar matching mockup with scroll-to-top button */}
      <div className="border-t border-[#1A1A1A] py-6 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-mono text-[11px] text-[#666666]">
          <p>© 2026 THE STANE PROJECT. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="w-8 h-8 rounded border border-[#333333] hover:border-white hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
