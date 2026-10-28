import React, { useState } from 'react';
import { ViewState } from '../../types';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { FORMATTED_PHONE, WHATSAPP_PHONE } from '../../utils/whatsapp';

interface FaqPageProps {
  onNavigate: (view: ViewState) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What does THE STANE PROJECT stand for?",
      a: "STANE is the archaic Scottish word for stone. We engineer garments built with monumental durability, heavy structured weights, and chiseled streetwear cuts."
    },
    {
      q: "Why are THE STANE PROJECT garments considered ultra-heavyweight?",
      a: "Most fast-fashion tees in India use flimsy, see-through fabrics that cling and lose structure after two washes. We mill dense, high-twist long-staple combed cotton and loopback French terry that holds a dramatic architectural drape without clinging to the body."
    },
    {
      q: "What are your shipping timelines across India?",
      a: "All orders are dispatched from our central atelier within 24 hours. Estimated delivery timelines: Tamil Nadu & South India: 2-3 business days. Metro cities (Bengaluru, Mumbai, Delhi, Hyderabad, Chennai): 3-4 business days. Rest of India: 4-6 business days. Real-time courier tracking is provided immediately upon dispatch."
    },
    {
      q: "Is Cash on Delivery (COD) supported?",
      a: "Yes. Cash on Delivery is available across all serviceable Indian PIN codes. You can pay cash directly to the courier agent when the parcel arrives at your doorstep."
    },
    {
      q: "What is your return or size exchange policy?",
      a: "We offer a 7-day doorstep size exchange policy. If the fit isn't exactly as you desired, simply reach out to us with your Order ID, and our team will arrange a reverse pickup and replacement size."
    },
    {
      q: "How should I wash and care for my heavyweights?",
      a: "All our garments are pre-shrunk and bio-silicon washed. Machine wash cold inside out with dark colors. Do not bleach or tumble dry. Dry flat in shade to preserve the heavy fabric drape, and iron inside-out."
    },
    {
      q: "Where is the atelier located and how do I contact you?",
      a: "Our physical studio address, location details, and direct WhatsApp concierge links are available on our About Us page."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f7f6f2] py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-[#262624] pb-8 text-center sm:text-left">
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#787672] mb-2">
            CLIENT INTELLIGENCE
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-[0.14em] text-[#f7f6f2]">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-[#8c8983]">
            Everything you need to know about our textiles, sizing, pan-India delivery, and care.
          </p>
        </div>

        {/* FAQs List */}
        <div className="divide-y divide-[#262624] border-y border-[#262624]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="font-display font-bold text-sm sm:text-base uppercase tracking-wider text-[#f7f6f2] group-hover:text-white transition-colors pr-4">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded bg-[#141414] border border-[#262624] text-[#787672] group-hover:text-[#f7f6f2] shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="mt-4 text-xs sm:text-sm font-mono text-[#8c8983] leading-relaxed pl-1 pr-6 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="p-8 bg-[#0e0e0e] border border-[#262624] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold uppercase tracking-wider text-sm text-[#f7f6f2]">
              Need direct atelier assistance?
            </h3>
            <p className="text-xs font-mono text-[#787672] mt-1">
              Visit our About Us page for our full address and concierge channels.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'about', focusContact: true })}
            className="px-5 py-3 bg-[#f7f6f2] hover:bg-white text-black font-display font-bold text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
          >
            About & Contact Details →
          </button>
        </div>
      </div>
    </div>
  );
};
