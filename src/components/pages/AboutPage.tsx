import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from '../../types';
import { MapPin, MessageCircle, Mail, Clock, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { FORMATTED_PHONE, WHATSAPP_PHONE, createWhatsAppChatUrl } from '../../utils/whatsapp';

interface AboutPageProps {
  focusContact?: boolean;
  onNavigate: (view: ViewState) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ focusContact, onNavigate }) => {
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (focusContact && contactSectionRef.current) {
      setTimeout(() => {
        contactSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [focusContact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello THE STANE PROJECT Team,
My name is ${form.name || 'a customer'}.
I would like to inquire about: ${form.subject || 'General Inquiry'}.
${form.message ? `Message: ${form.message}` : ''}`;
    const url = createWhatsAppChatUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header - Monochrome */}
        <div className="border-b border-[#222222] pb-10">
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#888888] mb-3">
            INDEPENDENT ATELIER • EST. 2024
          </div>
          <h1 className="text-3xl sm:text-6xl font-display font-black uppercase tracking-[0.14em] text-white leading-tight">
            Built Different. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CCCCCC] to-[#666666]">
              Worn With Purpose.
            </span>
          </h1>
          <p className="mt-4 text-sm font-display font-bold tracking-[0.3em] uppercase text-white">
            CARVED FOR THE UNCOMMON.
          </p>
        </div>

        {/* Narrative & Visual */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-5 font-mono text-xs sm:text-sm text-[#888888] leading-relaxed">
            <p>
              <strong className="text-white">THE STANE PROJECT</strong> takes its name from the archaic Scottish word for <em className="text-white">stone</em>—a tribute to monumental permanence and the ancient rock formations that inspire our cuts.
            </p>
            <p>
              We established our label after observing the erosion of clothing standards across India. Streetwear had degenerated into paper-thin synthetic blends and graphics slapped onto disposable garments meant to survive three wash cycles before warping.
            </p>
            <p>
              We took the opposite path. We chose to custom-mill our own ultra-heavy combed cotton textiles, develop architectural drop-shoulder patterns that drape without clinging, and finish each batch with organic silicon bio-washes.
            </p>
            <p>
              The result is a collection of uncompromising heavyweights. They do not cling. They do not twist at the seams. They stand with sculptured authority on every frame.
            </p>
          </div>

          <div className="md:col-span-5 aspect-[4/5] bg-[#0A0A0A] border border-[#222222] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
              alt="The Stane Project Atelier"
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
          </div>
        </div>

        {/* The Stane Creed - Pure B&W */}
        <div className="pt-10 border-t border-[#222222]">
          <h2 className="text-xl font-display font-black uppercase tracking-[0.2em] text-white mb-8">
            The Stane Creed
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0A0A0A] border border-[#222222] space-y-3">
              <span className="text-xs font-mono text-white font-bold border border-[#333333] px-2 py-0.5">01 / DENSITY</span>
              <h3 className="font-display font-bold uppercase text-sm text-white">Ultra-Heavy Textiles</h3>
              <p className="text-xs font-mono text-[#888888] leading-relaxed">
                We craft only heavyweight combed cotton and dense loopback fleece. Pure fabric substance provides structural drape and longevity.
              </p>
            </div>

            <div className="p-6 bg-[#0A0A0A] border border-[#222222] space-y-3">
              <span className="text-xs font-mono text-white font-bold border border-[#333333] px-2 py-0.5">02 / PURITY</span>
              <h3 className="font-display font-bold uppercase text-sm text-white">Zero Synthetic Fillers</h3>
              <p className="text-xs font-mono text-[#888888] leading-relaxed">
                100% long-staple Indian combed cotton. We refuse polyester dilution that traps heat and pills over time.
              </p>
            </div>

            <div className="p-6 bg-[#0A0A0A] border border-[#222222] space-y-3">
              <span className="text-xs font-mono text-white font-bold border border-[#333333] px-2 py-0.5">03 / PRECISION</span>
              <h3 className="font-display font-bold uppercase text-sm text-white">Architectural Cut</h3>
              <p className="text-xs font-mono text-[#888888] leading-relaxed">
                Tailored with intentional shoulder drop ratios and thick tubular rib collars that maintain shape permanently.
              </p>
            </div>
          </div>
        </div>

        {/* OFFICIAL CONTACT ADDRESS AND CONCIERGE (TRICHY STRICTLY HOUSED ONLY HERE) */}
        <div ref={contactSectionRef} className="pt-10 border-t border-[#222222] space-y-8">
          <div>
            <div className="text-xs font-mono tracking-[0.3em] uppercase text-white mb-2">
              EXCLUSIVE ATELIER LOCATION & CONTACT ADDRESS
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-[0.16em] text-white">
              Atelier & Client Concierge
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-mono text-[#888888]">
              All official communications, dispatch operations, and inquiries are managed from our central studio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Atelier Address Card */}
            <div className="lg:col-span-5 bg-[#0A0A0A] border border-[#222222] p-6 space-y-6">
              {/* Physical Address with Trichy */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#888888] uppercase font-bold tracking-wider">
                  Official Contact Address
                </span>
                <div className="flex items-start space-x-3 text-xs font-mono text-white">
                  <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-display text-white">THE STANE PROJECT</strong>
                    <p className="text-[#CCCCCC] mt-0.5 leading-relaxed">
                      Trichy, Tamil Nadu, India — 620001
                    </p>
                    <span className="text-[10px] text-[#666666] block mt-1">
                      (Coordinates: 10.7905° N, 78.7047° E • Tiruchirappalli)
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Concierge - Luxury Black & White */}
              <div className="pt-4 border-t border-[#1F1F1F] space-y-2">
                <span className="text-[10px] font-mono text-[#888888] uppercase font-bold tracking-wider">
                  Direct WhatsApp Ordering & Support
                </span>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <MessageCircle className="w-4 h-4 text-white shrink-0" />
                  <div>
                    <a
                      href={`https://wa.me/${WHATSAPP_PHONE}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-bold hover:underline text-sm"
                    >
                      {FORMATTED_PHONE}
                    </a>
                    <p className="text-[10px] text-[#888888] mt-0.5">
                      Fastest response for sizing, orders, and courier queries
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Email */}
              <div className="pt-4 border-t border-[#1F1F1F] space-y-2">
                <span className="text-[10px] font-mono text-[#888888] uppercase font-bold tracking-wider">
                  Electronic Mail
                </span>
                <div className="flex items-center space-x-3 text-xs font-mono text-white">
                  <Mail className="w-4 h-4 text-[#888888] shrink-0" />
                  <a href="mailto:gracedebritto3@gmail.com" className="hover:underline text-xs text-[#CCCCCC]">
                    gracedebritto3@gmail.com
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pt-4 border-t border-[#1F1F1F] space-y-2">
                <span className="text-[10px] font-mono text-[#888888] uppercase font-bold tracking-wider">
                  Studio Working Hours
                </span>
                <div className="flex items-center space-x-3 text-xs font-mono text-[#888888]">
                  <Clock className="w-4 h-4 text-[#888888] shrink-0" />
                  <span>Monday through Saturday: 9:30 AM – 7:30 PM IST</span>
                </div>
              </div>
            </div>

            {/* Atelier Direct Message Form - Pure B&W */}
            <div className="lg:col-span-7 bg-[#0A0A0A] border border-[#222222] p-6 sm:p-8">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-[#141414] border border-white text-white">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-black uppercase tracking-wider text-base text-white">
                    Message Received At Central Atelier
                  </h3>
                  <p className="text-xs font-mono text-[#888888] max-w-sm mx-auto">
                    Thank you, {form.name}. Our atelier concierge will review your note and respond within 4 hours.
                  </p>
                  <div className="pt-4 flex justify-center space-x-3">
                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="px-4 py-2 bg-white text-black text-xs font-mono uppercase font-bold cursor-pointer"
                    >
                      Open in WhatsApp Instead
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2 bg-[#141414] border border-[#333333] text-xs font-mono uppercase text-[#CCCCCC] cursor-pointer"
                    >
                      Send Another Note
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-display font-bold uppercase tracking-wider text-xs text-white mb-1">
                    Send Direct Message To Atelier
                  </h3>
                  <p className="text-[11px] font-mono text-[#888888] mb-3">
                    Have questions about silhouettes, sizing or custom requests? Reach our team directly.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#888888] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Arun Kumar"
                        required
                        className="w-full bg-[#141414] border border-[#222222] px-3.5 py-2.5 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#888888] mb-1">
                        Mobile / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        required
                        className="w-full bg-[#141414] border border-[#222222] px-3.5 py-2.5 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#888888] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full bg-[#141414] border border-[#222222] px-3.5 py-2.5 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#888888] mb-1">
                        Topic
                      </label>
                      <select
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-[#141414] border border-[#222222] px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                      >
                        <option value="Sizing Help" className="bg-black">Sizing & Silhouette Help</option>
                        <option value="Order Status" className="bg-black">Order Status & Delivery</option>
                        <option value="Size Exchange" className="bg-black">7-Day Size Exchange</option>
                        <option value="General" className="bg-black">General Inquiries</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#888888] mb-1">
                      Your Message *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your message to our central atelier..."
                      rows={4}
                      required
                      className="w-full bg-[#141414] border border-[#222222] px-3.5 py-2.5 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-white hover:bg-[#EAEAEA] text-black font-display font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Note</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="py-3.5 px-4 bg-[#0A0A0A] hover:bg-white hover:text-black border border-white text-white font-mono text-xs uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send via WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Explore Collection Button */}
        <div className="pt-6 text-center">
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', category: 'all' })}
            className="px-8 py-3.5 bg-white hover:bg-[#EAEAEA] text-black font-display font-black text-xs uppercase tracking-widest transition-colors inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
