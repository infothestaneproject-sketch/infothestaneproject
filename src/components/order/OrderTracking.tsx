import React, { useState } from 'react';
import { ViewState } from '../../types';
import { Search, Truck, CheckCircle2, Clock, Package, AlertCircle, MessageCircle } from 'lucide-react';
import { buildOrderInquiryWhatsAppMessage, createWhatsAppChatUrl, FORMATTED_PHONE } from '../../utils/whatsapp';

interface OrderTrackingProps {
  onNavigate: (view: ViewState) => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ onNavigate }) => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setError('Please provide both Order ID and Mobile number.');
      return;
    }

    setLoading(true);
    setError('');
    setTrackResult(null);

    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Order lookup failed.');
      }
      setTrackResult(data);
    } catch (err: any) {
      setError(err.message || 'No matching order found. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { key: 'placed', label: 'Order Placed', desc: 'Recorded in atelier database' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Inventory allocated & verified' },
    { key: 'packed', label: 'Packed & Sealed', desc: 'Pre-shrunk quality inspection passed' },
    { key: 'shipped', label: 'In Transit', desc: 'Handed over to courier partner' },
    { key: 'delivered', label: 'Delivered', desc: 'Handed over at doorstep' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'placed': return 0;
      case 'confirmed':
      case 'processing': return 1;
      case 'packed': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f7f6f2] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#787672] mb-1">
            LOGISTICS & DISPATCH
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-[0.16em] text-[#f7f6f2]">
            Track Your Garment
          </h1>
          <p className="text-xs font-mono text-[#8c8983] mt-2">
            Enter your Order ID (from SMS/WhatsApp or confirmation screen) and your 10-digit mobile number.
          </p>
        </div>

        {/* Lookup Form */}
        <div className="bg-[#0e0e0e] border border-[#262624] p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#787672] mb-1">
                  Order ID *
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  placeholder="e.g. TSP-2026-8942"
                  required
                  className="w-full bg-[#141414] border border-[#262624] px-3.5 py-2.5 text-xs font-mono uppercase text-[#f7f6f2] placeholder-[#555] focus:outline-none focus:border-[#f7f6f2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#787672] mb-1">
                  Mobile Number (10 Digits) *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                  className="w-full bg-[#141414] border border-[#262624] px-3.5 py-2.5 text-xs font-mono text-[#f7f6f2] placeholder-[#555] focus:outline-none focus:border-[#f7f6f2]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#f7f6f2] hover:bg-white text-[#0a0a0a] font-display font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Locating Order...' : 'Track Dispatch'}</span>
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono flex items-center space-x-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Live Result Timeline */}
        {trackResult && (
          <div className="mt-8 bg-[#0e0e0e] border border-[#262624] p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#262624] gap-2">
              <div>
                <span className="text-[10px] font-mono text-[#787672] uppercase">ORDER ID</span>
                <h3 className="text-lg font-display font-black text-[#f7f6f2] uppercase tracking-wider">
                  {trackResult.id}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#787672] uppercase block">DESTINATION</span>
                <span className="text-xs font-mono text-[#c8c5be]">
                  {trackResult.destination.city}, {trackResult.destination.state} ({trackResult.destination.pincode})
                </span>
              </div>
            </div>

            {/* Courier Tracking Info if assigned */}
            {trackResult.trackingNumber && (
              <div className="p-4 bg-[#141414] border border-[#262624] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#787672] block text-[10px] uppercase">COURIER PARTNER</span>
                  <span className="text-[#f7f6f2] font-bold">{trackResult.courierPartner || 'Delhivery Express'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#787672] block text-[10px] uppercase">AWB / TRACKING NO.</span>
                  <span className="text-white font-bold">{trackResult.trackingNumber}</span>
                </div>
              </div>
            )}

            {/* Step-by-step progress */}
            <div className="space-y-6">
              <h4 className="text-xs font-display font-bold uppercase tracking-wider text-[#787672]">
                Fulfillment Journey
              </h4>
              <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#262624]">
                {statusSteps.map((step, index) => {
                  const currentIndex = getStepIndex(trackResult.orderStatus);
                  const isDone = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div key={step.key} className="relative flex items-start space-x-4">
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold ${
                          isDone
                            ? 'bg-white text-black border-white'
                            : 'bg-[#141414] text-[#555] border-[#333]'
                        }`}
                      >
                        {isDone ? '✓' : index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h5
                            className={`text-xs font-display font-bold uppercase tracking-wider ${
                              isCurrent ? 'text-white' : isDone ? 'text-[#f7f6f2]' : 'text-[#666]'
                            }`}
                          >
                            {step.label}
                          </h5>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 bg-white text-black text-[9px] font-mono font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-[#787672] mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Need Help WhatsApp Button */}
            <div className="pt-6 border-t border-[#262624] flex items-center justify-between text-xs font-mono">
              <span className="text-[#787672]">Have queries about this order?</span>
              <a
                href={createWhatsAppChatUrl(buildOrderInquiryWhatsAppMessage(trackResult.id))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-white hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat with Stane Concierge</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
