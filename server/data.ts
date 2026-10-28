export interface ProductVariant {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  stock: number;
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
  specs: {
    weightCategory: string;
    fabric: string;
    fit: string;
    care: string;
    origin: string;
  };
  colors: {
    name: string;
    hex: string;
    code: string;
  }[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  inventory: Record<string, number>;
  images: string[];
  featured: boolean;
  badge?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  handle: string;
  color: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
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
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
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
  razorpayEnabled: boolean;
  adminSecret: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "tsp-tee-essence",
    name: "Essence Tee",
    handle: "essence-tee",
    category: "t-shirts",
    price: 1499,
    compareAtPrice: 1999,
    shortDesc: "Heavy combed cotton with minimalist front monogram and clean drop drape.",
    description: "Built for brutalist simplicity. The Essence Tee features custom-milled combed cotton with drop-shoulder architectural drape, reinforced ribbed neckband, and monochrome high-density chest star artwork.",
    specs: {
      weightCategory: "Heavyweight Knit",
      fabric: "100% Combed Heavyweight Indian Cotton",
      fit: "Drop-Shoulder Boxy Silhouette",
      care: "Cold machine wash inside out. Dry in shade. Iron on reverse.",
      origin: "Independent Atelier"
    },
    colors: [
      { name: "Bone White", hex: "#E8E4DA", code: "bone" },
      { name: "Obsidian Black", hex: "#0E0E0E", code: "black" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inventory: {
      "S-Bone White": 16,
      "M-Bone White": 24,
      "L-Bone White": 20,
      "XL-Bone White": 12,
      "XXL-Bone White": 5,
      "S-Obsidian Black": 18,
      "M-Obsidian Black": 25,
      "L-Obsidian Black": 22,
      "XL-Obsidian Black": 14,
      "XXL-Obsidian Black": 6
    },
    images: [
      "/prod-essence-tee.jpg",
      "/prod-stone-peak.jpg"
    ],
    featured: true,
    badge: "NEW ARRIVAL",
    isAvailable: true,
    createdAt: "2026-02-01T00:00:00.000Z"
  },
  {
    id: "tsp-tee-summit",
    name: "Summit Tee",
    handle: "summit-tee",
    category: "t-shirts",
    price: 1499,
    compareAtPrice: 1999,
    shortDesc: "Monumental mountain graphic print on pristine unbleached heavy knit.",
    description: "Carved for the uncommon. The Summit Tee combines raw alpine artwork with high-density textile engineering. Boxy drop-shoulder cut that maintains unyielding structural presence.",
    specs: {
      weightCategory: "Heavyweight Structured",
      fabric: "100% Ring-Spun Compact Cotton",
      fit: "Relaxed Boxy Fit",
      care: "Hand or machine wash gentle. Cool iron. Avoid print area.",
      origin: "Independent Atelier"
    },
    colors: [
      { name: "Bone White", hex: "#E8E4DA", code: "bone" },
      { name: "Obsidian Black", hex: "#0E0E0E", code: "black" },
      { name: "Slate Grey", hex: "#3B3E42", code: "slate" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inventory: {
      "S-Bone White": 15,
      "M-Bone White": 22,
      "L-Bone White": 18,
      "XL-Bone White": 10,
      "XXL-Bone White": 4,
      "S-Obsidian Black": 14,
      "M-Obsidian Black": 20,
      "L-Obsidian Black": 16,
      "XL-Obsidian Black": 8,
      "XXL-Obsidian Black": 3,
      "S-Slate Grey": 12,
      "M-Slate Grey": 18,
      "L-Slate Grey": 14,
      "XL-Slate Grey": 6,
      "XXL-Slate Grey": 2
    },
    images: [
      "/prod-summit-tee.jpg",
      "/prod-echoes.jpg"
    ],
    featured: true,
    badge: "FEATURED",
    isAvailable: true,
    createdAt: "2026-02-02T00:00:00.000Z"
  },
  {
    id: "tsp-hoodie-core",
    name: "Core Hoodie",
    handle: "core-hoodie",
    category: "hoodies",
    price: 2199,
    compareAtPrice: 2899,
    shortDesc: "Ultra-heavy loopback French terry fleece with minimalist star insignia.",
    description: "The definitive flagship hoodie of THE STANE PROJECT. Constructed with dense loopback French terry that holds a dramatic sculptured drape. Zero drawstrings for a clean brutalist neckline, hidden side-entry kangaroo pocket, and ribbed 4-inch wrist cuffs.",
    specs: {
      weightCategory: "Ultra-Heavy Fleece",
      fabric: "100% Premium Heavy French Terry Fleece",
      fit: "Structured Oversized Drop Cut",
      care: "Cold machine wash inside out. Lay flat to dry.",
      origin: "Independent Atelier"
    },
    colors: [
      { name: "Bone White", hex: "#E8E4DA", code: "bone" },
      { name: "Obsidian Black", hex: "#0E0E0E", code: "black" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inventory: {
      "S-Obsidian Black": 15,
      "M-Obsidian Black": 24,
      "L-Obsidian Black": 22,
      "XL-Obsidian Black": 12,
      "XXL-Obsidian Black": 6,
      "S-Bone White": 10,
      "M-Bone White": 16,
      "L-Bone White": 14,
      "XL-Bone White": 8,
      "XXL-Bone White": 3
    },
    images: [
      "/prod-core-hoodie.jpg",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop"
    ],
    featured: true,
    badge: "BESTSELLER",
    isAvailable: true,
    createdAt: "2026-02-03T00:00:00.000Z"
  },
  {
    id: "tsp-hoodie-shadow",
    name: "Shadow Hoodie",
    handle: "shadow-hoodie",
    category: "hoodies",
    price: 2199,
    compareAtPrice: 2899,
    shortDesc: "Unbleached chalk fleece hoodie with stone cross insignia.",
    description: "Architectural boxy cut designed for high-impact presence. Heavyweight brushed loopback interior provides warmth while holding rigid structural lines.",
    specs: {
      weightCategory: "Heavy Brushed Fleece",
      fabric: "100% Heavy Brushed Fleece",
      fit: "Boxy Cropped Silhouette",
      care: "Gentle cycle wash cold. Dry flat.",
      origin: "Independent Atelier"
    },
    colors: [
      { name: "Bone White", hex: "#E8E4DA", code: "bone" },
      { name: "Obsidian Black", hex: "#0E0E0E", code: "black" },
      { name: "Slate Grey", hex: "#3B3E42", code: "slate" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inventory: {
      "S-Bone White": 10,
      "M-Bone White": 18,
      "L-Bone White": 15,
      "XL-Bone White": 8,
      "XXL-Bone White": 3,
      "S-Obsidian Black": 12,
      "M-Obsidian Black": 20,
      "L-Obsidian Black": 16,
      "XL-Obsidian Black": 10,
      "XXL-Obsidian Black": 4,
      "S-Slate Grey": 8,
      "M-Slate Grey": 12,
      "L-Slate Grey": 10,
      "XL-Slate Grey": 5,
      "XXL-Slate Grey": 2
    },
    images: [
      "/prod-shadow-hoodie.jpg",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop"
    ],
    featured: true,
    badge: "ESSENTIAL",
    isAvailable: true,
    createdAt: "2026-02-04T00:00:00.000Z"
  },
  {
    id: "tsp-tee-stone-peak",
    name: "Stone Peak Tee",
    handle: "stone-peak-tee",
    category: "t-shirts",
    price: 1499,
    compareAtPrice: 1999,
    shortDesc: "Heavy combed cotton with monumental stone peak back imprint.",
    description: "Built for brutalist simplicity. Features custom-milled combed cotton with drop-shoulder architectural drape and monochrome stone peak back art.",
    specs: {
      weightCategory: "Heavyweight Knit",
      fabric: "100% Combed Heavyweight Indian Cotton",
      fit: "Drop-Shoulder Boxy Silhouette",
      care: "Cold machine wash inside out. Dry in shade. Iron on reverse.",
      origin: "Independent Atelier"
    },
    colors: [
      { name: "Obsidian Black", hex: "#0E0E0E", code: "black" },
      { name: "Bone White", hex: "#E8E4DA", code: "bone" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inventory: {
      "S-Obsidian Black": 18,
      "M-Obsidian Black": 25,
      "L-Obsidian Black": 20,
      "XL-Obsidian Black": 12,
      "XXL-Obsidian Black": 6
    },
    images: [
      "/prod-stone-peak.jpg"
    ],
    featured: true,
    badge: "POPULAR",
    isAvailable: true,
    createdAt: "2026-02-05T00:00:00.000Z"
  },
  {
    id: "tsp-tee-echoes",
    name: "Echoes Tee",
    handle: "echoes-tee",
    category: "t-shirts",
    price: 1499,
    compareAtPrice: 1999,
    shortDesc: "Pristine chalk-white boxy tee with central monolithic column emblem.",
    description: "Carved for the uncommon. The Echoes Tee provides structured heavyweight drape with zero see-through opacity. High-gauge ribbed collar.",
    specs: {
      weightCategory: "Heavyweight Structured",
      fabric: "100% Ring-Spun Compact Cotton",
      fit: "Relaxed Boxy Fit",
      care: "Hand or machine wash gentle. Cool iron. Avoid print area.",
      origin: "Independent Atelier"
    },
    colors: [
      { name: "Bone White", hex: "#E8E4DA", code: "bone" },
      { name: "Obsidian Black", hex: "#0E0E0E", code: "black" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inventory: {
      "S-Bone White": 14,
      "M-Bone White": 22,
      "L-Bone White": 18,
      "XL-Bone White": 10,
      "XXL-Bone White": 5
    },
    images: [
      "/prod-echoes.jpg"
    ],
    featured: true,
    badge: "SIGNATURE",
    isAvailable: true,
    createdAt: "2026-02-06T00:00:00.000Z"
  },
  {
    id: "tsp-tee-fragment",
    name: "Fragment Tee",
    handle: "fragment-tee",
    category: "t-shirts",
    price: 1499,
    compareAtPrice: 1999,
    shortDesc: "Tactile textured stone fragment art on deep graphite heavy jersey.",
    description: "An understated daily armor piece. Features double-needle cover-stitched seams and thick collar rib.",
    specs: {
      weightCategory: "Heavyweight Bio-Wash",
      fabric: "100% Super-Combed Cotton",
      fit: "Drop-Shoulder Straight Cut",
      care: "Cold wash with dark colors. Dry in shade.",
      origin: "Independent Atelier"
    },
    colors: [
      { name: "Graphite Charcoal", hex: "#1C1C1C", code: "charcoal" },
      { name: "Bone White", hex: "#E8E4DA", code: "bone" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inventory: {
      "S-Graphite Charcoal": 12,
      "M-Graphite Charcoal": 20,
      "L-Graphite Charcoal": 16,
      "XL-Graphite Charcoal": 9,
      "XXL-Graphite Charcoal": 4
    },
    images: [
      "/prod-fragment.jpg"
    ],
    featured: true,
    badge: "LIMITED",
    isAvailable: true,
    createdAt: "2026-02-07T00:00:00.000Z"
  },
  {
    id: "tsp-tee-uncommon",
    name: "Uncommon Tee",
    handle: "uncommon-tee",
    category: "t-shirts",
    price: 1499,
    compareAtPrice: 1999,
    shortDesc: "Signature monolithic weathered print in heavyweight washed black.",
    description: "Carved for the uncommon. Designed with an exaggerated drape, dense ribbed collar, and vertical stone weathering graphic on back.",
    specs: {
      weightCategory: "Heavyweight Bio-Wash",
      fabric: "100% Combed Heavy Cotton",
      fit: "Drop-Shoulder Relaxed",
      care: "Cold wash with dark colors. Do not iron print.",
      origin: "Independent Atelier"
    },
    colors: [
      { name: "Obsidian Black", hex: "#0E0E0E", code: "black" },
      { name: "Bone White", hex: "#E8E4DA", code: "bone" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inventory: {
      "S-Obsidian Black": 14,
      "M-Obsidian Black": 22,
      "L-Obsidian Black": 18,
      "XL-Obsidian Black": 10,
      "XXL-Obsidian Black": 5
    },
    images: [
      "/prod-uncommon.jpg"
    ],
    featured: true,
    badge: "DROP 01",
    isAvailable: true,
    createdAt: "2026-02-08T00:00:00.000Z"
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: "THE STANE PROJECT",
  tagline: "CARVED FOR THE UNCOMMON.",
  location: "Trichy, Tamil Nadu, India",
  whatsappNumber: "918870123806",
  supportEmail: "gracedebritto3@gmail.com",
  freeShippingThreshold: 999,
  standardShippingFee: 99,
  codEnabled: true,
  codFee: 0,
  announcementText: "✦ FREE SHIPPING ON ORDERS ABOVE ₹999 | LIMITED TIME LAUNCH OFFER ✦",
  announcementActive: true,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_StaneDemoKey",
  razorpayEnabled: true,
  adminSecret: process.env.ADMIN_SECRET_KEY || "stane2026"
};
