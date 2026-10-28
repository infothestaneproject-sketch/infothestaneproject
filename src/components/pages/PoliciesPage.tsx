import React, { useState } from 'react';
import { ViewState } from '../../types';
import { Truck, RefreshCw, Shield, FileText } from 'lucide-react';
import { FORMATTED_PHONE, WHATSAPP_PHONE } from '../../utils/whatsapp';

interface PoliciesPageProps {
  initialTab?: 'shipping' | 'returns' | 'privacy' | 'terms';
  onNavigate: (view: ViewState) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({
  initialTab = 'shipping',
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns' | 'privacy' | 'terms'>(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f7f6f2] py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-[#262624] pb-6">
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#787672] mb-1">
            LEGAL & OPERATIONS
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-[0.14em] text-[#f7f6f2]">
            Store Policies
          </h1>
          <p className="mt-2 text-xs font-mono text-[#8c8983]">
            Transparent operational standards for THE STANE PROJECT.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#262624] overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`py-3 px-5 uppercase tracking-wider transition-colors shrink-0 flex items-center space-x-2 border-b-2 ${
              activeTab === 'shipping'
                ? 'border-[#f7f6f2] text-[#f7f6f2] font-bold bg-[#141414]'
                : 'border-transparent text-[#787672] hover:text-[#f7f6f2]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('returns')}
            className={`py-3 px-5 uppercase tracking-wider transition-colors shrink-0 flex items-center space-x-2 border-b-2 ${
              activeTab === 'returns'
                ? 'border-[#f7f6f2] text-[#f7f6f2] font-bold bg-[#141414]'
                : 'border-transparent text-[#787672] hover:text-[#f7f6f2]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Returns & Exchanges</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-5 uppercase tracking-wider transition-colors shrink-0 flex items-center space-x-2 border-b-2 ${
              activeTab === 'privacy'
                ? 'border-[#f7f6f2] text-[#f7f6f2] font-bold bg-[#141414]'
                : 'border-transparent text-[#787672] hover:text-[#f7f6f2]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-5 uppercase tracking-wider transition-colors shrink-0 flex items-center space-x-2 border-b-2 ${
              activeTab === 'terms'
                ? 'border-[#f7f6f2] text-[#f7f6f2] font-bold bg-[#141414]'
                : 'border-transparent text-[#787672] hover:text-[#f7f6f2]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-[#0e0e0e] border border-[#262624] p-6 sm:p-10 font-mono text-xs sm:text-sm text-[#8c8983] leading-relaxed space-y-6">
          {activeTab === 'shipping' && (
            <div className="space-y-5">
              <h2 className="text-base sm:text-lg font-display font-black uppercase text-[#f7f6f2] tracking-wider">
                Pan-India Shipping Policy
              </h2>
              <p>
                All orders placed on <strong>THE STANE PROJECT</strong> are packed and dispatched directly from our central atelier facility in India.
              </p>
              <div className="p-4 bg-[#141414] border border-[#262624] space-y-2 text-xs">
                <p className="text-[#f7f6f2] font-bold uppercase tracking-wider">Estimated Transit Timelines:</p>
                <p>• Tamil Nadu & South Indian States: 2 to 3 business days.</p>
                <p>• Tier-1 Metro Hubs (Mumbai, NCR, Bengaluru, Hyderabad, Kolkata): 3 to 4 business days.</p>
                <p>• Rest of India & Regional Centres: 4 to 6 business days.</p>
              </div>
              <p>
                <strong>Shipping Charges:</strong> Free shipping is automatically applied on all domestic orders with a cart value of ₹1,999 and above. For orders below this threshold, a flat standard courier fee of ₹99 is applied.
              </p>
              <p>
                <strong>Order Tracking:</strong> Once your package is scanned at our courier dispatch facility, an automated AWB tracking code is generated. You can look up live updates through our Track Order page or contact us on WhatsApp at {FORMATTED_PHONE}.
              </p>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-5">
              <h2 className="text-base sm:text-lg font-display font-black uppercase text-[#f7f6f2] tracking-wider">
                7-Day Size Exchange Policy
              </h2>
              <p>
                Because streetwear fit is personal and our garments feature intentional oversized architectural silhouettes, we offer a dedicated <strong>7-Day Doorstep Size Exchange</strong>.
              </p>
              <div className="p-4 bg-[#141414] border border-[#262624] space-y-2 text-xs">
                <p className="text-[#f7f6f2] font-bold uppercase tracking-wider">Exchange Conditions:</p>
                <p>1. Garment must be in original unworn, unwashed condition with all brand tags and silicone badges intact.</p>
                <p>2. Exchange request must be submitted within 7 days of package delivery confirmation.</p>
                <p>3. One complimentary size exchange is provided per order.</p>
              </div>
              <p>
                <strong>How To Initiate An Exchange:</strong> Send a quick WhatsApp message to {FORMATTED_PHONE} or email gracedebritto3@gmail.com with your Order ID (e.g. TSP-2026-XXXX) and desired replacement size. Our concierge team will schedule a courier reverse pickup from your address.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <h2 className="text-base sm:text-lg font-display font-black uppercase text-[#f7f6f2] tracking-wider">
                Privacy & Data Security Policy
              </h2>
              <p>
                THE STANE PROJECT respects your privacy. We collect customer information (such as name, mobile number, delivery address, and email) solely for the purpose of order processing, fulfillment, and shipment updates.
              </p>
              <p>
                <strong>Payment Information:</strong> We do not store, process, or hold credit card, debit card, or UPI banking credentials on our servers. All online transactions are processed through Razorpay's PCI-DSS compliant secure payment gateway with 256-bit encryption.
              </p>
              <p>
                <strong>Zero Selling of Customer Data:</strong> We never sell, lease, or share customer contact records with third-party advertisers or data brokers.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-5">
              <h2 className="text-base sm:text-lg font-display font-black uppercase text-[#f7f6f2] tracking-wider">
                Terms and Conditions of Service
              </h2>
              <p>
                By accessing and purchasing from THE STANE PROJECT, you agree to comply with our commercial terms. All garments, logos, typography, visual lookbooks, and design patterns are the exclusive intellectual property of THE STANE PROJECT.
              </p>
              <p>
                <strong>Pricing & Invoicing:</strong> All prices listed are in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST).
              </p>
              <p>
                <strong>Jurisdiction:</strong> Any legal disputes or claims arising out of commercial transactions shall be subject to the exclusive jurisdiction of the competent courts in Tamil Nadu, India.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
