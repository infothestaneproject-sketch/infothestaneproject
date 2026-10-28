import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db } from './server/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper: Admin auth middleware
const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const adminSecret = process.env.ADMIN_SECRET_KEY || db.getSettings().adminSecret || 'stane2026';
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin authorization required' });
  }

  const token = authHeader.split(' ')[1];
  if (token !== adminSecret) {
    return res.status(403).json({ success: false, error: 'Forbidden: Invalid admin credentials' });
  }

  next();
};

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'THE STANE PROJECT',
    tagline: 'CARVED FOR THE UNCOMMON',
    timestamp: new Date().toISOString()
  });
});

// Admin verification
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { passcode } = req.body;
  const adminSecret = process.env.ADMIN_SECRET_KEY || db.getSettings().adminSecret || 'stane2026';

  if (passcode && passcode.trim() === adminSecret.trim()) {
    return res.json({
      success: true,
      token: adminSecret,
      user: {
        role: 'owner',
        email: db.getSettings().supportEmail || 'gracedebritto3@gmail.com'
      }
    });
  }

  return res.status(401).json({ success: false, error: 'Incorrect owner passcode.' });
});

// Settings API
app.get('/api/settings', (_req: Request, res: Response) => {
  const settings = db.getSettings();
  // Safe sanitized settings without server secrets
  const sanitized = {
    storeName: settings.storeName,
    tagline: settings.tagline,
    location: settings.location,
    whatsappNumber: settings.whatsappNumber,
    supportEmail: settings.supportEmail,
    freeShippingThreshold: settings.freeShippingThreshold,
    standardShippingFee: settings.standardShippingFee,
    codEnabled: settings.codEnabled,
    codFee: settings.codFee,
    announcementText: settings.announcementText,
    announcementActive: settings.announcementActive,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || settings.razorpayKeyId || '',
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  };
  res.json(sanitized);
});

app.put('/api/settings', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Products API
app.get('/api/products', (req: Request, res: Response) => {
  let products = db.getProducts();
  const { category, search, sort } = req.query;

  if (category && typeof category === 'string' && category !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const term = search.toLowerCase();
    products = products.filter(
      p => p.name.toLowerCase().includes(term) ||
           p.description.toLowerCase().includes(term) ||
           p.specs.fit.toLowerCase().includes(term)
    );
  }

  if (sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(products);
});

app.get('/api/products/:idOrHandle', (req: Request, res: Response) => {
  const product = db.getProductByIdOrHandle(req.params.idOrHandle);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const product = db.createProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
});

// Coupons API
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code || typeof subtotal !== 'number') {
    return res.status(400).json({ valid: false, message: 'Invalid coupon check payload' });
  }
  const result = db.validateCoupon(code, subtotal);
  res.json(result);
});

// Orders API
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { items, customer, paymentMethod, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.pincode) {
      return res.status(400).json({ error: 'Complete delivery details are required' });
    }

    // Server-side stock check & deduction
    const stockResult = db.validateAndDeductStock(
      items.map(it => ({
        productId: it.productId,
        size: it.size,
        color: it.color,
        quantity: it.quantity
      }))
    );

    if (!stockResult.success) {
      return res.status(400).json({ error: stockResult.error });
    }

    // Calculate pricing server-side to prevent tampering
    let subtotal = 0;
    for (const item of items) {
      const p = db.getProductByIdOrHandle(item.productId);
      const unitPrice = p ? p.price : item.price;
      subtotal += unitPrice * item.quantity;
    }

    const settings = db.getSettings();
    let shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
    let discount = 0;

    if (couponCode) {
      const couponCheck = db.validateCoupon(couponCode, subtotal);
      if (couponCheck.valid) {
        discount = couponCheck.discountAmount;
      }
    }

    const total = Math.max(0, subtotal + shippingFee - discount);

    const order = db.createOrder({
      items,
      subtotal,
      shippingFee,
      discount,
      couponCode,
      total,
      customer,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'pending',
      orderStatus: 'placed',
      notes: req.body.notes || ''
    });

    res.status(201).json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});

// Admin: Get all orders
app.get('/api/orders', requireAdminAuth, (_req: Request, res: Response) => {
  const orders = db.getOrders();
  res.json(orders);
});

// Public: Track order by orderId & phone
app.get('/api/orders/track', (req: Request, res: Response) => {
  const { orderId, phone } = req.query;
  if (!orderId || !phone || typeof orderId !== 'string' || typeof phone !== 'string') {
    return res.status(400).json({ error: 'Order ID and Phone number are required' });
  }

  const order = db.getOrderByTracking(orderId, phone);
  if (!order) {
    return res.status(404).json({ error: 'No matching order found. Please verify Order ID and Mobile number.' });
  }

  // Sanitize order details for tracking view
  res.json({
    id: order.id,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    items: order.items,
    total: order.total,
    trackingNumber: order.trackingNumber,
    courierPartner: order.courierPartner,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    destination: {
      city: order.customer.city,
      state: order.customer.state,
      pincode: order.customer.pincode
    }
  });
});

// Admin: Update order status & tracking
app.patch('/api/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus, trackingNumber, courierPartner, notes } = req.body;

  const updated = db.updateOrderStatus(id, {
    orderStatus,
    paymentStatus,
    trackingNumber,
    courierPartner,
    notes
  });

  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ success: true, order: updated });
});

// ==========================================
// SECURE RAZORPAY INTEGRATION (SERVER-SIDE)
// ==========================================

// 1. Create Razorpay Order
app.post('/api/razorpay/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live/test credentials are configured in environment
    if (keyId && keySecret && !keyId.includes('YourTestKeyId') && !keyId.includes('StaneDemoKey')) {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // convert to paise
          currency,
          receipt: receipt || `rcpt_${Date.now()}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Razorpay Order Creation Failed]', errorData);
        return res.status(response.status).json({ error: errorData.error?.description || 'Razorpay order creation failed' });
      }

      const orderData = await response.json();
      return res.json({
        id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        key: keyId,
        isTestSimulator: false
      });
    }

    // If keys not yet set, provide secure test sandbox order response
    const mockOrderId = `order_${Date.now()}_test_${Math.random().toString(36).substring(2, 7)}`;
    return res.json({
      id: mockOrderId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      key: keyId || 'rzp_test_StaneDemoKey',
      isTestSimulator: true,
      notice: 'Running in Secure Razorpay Test Mode. To enable live gateway, configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.'
    });

  } catch (err: any) {
    console.error('[Razorpay Error]:', err);
    res.status(500).json({ error: err.message || 'Internal payment gateway error' });
  }
});

// 2. Verify Razorpay Payment Signature
app.post('/api/razorpay/verify-payment', (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Missing payment parameters' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live/configured secret exists, verify exact HMAC SHA256 signature
    if (keySecret && !keySecret.includes('YourRazorpaySecretKey')) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        console.error('[Signature Verification Mismatch]');
        return res.status(400).json({ success: false, error: 'Invalid payment signature. Verification failed.' });
      }
    }

    // Update order in database if order_id provided
    if (order_id) {
      db.updateOrderStatus(order_id, {
        paymentStatus: 'captured',
        orderStatus: 'confirmed'
      });
    }

    return res.json({
      success: true,
      message: 'Payment verified and captured successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

  } catch (err: any) {
    console.error('[Verify Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Payment verification failed' });
  }
});

// ==========================================
// VITE INTEGRATION & SERVER STARTUP
// ==========================================

async function startServer() {
  if (!isProduction) {
    // Dynamic import of Vite createServer in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[THE STANE PROJECT] Server running on http://localhost:${PORT}`);
  });
}

startServer();
