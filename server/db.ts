import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, Product, Order, StoreSettings } from './data.js';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  coupons: {
    code: string;
    discountPercent: number;
    minSpend: number;
    active: boolean;
  }[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'stane_db.json');

const INITIAL_COUPONS = [
  { code: 'STANE10', discountPercent: 10, minSpend: 999, active: true },
  { code: 'TRICHYFIRST', discountPercent: 15, minSpend: 1499, active: true },
  { code: 'UNCOMMON', discountPercent: 20, minSpend: 2499, active: true }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
          orders: parsed.orders || [],
          settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
          coupons: parsed.coupons || INITIAL_COUPONS
        };
      }
    } catch (err) {
      console.error('[DB] Failed to read database file, initializing defaults:', err);
    }

    const initial: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: [],
      settings: INITIAL_SETTINGS,
      coupons: INITIAL_COUPONS
    };
    this.saveDataDirect(initial);
    return initial;
  }

  private saveDataDirect(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed to write database file:', err);
    }
  }

  private save() {
    this.saveDataDirect(this.data);
  }

  // Products
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductByIdOrHandle(idOrHandle: string): Product | undefined {
    return this.data.products.find(p => p.id === idOrHandle || p.handle === idOrHandle);
  }

  createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const id = `tsp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.data.products[index] = {
      ...this.data.products[index],
      ...updates
    };
    this.save();
    return this.data.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Stock deduction & validation
  validateAndDeductStock(items: { productId: string; size: string; color: string; quantity: number }[]): { success: boolean; error?: string } {
    // Check all first
    for (const item of items) {
      const product = this.getProductByIdOrHandle(item.productId);
      if (!product) {
        return { success: false, error: `Product not found: ${item.productId}` };
      }
      const invKey = `${item.size}-${item.color}`;
      const available = product.inventory[invKey] ?? 0;
      if (available < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${product.name} (${item.color}, Size ${item.size}). Available: ${available}`
        };
      }
    }

    // Deduct
    for (const item of items) {
      const product = this.getProductByIdOrHandle(item.productId)!;
      const invKey = `${item.size}-${item.color}`;
      product.inventory[invKey] = (product.inventory[invKey] || 0) - item.quantity;
      this.updateProduct(product.id, { inventory: product.inventory });
    }

    return { success: true };
  }

  // Orders
  getOrders(): Order[] {
    return this.data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id.toLowerCase() === id.trim().toLowerCase());
  }

  getOrderByTracking(orderId: string, phone: string): Order | undefined {
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    return this.data.orders.find(o => {
      const idMatch = o.id.toLowerCase() === orderId.trim().toLowerCase();
      const phoneClean = o.customer.phone.replace(/[^0-9]/g, '').slice(-10);
      return idMatch && phoneClean === cleanPhone;
    });
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const id = `TSP-${year}-${randomHex}`;

    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(
    orderId: string,
    updates: {
      orderStatus?: Order['orderStatus'];
      paymentStatus?: Order['paymentStatus'];
      trackingNumber?: string;
      courierPartner?: string;
      notes?: string;
    }
  ): Order | null {
    const index = this.data.orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    this.data.orders[index] = {
      ...this.data.orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.orders[index];
  }

  // Settings
  getSettings(): StoreSettings {
    return {
      ...this.data.settings,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || this.data.settings.razorpayKeyId
    };
  }

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.save();
    return this.data.settings;
  }

  // Coupons
  validateCoupon(code: string, subtotal: number): { valid: boolean; discountPercent: number; discountAmount: number; message: string } {
    const coupon = this.data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (!coupon) {
      return { valid: false, discountPercent: 0, discountAmount: 0, message: 'Invalid or expired coupon code' };
    }
    if (subtotal < coupon.minSpend) {
      return {
        valid: false,
        discountPercent: 0,
        discountAmount: 0,
        message: `Coupon requires minimum cart subtotal of ₹${coupon.minSpend}`
      };
    }
    const discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
    return {
      valid: true,
      discountPercent: coupon.discountPercent,
      discountAmount,
      message: `Code ${coupon.code} applied! ${coupon.discountPercent}% OFF (-₹${discountAmount})`
    };
  }
}

export const db = new Database();
