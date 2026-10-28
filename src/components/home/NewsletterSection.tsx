import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 4000);
    }
  };

  return (
    <section className="relative w-full bg-[#0a0a0a] border-b border-[#222222] py-8 sm:py-10 overflow-hidden select-none">
      {/* Stone Texture Background on Left matching mockup */}
      <div className="absolute inset-0 z-0">
        <img
          src="/newsletter-stone.jpg"
          alt="THE STANE PROJECT Stone Texture"
          className="w-full h-full object-cover object-left filter contrast-125 brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/85 to-[#000000]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Heading and Subtitle */}
        <div className="space-y-1">
          <h2 className="font-display font-black text-xl sm:text-2xl tracking-[0.16em] uppercase text-white">
            JOIN OUR JOURNEY
          </h2>
          <p className="font-mono text-xs text-[#AAAAAA] tracking-wider">
            Get early access to new drops, exclusive offers and more.
          </p>
        </div>

        {/* Right: Email Input + Subscribe Button */}
        <form onSubmit={handleSubmit} className="flex items-center w-full md:w-auto">
          {submitted ? (
            <div className="flex items-center space-x-2 text-xs font-mono text-white bg-white/10 px-6 py-3 border border-white">
              <Check className="w-4 h-4 text-white" />
              <span>ACCESS GRANTED. CHECK YOUR INBOX.</span>
            </div>
          ) : (
            <div className="flex items-center w-full md:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full md:w-72 lg:w-80 px-4 py-3 bg-[#111111]/90 border border-[#333333] border-r-0 text-white placeholder-[#666666] font-mono text-xs focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white hover:bg-[#E5E5E5] text-black font-display font-bold text-xs uppercase tracking-[0.2em] transition-colors flex items-center space-x-2 cursor-pointer flex-shrink-0"
              >
                <span>SUBSCRIBE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
