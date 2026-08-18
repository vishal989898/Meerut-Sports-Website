import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "store.json");

// Ensure data folder exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial default seed dataset
const defaultData = {
  products: [
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
  ],
  categories: [
    { id: "cat-1", name: "Cricket", slug: "cricket", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80", iconName: "Trophy", itemCount: 24 },
    { id: "cat-2", name: "Football", slug: "football", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80", iconName: "Activity", itemCount: 32 },
    { id: "cat-3", name: "Basketball", slug: "basketball", image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=600&q=80", iconName: "Dribbble", itemCount: 18 },
    { id: "cat-4", name: "Badminton", slug: "badminton", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80", iconName: "Target", itemCount: 15 },
    { id: "cat-5", name: "Tennis", slug: "tennis", image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80", iconName: "CircleDot", itemCount: 12 },
  ],
  coupons: [
    { id: "c1", code: "MEERUT10", discountPercent: 10, minOrderAmount: 1000, maxDiscount: 500, expiryDate: "2025-12-31", isActive: true },
    { id: "c2", code: "SPORTS20", discountPercent: 20, minOrderAmount: 3000, maxDiscount: 1500, expiryDate: "2025-12-31", isActive: true },
    { id: "c3", code: "PROFIT500", discountPercent: 15, minOrderAmount: 5000, maxDiscount: 2000, expiryDate: "2025-12-31", isActive: true },
  ],
  upiSettings: {
    upiId: "7417031520@pytes",
    merchantName: "Meerut Sports Official Store",
    qrCodeUrl: "/paytm-qr.jpeg",
    instructions: "1. Open Paytm, Google Pay, PhonePe or BHIM UPI app.\n2. Scan this Paytm QR Code or enter UPI ID: 7417031520@pytes\n3. Complete payment for the exact order total.\n4. Copy the 12-digit UTR / Transaction ID and paste below."
  },
  admin: {
    email: "mohit@sport.in",
    passcode: "Mohit@123"
  },
  orders: [],
  addresses: [],
  users: []
};

// Helper to read database
function readDB(): typeof defaultData {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), "utf8");
      return defaultData;
    }
    const content = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(content);
    return {
      products: Array.isArray(parsed.products) ? parsed.products : defaultData.products,
      categories: Array.isArray(parsed.categories) ? parsed.categories : defaultData.categories,
      coupons: Array.isArray(parsed.coupons) ? parsed.coupons : defaultData.coupons,
      upiSettings: parsed.upiSettings || defaultData.upiSettings,
      admin: parsed.admin || defaultData.admin,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      addresses: Array.isArray(parsed.addresses) ? parsed.addresses : [],
      users: Array.isArray(parsed.users) ? parsed.users : []
    };
  } catch (err) {
    console.error("Error reading database file:", err);
    return defaultData;
  }
}

// Helper to write database
function writeDB(data: typeof defaultData) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

async function startServer() {
  const app = express();

  // Increase payload limit for base64 image uploads from admin panel
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // CORS for development flexibility
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ----------------------------------------------------
  // PRODUCTS API
  // ----------------------------------------------------
  app.get("/api/products", (_req, res) => {
    const db = readDB();
    res.json(db.products);
  });

  app.get("/api/products/:id", (req, res) => {
    const db = readDB();
    const product = db.products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  });

  app.post("/api/products", (req, res) => {
    const db = readDB();
    const newProduct = {
      id: req.body.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: req.body.name || "Untitled Product",
      brand: req.body.brand || "SG Cricket",
      category: req.body.category || "Cricket",
      price: Number(req.body.price) || 0,
      originalPrice: Number(req.body.originalPrice) || Number(req.body.price) || 0,
      discountPercentage: Number(req.body.discountPercentage) || 0,
      rating: Number(req.body.rating) || 4.8,
      reviewCount: Number(req.body.reviewCount) || 1,
      images: Array.isArray(req.body.images) && req.body.images.length > 0
        ? req.body.images
        : ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80"],
      description: req.body.description || "Authentic high quality sports gear.",
      specifications: typeof req.body.specifications === "object" ? req.body.specifications : { "Material": "High Grade" },
      sizes: Array.isArray(req.body.sizes) && req.body.sizes.length > 0 ? req.body.sizes : ["Standard"],
      colors: Array.isArray(req.body.colors) && req.body.colors.length > 0 ? req.body.colors : ["Standard"],
      stock: typeof req.body.stock === "number" ? req.body.stock : 15,
      isFeatured: Boolean(req.body.isFeatured),
      isTrending: Boolean(req.body.isTrending),
      isNewArrival: Boolean(req.body.isNewArrival)
    };

    db.products.unshift(newProduct);
    writeDB(db);
    res.status(201).json(newProduct);
  });

  app.put("/api/products/:id", (req, res) => {
    const db = readDB();
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    db.products[index] = {
      ...db.products[index],
      ...req.body,
      id: req.params.id
    };
    writeDB(db);
    res.json(db.products[index]);
  });

  app.delete("/api/products/:id", (req, res) => {
    const db = readDB();
    const initialLen = db.products.length;
    db.products = db.products.filter((p) => p.id !== req.params.id);
    if (db.products.length === initialLen) {
      return res.status(404).json({ error: "Product not found" });
    }
    writeDB(db);
    res.json({ success: true, id: req.params.id });
  });

  // ----------------------------------------------------
  // CATEGORIES API
  // ----------------------------------------------------
  app.get("/api/categories", (_req, res) => {
    const db = readDB();
    res.json(db.categories);
  });

  app.post("/api/categories", (req, res) => {
    const db = readDB();
    const newCat = {
      id: req.body.id || `cat-${Date.now()}`,
      name: req.body.name,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      image: req.body.image || "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80",
      iconName: req.body.iconName || "Trophy",
      itemCount: Number(req.body.itemCount) || 0
    };

    db.categories.push(newCat);
    writeDB(db);
    res.status(201).json(newCat);
  });

  app.delete("/api/categories/:id", (req, res) => {
    const db = readDB();
    db.categories = db.categories.filter((c) => c.id !== req.params.id);
    writeDB(db);
    res.json({ success: true, id: req.params.id });
  });

  // ----------------------------------------------------
  // COUPONS API
  // ----------------------------------------------------
  app.get("/api/coupons", (_req, res) => {
    const db = readDB();
    res.json(db.coupons);
  });

  app.post("/api/coupons", (req, res) => {
    const db = readDB();
    const newCoupon = {
      id: req.body.id || `cp-${Date.now()}`,
      code: req.body.code.toUpperCase(),
      discountPercent: Number(req.body.discountPercent) || 10,
      minOrderAmount: Number(req.body.minOrderAmount) || 1000,
      maxDiscount: Number(req.body.maxDiscount) || 1000,
      expiryDate: req.body.expiryDate || "2025-12-31",
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true
    };
    db.coupons.unshift(newCoupon);
    writeDB(db);
    res.status(201).json(newCoupon);
  });

  app.delete("/api/coupons/:id", (req, res) => {
    const db = readDB();
    db.coupons = db.coupons.filter((c) => c.id !== req.params.id);
    writeDB(db);
    res.json({ success: true, id: req.params.id });
  });

  // ----------------------------------------------------
  // ORDERS API
  // ----------------------------------------------------
  app.get("/api/orders", (_req, res) => {
    const db = readDB();
    res.json(db.orders);
  });

  app.post("/api/orders", (req, res) => {
    const db = readDB();
    const now = new Date().toISOString();
    const newOrder = {
      id: req.body.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: req.body.userId,
      customerName: req.body.customerName || "Customer",
      customerEmail: req.body.customerEmail || "customer@example.com",
      customerPhone: req.body.customerPhone || "+91 9876543210",
      items: Array.isArray(req.body.items) ? req.body.items : [],
      shippingAddress: req.body.shippingAddress,
      subtotal: Number(req.body.subtotal) || 0,
      discount: Number(req.body.discount) || 0,
      shippingFee: Number(req.body.shippingFee) || 0,
      totalAmount: Number(req.body.totalAmount) || 0,
      couponCode: req.body.couponCode,
      paymentStatus: req.body.paymentStatus || "Pending Verification",
      orderStatus: req.body.orderStatus || "Order Placed",
      paymentDetails: req.body.paymentDetails || {
        upiId: db.upiSettings.upiId,
        utrNumber: req.body.utrNumber || "N/A",
        screenshotUrl: req.body.screenshotUrl,
        submittedAt: now
      },
      createdAt: now,
      updatedAt: now
    };

    // Reduce product stock in database
    if (Array.isArray(newOrder.items)) {
      newOrder.items.forEach((item: CartItem) => {
        const prod = db.products.find((p) => p.id === item.product?.id);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
        }
      });
    }

    db.orders.unshift(newOrder);
    writeDB(db);
    res.status(201).json(newOrder);
  });

  app.patch("/api/orders/:id/status", (req, res) => {
    const db = readDB();
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (req.body.status) {
      order.orderStatus = req.body.status;
    }
    order.updatedAt = new Date().toISOString();
    writeDB(db);
    res.json(order);
  });

  app.post("/api/orders/:id/verify-payment", (req, res) => {
    const db = readDB();
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { approve, reason } = req.body;
    const now = new Date().toISOString();

    if (approve) {
      order.paymentStatus = "Paid";
      order.orderStatus = "Payment Verified";
      order.paymentDetails.verifiedAt = now;
    } else {
      order.paymentStatus = "Rejected";
      order.paymentDetails.rejectedReason = reason || "Payment verification rejected";
    }

    order.updatedAt = now;
    writeDB(db);
    res.json(order);
  });

  app.post("/api/orders/:id/cancel", (req, res) => {
    const db = readDB();
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.orderStatus = "Cancelled";
    order.updatedAt = new Date().toISOString();
    writeDB(db);
    res.json(order);
  });

  // ----------------------------------------------------
  // UPI GATEWAY SETTINGS API
  // ----------------------------------------------------
  app.get("/api/upi-settings", (_req, res) => {
    const db = readDB();
    res.json(db.upiSettings);
  });

  app.put("/api/upi-settings", (req, res) => {
    const db = readDB();
    db.upiSettings = {
      ...db.upiSettings,
      ...req.body
    };
    writeDB(db);
    res.json(db.upiSettings);
  });

  // ----------------------------------------------------
  // ADMIN CREDENTIALS API
  // ----------------------------------------------------
  app.get("/api/admin/config", (_req, res) => {
    const db = readDB();
    res.json({ email: db.admin.email });
  });

  app.post("/api/admin/login", (req, res) => {
    const db = readDB();
    const { email, password } = req.body;
    const isEmailValid = (email || "").trim().toLowerCase() === db.admin.email.trim().toLowerCase();
    const isPasswordValid = password === db.admin.passcode;

    if (isEmailValid && isPasswordValid) {
      res.json({ success: true, message: "Admin authenticated" });
    } else {
      res.status(401).json({ success: false, error: "Invalid Admin Email or Password" });
    }
  });

  app.put("/api/admin/credentials", (req, res) => {
    const db = readDB();
    const { email, passcode } = req.body;
    if (email) db.admin.email = email.trim().toLowerCase();
    if (passcode) db.admin.passcode = passcode.trim();
    writeDB(db);
    res.json({ success: true, email: db.admin.email });
  });

  // ----------------------------------------------------
  // CUSTOMER USERS & ADDRESSES API
  // ----------------------------------------------------
  app.get("/api/users", (_req, res) => {
    const db = readDB();
    // Return users without sensitive password hash
    const safeUsers = db.users.map(({ password: _, ...rest }) => rest);
    res.json(safeUsers);
  });

  app.post("/api/users/register", (req, res) => {
    const db = readDB();
    const { name, email, phone, password, avatar } = req.body;
    const trimmedEmail = (email || "").trim().toLowerCase();

    if (!name || !trimmedEmail || !password) {
      return res.status(400).json({ error: "Missing required registration fields" });
    }

    const existing = db.users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return res.status(400).json({ error: "Account already exists with this email" });
    }

    const newUser = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      phone: phone ? phone.trim() : "+91 9876543210",
      password: password,
      avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    };

    db.users.push(newUser);
    writeDB(db);

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ success: true, user: safeUser });
  });

  app.post("/api/users/login", (req, res) => {
    const db = readDB();
    const { email, password } = req.body;
    const trimmedEmail = (email || "").trim().toLowerCase();

    const user = db.users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!user) {
      return res.status(404).json({ error: "Account not found! Please register first." });
    }

    if (user.password && user.password !== password) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  });

  app.get("/api/addresses", (_req, res) => {
    const db = readDB();
    res.json(db.addresses);
  });

  app.post("/api/addresses", (req, res) => {
    const db = readDB();
    const newAddr = {
      ...req.body,
      id: req.body.id || `addr-${Date.now()}`
    };
    db.addresses.push(newAddr);
    writeDB(db);
    res.status(201).json(newAddr);
  });

  app.delete("/api/addresses/:id", (req, res) => {
    const db = readDB();
    db.addresses = db.addresses.filter((a) => a.id !== req.params.id);
    writeDB(db);
    res.json({ success: true, id: req.params.id });
  });

  // ----------------------------------------------------
  // VITE / STATIC CLIENT MIDDLEWARE
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MEERUTSPORTS full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server startup error:", err);
});
