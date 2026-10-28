import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { useCart } from '../../context/CartContext';
import { ViewState } from '../../types';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { itemCount, setIsCartOpen, settings } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: { type: 'home' } as ViewState },
    { label: 'Shop', view: { type: 'shop', category: 'all' } as ViewState },
    { label: 'T-Shirts', view: { type: 'shop', category: 't-shirts' } as ViewState },
    { label: 'Hoodies', view: { type: 'shop', category: 'hoodies' } as ViewState },
    { label: 'About Us', view: { type: 'about' } as ViewState },
    { label: 'Contact', view: { type: 'about', focusContact: true } as ViewState },
  ];

  const isCurrent = (view: ViewState) => {
    if (view.type === 'home' && currentView.type === 'home') return true;
    if (view.type === 'shop' && currentView.type === 'shop') {
      return view.category === currentView.category;
    }
    if (view.type === 'about' && currentView.type === 'about') {
      return Boolean(view.focusContact) === Boolean(currentView.focusContact);
    }
    return currentView.type === view.type;
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. Announcement Bar - Matches Screenshot Exactly */}
      <div className="bg-[#000000] border-b border-[#222222] text-[10px] sm:text-xs py-2 px-4 text-[#CCCCCC] font-mono tracking-wider flex items-center justify-between select-none">
        <button
          type="button"
          onClick={() => {}}
          className="text-[#777777] hover:text-white transition-colors cursor-pointer p-0.5"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 text-center font-medium text-white truncate px-2 text-[10px] sm:text-xs tracking-widest uppercase">
          {settings?.announcementText || '✦ FREE SHIPPING ON ORDERS ABOVE ₹999 | LIMITED TIME LAUNCH OFFER ✦'}
        </div>

        <button
          type="button"
          onClick={() => {}}
          className="text-[#777777] hover:text-white transition-colors cursor-pointer p-0.5"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Main Navigation Bar - Pure Black and White */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#000000]/95 backdrop-blur-md border-b border-[#222222] py-3 shadow-2xl'
            : 'bg-[#000000] border-b border-[#1A1A1A] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-white hover:text-[#888888] transition-colors focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Real Attached Brand Logo */}
          <div onClick={() => onNavigate({ type: 'home' })} className="cursor-pointer">
            <Logo variant="header" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, idx) => {
              const active = isCurrent(link.view);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onNavigate(link.view)}
                  className={`text-xs uppercase tracking-[0.22em] font-bold transition-all duration-200 relative py-1 cursor-pointer ${
                    active
                      ? 'text-white'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Admin, Cart */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] rounded-full transition-colors cursor-pointer"
              aria-label="Search collection"
              title="Search products (press /)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Owner Admin / User Profile link */}
            <button
              type="button"
              onClick={() => onNavigate({ type: 'admin' })}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                currentView.type === 'admin'
                  ? 'text-white bg-white/10'
                  : 'text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A]'
              }`}
              title="Store Owner Admin Panel / Account"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#141414] hover:bg-[#222222] text-white border border-[#333333] hover:border-white rounded-full transition-all group flex items-center justify-center cursor-pointer"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black font-display font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-75">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Slide-Over Drawer - Pure Black and White */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#000000] border-r border-[#222222] p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#222222]">
                <Logo variant="full" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#888888] hover:text-white cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-1">
                {navLinks.map((link, idx) => {
                  const active = isCurrent(link.view);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onNavigate(link.view);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between py-3.5 px-3 text-left font-display text-sm tracking-[0.2em] uppercase transition-colors rounded cursor-pointer ${
                        active
                          ? 'text-white bg-[#141414] font-bold border-l-2 border-white'
                          : 'text-[#888888] hover:text-white hover:bg-[#141414]/50'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-[#222222] space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate({ type: 'size-guide' });
                    setMobileMenuOpen(false);
                  }}
                  className="block text-xs uppercase tracking-widest text-[#888888] hover:text-white px-3 py-1 cursor-pointer"
                >
                  Size Guide & Measurements
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate({ type: 'policies', initialTab: 'shipping' });
                    setMobileMenuOpen(false);
                  }}
                  className="block text-xs uppercase tracking-widest text-[#888888] hover:text-white px-3 py-1 cursor-pointer"
                >
                  Shipping & Exchange Policy
                </button>
              </div>
            </div>

            {/* Bottom atelier guide */}
            <div className="pt-6 border-t border-[#222222] space-y-2 font-mono text-[11px] text-[#888888]">
              <button
                type="button"
                onClick={() => {
                  onNavigate({ type: 'about', focusContact: true });
                  setMobileMenuOpen(false);
                }}
                className="text-white hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Atelier Location & Contact Address →</span>
              </button>
              <div className="text-[10px] text-[#555] uppercase">
                CARVED FOR THE UNCOMMON • EST. 2024
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
