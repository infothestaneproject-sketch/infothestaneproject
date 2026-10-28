import React, { useState, useEffect } from 'react';
import { Product, Order, StoreSettings, ViewState, ProductSize } from '../../types';
import {
  ShieldCheck,
  Lock,
  Package,
  ShoppingBag,
  DollarSign,
  Truck,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { FORMATTED_PHONE } from '../../utils/whatsapp';

interface AdminDashboardProps {
  products: Product[];
  onRefreshProducts: () => void;
  onNavigate: (view: ViewState) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onRefreshProducts,
  onNavigate
}) => {
  const [authToken, setAuthToken] = useState<string>(() => {
    return sessionStorage.getItem('stane_admin_token') || '';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'settings'>('overview');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Settings State
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Authenticate Admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthToken(data.token);
        sessionStorage.setItem('stane_admin_token', data.token);
        setPasscode('');
      } else {
        setAuthError(data.error || 'Invalid owner passcode');
      }
    } catch {
      setAuthError('Connection error to server');
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    sessionStorage.removeItem('stane_admin_token');
  };

  // Fetch orders
  const fetchOrders = async () => {
    if (!authToken) return;
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchOrders();
      fetchSettings();
    }
  }, [authToken]);

  // Update order fulfillment status
  const handleUpdateOrderStatus = async (
    orderId: string,
    updates: {
      orderStatus?: Order['orderStatus'];
      paymentStatus?: Order['paymentStatus'];
      trackingNumber?: string;
      courierPartner?: string;
    }
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  };

  // Save Product (Edit or New)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const url = isNewProduct ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(editingProduct)
      });

      if (res.ok) {
        setEditingProduct(null);
        setIsNewProduct(false);
        onRefreshProducts();
      }
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        onRefreshProducts();
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  // If not logged in, show owner login form
  if (!authToken) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0a0a0a] text-[#f7f6f2] px-4 py-16">
        <div className="w-full max-w-md bg-[#0e0e0e] border border-[#262624] p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-[#1b1b1b] border border-[#262624] text-white">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-display font-black uppercase tracking-wider text-[#f7f6f2]">
              Store Owner Access
            </h1>
            <p className="text-xs font-mono text-[#787672]">
              THE STANE PROJECT • Protected Administrative Console
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#787672] mb-1">
                Owner Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter secret key (default: stane2026)"
                required
                className="w-full bg-[#141414] border border-[#262624] px-3.5 py-2.5 text-xs font-mono text-[#f7f6f2] placeholder-[#555] focus:outline-none focus:border-[#f7f6f2]"
              />
            </div>

            {authError && (
              <p className="text-xs font-mono text-white/80">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#f7f6f2] hover:bg-white text-[#0a0a0a] font-display font-black text-xs uppercase tracking-widest transition-colors"
            >
              Authenticate As Owner
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'home' })}
              className="text-[11px] font-mono text-[#787672] hover:text-[#f7f6f2]"
            >
              ← Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'captured' || o.orderStatus === 'delivered')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'confirmed');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f7f6f2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#262624] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-white">
              <ShieldCheck className="w-4 h-4" />
              <span>OWNER ATELIER CONSOLE • CENTRAL DISPATCH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-wider text-[#f7f6f2] mt-1">
              THE STANE PROJECT Operations
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'home' })}
              className="px-3.5 py-2 bg-[#141414] hover:bg-[#1b1b1b] border border-[#262624] text-xs font-mono uppercase text-[#c8c5be] hover:text-[#f7f6f2] transition-colors"
            >
              View Storefront
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 bg-[#141414] hover:bg-rose-950/40 border border-[#262624] hover:border-rose-800 text-xs font-mono uppercase text-rose-400 transition-colors flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#262624] space-x-1 sm:space-x-4 text-xs font-mono overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Analytics & Overview' },
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'products', label: `Products & Stock (${products.length})` },
            { id: 'settings', label: 'Store & Payments Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 uppercase tracking-wider transition-colors shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#141414] text-[#f7f6f2] border-b-2 border-[#f7f6f2] font-bold'
                  : 'text-[#787672] hover:text-[#f7f6f2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#0e0e0e] border border-[#262624]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#787672]">
                  Captured Revenue
                </span>
                <div className="text-2xl font-display font-black text-[#f7f6f2] mt-2">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] font-mono text-white mt-1 block">
                  Online & Delivered
                </span>
              </div>

              <div className="p-6 bg-[#0e0e0e] border border-[#262624]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#787672]">
                  Total Orders
                </span>
                <div className="text-2xl font-display font-black text-[#f7f6f2] mt-2">
                  {orders.length}
                </div>
                <span className="text-[10px] font-mono text-[#8c8983] mt-1 block">
                  All time recorded
                </span>
              </div>

              <div className="p-6 bg-[#0e0e0e] border border-[#262624]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#787672]">
                  Pending Dispatch
                </span>
                <div className="text-2xl font-display font-black text-white mt-2">
                  {pendingOrders.length}
                </div>
                <span className="text-[10px] font-mono text-[#8c8983] mt-1 block">
                  Awaiting packing/handover
                </span>
              </div>

              <div className="p-6 bg-[#0e0e0e] border border-[#262624]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#787672]">
                  Active Catalog
                </span>
                <div className="text-2xl font-display font-black text-[#f7f6f2] mt-2">
                  {products.length} Drops
                </div>
                <span className="text-[10px] font-mono text-white mt-1 block">
                  Heavyweights in stock
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-[#0e0e0e] border border-[#262624] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold uppercase tracking-wider text-xs text-[#f7f6f2]">
                    Recent Order Transmissions
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-mono text-white hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs font-mono text-[#787672] py-8 text-center">
                    No orders placed yet. Orders will appear here in real-time.
                  </p>
                ) : (
                  <div className="divide-y divide-[#1b1b1b]">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="py-3 flex items-center justify-between text-xs font-mono">
                        <div>
                          <strong className="text-[#f7f6f2]">{o.id}</strong>
                          <span className="text-[#787672] ml-2">by {o.customer.name}</span>
                          <div className="text-[10px] text-[#666]">
                            {o.customer.city}, {o.customer.state} • {o.items.length} items
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#f7f6f2]">₹{o.total.toLocaleString('en-IN')}</span>
                          <span className="block text-[10px] uppercase font-bold text-white">
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Atelier Status */}
              <div className="lg:col-span-4 bg-[#0e0e0e] border border-[#262624] p-6 space-y-4 text-xs font-mono text-[#8c8983]">
                <h3 className="font-display font-bold uppercase tracking-wider text-xs text-[#f7f6f2]">
                  Atelier Dispatch Settings
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-[#1b1b1b]">
                    <span>Atelier Base:</span>
                    <strong className="text-[#f7f6f2]">Central Facility</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1b1b1b]">
                    <span>WhatsApp Concierge:</span>
                    <strong className="text-white">{FORMATTED_PHONE}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1b1b1b]">
                    <span>Free Shipping At:</span>
                    <strong className="text-[#f7f6f2]">₹{settings?.freeShippingThreshold || 1999}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1b1b1b]">
                    <span>Cash on Delivery:</span>
                    <strong className={settings?.codEnabled ? 'text-white' : 'text-[#888]'}>
                      {settings?.codEnabled ? 'ENABLED' : 'DISABLED'}
                    </strong>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-2 bg-[#1b1b1b] hover:bg-[#262624] text-xs font-mono uppercase text-[#c8c5be]"
                  >
                    Adjust Operational Rules
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-black uppercase tracking-wider text-[#f7f6f2]">
                Order Management ({orders.length})
              </h2>
              <button
                type="button"
                onClick={fetchOrders}
                className="px-3 py-1.5 bg-[#141414] border border-[#262624] text-xs font-mono text-[#c8c5be] hover:text-[#f7f6f2] flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[#0e0e0e] border border-[#262624] font-mono text-xs text-[#787672]">
                No orders received yet. Once customers place orders, they will show here with one-click status transitions.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Orders Table */}
                <div className="lg:col-span-7 bg-[#0e0e0e] border border-[#262624] overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-[#141414] text-[#c8c5be] border-b border-[#262624] uppercase text-[10px]">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1b1b1b]">
                      {orders.map(o => (
                        <tr
                          key={o.id}
                          onClick={() => setSelectedOrder(o)}
                          className={`cursor-pointer transition-colors ${
                            selectedOrder?.id === o.id ? 'bg-[#1b1b1b] text-white' : 'hover:bg-[#141414]'
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-[#f7f6f2]">
                            {o.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="block text-[#f7f6f2]">{o.customer.name}</span>
                            <span className="text-[10px] text-[#787672]">{o.customer.city}</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold">
                            ₹{o.total.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#1b1b1b] text-white border border-[#333]">
                              {o.paymentMethod === 'cod' ? 'COD' : 'Razorpay'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] uppercase font-bold text-white">
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected Order Detailed Drawer */}
                <div className="lg:col-span-5 bg-[#0e0e0e] border border-[#262624] p-6 space-y-6">
                  {selectedOrder ? (
                    <>
                      <div className="flex items-center justify-between pb-4 border-b border-[#262624]">
                        <div>
                          <span className="text-[10px] font-mono text-[#787672] uppercase">ORDER DETAILS</span>
                          <h3 className="text-base font-display font-black text-[#f7f6f2] uppercase">
                            {selectedOrder.id}
                          </h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#f7f6f2]">
                          ₹{selectedOrder.total.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-mono uppercase text-[#787672]">
                          Update Fulfillment Status
                        </label>
                        <select
                          value={selectedOrder.orderStatus}
                          onChange={e => handleUpdateOrderStatus(selectedOrder.id, { orderStatus: e.target.value as any })}
                          className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-xs font-mono text-[#f7f6f2]"
                        >
                          <option value="placed">Placed (Received in Database)</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="packed">Packed (Inspected at Atelier)</option>
                          <option value="shipped">Shipped (In Transit with Courier)</option>
                          <option value="delivered">Delivered to Customer</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Courier Partner & AWB Tracking Number Input */}
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-[#787672] mb-1">
                            Courier Partner Name
                          </label>
                          <input
                            type="text"
                            defaultValue={selectedOrder.courierPartner || 'Delhivery Express'}
                            onBlur={e => handleUpdateOrderStatus(selectedOrder.id, { courierPartner: e.target.value })}
                            placeholder="e.g. Delhivery, Blue Dart, DTDC"
                            className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-xs font-mono text-[#f7f6f2]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-[#787672] mb-1">
                            Tracking Number / AWB
                          </label>
                          <input
                            type="text"
                            defaultValue={selectedOrder.trackingNumber || ''}
                            onBlur={e => handleUpdateOrderStatus(selectedOrder.id, { trackingNumber: e.target.value })}
                            placeholder="e.g. DL18274981IN"
                            className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-xs font-mono text-[#f7f6f2]"
                          />
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="p-4 bg-[#141414] border border-[#262624] text-xs font-mono space-y-1">
                        <span className="text-[10px] text-[#787672] uppercase font-bold block mb-1">Shipping Address</span>
                        <p className="text-[#f7f6f2] font-bold">{selectedOrder.customer.name}</p>
                        <p className="text-white">Phone: {selectedOrder.customer.phone}</p>
                        {selectedOrder.customer.email && <p>Email: {selectedOrder.customer.email}</p>}
                        <p>{selectedOrder.customer.address}</p>
                        <p>{selectedOrder.customer.city}, {selectedOrder.customer.state} — {selectedOrder.customer.pincode}</p>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-[#787672] uppercase font-bold">Ordered Garments</span>
                        <div className="divide-y divide-[#1b1b1b]">
                          {selectedOrder.items.map((it, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between text-xs font-mono">
                              <div>
                                <span className="text-[#f7f6f2] font-semibold">{it.productName}</span>
                                <div className="text-[11px] text-[#787672]">
                                  Size {it.size} • {it.color} • Qty {it.quantity}
                                </div>
                              </div>
                              <span className="text-[#c8c5be]">
                                ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-16 text-center text-xs font-mono text-[#787672]">
                      Select an order from the list to view complete shipping info, update tracking numbers, or adjust dispatch status.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS & INVENTORY MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-display font-black uppercase tracking-wider text-[#f7f6f2]">
                  Products & Stock Manager ({products.length} Garments)
                </h2>
                <p className="text-xs font-mono text-[#787672]">
                  Edit prices in INR, adjust stock per size/colour, and add new releases.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct({
                    id: '',
                    name: 'NEW DROP // HEAVY TEE',
                    handle: 'new-drop-heavy-tee',
                    category: 't-shirts',
                    price: 1499,
                    compareAtPrice: 1999,
                    shortDesc: 'Heavy combed cotton streetwear cut.',
                    description: 'Engineered with oversized boxy drop-shoulder silhouette.',
                    specs: {
                      weightCategory: 'Heavyweight Knit',
                      fabric: '100% Combed Cotton',
                      fit: 'Oversized Boxy',
                      care: 'Cold wash inside out',
                      origin: 'Atelier Crafted'
                    },
                    colors: [{ name: 'Onyx Black', hex: '#111111', code: 'black' }],
                    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                    inventory: {
                      'S-Onyx Black': 10,
                      'M-Onyx Black': 15,
                      'L-Onyx Black': 15,
                      'XL-Onyx Black': 8,
                      'XXL-Onyx Black': 4
                    },
                    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop'],
                    featured: true,
                    badge: 'NEW DROP',
                    isAvailable: true,
                    createdAt: new Date().toISOString()
                  });
                  setIsNewProduct(true);
                }}
                className="px-4 py-2 bg-[#f7f6f2] hover:bg-white text-[#0a0a0a] text-xs font-display font-black uppercase tracking-wider flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Drop</span>
              </button>
            </div>

            {/* Products List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => {
                const totalStock = Object.values(p.inventory).reduce((a, b) => a + b, 0);
                return (
                  <div key={p.id} className="bg-[#0e0e0e] border border-[#262624] p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex space-x-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-16 h-20 object-cover bg-[#141414] border border-[#262624] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#1b1b1b] text-[#c8c5be]">
                            {p.specs.weightCategory || 'Heavyweight'} • {p.category}
                          </span>
                          <h3 className="font-display font-bold text-xs uppercase text-[#f7f6f2] truncate mt-1">
                            {p.name}
                          </h3>
                          <div className="text-sm font-mono font-bold text-[#f7f6f2] mt-1">
                            ₹{p.price.toLocaleString('en-IN')}
                            {p.compareAtPrice && (
                              <span className="text-xs font-mono text-[#666] line-through ml-2">
                                ₹{p.compareAtPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stock Summary */}
                      <div className="p-2.5 bg-[#141414] border border-[#1b1b1b] text-[11px] font-mono flex items-center justify-between">
                        <span className="text-[#787672]">Total Stock:</span>
                        <strong className={totalStock > 0 ? 'text-white' : 'text-[#888]'}>
                          {totalStock} units available
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-[#1b1b1b]">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(p);
                          setIsNewProduct(false);
                        }}
                        className="flex-1 py-2 bg-[#1b1b1b] hover:bg-[#262624] text-[#f7f6f2] text-xs font-mono uppercase flex items-center justify-center space-x-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Drop & Stock</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 bg-[#1b1b1b] hover:bg-rose-950 text-rose-400 text-xs font-mono"
                        title="Delete drop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Product Edit Modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
                <div className="w-full max-w-2xl bg-[#0e0e0e] border border-[#262624] p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#262624]">
                    <h3 className="font-display font-black uppercase text-base text-[#f7f6f2]">
                      {isNewProduct ? 'Create New Drop Release' : `Edit: ${editingProduct.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs font-mono uppercase text-[#787672] hover:text-[#f7f6f2]"
                    >
                      Close ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#787672] uppercase mb-1">Product Title</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          required
                          className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#787672] uppercase mb-1">URL Handle</label>
                        <input
                          type="text"
                          value={editingProduct.handle}
                          onChange={e => setEditingProduct({ ...editingProduct, handle: e.target.value })}
                          required
                          className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[#787672] uppercase mb-1">Price (₹ INR)</label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          required
                          className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#787672] uppercase mb-1">Compare-At Price (₹)</label>
                        <input
                          type="number"
                          value={editingProduct.compareAtPrice || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, compareAtPrice: Number(e.target.value) })}
                          className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#787672] uppercase mb-1">Fabric Weight Class</label>
                        <input
                          type="text"
                          value={editingProduct.specs.weightCategory || 'Heavyweight Knit'}
                          onChange={e => setEditingProduct({
                            ...editingProduct,
                            specs: { ...editingProduct.specs, weightCategory: e.target.value }
                          })}
                          required
                          className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#787672] uppercase mb-1">Category</label>
                        <select
                          value={editingProduct.category}
                          onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                          className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                        >
                          <option value="t-shirts">Heavyweight T-Shirt</option>
                          <option value="hoodies">Heavyweight Hoodie</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#787672] uppercase mb-1">Badge</label>
                        <input
                          type="text"
                          value={editingProduct.badge || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                          placeholder="e.g. NEW DROP, BESTSELLER"
                          className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                        />
                      </div>
                    </div>

                    {/* Stock Allocation Per Size for first colorway */}
                    <div className="p-4 bg-[#141414] border border-[#262624] space-y-3">
                      <span className="text-[#f7f6f2] font-bold uppercase tracking-wider block">
                        Inventory Units Per Size ({editingProduct.colors[0]?.name || 'Standard'})
                      </span>
                      <div className="grid grid-cols-5 gap-2">
                        {(['S', 'M', 'L', 'XL', 'XXL'] as ProductSize[]).map(sz => {
                          const col = editingProduct.colors[0]?.name || 'Standard';
                          const key = `${sz}-${col}`;
                          const qty = editingProduct.inventory[key] ?? 0;
                          return (
                            <div key={sz}>
                              <label className="block text-[10px] text-[#787672] uppercase mb-0.5">{sz}</label>
                              <input
                                type="number"
                                min={0}
                                value={qty}
                                onChange={e => {
                                  const updatedInv = { ...editingProduct.inventory, [key]: Number(e.target.value) };
                                  setEditingProduct({ ...editingProduct, inventory: updatedInv });
                                }}
                                className="w-full bg-[#0a0a0a] border border-[#333] px-2 py-1.5 text-center text-[#f7f6f2]"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#787672] uppercase mb-1">Image URL (High-Res Lookbook)</label>
                      <input
                        type="url"
                        value={editingProduct.images[0] || ''}
                        onChange={e => {
                          const imgs = [...editingProduct.images];
                          imgs[0] = e.target.value;
                          setEditingProduct({ ...editingProduct, images: imgs });
                        }}
                        className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                      />
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 bg-[#1b1b1b] text-xs font-mono uppercase text-[#787672]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#f7f6f2] text-[#0a0a0a] text-xs font-display font-bold uppercase tracking-wider"
                      >
                        Save Garment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STORE SETTINGS & PAYMENT GATEWAY */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-[#0e0e0e] border border-[#262624] p-6 sm:p-8 space-y-6 max-w-3xl">
              <div>
                <h2 className="text-base font-display font-black uppercase tracking-wider text-[#f7f6f2]">
                  Store & Payment Settings
                </h2>
                <p className="text-xs font-mono text-[#787672] mt-1">
                  Manage shipping thresholds, Cash on Delivery availability, and payment rules.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 text-xs font-mono">
                {/* Shipping & COD */}
                <div className="space-y-4 p-4 bg-[#141414] border border-[#262624]">
                  <h3 className="font-display font-bold uppercase text-xs text-[#f7f6f2]">
                    Pan-India Logistics & Payments
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#787672] uppercase mb-1">
                        Free Shipping Threshold (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full bg-[#0a0a0a] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#787672] uppercase mb-1">
                        Standard Shipping Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.standardShippingFee}
                        onChange={e => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                        className="w-full bg-[#0a0a0a] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                      />
                    </div>
                  </div>

                  {/* COD Toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[#f7f6f2] font-bold block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-[#787672]">Allow customers to pay in cash at doorstep</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.codEnabled}
                      onChange={e => setSettings({ ...settings, codEnabled: e.target.checked })}
                      className="w-5 h-5 accent-[#f7f6f2]"
                    />
                  </div>
                </div>

                {/* Announcement Bar */}
                <div className="space-y-2">
                  <label className="block text-[#787672] uppercase">
                    Homepage Announcement Bar Text
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={e => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                  />
                </div>

                {/* WhatsApp Support Number */}
                <div className="space-y-2">
                  <label className="block text-[#787672] uppercase">
                    Concierge WhatsApp Number (Without +)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262624] px-3 py-2 text-[#f7f6f2]"
                  />
                  <p className="text-[10px] text-[#666]">
                    Current international link uses: +91 8870123806
                  </p>
                </div>

                {/* Razorpay Setup Guide */}
                <div className="p-4 bg-[#141414] border border-emerald-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Razorpay Production Setup</span>
                  </div>
                  <p className="text-[11px] text-[#8c8983] leading-relaxed">
                    Razorpay server-side order generation and HMAC signature verification are fully wired. To switch from Test Mode simulator to live gateway payments, add your keys to your deployment environment:
                  </p>
                  <pre className="p-2.5 bg-[#0a0a0a] text-emerald-300 text-[11px] font-mono overflow-x-auto border border-[#262624]">
{`RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="YourSecretKey"`}
                  </pre>
                  <p className="text-[10px] text-[#666]">
                    The secret key remains securely on the server and is never transmitted to the browser.
                  </p>
                </div>

                {settingsSaved && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
                    Store settings saved successfully!
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#f7f6f2] hover:bg-white text-[#0a0a0a] font-display font-black text-xs uppercase tracking-widest transition-colors"
                >
                  Save Store Settings
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
