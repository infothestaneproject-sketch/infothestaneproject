import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductSize, StoreSettings } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, color: string, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (productId: string, size: ProductSize, color: string) => void;
  updateQuantity: (productId: string, size: ProductSize, color: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  hasFreeShipping: boolean;
  couponCode: string;
  discount: number;
  discountMessage: string;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  settings: StoreSettings | null;
  refreshSettings: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'the_stane_project_cart_v1';
const COUPON_STORAGE_KEY = 'the_stane_project_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountMessage, setDiscountMessage] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  // Fetch settings from server
  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.warn('Failed to fetch settings, using defaults', err);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to local storage', err);
    }
  }, [cart]);

  // Calculate Subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Settings-based shipping
  const freeShippingThreshold = settings?.freeShippingThreshold ?? 1999;
  const standardShippingFee = settings?.standardShippingFee ?? 99;
  const hasFreeShipping = subtotal >= freeShippingThreshold;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = cart.length === 0 ? 0 : hasFreeShipping ? 0 : standardShippingFee;

  // Revalidate coupon whenever subtotal changes
  useEffect(() => {
    if (!couponCode) {
      setDiscountPercent(0);
      setDiscountMessage('');
      return;
    }

    const checkCoupon = async () => {
      try {
        const res = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: couponCode, subtotal })
        });
        const data = await res.json();
        if (data.valid) {
          setDiscountPercent(data.discountPercent);
          setDiscountMessage(data.message);
        } else {
          setDiscountPercent(0);
          setDiscountMessage(data.message || 'Coupon requirements not met');
        }
      } catch {
        // Fallback for coupon check
        if (couponCode.toUpperCase() === 'STANE10' && subtotal >= 999) {
          setDiscountPercent(10);
          setDiscountMessage('Code STANE10 applied: 10% OFF');
        } else {
          setDiscountPercent(0);
        }
      }
    };

    checkCoupon();
  }, [subtotal, couponCode]);

  const discount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal + shippingFee - discount);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Add Item to Cart
  const addToCart = (product: Product, size: ProductSize, color: string, quantity = 1) => {
    const invKey = `${size}-${color}`;
    const availableStock = product.inventory[invKey] ?? 0;

    if (availableStock <= 0) {
      return { success: false, message: `Size ${size} in ${color} is currently out of stock.` };
    }

    const existingIndex = cart.findIndex(
      item => item.productId === product.id && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty + quantity > availableStock) {
        return {
          success: false,
          message: `Cannot add more. Maximum available stock for this variant is ${availableStock}.`
        };
      }

      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
      setIsCartOpen(true);
      return { success: true, message: `Added ${product.name} to cart.` };
    }

    if (quantity > availableStock) {
      return {
        success: false,
        message: `Only ${availableStock} left in stock for size ${size}.`
      };
    }

    const newItem: CartItem = {
      productId: product.id,
      productName: product.name,
      handle: product.handle,
      category: product.category,
      color,
      size,
      quantity,
      price: product.price,
      image: product.images[0] || '',
      maxStock: availableStock
    };

    setCart(prev => [newItem, ...prev]);
    setIsCartOpen(true);
    return { success: true, message: `Added ${product.name} to cart.` };
  };

  // Remove from cart
  const removeFromCart = (productId: string, size: ProductSize, color: string) => {
    setCart(prev => prev.filter(
      item => !(item.productId === productId && item.size === size && item.color === color)
    ));
  };

  // Update Quantity
  const updateQuantity = (productId: string, size: ProductSize, color: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.productId === productId && item.size === size && item.color === color) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.maxStock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Apply Coupon
  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), subtotal })
      });
      const data = await res.json();
      if (data.valid) {
        setCouponCode(code.trim().toUpperCase());
        localStorage.setItem(COUPON_STORAGE_KEY, code.trim().toUpperCase());
        setDiscountPercent(data.discountPercent);
        setDiscountMessage(data.message);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Invalid coupon code' };
      }
    } catch {
      return { success: false, message: 'Could not validate coupon. Check internet connection.' };
    }
  };

  // Remove Coupon
  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setDiscountMessage('');
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
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
        itemCount,
        isCartOpen,
        setIsCartOpen,
        settings,
        refreshSettings
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
