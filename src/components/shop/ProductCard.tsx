import React, { useState } from 'react';
import { Product, ProductSize, ViewState } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (view: ViewState) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'M');
  const [quickAdded, setQuickAdded] = useState(false);

  // Check total stock for this product
  const totalStock = Object.values(product.inventory).reduce((a, b) => a + b, 0);
  const isOutOfStock = totalStock <= 0 || !product.isAvailable;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultColor = product.colors[0]?.name || 'Standard';
    const res = addToCart(product, selectedSize, defaultColor, 1);
    if (res.success) {
      setQuickAdded(true);
      setTimeout(() => setQuickAdded(false), 1800);
    }
  };

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <div
      onClick={() => onNavigate({ type: 'product', idOrHandle: product.handle })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer flex flex-col bg-[#0e0e0e] border border-[#1e1e1d] hover:border-[#383838] transition-all duration-300 relative overflow-hidden"
    >
      {/* Badges (No GSM) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.badge && (
          <span className="px-2 py-0.5 bg-[#f7f6f2] text-[#0a0a0a] text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg">
            {product.badge}
          </span>
        )}
        <span className="px-2 py-0.5 bg-[#141414]/90 backdrop-blur-sm border border-[#262624] text-[#c8c5be] text-[10px] font-mono tracking-wider">
          {product.category === 't-shirts' ? 'HEAVY KNIT' : 'LOOPBACK FLEECE'}
        </span>
      </div>

      {discountPercent && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-1.5 py-0.5 bg-white text-black text-[10px] font-mono font-bold">
            -{discountPercent}%
          </span>
        </div>
      )}

      {/* Image Container with smooth hover swap */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#141414]">
        <img
          src={hovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="px-3 py-1 bg-[#141414] border border-[#262624] text-[#787672] font-mono text-xs uppercase tracking-widest font-bold">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick size selector on hover */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between">
            <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`w-7 h-7 text-[10px] font-mono font-bold flex items-center justify-center transition-colors border cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-[#f7f6f2] text-[#0a0a0a] border-[#f7f6f2]'
                      : 'bg-[#141414]/80 text-[#c8c5be] border-[#333] hover:border-[#f7f6f2]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              className="px-3 py-1.5 bg-[#f7f6f2] hover:bg-white text-[#0a0a0a] text-[10px] font-display font-black uppercase tracking-wider transition-colors shrink-0 shadow-lg cursor-pointer"
            >
              {quickAdded ? 'Added ✓' : '+ Add'}
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#787672]">
            {product.category === 't-shirts' ? 'Heavyweight T-Shirt' : 'Heavy Loopback Hoodie'}
          </div>
          <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-[#f7f6f2] group-hover:text-white transition-colors mt-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] font-mono text-[#787672] mt-1 line-clamp-1">
            {product.specs.fit} • {product.colors.length} Colourways
          </p>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-[#1b1b1b]">
          <div className="flex items-baseline space-x-2">
            <span className="font-display font-black text-sm sm:text-base text-[#f7f6f2]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs font-mono text-[#555] line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            {product.colors.map(c => (
              <span
                key={c.code}
                className="w-2.5 h-2.5 rounded-full border border-[#333]"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
