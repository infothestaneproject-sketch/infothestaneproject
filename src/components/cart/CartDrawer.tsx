import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ViewState } from '../../types';
import { buildCartWhatsAppMessage, createWhatsAppChatUrl, FORMATTED_PHONE } from '../../utils/whatsapp';

interface CartDrawerProps {
  onNavigate: (view: ViewState) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    freeShippingRemaining,
    hasFreeShipping,
    couponCode,
    discount,
    discountMessage,
    applyCoupon,
    removeCoupon,
    total,
    itemCount
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [localCouponErr, setLocalCouponErr] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponLoading(true);
    setLocalCouponErr('');
    const result = await applyCoupon(inputCoupon);
    setCouponLoading(false);
    if (!result.success) {
      setLocalCouponErr(result.message);
    } else {
      setInputCoupon('');
    }
  };

  const handleWhatsAppCheckout = () => {
    const message = buildCartWhatsAppMessage(cart, subtotal, shippingFee, total);
    const url = createWhatsAppChatUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0a0a] border-l border-[#262624] text-[#f7f6f2] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#262624] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-[#f7f6f2]" />
              <h2 className="font-display font-black text-sm uppercase tracking-[0.2em] text-[#f7f6f2]">
                Your Bag ({itemCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#787672] hover:text-[#f7f6f2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3.5 bg-[#141414] border-b border-[#262624]">
            {hasFreeShipping ? (
              <div className="flex items-center space-x-2 text-xs font-mono text-white">
                <Sparkles className="w-4 h-4 text-white shrink-0" />
                <span>You've unlocked <strong>FREE Pan-India Shipping!</strong></span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[#c8c5be]">
                  <span>Add <strong>₹{freeShippingRemaining.toLocaleString('en-IN')}</strong> more for Free Shipping</span>
                  <span>{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#262624] overflow-hidden">
                  <div
                    className="h-full bg-[#f7f6f2] transition-all duration-500 ease-out"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#1b1b1b]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                <div className="p-4 rounded-full bg-[#141414] border border-[#262624] text-[#787672]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold uppercase tracking-wider text-sm text-[#f7f6f2]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs font-mono text-[#787672] mt-1 max-w-xs">
                    Explore our heavyweight drop silhouettes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate({ type: 'shop', category: 'all' });
                  }}
                  className="px-6 py-2.5 bg-[#f7f6f2] hover:bg-white text-[#0a0a0a] text-xs font-display font-bold uppercase tracking-widest transition-colors"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="py-4 flex space-x-4">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-24 object-cover bg-[#141414] border border-[#262624] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-xs font-display font-bold uppercase tracking-wider text-[#f7f6f2] truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] font-mono text-[#787672] mt-0.5">
                        Size: <strong className="text-[#c8c5be]">{item.size}</strong> • Color: <strong className="text-[#c8c5be]">{item.color}</strong>
                      </p>
                      <div className="text-xs font-mono font-bold text-[#f7f6f2] mt-1">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1b1b1b]">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#262624] bg-[#141414]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, -1)}
                          className="p-1 text-[#787672] hover:text-[#f7f6f2]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-[#f7f6f2]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 text-[#787672] hover:text-[#f7f6f2] disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-[#787672] hover:text-rose-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#262624] bg-[#0e0e0e] space-y-4">
              {/* Coupon input */}
              <div className="space-y-1.5">
                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-white/30 text-xs font-mono">
                    <span className="text-white">
                      Applied: <strong>{couponCode}</strong> ({discountMessage || `-₹${discount}`})
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[#787672] hover:text-white text-[11px] underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={e => setInputCoupon(e.target.value.toUpperCase())}
                      placeholder="Coupon code (e.g. STANE10)"
                      className="flex-1 bg-[#141414] border border-[#262624] px-3 py-2 text-xs font-mono uppercase text-[#f7f6f2] placeholder-[#555] focus:outline-none focus:border-[#f7f6f2]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-3.5 py-2 bg-[#262624] hover:bg-[#333] text-xs font-mono uppercase text-[#f7f6f2] transition-colors"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {localCouponErr && (
                  <p className="text-[11px] font-mono text-white/70">{localCouponErr}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs font-mono text-[#8c8983]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#f7f6f2]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-white">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping (Pan-India)</span>
                  <span className={shippingFee === 0 ? 'text-white font-bold' : 'text-[#f7f6f2]'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#262624] text-sm font-bold text-[#f7f6f2]">
                  <span className="font-display uppercase tracking-wider">Total</span>
                  <span className="font-display">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate({ type: 'checkout' });
                  }}
                  className="w-full py-3.5 bg-[#f7f6f2] hover:bg-white text-[#0a0a0a] font-display font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all shadow-xl"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* WhatsApp Order Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 bg-[#141414] hover:bg-[#1f1f1f] text-white border border-white/20 hover:border-white font-mono text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
                  title="Send bag contents directly to our WhatsApp concierge"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Order Bag via WhatsApp</span>
                </button>

                <p className="text-[10px] text-center font-mono text-[#666]">
                  Opening WhatsApp sends your bag inquiry to {FORMATTED_PHONE}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
