import React from 'react';
import { Order, ViewState } from '../../types';
import { CheckCircle2, MessageCircle, Printer, ArrowRight, Truck, Package, ShieldCheck } from 'lucide-react';
import { buildOrderInquiryWhatsAppMessage, createWhatsAppChatUrl, FORMATTED_PHONE } from '../../utils/whatsapp';

interface OrderConfirmationProps {
  order: Order;
  onNavigate: (view: ViewState) => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onNavigate
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppNotify = () => {
    const msg = `Hello THE STANE PROJECT Team,
I have just placed an order on your website!
• Order ID: ${order.id}
• Total Amount: ₹${order.total.toLocaleString('en-IN')}
• Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Captured)'}
• Customer Name: ${order.customer.name}
• Delivery City: ${order.customer.city}, ${order.customer.state} (${order.customer.pincode})

Please acknowledge and share updates when dispatched. Thank you!`;
    const url = createWhatsAppChatUrl(msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f7f6f2] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center space-y-4 pb-8 border-b border-[#262624]">
          <div className="inline-flex p-4 rounded-full bg-[#181818] border border-white/30 text-white">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="block text-[10px] font-mono tracking-[0.3em] uppercase text-white font-semibold">
            {order.paymentMethod === 'cod' ? 'ORDER CONFIRMED (CASH ON DELIVERY)' : 'PAYMENT VERIFIED & CAPTURED'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-[0.16em] text-[#f7f6f2]">
            Welcome To The Uncommon
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#8c8983] max-w-lg mx-auto">
            Your order has been confirmed and registered. We are preparing your heavyweight garments for dispatch.
          </p>

          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#141414] border border-[#262624] text-xs font-mono">
            <span className="text-[#787672]">ORDER ID:</span>
            <strong className="text-[#f7f6f2] tracking-wider">{order.id}</strong>
          </div>
        </div>

        {/* Action Bar */}
        <div className="py-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleWhatsAppNotify}
            className="px-4 py-2.5 bg-[#181818] hover:bg-[#222] border border-white/30 text-white text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Confirmation to WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ type: 'track-order' })}
            className="px-4 py-2.5 bg-[#141414] hover:bg-[#1b1b1b] border border-[#262624] text-[#f7f6f2] text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-colors"
          >
            <Truck className="w-4 h-4 text-[#c8c5be]" />
            <span>Track Order Status</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-[#141414] hover:bg-[#1b1b1b] border border-[#262624] text-[#787672] hover:text-[#f7f6f2] text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Receipt Container */}
        <div className="bg-[#0e0e0e] border border-[#262624] p-6 sm:p-8 space-y-6 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#262624] text-xs font-mono text-[#8c8983] gap-2">
            <div>
              <span>Placed On: </span>
              <strong className="text-[#f7f6f2]">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</strong>
            </div>
            <div>
              <span>Payment Mode: </span>
              <strong className="text-[#f7f6f2] uppercase">{order.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Razorpay (Online)'}</strong>
            </div>
          </div>

          {/* Garments List */}
          <div className="divide-y divide-[#1b1b1b]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-16 object-cover bg-[#141414] border border-[#262624]"
                  />
                  <div>
                    <h3 className="font-display font-bold text-xs uppercase text-[#f7f6f2]">
                      {item.productName}
                    </h3>
                    <p className="text-[11px] font-mono text-[#787672] mt-0.5">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-[#f7f6f2]">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-[#262624] pt-4 space-y-2 text-xs font-mono text-[#8c8983]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#f7f6f2]">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-white">
                <span>Coupon Discount ({order.couponCode})</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pan-India Shipping</span>
              <span className={order.shippingFee === 0 ? 'text-white font-bold' : 'text-[#f7f6f2]'}>
                {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#262624] text-base font-bold text-[#f7f6f2]">
              <span className="font-display uppercase tracking-wider">Total Amount</span>
              <span className="font-display text-lg">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="border-t border-[#262624] pt-4 text-xs font-mono text-[#8c8983]">
            <h4 className="font-display font-bold uppercase tracking-wider text-[#f7f6f2] mb-1.5">
              Delivery Destination
            </h4>
            <p className="text-[#c8c5be] font-semibold">{order.customer.name} ({order.customer.phone})</p>
            <p>{order.customer.address}</p>
            {order.customer.landmark && <p>Landmark: {order.customer.landmark}</p>}
            <p>{order.customer.city}, {order.customer.state} — {order.customer.pincode}</p>
          </div>
        </div>

        {/* Back to Home CTA */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => onNavigate({ type: 'home' })}
            className="inline-flex items-center space-x-2 text-xs font-display font-bold uppercase tracking-[0.2em] text-[#f7f6f2] hover:text-white border-b border-[#f7f6f2] pb-1"
          >
            <span>Continue Exploring Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
