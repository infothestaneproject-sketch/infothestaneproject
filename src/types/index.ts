export interface ProductColor {
  name: string;
  hex: string;
  code: string;
}

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductSpecs {
  weightCategory: string;
  fabric: string;
  fit: string;
  care: string;
  origin: string;
}

export interface Product {
  id: string;
  name: string;
  handle: string;
  category: 't-shirts' | 'hoodies';
  price: number;
  compareAtPrice?: number;
  shortDesc: string;
  description: string;
  specs: ProductSpecs;
  colors: ProductColor[];
  sizes: ProductSize[];
  inventory: Record<string, number>;
  images: string[];
  featured: boolean;
  badge?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  handle: string;
  category: 't-shirts' | 'hoodies';
  color: string;
  size: ProductSize;
  quantity: number;
  price: number;
  image: string;
  maxStock: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  handle: string;
  color: string;
  size: ProductSize;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  customer: CustomerDetails;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'captured' | 'cod_pending' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: 'placed' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  courierPartner?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  location: string;
  whatsappNumber: string;
  supportEmail: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  codEnabled: boolean;
  codFee: number;
  announcementText: string;
  announcementActive: boolean;
  razorpayKeyId: string;
  razorpayConfigured: boolean;
}

export type ViewState =
  | { type: 'home' }
  | { type: 'shop'; category?: 'all' | 't-shirts' | 'hoodies' }
  | { type: 'product'; idOrHandle: string }
  | { type: 'cart' }
  | { type: 'checkout' }
  | { type: 'order-confirmation'; order: Order }
  | { type: 'track-order' }
  | { type: 'about'; focusContact?: boolean }
  | { type: 'faqs' }
  | { type: 'policies'; initialTab?: 'shipping' | 'returns' | 'privacy' | 'terms' }
  | { type: 'size-guide' }
  | { type: 'admin' };
