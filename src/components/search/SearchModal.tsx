import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { Product, ViewState } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onNavigate: (view: ViewState) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = searchTerm.trim()
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.specs.fabric.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const quickTags = ['Oversized Tee', 'Heavy Loopback', 'Drop Shoulder', 'Monolith Edition', 'French Terry', 'Boxy'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e0e0e] border border-[#262624] shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#262624]">
          <Search className="w-5 h-5 text-[#787672] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search heavyweights, hoodies, fabrics, or fits..."
            className="w-full bg-transparent text-sm md:text-base font-mono text-[#f7f6f2] placeholder-[#555] focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 text-[#787672] hover:text-[#f7f6f2] mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono uppercase tracking-widest text-[#787672] hover:text-[#f7f6f2] px-2 py-1 bg-[#141414] border border-[#262624]"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        <div className="px-5 py-3 bg-[#141414] border-b border-[#1b1b1b] flex items-center space-x-2 overflow-x-auto text-xs font-mono">
          <span className="text-[#666] shrink-0 flex items-center">
            <Tag className="w-3 h-3 mr-1" /> Quick:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchTerm(tag)}
              className="px-2.5 py-1 bg-[#1b1b1b] hover:bg-[#262624] text-[#c8c5be] hover:text-[#f7f6f2] transition-colors shrink-0 border border-[#262624] text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-[#1b1b1b]">
          {searchTerm.trim() ? (
            filtered.length > 0 ? (
              filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onNavigate({ type: 'product', idOrHandle: product.handle });
                    onClose();
                  }}
                  className="flex items-center space-x-4 py-3 px-2 hover:bg-[#141414] cursor-pointer group transition-colors"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-16 object-cover bg-[#1b1b1b] border border-[#262624]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#262624] text-[#c8c5be]">
                        {product.specs.weightCategory || (product.category === 't-shirts' ? 'Heavy Knit' : 'Heavy Fleece')}
                      </span>
                      {product.badge && (
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-white text-black font-bold">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-display font-bold text-[#f7f6f2] uppercase tracking-wider group-hover:text-white truncate mt-1">
                      {product.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#787672] truncate">
                      {product.specs.fit} • {product.specs.fabric}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-display font-black text-[#f7f6f2]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#787672] group-hover:text-[#f7f6f2] group-hover:translate-x-1 transition-all ml-auto mt-1" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs font-mono text-[#787672]">
                No matching garments found for "{searchTerm}".
              </div>
            )
          ) : (
            <div className="py-8 text-center text-xs font-mono text-[#787672]">
              Type above to search our heavyweight catalog by name, fabric, or silhouette.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
