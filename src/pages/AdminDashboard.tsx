import React, { useState, useEffect } from "react";
import { useSports } from "@/context/SportsContext";
import { Order, OrderStatus } from "@/types/sports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, QrCode, CheckCircle2, XCircle, Database, Plus, Trash2, KeyRound, LogOut, Lock, Mail, Eye, EyeOff, Clock, Upload, ImageIcon, LinkIcon, X, MapPin, PackageCheck, ShoppingBag, ArrowRight, ExternalLink, ChevronRight, Phone, User, RefreshCw, Loader2, Layers, Sparkles, Check 
} from "lucide-react";
import { toast } from "sonner";

export const AdminDashboard: React.FC = () => {
  const { 
    isAdmin, adminLogin, adminLogout, adminEmail, updateAdminCredentials,
    products, categories, allOrders, coupons, upiSettings, 
    verifyPayment, updateOrderStatus, addProduct, deleteProduct, 
    addCategory, deleteCategory, addCoupon, deleteCoupon, updateUPISettings,
    refreshProductsFromSupabase, isLoadingProducts 
  } = useSports();

  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'orders' | 'products' | 'categories' | 'coupons' | 'settings'>('overview');

  // Selected Order for Full Details Modal
  const [selectedOrderModal, setSelectedOrderModal] = useState<Order | null>(null);

  // Login form state for unauthenticated users
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // New Product Form State
  const [showAddProd, setShowAddProd] = useState(false);
  const [isSavingProd, setIsSavingProd] = useState(false);
  const [newProd, setNewProd] = useState({
    name: "",
    brand: "SG Cricket",
    category: "Cricket",
    price: 2999,
    originalPrice: 3999,
    discountPercentage: 25,
    stock: 20,
    images: [] as string[],
    description: "High quality professional sports gear crafted in Meerut.",
    specifications: { "Material": "Premium Composite" },
    sizes: ["Standard"],
    colors: ["Black"]
  });

  // State for image URL input option
  const [imageUrlInput, setImageUrlInput] = useState("");

  // New Category Form State
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState("https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80");
  const [catImageUrlInput, setCatImageUrlInput] = useState("");

  // UPI Settings Form State
  const [upiForm, setUpiForm] = useState(upiSettings);

  // Keep upiForm in sync when upiSettings updates
  useEffect(() => {
    setUpiForm(upiSettings);
  }, [upiSettings]);

  // Passcode update form state
  const [newAdminEmail, setNewAdminEmail] = useState(adminEmail);
  const [newAdminPasscode, setNewAdminPasscode] = useState("");

  // New Coupon Form
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercent: 15,
    minOrderAmount: 2000,
    maxDiscount: 1000,
    expiryDate: "2025-12-31",
    isActive: true
  });

  // Lockout countdown timer for direct login
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  // Handle local image file upload for Product
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload valid image files (PNG, JPG, WEBP)");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setNewProd((prev) => ({
            ...prev,
            images: [...prev.images, result],
          }));
          toast.success(`Uploaded ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // Handle local image file upload for Category
  const handleCategoryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setNewCatImage(result);
        toast.success("Category banner uploaded!");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Handle local QR code image file upload for UPI Gateway
  const handleQRFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, JPEG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setUpiForm((prev) => ({
          ...prev,
          qrCodeUrl: result
        }));
        toast.success("New UPI QR Code image loaded! Click 'Save Gateway Settings' to apply.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Handle manual image URL addition for Product
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    try {
      new URL(imageUrlInput.trim());
      setNewProd((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()],
      }));
      setImageUrlInput("");
      toast.success("Image URL added!");
    } catch {
      toast.error("Please enter a valid Image URL");
    }
  };

  // Handle manual image URL for Category
  const handleAddCategoryImageUrl = () => {
    if (!catImageUrlInput.trim()) return;
    try {
      new URL(catImageUrlInput.trim());
      setNewCatImage(catImageUrlInput.trim());
      setCatImageUrlInput("");
      toast.success("Category image set from URL!");
    } catch {
      toast.error("Please enter a valid Image URL");
    }
  };

  // Remove image from draft product
  const handleRemoveImage = (indexToRemove: number) => {
    setNewProd((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
    toast.info("Image removed");
  };

  // If not logged in as Admin, show direct login screen with rate-limiting
  if (!isAdmin) {
    const handleDirectLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (lockoutTime > 0) return;

      const ok = adminLogin(loginEmail, loginPass);
      if (ok) {
        setLoginEmail("");
        setLoginPass("");
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 3) {
          setLockoutTime(60);
          setFailedAttempts(0);
          toast.error("Security Lockout: Too many failed admin login attempts.");
        }
      }
    };

    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="h-16 w-16 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <ShieldCheck className="h-10 w-10 text-slate-950" />
          </div>

          <div>
            <h1 className="text-2xl font-black uppercase text-white">Admin Authentication</h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter authorized admin email & password to manage orders and payment gateways.
            </p>
          </div>

          <form onSubmit={handleDirectLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Admin Email
              </Label>
              <Input
                type="email"
                placeholder="mohit@sport.in"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                disabled={lockoutTime > 0}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-5 text-sm focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Admin Password
              </Label>
              <div className="relative">
                <Input
                  type={showLoginPass ? "text" : "password"}
                  placeholder="Enter password..."
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  disabled={lockoutTime > 0}
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-5 pr-10 text-sm focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400"
                >
                  {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {lockoutTime > 0 && (
              <div className="bg-red-950/80 border border-red-800 text-red-200 p-3 rounded-xl text-xs flex items-center justify-center gap-2 font-bold">
                <Clock className="h-4 w-4 text-red-400 animate-spin" />
                <span>Locked out for {lockoutTime}s</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={lockoutTime > 0}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-6 rounded-2xl shadow-xl text-sm disabled:opacity-50"
            >
              {lockoutTime > 0 ? `Locked (${lockoutTime}s)` : "Login to Admin Panel"}
            </Button>
          </form>

          <div className="text-[11px] text-slate-500">
            Protected with SSL Encryption & Rate Limiting
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics using global orders
  const totalRevenue = allOrders
    .filter(o => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingPayments = allOrders.filter(o => o.paymentStatus === "Pending Verification");

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || newProd.price <= 0) {
      toast.error("Please provide product name and valid price");
      return;
    }

    setIsSavingProd(true);
    const finalImages = newProd.images.length > 0 
      ? newProd.images 
      : ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80"];

    await addProduct({
      ...newProd,
      images: finalImages,
      rating: 4.8,
      reviewCount: 1,
    });

    setIsSavingProd(false);
    setNewProd({
      name: "",
      brand: "SG Cricket",
      category: categories[0]?.name || "Cricket",
      price: 2999,
      originalPrice: 3999,
      discountPercentage: 25,
      stock: 20,
      images: [],
      description: "High quality professional sports gear crafted in Meerut.",
      specifications: { "Material": "Premium Composite" },
      sizes: ["Standard"],
      colors: ["Black"]
    });
    setImageUrlInput("");
    setShowAddProd(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      toast.error("Please enter a category name");
      return;
    }

    // Check duplicate
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("A category with this name already exists");
      return;
    }

    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    addCategory({
      name: trimmed,
      slug,
      image: newCatImage || "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80",
      iconName: "Trophy",
      itemCount: 0
    });

    setNewCatName("");
    setNewCatImage("https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80");
    setCatImageUrlInput("");
    setShowAddCategory(false);
  };

  const handleSaveUPISettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateUPISettings(upiForm);
  };

  const handleCredentialsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminCredentials(newAdminEmail, newAdminPasscode || "Mohit@123");
    setNewAdminPasscode("");
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    addCoupon(newCoupon);
    setNewCoupon({ code: "", discountPercent: 15, minOrderAmount: 2000, maxDiscount: 1000, expiryDate: "2025-12-31", isActive: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>AUTHENTICATED SECURED CONTROL PANEL</span>
          </div>
          <h1 className="text-3xl font-black uppercase text-white mt-1">Meerut Sports Admin Center</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={adminLogout} variant="destructive" className="font-bold text-xs rounded-xl gap-1.5">
            <LogOut className="h-4 w-4" /> Logout Admin
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'overview' ? "bg-slate-900 text-amber-400" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Dashboard Overview
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all relative ${
            activeTab === 'payments' ? "bg-slate-900 text-amber-400" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          UPI Verifications
          {pendingPayments.length > 0 && (
            <Badge className="ml-2 bg-amber-500 text-slate-950 px-1.5 py-0.2 text-[10px] rounded-full">
              {pendingPayments.length}
            </Badge>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'orders' ? "bg-slate-900 text-amber-400" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Order Fulfillment ({allOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'products' ? "bg-slate-900 text-amber-400" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Products Catalog ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'categories' ? "bg-slate-900 text-amber-400" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'coupons' ? "bg-slate-900 text-amber-400" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Coupons
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'settings' ? "bg-slate-900 text-amber-400" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Gateway & Security Config
        </button>
      </div>

      {/* Tab Content */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Verified Revenue Card */}
            <div 
              onClick={() => setActiveTab('orders')}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer group space-y-2 relative overflow-hidden"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Revenue</span>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
              </div>
              <p className="text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</p>
              <span className="text-[10px] text-amber-600 font-bold group-hover:underline block">Click to view order records →</span>
            </div>

            {/* TOTAL ORDERS CARD */}
            <div 
              onClick={() => setActiveTab('orders')}
              className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all cursor-pointer group space-y-2 relative"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <PackageCheck className="h-4 w-4 text-amber-500" /> TOTAL ORDERS
                </span>
                <ExternalLink className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tight">{allOrders.length}</p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:text-amber-600">
                <span>View All Orders & Shipping Addresses</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pending Verification Card */}
            <div 
              onClick={() => setActiveTab('payments')}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer group space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Verification</span>
                <QrCode className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-amber-600">{pendingPayments.length}</p>
              <span className="text-[10px] text-amber-600 font-bold group-hover:underline block">Click to verify UPI UTR codes →</span>
            </div>

            {/* Cloud Products Card */}
            <div 
              onClick={() => setActiveTab('products')}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Products</span>
                <Database className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">{products.length}</p>
              <span className="text-[10px] text-blue-600 font-bold group-hover:underline block">View Catalog →</span>
            </div>
          </div>

          {/* Quick Pending List */}
          {pendingPayments.length > 0 && (
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 space-y-4">
              <h3 className="font-bold text-amber-900 text-base flex items-center gap-2">
                <QrCode className="h-5 w-5 text-amber-600" /> Pending UPI Payments to Approve
              </h3>
              <div className="space-y-3">
                {pendingPayments.map(ord => (
                  <div key={ord.id} className="bg-white p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-sm">
                    <div>
                      <p className="font-bold text-slate-900">Order #{ord.id} • {ord.customerName}</p>
                      <p className="text-slate-500">
                        UTR: <strong className="text-slate-900 font-mono">{ord.paymentDetails.utrNumber}</strong> • Amount: ₹{ord.totalAmount}
                      </p>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-amber-600" /> Deliver to: {ord.shippingAddress.street}, {ord.shippingAddress.city} ({ord.shippingAddress.pincode})
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => verifyPayment(ord.id, true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl">
                        Approve Payment
                      </Button>
                      <Button onClick={() => verifyPayment(ord.id, false, "UTR mismatched")} variant="destructive" className="font-bold text-xs rounded-xl">
                        Reject
                      </Button>
                      <Button onClick={() => setSelectedOrderModal(ord)} variant="outline" className="text-xs font-bold rounded-xl">
                        Full Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-slate-900 uppercase">Manual UPI Payment Verifications</h2>
          <div className="space-y-4">
            {allOrders.map(ord => (
              <div key={ord.id} className="p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm hover:border-slate-300 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 text-xs">
                  <span className="font-bold text-slate-900 text-sm">Order #{ord.id} ({ord.customerName})</span>
                  <div className="flex items-center gap-2">
                    <Badge className={ord.paymentStatus === "Paid" ? "bg-emerald-600" : ord.paymentStatus === "Rejected" ? "bg-red-600" : "bg-amber-500 text-slate-950"}>
                      {ord.paymentStatus}
                    </Badge>
                    <Button onClick={() => setSelectedOrderModal(ord)} size="sm" variant="ghost" className="text-xs font-bold text-blue-600">
                      View Full Details & Address →
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[10px]">UTR / Transaction ID</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{ord.paymentDetails.utrNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Total Amount</span>
                    <span className="font-black text-slate-900 text-sm">₹{ord.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Shipping Destination</span>
                    <span className="font-bold text-slate-800">{ord.shippingAddress.fullName} ({ord.shippingAddress.city}, {ord.shippingAddress.state})</span>
                  </div>
                </div>

                {ord.paymentStatus === "Pending Verification" && (
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => verifyPayment(ord.id, true)} className="bg-emerald-600 text-white font-bold text-xs rounded-xl">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Approve & Mark Paid
                    </Button>
                    <Button onClick={() => verifyPayment(ord.id, false, "Invalid UTR")} variant="destructive" className="font-bold text-xs rounded-xl">
                      <XCircle className="h-4 w-4 mr-1" /> Reject Payment
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase">Order Fulfillment & Delivery Details</h2>
              <p className="text-xs text-slate-500">
                Viewing all {allOrders.length} placed customer order(s) with full shipping address and live fulfillment status controls.
              </p>
            </div>
            <Badge className="bg-slate-900 text-amber-400 font-bold px-3 py-1.5 text-xs rounded-xl">
              Total Recorded Orders: {allOrders.length}
            </Badge>
          </div>

          <div className="space-y-6">
            {allOrders.map(ord => (
              <div 
                key={ord.id} 
                className="p-6 rounded-3xl border-2 border-slate-200 bg-white hover:border-amber-400 transition-all shadow-md space-y-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono font-black text-slate-900">#{ord.id}</span>
                      <Badge className={ord.paymentStatus === "Paid" ? "bg-emerald-600" : ord.paymentStatus === "Rejected" ? "bg-red-600" : "bg-amber-500 text-slate-950"}>
                        {ord.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Placed on {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-bold">Grand Total</span>
                      <span className="text-xl font-black text-amber-600">₹{ord.totalAmount.toLocaleString("en-IN")}</span>
                    </div>

                    {/* Status Dropdown */}
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Update Status</span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="border-2 border-slate-300 rounded-xl px-3 py-1.5 font-bold text-xs bg-slate-50 text-slate-900 focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Payment Verified">Payment Verified</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Details Grid: Customer Info & Shipping Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  
                  {/* Customer Information */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-blue-600" /> Customer Information
                    </h4>
                    <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900 text-sm">{ord.customerName}</p>
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> {ord.customerEmail}
                      </p>
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" /> {ord.customerPhone}
                      </p>
                    </div>
                  </div>

                  {/* Complete Shipping Address */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-amber-600" /> Full Delivery Address
                    </h4>
                    <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900">{ord.shippingAddress.fullName}</p>
                      <p className="text-slate-700 font-medium">{ord.shippingAddress.street}</p>
                      <p className="text-slate-700 font-medium">
                        {ord.shippingAddress.city}, {ord.shippingAddress.state} - <strong className="text-slate-900">{ord.shippingAddress.pincode}</strong>
                      </p>
                      <p className="text-slate-500 text-[11px] pt-1 border-t mt-1">
                        Contact Phone: <strong className="text-slate-800">{ord.shippingAddress.phone}</strong>
                      </p>
                    </div>
                  </div>

                </div>

                {/* Ordered Items Preview */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                    <ShoppingBag className="h-4 w-4 text-amber-500" /> Purchased Gear Items ({ord.items.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="h-12 w-12 object-cover rounded-lg border bg-slate-100 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 line-clamp-1">{item.product.name}</p>
                          <p className="text-slate-500 text-[11px]">Variant: {item.selectedSize} | Qty: {item.quantity}</p>
                          <p className="font-bold text-amber-600">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Bar & Action */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="text-xs text-slate-500 font-mono">
                    UPI UTR: <strong className="text-slate-900">{ord.paymentDetails.utrNumber}</strong>
                  </div>

                  <Button 
                    onClick={() => setSelectedOrderModal(ord)} 
                    variant="outline"
                    className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View Full Printable Order Sheet
                  </Button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase">Product Catalog</h2>
              <p className="text-xs text-slate-500">Manage all products available in your store.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={refreshProductsFromSupabase} 
                variant="outline" 
                disabled={isLoadingProducts}
                className="text-xs font-bold rounded-xl gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingProducts ? "animate-spin" : ""}`} /> 
                Refresh Catalog
              </Button>
              <Button onClick={() => setShowAddProd(!showAddProd)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs gap-1">
                <Plus className="h-4 w-4" /> Add New Sports Gear
              </Button>
            </div>
          </div>

          {showAddProd && (
            <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-3xl border-2 border-amber-400 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-600" /> Add Product to Catalog
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold text-slate-700 uppercase">Product Title</Label>
                  <Input value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} placeholder="e.g. English Willow Bat" required className="text-xs rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700 uppercase">Category</Label>
                  <select value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white mt-1">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-bold text-slate-700 uppercase">Price (₹)</Label>
                  <Input type="number" value={newProd.price} onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} className="text-xs rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700 uppercase">Original Price (₹)</Label>
                  <Input type="number" value={newProd.originalPrice} onChange={e => setNewProd({...newProd, originalPrice: Number(e.target.value)})} className="text-xs rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700 uppercase">Stock Quantity</Label>
                  <Input type="number" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: Number(e.target.value)})} className="text-xs rounded-xl mt-1" />
                </div>
              </div>

              {/* IMAGE UPLOAD & PREVIEW SECTION */}
              <div className="space-y-3 border-t pt-4 border-slate-100">
                <Label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-amber-500" /> Product Images Upload & Preview
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Local File Upload Box */}
                  <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/50 hover:bg-amber-50/20 rounded-2xl p-4 text-center transition-all cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-1">
                      <div className="bg-amber-100 text-amber-700 h-10 w-10 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">Click or Drag & Drop Image Files</p>
                      <p className="text-[10px] text-slate-400">Supports PNG, JPG, WEBP formats</p>
                    </div>
                  </div>

                  {/* Or Enter Image URL */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <Label className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
                      <LinkIcon className="h-3.5 w-3.5 text-blue-600" /> Add Image by URL Link
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="text-xs rounded-xl bg-white"
                      />
                      <Button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="bg-slate-900 text-white font-bold text-xs rounded-xl px-4"
                      >
                        Add URL
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Uploaded Images Preview Grid */}
                {newProd.images.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Selected Images ({newProd.images.length}):
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {newProd.images.map((imgSrc, index) => (
                        <div
                          key={index}
                          className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-slate-200 group shadow-sm bg-slate-100"
                        >
                          <img
                            src={imgSrc}
                            alt={`Product preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition-colors"
                            title="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-slate-950 text-[9px] font-extrabold text-center py-0.5">
                              Main Image
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    * If no image is uploaded, a default sports placeholder image will be assigned automatically.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSavingProd}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl px-6 py-5 gap-2"
                >
                  {isSavingProd ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-amber-400" /> Saving Product...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 text-amber-400" /> Save Product to Store
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs shadow-sm">
                <img src={p.images[0]} alt={p.name} className="h-12 w-12 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                  <p className="text-slate-500">₹{p.price} • Stock: {p.stock}</p>
                </div>
                <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORIES (WITH OPTION TO ADD NEW CATEGORY) */}
      {activeTab === 'categories' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                <Layers className="h-5 w-5 text-amber-500" /> Sports Categories ({categories.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage navigation categories and create new sports categories with custom banner images.
              </p>
            </div>

            <Button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs gap-1.5 shadow-md self-start sm:self-auto"
            >
              {showAddCategory ? (
                <>
                  <X className="h-4 w-4" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add New Category
                </>
              )}
            </Button>
          </div>

          {/* ADD CATEGORY FORM ACCORDION */}
          {showAddCategory && (
            <form onSubmit={handleCreateCategory} className="bg-slate-50 p-6 rounded-3xl border-2 border-amber-400 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-black text-slate-900 text-sm uppercase flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" /> Create New Sports Category
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-800 uppercase">
                      Category Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. Volleyball, Swimming, Table Tennis..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      required
                      className="text-xs rounded-xl bg-white border-slate-300 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1">
                      <LinkIcon className="h-3.5 w-3.5 text-blue-600" /> Image URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={catImageUrlInput}
                        onChange={(e) => setCatImageUrlInput(e.target.value)}
                        className="text-xs rounded-xl bg-white"
                      />
                      <Button
                        type="button"
                        onClick={handleAddCategoryImageUrl}
                        className="bg-slate-900 text-white font-bold text-xs rounded-xl px-4"
                      >
                        Set URL
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1">
                      <Upload className="h-3.5 w-3.5 text-amber-500" /> Or Upload Image File
                    </Label>
                    <label className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm w-full justify-center">
                      <Upload className="h-4 w-4 text-amber-600" /> Choose Category Image File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Banner Preview */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800 uppercase">Category Card Live Preview</Label>
                  <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white aspect-[4/3] border border-slate-300 shadow-md max-w-xs mx-auto flex items-end p-4">
                    <img
                      src={newCatImage}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <div>
                        <h4 className="font-black text-white text-base leading-tight">
                          {newCatName.trim() || "Category Name"}
                        </h4>
                        <p className="text-[11px] text-slate-300 font-medium">0+ Products</p>
                      </div>
                      <div className="bg-amber-500 text-slate-950 p-1.5 rounded-full">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-200">
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl px-6 py-5 shadow-md gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Save New Category
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddCategory(false)}
                  className="text-xs font-bold rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* CATEGORIES PILLS & CARDS GRID */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-600 tracking-wider">
              Active Store Categories ({categories.length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={c.image || "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=150&q=80"}
                      alt={c.name}
                      className="h-12 w-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0">
                      <span className="font-black text-slate-900 text-sm block truncate group-hover:text-amber-600 transition-colors">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Slug: /{c.slug}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all shrink-0"
                    title={`Delete ${c.name} category`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-slate-900 uppercase">Coupon Management</h2>
          <form onSubmit={handleCreateCoupon} className="flex gap-3">
            <Input placeholder="Coupon Code (e.g. FLAT30)" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="text-xs uppercase font-bold" />
            <Input type="number" placeholder="Discount %" value={newCoupon.discountPercent} onChange={e => setNewCoupon({...newCoupon, discountPercent: Number(e.target.value)})} className="text-xs w-24" />
            <Button type="submit" className="bg-slate-900 text-white font-bold text-xs rounded-xl">Add Coupon</Button>
          </form>

          <div className="space-y-2">
            {coupons.map(c => (
              <div key={c.id} className="p-3 rounded-xl border flex items-center justify-between text-xs font-bold">
                <span>{c.code} ({c.discountPercent}% OFF)</span>
                <button onClick={() => deleteCoupon(c.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SETTINGS (UPDATED WITH IMAGE UPLOAD FOR UPI QR) */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* UPI Gateway Settings */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                <QrCode className="h-5 w-5 text-amber-500" /> Seller UPI Gateway Configuration
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize your merchant UPI ID and upload/change the official payment QR code displayed to customers during checkout.
              </p>
            </div>

            <form onSubmit={handleSaveUPISettings} className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-slate-700">Merchant Name</Label>
                <Input 
                  value={upiForm.merchantName} 
                  onChange={e => setUpiForm({...upiForm, merchantName: e.target.value})} 
                  placeholder="Meerut Sports Official"
                  className="text-xs font-semibold rounded-xl" 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-slate-700">Merchant UPI ID (VPA)</Label>
                <Input 
                  value={upiForm.upiId} 
                  onChange={e => setUpiForm({...upiForm, upiId: e.target.value})} 
                  placeholder="e.g. 7417031520@pytes"
                  className="text-xs font-mono font-bold rounded-xl" 
                />
              </div>

              {/* QR CODE UPLOAD & URL SECTION */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <Label className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-amber-500" /> Payment QR Code Image
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  
                  {/* File Upload Box */}
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50/30 rounded-2xl cursor-pointer transition-all text-center">
                      <div className="bg-amber-100 text-amber-600 p-2.5 rounded-full mb-1.5">
                        <Upload className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Upload QR Image File</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, JPEG or WEBP</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleQRFileUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {/* QR Image Live Preview */}
                  <div className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">Live QR Preview</span>
                    <div className="h-28 w-28 rounded-xl overflow-hidden border-2 border-amber-400/80 p-1 bg-white shadow-inner flex items-center justify-center">
                      <img 
                        src={upiForm.qrCodeUrl || "/paytm-qr.jpeg"} 
                        alt="UPI QR Code Preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>

                </div>

                {/* QR Image URL input */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                  <Label className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
                    <LinkIcon className="h-3.5 w-3.5 text-blue-600" /> Or Enter QR Image URL
                  </Label>
                  <Input 
                    value={upiForm.qrCodeUrl} 
                    onChange={e => setUpiForm({...upiForm, qrCodeUrl: e.target.value})} 
                    placeholder="e.g. /paytm-qr.jpeg or https://..."
                    className="text-xs rounded-xl bg-white" 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-5 rounded-xl shadow-md gap-1.5">
                <Check className="h-4 w-4" /> Save Gateway Settings
              </Button>
            </form>
          </div>

          {/* Change Admin Password */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-500" /> Admin Security Settings
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Update the authorized admin portal login credentials.
              </p>
            </div>

            <form onSubmit={handleCredentialsUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-slate-700">Admin Email</Label>
                <Input
                  type="email"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  className="text-xs font-medium rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-slate-700">New Admin Password</Label>
                <Input
                  type="password"
                  placeholder="Leave blank to keep current..."
                  value={newAdminPasscode}
                  onChange={e => setNewAdminPasscode(e.target.value)}
                  className="text-xs rounded-xl"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Policy requirement: Minimum 6 characters.
                </p>
              </div>
              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-5 rounded-xl">
                Update Admin Credentials
              </Button>
            </form>
          </div>

        </div>
      )}

      {/* FULL ORDER DETAILS MODAL FOR DEEP INSPECTION */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 border border-slate-200 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase">Printable Order Sheet</span>
                <h3 className="text-xl font-black text-slate-900">Order #{selectedOrderModal.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrderModal(null)} 
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Address Box */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
              <h4 className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-amber-600" /> Shipping Destination Label
              </h4>
              <div className="text-xs text-slate-800 leading-relaxed font-medium">
                <p className="font-extrabold text-slate-900 text-sm">{selectedOrderModal.shippingAddress.fullName}</p>
                <p>{selectedOrderModal.shippingAddress.street}</p>
                <p>{selectedOrderModal.shippingAddress.city}, {selectedOrderModal.shippingAddress.state} - {selectedOrderModal.shippingAddress.pincode}</p>
                <p className="pt-1 font-bold text-slate-900">Phone: {selectedOrderModal.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border">
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Email</span>
                <span className="font-bold text-slate-900">{selectedOrderModal.customerEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Payment Method</span>
                <span className="font-bold text-slate-900">Manual UPI (UTR: {selectedOrderModal.paymentDetails.utrNumber})</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-700">Order Items</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrderModal.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt={item.product.name} className="h-10 w-10 object-cover rounded-md border" />
                      <div>
                        <p className="font-bold text-slate-900">{item.product.name}</p>
                        <p className="text-slate-500">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="border-t pt-3 space-y-1 text-xs">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{selectedOrderModal.subtotal.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-emerald-600 font-bold"><span>Discount</span><span>-₹{selectedOrderModal.discount}</span></div>
              <div className="flex justify-between"><span>Shipping Fee</span><span>₹{selectedOrderModal.shippingFee}</span></div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-1 border-t"><span>Total Amount</span><span className="text-amber-600">₹{selectedOrderModal.totalAmount.toLocaleString("en-IN")}</span></div>
            </div>

            <div className="pt-2">
              <Button onClick={() => setSelectedOrderModal(null)} className="w-full bg-slate-900 text-white font-bold text-xs rounded-xl py-4">
                Close Order Sheet
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};