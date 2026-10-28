import React, { useState, useMemo } from 'react';
import { Product, ViewState } from '../../types';
import { ProductCard } from './ProductCard';
import { Filter, ArrowUpDown } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  category?: 'all' | 't-shirts' | 'hoodies';
  onNavigate: (view: ViewState) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  category = 'all',
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 't-shirts' | 'hoodies'>(category);
  const [selectedFit, setSelectedFit] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  // Sync prop changes
  React.useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  const fits = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.specs.fit) set.add(p.specs.fit);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (selectedFit !== 'all') {
      list = list.filter(p => p.specs.fit === selectedFit);
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [products, selectedCategory, selectedFit, sortBy]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f7f6f2] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Collection Header (No GSM) */}
        <div className="border-b border-[#262624] pb-8 mb-10">
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#787672] mb-2">
            THE STANE PROJECT • ARCHIVE & RELEASES
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-[0.15em] text-[#f7f6f2]">
            {selectedCategory === 't-shirts'
              ? 'Heavyweight T-Shirts'
              : selectedCategory === 'hoodies'
              ? 'Heavy Loopback Hoodies'
              : 'All Garments'}
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#8c8983] max-w-2xl mt-3 leading-relaxed">
            {selectedCategory === 't-shirts'
              ? 'Pure combed cotton tees engineered with high-twist yarns, drop-shoulder silhouettes, and silicon-softened finishes.'
              : selectedCategory === 'hoodies'
              ? 'Heavyweight luxury French terry and loopback fleece hoodies built with structured drapes and zero drawstrings.'
              : 'The complete monolithic collection. Crafted for fashion-conscious young adults who value structural durability and monumental silhouettes.'}
          </p>
        </div>

        {/* Filters and Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1b1b1b] mb-8">
          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#f7f6f2] text-[#0a0a0a] font-bold'
                  : 'bg-[#141414] text-[#8c8983] hover:text-[#f7f6f2] border border-[#262624]'
              }`}
            >
              All Pieces ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('t-shirts')}
              className={`px-4 py-2 uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 't-shirts'
                  ? 'bg-[#f7f6f2] text-[#0a0a0a] font-bold'
                  : 'bg-[#141414] text-[#8c8983] hover:text-[#f7f6f2] border border-[#262624]'
              }`}
            >
              T-Shirts ({products.filter(p => p.category === 't-shirts').length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('hoodies')}
              className={`px-4 py-2 uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'hoodies'
                  ? 'bg-[#f7f6f2] text-[#0a0a0a] font-bold'
                  : 'bg-[#141414] text-[#8c8983] hover:text-[#f7f6f2] border border-[#262624]'
              }`}
            >
              Hoodies ({products.filter(p => p.category === 'hoodies').length})
            </button>
          </div>

          {/* Right Filters: Silhouette & Sort */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            {/* Fit Filter */}
            {fits.length > 0 && (
              <div className="flex items-center bg-[#141414] border border-[#262624] px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-[#787672] mr-2" />
                <select
                  value={selectedFit}
                  onChange={e => setSelectedFit(e.target.value)}
                  className="bg-transparent text-[#c8c5be] focus:outline-none uppercase text-[11px]"
                >
                  <option value="all" className="bg-[#141414]">All Silhouettes</option>
                  {fits.map(f => (
                    <option key={f} value={f} className="bg-[#141414]">{f}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center bg-[#141414] border border-[#262624] px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#787672] mr-2" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#c8c5be] focus:outline-none uppercase text-[11px]"
              >
                <option value="featured" className="bg-[#141414]">Featured Drops</option>
                <option value="newest" className="bg-[#141414]">Newest Arrivals</option>
                <option value="price-low" className="bg-[#141414]">Price: Low to High</option>
                <option value="price-high" className="bg-[#141414]">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-[#1b1b1b] bg-[#0e0e0e] p-8 space-y-4">
            <p className="text-xs font-mono text-[#787672] uppercase tracking-wider">
              No garments found matching the selected filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedFit('all');
              }}
              className="px-6 py-2 bg-[#f7f6f2] text-[#0a0a0a] text-xs font-display font-bold uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
