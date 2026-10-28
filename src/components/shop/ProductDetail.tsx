import React, { useState } from 'react';
import { Product, ProductSize, ViewState } from '../../types';
import { useCart } from '../../context/CartContext';
import { SizeGuideModal } from '../common/SizeGuideModal';
import { ProductCard } from './ProductCard';
import {
  Ruler,
  ShoppingBag,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle
} from 'lucide-react';
import { buildProductWhatsAppMessage, createWhatsAppChatUrl, FORMATTED_PHONE } from '../../utils/whatsapp';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onNavigate: (view: ViewState) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  allProducts,
  onNavigate
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  // Variant inventory lookup
  const invKey = `${selectedSize}-${selectedColor}`;
  const availableStock = product.inventory[invKey] ?? 0;
  const isVariantOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    if (isVariantOutOfStock) {
      setFeedbackMsg({ text: `Size ${selectedSize} in ${selectedColor} is out of stock.`, error: true });
      return;
    }
    const res = addToCart(product, selectedSize, selectedColor, quantity);
    if (res.success) {
      setFeedbackMsg({ text: res.message });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      setFeedbackMsg({ text: res.message, error: true });
    }
  };

  const handleBuyNow = () => {
    if (isVariantOutOfStock) {
      setFeedbackMsg({ text: `Size ${selectedSize} in ${selectedColor} is out of stock.`, error: true });
      return;
    }
    const res = addToCart(product, selectedSize, selectedColor, quantity);
    if (res.success) {
      setIsCartOpen(false);
      onNavigate({ type: 'checkout' });
    }
  };

  // WhatsApp Direct Order Action - Black and White
  const handleWhatsAppOrder = () => {
    const message = buildProductWhatsAppMessage({
      productName: product.name,
      size: selectedSize,
      color: selectedColor,
      quantity,
      unitPrice: product.price,
      handle: product.handle
    });
    const url = createWhatsAppChatUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const related = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#000000] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation - Monochrome */}
        <div className="flex items-center space-x-2 text-xs font-mono text-[#888888] mb-8 uppercase tracking-wider">
          <button
            type="button"
            onClick={() => onNavigate({ type: 'home' })}
            className="hover:text-white cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', category: product.category })}
            className="hover:text-white cursor-pointer"
          >
            {product.category === 't-shirts' ? 'T-Shirts' : 'Hoodies'}
          </button>
          <span>/</span>
          <span className="text-white truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          {/* Left Column: Image Gallery (7 Cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 bg-[#0A0A0A] border transition-all overflow-hidden shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-white scale-102 ring-1 ring-white'
                      : 'border-[#222222] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all" />
                </button>
              ))}
            </div>

            {/* Main Image Display */}
            <div className="relative flex-1 aspect-[3/4] bg-[#0A0A0A] border border-[#222222] overflow-hidden">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider shadow-lg">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Garment Specs & Order Controls (5 Cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Header info (No GSM, No Trichy) */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#888888] uppercase tracking-widest mb-1.5">
                <span>INDEPENDENT ATELIER</span>
                <span>•</span>
                <span className="text-white font-bold">{product.specs.weightCategory || 'Heavyweight'}</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white leading-tight">
                {product.name}
              </h1>
              <p className="text-xs font-mono text-[#888888] mt-2 leading-relaxed">
                {product.shortDesc}
              </p>
            </div>

            {/* Price & Taxes - Black & White */}
            <div className="p-4 bg-[#0A0A0A] border border-[#222222] flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline space-x-3">
                  <span className="font-display font-black text-2xl sm:text-3xl text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm font-mono text-[#666666] line-through">
                      ₹{product.compareAtPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-xs font-mono font-bold bg-white text-black px-2 py-0.5">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-mono text-[#888888] mt-1">
                  Inclusive of all taxes • Free shipping on ₹1,999+
                </p>
              </div>

              <div className="text-right font-mono text-[10px]">
                <span className="text-white block font-bold">
                  COD Available
                </span>
                <span className="text-[#888888]">
                  Razorpay UPI / Cards
                </span>
              </div>
            </div>

            {/* Colour Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#888888] flex justify-between">
                <span>Colourway: <strong className="text-white">{selectedColor}</strong></span>
              </label>
              <div className="flex items-center space-x-3">
                {product.colors.map(col => (
                  <button
                    key={col.code}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center space-x-2 px-3 py-1.5 border transition-all cursor-pointer ${
                      selectedColor === col.name
                        ? 'border-white bg-[#141414]'
                        : 'border-[#222222] bg-[#0A0A0A] hover:border-[#666]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-xs font-mono text-[#CCCCCC]">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector with Stock Validation */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#888888] uppercase tracking-wider">
                  Select Size: <strong className="text-white">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center space-x-1.5 text-white hover:text-[#CCCCCC] transition-colors uppercase tracking-wider font-semibold cursor-pointer underline underline-offset-2"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide & Recommender</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map(sz => {
                  const szStock = product.inventory[`${sz}-${selectedColor}`] ?? 0;
                  const szOutOfStock = szStock <= 0;
                  return (
                    <button
                      key={sz}
                      type="button"
                      disabled={szOutOfStock}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 text-xs font-mono font-bold uppercase transition-all flex flex-col items-center justify-center border relative cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-white text-black border-white shadow-md'
                          : szOutOfStock
                          ? 'bg-[#0A0A0A] text-[#444] border-[#1A1A1A] cursor-not-allowed line-through'
                          : 'bg-[#0A0A0A] text-[#CCCCCC] border-[#222222] hover:border-white'
                      }`}
                    >
                      <span>{sz}</span>
                      <span className={`text-[9px] mt-0.5 ${selectedSize === sz ? 'text-[#333]' : 'text-[#666]'}`}>
                        {szOutOfStock ? '0' : `${szStock} left`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Stock Indicator - Zero Trichy, Pure B&W */}
              <div className="text-xs font-mono pt-1">
                {isVariantOutOfStock ? (
                  <span className="text-[#888888] flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Currently out of stock in this size & colour.</span>
                  </span>
                ) : availableStock <= 5 ? (
                  <span className="text-white flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Low Stock: Only {availableStock} pieces remaining in central atelier.</span>
                  </span>
                ) : (
                  <span className="text-white flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock — Ready for Pan-India dispatch within 24 hours.</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center space-x-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#888888]">
                Quantity:
              </span>
              <div className="flex items-center border border-[#222222] bg-[#0A0A0A]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-[#888888] hover:text-white cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 font-mono text-xs font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                  className="px-3 py-1.5 text-[#888888] hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Feedback message banner */}
            {feedbackMsg && (
              <div
                className={`p-3 text-xs font-mono border ${
                  feedbackMsg.error
                    ? 'bg-[#141414] border-white text-white'
                    : 'bg-white text-black'
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            {/* Action Buttons: Pure Black & White Contrast */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isVariantOutOfStock}
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white border border-white font-display font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag</span>
                </button>

                <button
                  type="button"
                  disabled={isVariantOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-white hover:bg-[#EAEAEA] text-black font-display font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xl cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now (Instant)</span>
                </button>
              </div>

              {/* Dedicated WhatsApp Ordering Button - Luxury Monochrome */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 bg-[#0A0A0A] hover:bg-white hover:text-black text-white border border-[#333333] hover:border-white font-mono text-xs uppercase tracking-wider flex items-center justify-center space-x-2.5 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp ({FORMATTED_PHONE})</span>
                </button>
                <p className="text-[10px] font-mono text-[#666666] text-center mt-1.5">
                  Opening WhatsApp sends a prefilled inquiry for size {selectedSize} / {selectedColor}. It does not automatically confirm an order until you review and send it.
                </p>
              </div>
            </div>

            {/* Garment Details Accordions */}
            <div className="border-t border-[#222222] divide-y divide-[#1A1A1A] pt-4">
              {/* Description & Story */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'story' ? null : 'story')}
                  className="w-full flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-white cursor-pointer"
                >
                  <span>Design & Architectural Concept</span>
                  {openAccordion === 'story' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'story' && (
                  <div className="mt-3 text-xs font-mono text-[#888888] leading-relaxed">
                    {product.description}
                  </div>
                )}
              </div>

              {/* Specs (No GSM, No Trichy) */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                  className="w-full flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-white cursor-pointer"
                >
                  <span>Textile Specifications & Care</span>
                  {openAccordion === 'specs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'specs' && (
                  <div className="mt-3 space-y-2 text-xs font-mono text-[#888888]">
                    <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                      <span className="text-[#666666]">Textile Structure</span>
                      <span className="text-white font-bold">{product.specs.weightCategory || 'Heavyweight Combed Knit'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                      <span className="text-[#666666]">Composition</span>
                      <span className="text-white">{product.specs.fabric}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                      <span className="text-[#666666]">Silhouette Cut</span>
                      <span className="text-white">{product.specs.fit}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                      <span className="text-[#666666]">Atelier Origin</span>
                      <span className="text-white">Central Atelier, India</span>
                    </div>
                    <div className="pt-1 text-[11px] text-[#888888]">
                      Wash Care: {product.specs.care}
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping & Delivery - Zero Trichy */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-white cursor-pointer"
                >
                  <span>Pan-India Shipping & Timelines</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="mt-3 text-xs font-mono text-[#888888] space-y-2">
                    <p>• Dispatched from our central atelier within 24 hours.</p>
                    <p>• South India: 2-3 business days.</p>
                    <p>• Metro Cities (Mumbai, Delhi, Bengaluru, etc.): 3-4 business days.</p>
                    <p>• Rest of India: 4-6 business days.</p>
                    <p>• Free shipping automatically applies on all orders above ₹1,999.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Drops Section */}
        {related.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#222222]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#888888]">
                  Related Pieces
                </span>
                <h2 className="text-lg sm:text-xl font-display font-black uppercase tracking-[0.2em] text-white mt-1">
                  Complete The Silhouette
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', category: product.category })}
                className="text-xs font-mono uppercase tracking-wider text-[#888888] hover:text-white cursor-pointer"
              >
                View Collection →
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map(rel => (
                <ProductCard key={rel.id} product={rel} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
        onSelectSize={sz => setSelectedSize(sz)}
      />
    </div>
  );
};
