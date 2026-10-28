import React, { useState, useEffect } from 'react';
import { Product, ViewState, Order } from './types';
import { CartProvider } from './context/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CategorySplitBanners } from './components/home/CategorySplitBanners';
import { TrustBadgesBar } from './components/home/TrustBadgesBar';
import { NewArrivalsSection } from './components/home/NewArrivalsSection';
import { NewsletterSection } from './components/home/NewsletterSection';
import { LogoIntroAnimation } from './components/brand/LogoIntroAnimation';
import { ProductList } from './components/shop/ProductList';
import { ProductDetail } from './components/shop/ProductDetail';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmation } from './components/order/OrderConfirmation';
import { OrderTracking } from './components/order/OrderTracking';
import { AboutPage } from './components/pages/AboutPage';
import { FaqPage } from './components/pages/FaqPage';
import { PoliciesPage } from './components/pages/PoliciesPage';
import { SizeGuidePage } from './components/pages/SizeGuidePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SearchModal } from './components/search/SearchModal';
import { Loader2 } from 'lucide-react';

function MainApp() {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'home' });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch products from database API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Listen for keyboard shortcut `/` to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Scroll to top on view changes
  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current view
  const renderView = () => {
    if (loading) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0a0a0a] text-[#f7f6f2] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#f7f6f2]" />
          <p className="text-xs font-mono tracking-widest uppercase text-[#787672]">
            Loading THE STANE PROJECT Atelier...
          </p>
        </div>
      );
    }

    switch (currentView.type) {
      case 'home':
        return (
          <>
            {/* 1. Hero Section: BUILT DIFFERENT. WORN WITH PURPOSE. */}
            <HeroSection onNavigate={handleNavigate} />

            {/* 2. Dual Category Split Cards: T-SHIRTS and HOODIES */}
            <CategorySplitBanners onNavigate={handleNavigate} />

            {/* 3. Value Proposition / 4 Trust Badges */}
            <TrustBadgesBar />

            {/* 4. Live Continuous Scrolling NEW ARRIVALS Shelf */}
            <NewArrivalsSection products={products} onNavigate={handleNavigate} />

            {/* 5. Newsletter: JOIN OUR JOURNEY over Stone Texture */}
            <NewsletterSection />
          </>
        );

      case 'shop':
        return (
          <ProductList
            products={products}
            category={currentView.category}
            onNavigate={handleNavigate}
          />
        );

      case 'product': {
        const product = products.find(
          p => p.id === currentView.idOrHandle || p.handle === currentView.idOrHandle
        );
        if (!product) {
          return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
              <h2 className="text-xl font-display font-black uppercase text-[#f7f6f2]">
                Garment Not Found
              </h2>
              <p className="text-xs font-mono text-[#787672]">
                This drop release may have been archived or moved.
              </p>
              <button
                type="button"
                onClick={() => handleNavigate({ type: 'shop', category: 'all' })}
                className="px-6 py-2.5 bg-[#f7f6f2] text-[#0a0a0a] text-xs font-display font-bold uppercase cursor-pointer"
              >
                View Collection
              </button>
            </div>
          );
        }
        return (
          <ProductDetail
            product={product}
            allProducts={products}
            onNavigate={handleNavigate}
          />
        );
      }

      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={handleNavigate}
            onOrderComplete={(order: Order) => handleNavigate({ type: 'order-confirmation', order })}
          />
        );

      case 'order-confirmation':
        return (
          <OrderConfirmation
            order={currentView.order}
            onNavigate={handleNavigate}
          />
        );

      case 'track-order':
        return <OrderTracking onNavigate={handleNavigate} />;

      case 'about':
        return <AboutPage focusContact={currentView.focusContact} onNavigate={handleNavigate} />;

      case 'faqs':
        return <FaqPage onNavigate={handleNavigate} />;

      case 'policies':
        return (
          <PoliciesPage
            initialTab={currentView.initialTab}
            onNavigate={handleNavigate}
          />
        );

      case 'size-guide':
        return <SizeGuidePage onNavigate={handleNavigate} />;

      case 'admin':
        return (
          <AdminDashboard
            products={products}
            onRefreshProducts={fetchProducts}
            onNavigate={handleNavigate}
          />
        );

      default:
        return <HeroSection onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#f7f6f2]">
      {/* Brand Opening Logo Animation Reveal */}
      <LogoIntroAnimation />

      {/* Global Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Cart Slide-Over Drawer */}
      <CartDrawer onNavigate={handleNavigate} />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
