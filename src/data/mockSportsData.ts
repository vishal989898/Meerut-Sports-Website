import { Product, Category, Brand, Coupon, UPISettings } from "@/types/sports";

export const initialCategories: Category[] = [
  { id: "cat-1", name: "Cricket", slug: "cricket", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80", iconName: "Trophy", itemCount: 24 },
  { id: "cat-2", name: "Football", slug: "football", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80", iconName: "Activity", itemCount: 32 },
  { id: "cat-3", name: "Basketball", slug: "basketball", image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=600&q=80", iconName: "Dribbble", itemCount: 18 },
  { id: "cat-4", name: "Badminton", slug: "badminton", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80", iconName: "Target", itemCount: 15 },
  { id: "cat-5", name: "Tennis", slug: "tennis", image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80", iconName: "CircleDot", itemCount: 12 },
];

export const initialBrands: Brand[] = [
  { id: "b1", name: "SG Cricket", logo: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=100&q=80" },
  { id: "b2", name: "Nike", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80" },
  { id: "b3", name: "Adidas", logo: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=100&q=80" },
  { id: "b4", name: "Puma", logo: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=100&q=80" },
  { id: "b5", name: "Yonex", logo: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=100&q=80" },
];

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Meerut Pro English Willow Cricket Bat",
    brand: "SG Cricket",
    category: "Cricket",
    price: 8499,
    originalPrice: 10999,
    discountPercentage: 22,
    rating: 4.8,
    reviewCount: 42,
    images: [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Crafted from top-tier Grade 1 English Willow directly in Meerut's legendary bat manufacturing cluster. Engineered for explosive stroke play with maximum sweet spot.",
    specifications: {
      "Willow Type": "Grade 1 English Willow",
      "Weight": "1180g - 1220g",
      "Grip": "Chevron Multi-Color",
      "Handle": "9-piece cane handle"
    },
    sizes: ["Short Handle", "Long Handle", "Harrow"],
    colors: ["Natural Wood"],
    stock: 12,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: "prod-2",
    name: "Nike Court Pro Tournament Tennis Racket",
    brand: "Nike",
    category: "Tennis",
    price: 9295,
    originalPrice: 11500,
    discountPercentage: 19,
    rating: 4.9,
    reviewCount: 128,
    images: [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Precision-engineered professional tournament tennis racket. Lightweight carbon frame delivers unmatched speed and top-spin control.",
    specifications: {
      "Frame Material": "High Modulus Carbon Fiber",
      "Head Size": "100 sq in",
      "Unstrung Weight": "300g",
      "Balance": "320mm"
    },
    sizes: ["Grip 2 (4 1/4\")", "Grip 3 (4 3/8\")"],
    colors: ["Neon Green", "Matte Black"],
    stock: 25,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: "prod-3",
    name: "Adidas Predator League FIFA Match Football",
    brand: "Adidas",
    category: "Football",
    price: 2499,
    originalPrice: 3299,
    discountPercentage: 24,
    rating: 4.7,
    reviewCount: 86,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Seamless TSBE construction for true flight and low water absorption. Certified FIFA Quality Pro match ball.",
    specifications: {
      "Material": "100% TPU Cover",
      "Construction": "Seamless Thermal Bonding",
      "Bladder": "Butyl Bladder",
      "Size": "Size 5"
    },
    sizes: ["Size 4", "Size 5"],
    colors: ["White/Solar Red", "Black/Neon Yellow"],
    stock: 18,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    id: "prod-4",
    name: "Yonex Astrox 99 Pro Badminton Racket",
    brand: "Yonex",
    category: "Badminton",
    price: 13990,
    originalPrice: 17500,
    discountPercentage: 20,
    rating: 4.9,
    reviewCount: 54,
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Head-heavy power racket featuring Namd graphite for unbelievable flex and power smash precision.",
    specifications: {
      "Frame Material": "HM Graphite + VOLUME CUT RESIN",
      "Flex": "Stiff",
      "Weight": "4U (83g)",
      "String Tension": "20-28 lbs"
    },
    sizes: ["4U G5", "3U G4"],
    colors: ["Cherry Sunburst", "White Tiger"],
    stock: 8,
    isTrending: true,
  },
  {
    id: "prod-5",
    name: "Spalding NBA Official Composite Basketball",
    brand: "Puma",
    category: "Basketball",
    price: 3199,
    originalPrice: 4200,
    discountPercentage: 23,
    rating: 4.6,
    reviewCount: 61,
    images: [
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Premium composite leather game ball designed for maximum grip, soft feel, and consistent bounce outdoors and indoors.",
    specifications: {
      "Material": "Microfiber Composite Leather",
      "Size": "7 (29.5 Inches)",
      "Surface": "Indoor / Outdoor"
    },
    sizes: ["Size 6", "Size 7"],
    colors: ["Traditional Tan"],
    stock: 14,
    isTrending: true,
  }
];

export const initialCoupons: Coupon[] = [
  { id: "c1", code: "MEERUT10", discountPercent: 10, minOrderAmount: 1000, maxDiscount: 500, expiryDate: "2025-12-31", isActive: true },
  { id: "c2", code: "SPORTS20", discountPercent: 20, minOrderAmount: 3000, maxDiscount: 1500, expiryDate: "2025-12-31", isActive: true },
  { id: "c3", code: "PROFIT500", discountPercent: 15, minOrderAmount: 5000, maxDiscount: 2000, expiryDate: "2025-12-31", isActive: true },
];

export const defaultUPISettings: UPISettings = {
  upiId: "7417031520@pytes",
  merchantName: "Meerut Sports Official Store",
  qrCodeUrl: "/paytm-qr.jpeg",
  instructions: "1. Open Paytm, Google Pay, PhonePe or BHIM UPI app.\n2. Scan this Paytm QR Code or enter UPI ID: 7417031520@pytes\n3. Complete payment for the exact order total.\n4. Copy the 12-digit UTR / Transaction ID and paste below."
};