import React from 'react';
import { ShieldCheck, Truck, CreditCard, MessageSquare } from 'lucide-react';

export const TrustBadgesBar: React.FC = () => {
  const openWhatsApp = () => {
    const text = encodeURIComponent("Hello THE STANE PROJECT, I would like to inquire about your collections.");
    window.open(`https://wa.me/918870123806?text=${text}`, '_blank');
  };

  return (
    <section className="bg-[#000000] border-b border-[#222222] py-5 px-4 sm:px-6 lg:px-12 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
        {/* 1. Premium Quality */}
        <div className="flex items-center space-x-3.5 group">
          <ShieldCheck className="w-5 h-5 text-white flex-shrink-0" />
          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase text-white leading-tight">
              PREMIUM QUALITY
            </span>
            <span className="font-mono text-[10px] tracking-widest text-[#777777] uppercase">
              BUILT TO LAST
            </span>
          </div>
        </div>

        {/* 2. Pan India Shipping */}
        <div className="flex items-center space-x-3.5 group">
          <Truck className="w-5 h-5 text-white flex-shrink-0" />
          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase text-white leading-tight">
              PAN INDIA SHIPPING
            </span>
            <span className="font-mono text-[10px] tracking-widest text-[#777777] uppercase">
              SAFE & RELIABLE
            </span>
          </div>
        </div>

        {/* 3. Secure Payments */}
        <div className="flex items-center space-x-3.5 group">
          <CreditCard className="w-5 h-5 text-white flex-shrink-0" />
          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase text-white leading-tight">
              SECURE PAYMENTS
            </span>
            <span className="font-mono text-[10px] tracking-widest text-[#777777] uppercase">
              RAZORPAY • COD
            </span>
          </div>
        </div>

        {/* 4. WhatsApp Support */}
        <div
          onClick={openWhatsApp}
          className="flex items-center space-x-3.5 group cursor-pointer hover:opacity-90 transition-opacity"
        >
          <MessageSquare className="w-5 h-5 text-white flex-shrink-0" />
          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase text-white leading-tight">
              WHATSAPP SUPPORT
            </span>
            <span className="font-mono text-[10px] tracking-widest text-[#777777] uppercase group-hover:text-white transition-colors">
              +91 8870123806
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
