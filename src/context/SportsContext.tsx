import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { 
  Product, Category, Brand, CartItem, Address, Order, Coupon, UPISettings, OrderStatus, PaymentStatus 
} from "@/types/sports";
import { 
  initialProducts, initialCategories, initialBrands, initialCoupons, defaultUPISettings 
} from "@/data/mockSportsData";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  password?: string;
}

interface SportsContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  coupons: Coupon[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  allOrders: Order[];
  addresses: Address[];
  allAddresses: Address[];
  upiSettings: UPISettings;
  appliedCoupon: Coupon | null;
  isAdmin: boolean;
  isAdminLoginModalOpen: boolean;
  userRole: 'customer' | 'admin';
  adminEmail: string;
  supabaseConnected: boolean;
  isLoadingAuth: boolean;
  isLoadingProducts: boolean;
  
  // Customer Auth
  customerUser: CustomerUser | null;
  supabaseAuthUser: SupabaseUser | null;
  loginCustomer: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  registerCustomer: (data: { name: string; email: string; phone: string; password: string; avatar?: string }) => Promise<{ success: boolean; message?: string }>;
  logoutCustomer: () => Promise<void>;
  currentUser: CustomerUser | null;
  
  // Admin Auth Actions
  adminLogin: (email: string, password: string) => Promise<boolean> | boolean;
  adminLogout: () => void;
  updateAdminCredentials: (newEmail: string, newPasscode: string) => Promise<void>;
  openAdminLoginModal: () => void;
  closeAdminLoginModal: () => void;
  toggleAdminView: () => void;
  
  // Cart Actions
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Wishlist Actions
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Address Actions
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  
  // Order & UPI Actions
  placeOrderWithUPI: (
    shippingAddress: Address, 
    utrNumber: string, 
    screenshotUrl?: string
  ) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  
  // Admin / Product Database Actions
  refreshProductsFromSupabase: () => Promise<void>;
  verifyPayment: (orderId: string, approve: boolean, reason?: string) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<Product | null>;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addCoupon: (coupon: Omit<Coupon, "id">) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  updateUPISettings: (settings: Partial<UPISettings>) => Promise<void>;
}

const SportsContext = createContext<SportsContextType | undefined>(undefined);

export const SportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("apex_products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("apex_categories");
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [brands] = useState<Brand[]>(initialBrands);
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("apex_coupons");
    return saved ? JSON.parse(saved) : initialCoupons;
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [supabaseConnected] = useState<boolean>(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  // Registered Customer Database
  const [registeredUsers, setRegisteredUsers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem("apex_registered_users");
    return saved ? JSON.parse(saved) : [];
  });

  // Current Active Customer Profile State
  const [supabaseAuthUser, setSupabaseAuthUser] = useState<SupabaseUser | null>(null);
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem("apex_customer_user");
    return saved ? JSON.parse(saved) : null;
  });

  // User-scoped storage key helper
  const getUserScopeKey = useCallback((prefix: string) => {
    if (customerUser?.email) {
      return `${prefix}_${customerUser.email.toLowerCase()}`;
    }
    return `${prefix}_guest`;
  }, [customerUser?.email]);

  // Cart scoped per active user
  const [cart, setCart] = useState<CartItem[]>(() => {
    const key = customerUser?.email ? `apex_cart_${customerUser.email.toLowerCase()}` : "apex_cart_guest";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist scoped per active user
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const key = customerUser?.email ? `apex_wishlist_${customerUser.email.toLowerCase()}` : "apex_wishlist_guest";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // All Addresses stored
  const [allAddresses, setAllAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem("apex_all_addresses");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // All Orders stored
  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("apex_orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [upiSettings, setUpiSettings] = useState<UPISettings>(() => {
    const saved = localStorage.getItem("apex_upi_settings");
    return saved ? JSON.parse(saved) : defaultUPISettings;
  });

  // Admin Auth States
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("apex_is_admin") === "true";
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem("apex_admin_email") || "mohit@sport.in";
  });

  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    return localStorage.getItem("apex_admin_passcode") || "Mohit@123";
  });

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Sync state to local cache for instant offline UI
  useEffect(() => {
    localStorage.setItem("apex_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("apex_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("apex_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem("apex_orders", JSON.stringify(allOrders));
  }, [allOrders]);

  useEffect(() => {
    localStorage.setItem("apex_all_addresses", JSON.stringify(allAddresses));
  }, [allAddresses]);

  useEffect(() => {
    localStorage.setItem("apex_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem("apex_upi_settings", JSON.stringify(upiSettings));
  }, [upiSettings]);

  useEffect(() => {
    localStorage.setItem("apex_is_admin", isAdmin ? "true" : "false");
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem("apex_admin_email", adminEmail);
  }, [adminEmail]);

  useEffect(() => {
    localStorage.setItem("apex_admin_passcode", adminPasscode);
  }, [adminPasscode]);

  // When active user switches, re-load their respective Cart & Wishlist
  useEffect(() => {
    if (customerUser?.email) {
      const userCartKey = `apex_cart_${customerUser.email.toLowerCase()}`;
      const savedCart = localStorage.getItem(userCartKey);
      setCart(savedCart ? JSON.parse(savedCart) : []);

      const userWishlistKey = `apex_wishlist_${customerUser.email.toLowerCase()}`;
      const savedWishlist = localStorage.getItem(userWishlistKey);
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    } else {
      const guestCart = localStorage.getItem("apex_cart_guest");
      setCart(guestCart ? JSON.parse(guestCart) : []);
      const guestWishlist = localStorage.getItem("apex_wishlist_guest");
      setWishlist(guestWishlist ? JSON.parse(guestWishlist) : []);
    }
  }, [customerUser?.email]);

  // Save Cart
  useEffect(() => {
    const key = getUserScopeKey("apex_cart");
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, getUserScopeKey]);

  // Save Wishlist
  useEffect(() => {
    const key = getUserScopeKey("apex_wishlist");
    localStorage.setItem(key, JSON.stringify(wishlist));
  }, [wishlist, getUserScopeKey]);

  // Filtered Addresses: STRICTLY scoped to current logged-in user!
  const userAddresses = useMemo(() => {
    if (!customerUser) return [];
    return allAddresses.filter(addr => {
      const emailMatches = addr.userEmail && addr.userEmail.toLowerCase() === customerUser.email.toLowerCase();
      const idMatches = addr.userId && addr.userId === customerUser.id;
      return emailMatches || idMatches;
    });
  }, [allAddresses, customerUser]);

  // Filtered Orders: Customer only sees their OWN orders
  const userOrders = useMemo(() => {
    if (!customerUser) return [];
    return allOrders.filter(ord => {
      const emailMatches = ord.customerEmail && ord.customerEmail.toLowerCase() === customerUser.email.toLowerCase();
      const idMatches = ord.userId && ord.userId === customerUser.id;
      return emailMatches || idMatches;
    });
  }, [allOrders, customerUser]);

  // Master fetch function to sync all data from Server Database
  const fetchAllServerData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoadingProducts(true);
    try {
      // Parallel fetch from server database
      const [
        prods,
        cats,
        cps,
        ords,
        upis,
        addrs
      ] = await Promise.allSettled([
        api.getProducts(),
        api.getCategories(),
        api.getCoupons(),
        api.getOrders(),
        api.getUPISettings(),
        api.getAddresses()
      ]);

      if (prods.status === "fulfilled" && Array.isArray(prods.value)) {
        setProducts(prods.value);
      }
      if (cats.status === "fulfilled" && Array.isArray(cats.value)) {
        setCategories(cats.value);
      }
      if (cps.status === "fulfilled" && Array.isArray(cps.value)) {
        setCoupons(cps.value);
      }
      if (ords.status === "fulfilled" && Array.isArray(ords.value)) {
        setAllOrders(ords.value);
      }
      if (upis.status === "fulfilled" && upis.value) {
        setUpiSettings(upis.value);
      }
      if (addrs.status === "fulfilled" && Array.isArray(addrs.value)) {
        setAllAddresses(addrs.value);
      }
    } catch (err) {
      console.warn("Server sync note:", err);
    } finally {
      if (isInitial) setIsLoadingProducts(false);
    }
  }, []);

  const refreshProductsFromSupabase = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      await fetchAllServerData(false);
      toast.success("Catalog and store database synchronized!");
    } catch (err) {
      console.warn("Refresh error:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [fetchAllServerData]);

  // Initial load from server database
  useEffect(() => {
    fetchAllServerData(true);
  }, [fetchAllServerData]);

  // Background auto-sync every 4 seconds and on window focus so multiple browsers stay synced
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllServerData(false);
    }, 4000);

    const onFocus = () => {
      fetchAllServerData(false);
    };

    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchAllServerData]);

  // Initialize Supabase Auth Session listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSupabaseAuthUser(session.user);
          const metaName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Customer";
          const formattedName = metaName.charAt(0).toUpperCase() + metaName.slice(1);
          const userObj: CustomerUser = {
            id: session.user.id,
            name: formattedName,
            email: session.user.email || "",
            phone: session.user.user_metadata?.phone || "+91 9876543210",
            avatar: session.user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
          };
          setCustomerUser(userObj);
          localStorage.setItem("apex_customer_user", JSON.stringify(userObj));
        }
      } catch (err) {
        console.warn("Auth initialization note:", err);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    initAuth();
  }, []);

  // REGISTER CUSTOMER: Persists into server database
  const registerCustomer = async (data: { name: string; email: string; phone: string; password: string; avatar?: string }): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedName = data.name.trim();
    const trimmedPhone = data.phone.trim();
    const trimmedPass = data.password;
    const userAvatar = data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

    if (!trimmedName || !trimmedEmail || !trimmedPass) {
      toast.error("Please fill in all required registration fields");
      return { success: false, message: "Missing required fields" };
    }

    try {
      const res = await api.registerUser({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone || "+91 9876543210",
        password: trimmedPass,
        avatar: userAvatar
      });

      if (res.success && res.user) {
        setCustomerUser(res.user);
        setRegisteredUsers(prev => [...prev.filter(u => u.email.toLowerCase() !== trimmedEmail), res.user!]);
        localStorage.setItem("apex_customer_user", JSON.stringify(res.user));
        toast.success(`Account registered successfully! Welcome, ${res.user.name}!`);
        return { success: true };
      }
    } catch (_err) {
      // Check local fallback
      const existingIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === trimmedEmail);
      if (existingIndex > -1) {
        toast.error("This email is already registered! Please sign in with your password.");
        return { success: false, message: "Account already exists with this email" };
      }

      const newCustomerId = `cust-${Date.now()}`;
      const newUser: CustomerUser = {
        id: newCustomerId,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone || "+91 9876543210",
        password: trimmedPass,
        avatar: userAvatar
      };
      setRegisteredUsers(prev => [...prev, newUser]);
      setCustomerUser(newUser);
      localStorage.setItem("apex_customer_user", JSON.stringify(newUser));
      toast.success(`Account registered successfully! Welcome, ${newUser.name}!`);
      return { success: true };
    }

    return { success: false, message: "Registration failed" };
  };

  // LOGIN CUSTOMER: Verifies against server user database
  const loginCustomer = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass;

    if (!trimmedEmail || !trimmedPass) {
      toast.error("Please provide both email and password");
      return { success: false, message: "Please fill in all fields" };
    }

    // 1. Try Server API Login
    try {
      const res = await api.loginUser(trimmedEmail, trimmedPass);
      if (res.success && res.user) {
        setCustomerUser(res.user);
        localStorage.setItem("apex_customer_user", JSON.stringify(res.user));
        toast.success(`Welcome back, ${res.user.name}!`);
        return { success: true };
      }
    } catch (apiErr) {
      // 2. Fallback to Supabase Auth
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPass
        });

        if (!error && data?.user) {
          const metaName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || trimmedEmail.split("@")[0];
          const formattedName = metaName.charAt(0).toUpperCase() + metaName.slice(1);
          const userObj: CustomerUser = {
            id: data.user.id,
            name: formattedName,
            email: trimmedEmail,
            phone: data.user.user_metadata?.phone || "+91 9876543210",
            avatar: data.user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
          };
          setCustomerUser(userObj);
          localStorage.setItem("apex_customer_user", JSON.stringify(userObj));
          toast.success(`Welcome back, ${userObj.name}!`);
          return { success: true };
        }
      } catch (err) {
        console.warn("Supabase signin attempt:", err);
      }

      // 3. Fallback to Local registry
      const foundUser = registeredUsers.find(u => u.email.toLowerCase() === trimmedEmail);
      if (foundUser && foundUser.password === trimmedPass) {
        setCustomerUser(foundUser);
        localStorage.setItem("apex_customer_user", JSON.stringify(foundUser));
        toast.success(`Signed in as ${foundUser.name}!`);
        return { success: true };
      }

      const msg = apiErr instanceof Error ? apiErr.message : "Invalid email or password.";
      toast.error(msg);
      return { success: false, message: msg };
    }

    return { success: false, message: "Sign in failed" };
  };

  const logoutCustomer = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Signout note:", err);
    }
    setCustomerUser(null);
    setSupabaseAuthUser(null);
    localStorage.removeItem("apex_customer_user");
    toast.info("Signed out successfully");
  };

  // Admin Auth Methods
  const adminLogin = (email: string, password: string): boolean => {
    const isEmailValid = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
    const isPasswordValid = password === adminPasscode;

    if (isEmailValid && isPasswordValid) {
      setIsAdmin(true);
      setIsAdminLoginModalOpen(false);
      toast.success("Admin Panel Access Granted!");
      return true;
    } else {
      toast.error("Invalid Admin Email or Password");
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdmin(false);
    toast.info("Logged out from Admin Panel");
  };

  const updateAdminCredentials = async (newEmail: string, newPasscode: string) => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid admin email address");
      return;
    }
    if (!newPasscode || newPasscode.trim().length < 6) {
      toast.error("Passcode must be at least 6 characters long");
      return;
    }

    const cleanEmail = newEmail.trim().toLowerCase();
    const cleanPasscode = newPasscode.trim();

    setAdminEmail(cleanEmail);
    setAdminPasscode(cleanPasscode);

    try {
      await api.updateAdminCredentials(cleanEmail, cleanPasscode);
    } catch (err) {
      console.warn("Server credentials update note:", err);
    }

    toast.success("Admin credentials updated successfully!");
  };

  const openAdminLoginModal = () => setIsAdminLoginModalOpen(true);
  const closeAdminLoginModal = () => setIsAdminLoginModalOpen(false);

  const toggleAdminView = () => {
    if (isAdmin) {
      adminLogout();
    } else {
      openAdminLoginModal();
    }
  };

  // Cart methods
  const addToCart = (product: Product, size?: string, color?: string, quantity = 1) => {
    const selectedSize = size || (product.sizes.length > 0 ? product.sizes[0] : "Standard");
    const selectedColor = color || (product.colors.length > 0 ? product.colors[0] : "Standard");

    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.product.id === product.id && i.selectedSize === selectedSize && i.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          toast.error(`Only ${product.stock} units available in stock`);
          return prev;
        }
        updated[existingIndex].quantity = newQty;
        toast.success(`Updated quantity in cart`);
        return updated;
      } else {
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} units available in stock`);
          return prev;
        }
        toast.success(`Added ${product.name} to Cart!`);
        return [...prev, { product, selectedSize, selectedColor, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(i => !(i.product.id === productId && i.selectedSize === size && i.selectedColor === color)));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev => prev.map(i => {
      if (i.product.id === productId && i.selectedSize === size && i.selectedColor === color) {
        if (quantity > i.product.stock) {
          toast.error(`Maximum stock reached (${i.product.stock})`);
          return i;
        }
        return { ...i, quantity };
      }
      return i;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): boolean => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      toast.error("Invalid or expired coupon code");
      return false;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (subtotal < coupon.minOrderAmount) {
      toast.error(`Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
      return false;
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon ${coupon.code} applied successfully!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        toast.info(`Removed ${product.name} from Wishlist`);
        return prev.filter(p => p.id !== product.id);
      } else {
        toast.success(`Added ${product.name} to Wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId);

  // Address
  const addAddress = async (addressData: Omit<Address, "id">) => {
    const newAddr: Address = { 
      ...addressData, 
      id: `addr-${Date.now()}`,
      userId: customerUser?.id,
      userEmail: customerUser?.email?.toLowerCase()
    };
    setAllAddresses(prev => [...prev, newAddr]);

    try {
      await api.createAddress(newAddr);
    } catch (err) {
      console.warn("Address save note:", err);
    }

    toast.success("New shipping address saved to your account!");
  };

  const deleteAddress = async (id: string) => {
    setAllAddresses(prev => prev.filter(a => a.id !== id));
    try {
      await api.deleteAddress(id);
    } catch (err) {
      console.warn("Address delete note:", err);
    }
    toast.info("Address deleted");
  };

  // Place Order
  const placeOrderWithUPI = async (
    shippingAddress: Address, 
    utrNumber: string, 
    screenshotUrl?: string
  ): Promise<Order> => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    let discount = 0;
    if (appliedCoupon) {
      const calculated = (subtotal * appliedCoupon.discountPercent) / 100;
      discount = Math.min(calculated, appliedCoupon.maxDiscount);
    }
    const shippingFee = subtotal > 1500 ? 0 : 99;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);

    const activeName = customerUser?.name || shippingAddress.fullName || "Customer";
    const activeEmail = customerUser?.email || "customer@example.com";
    const activePhone = customerUser?.phone || shippingAddress.phone || "+91 9876543210";

    const orderPayload = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: customerUser?.id,
      customerName: activeName,
      customerEmail: activeEmail,
      customerPhone: activePhone,
      items: [...cart],
      shippingAddress: {
        ...shippingAddress,
        userId: customerUser?.id,
        userEmail: activeEmail
      },
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      couponCode: appliedCoupon?.code,
      paymentStatus: "Pending Verification" as PaymentStatus,
      orderStatus: "Order Placed" as OrderStatus,
      paymentDetails: {
        upiId: upiSettings.upiId,
        utrNumber,
        screenshotUrl,
        submittedAt: new Date().toISOString()
      }
    };

    let placedOrder: Order = {
      ...orderPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      placedOrder = await api.createOrder(orderPayload);
    } catch (err) {
      console.warn("Order save to server DB note:", err);
    }

    // Also reduce local stock and add order
    setProducts(prev => prev.map(prod => {
      const cartItem = cart.find(ci => ci.product.id === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
      }
      return prod;
    }));

    setAllOrders(prev => [placedOrder, ...prev.filter(o => o.id !== placedOrder.id)]);
    clearCart();
    toast.success(`Order placed! Payment status is Pending Verification.`);
    return placedOrder;
  };

  const cancelOrder = async (orderId: string) => {
    setAllOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, orderStatus: "Cancelled" as OrderStatus, updatedAt: new Date().toISOString() };
      }
      return ord;
    }));

    try {
      await api.cancelOrder(orderId);
    } catch (err) {
      console.warn("Cancel order note:", err);
    }

    toast.info(`Order #${orderId} has been cancelled.`);
  };

  // Admin Actions
  const verifyPayment = async (orderId: string, approve: boolean, reason?: string) => {
    const paymentStatus: PaymentStatus = approve ? "Paid" : "Rejected";
    const orderStatus: OrderStatus = approve ? "Payment Verified" : "Order Placed";

    setAllOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          paymentStatus,
          orderStatus: approve ? orderStatus : ord.orderStatus,
          paymentDetails: {
            ...ord.paymentDetails,
            verifiedAt: new Date().toISOString(),
            rejectedReason: reason
          },
          updatedAt: new Date().toISOString()
        };
      }
      return ord;
    }));

    try {
      await api.verifyPayment(orderId, approve, reason);
    } catch (err) {
      console.warn("Verify payment server note:", err);
    }

    if (approve) {
      toast.success(`Payment for Order #${orderId} APPROVED and marked as Paid!`);
    } else {
      toast.error(`Payment for Order #${orderId} REJECTED.`);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setAllOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, orderStatus: newStatus, updatedAt: new Date().toISOString() };
      }
      return ord;
    }));

    try {
      await api.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.warn("Status update server note:", err);
    }

    toast.success(`Order #${orderId} status updated to: ${newStatus}`);
  };

  // ----------------------------------------------------
  // ADD PRODUCT: Directly persisted to Server Database!
  // ----------------------------------------------------
  const addProduct = async (productData: Omit<Product, "id">): Promise<Product | null> => {
    const localId = `prod-${Date.now()}`;
    const optimisticProduct: Product = { ...productData, id: localId };

    // Optimistic local state update
    setProducts(prev => [optimisticProduct, ...prev]);

    try {
      const created = await api.createProduct(productData);
      if (created && created.id) {
        setProducts(prev => [created, ...prev.filter(p => p.id !== localId)]);
        toast.success("Product saved to database successfully! Visible to all users.");
        return created;
      }
    } catch (err) {
      console.warn("Server API product create error:", err);
      toast.error("Saved locally. Server sync will retry.");
    }

    return optimisticProduct;
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    try {
      await api.updateProduct(id, updatedProduct);
      toast.success("Product updated in database successfully!");
    } catch (err) {
      console.warn("Server update error:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await api.deleteProduct(id);
      toast.info("Product removed from store database");
    } catch (err) {
      console.warn("Server delete product note:", err);
    }
  };

  const addCategory = async (cat: Omit<Category, "id">) => {
    const localId = `cat-${Date.now()}`;
    const newCat: Category = { ...cat, id: localId };
    setCategories(prev => [...prev, newCat]);

    try {
      const created = await api.createCategory(cat);
      if (created && created.id) {
        setCategories(prev => [...prev.filter(c => c.id !== localId), created]);
      }
    } catch (err) {
      console.warn("Server add category note:", err);
    }

    toast.success(`Category "${newCat.name}" added successfully!`);
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    try {
      await api.deleteCategory(id);
    } catch (err) {
      console.warn("Server delete category note:", err);
    }
    toast.info("Category removed");
  };

  const addCoupon = async (cp: Omit<Coupon, "id">) => {
    const localId = `cp-${Date.now()}`;
    const newCp: Coupon = { ...cp, id: localId };
    setCoupons(prev => [newCp, ...prev]);

    try {
      const created = await api.createCoupon(cp);
      if (created && created.id) {
        setCoupons(prev => [created, ...prev.filter(c => c.id !== localId)]);
      }
    } catch (err) {
      console.warn("Server add coupon note:", err);
    }

    toast.success("Coupon code created in database!");
  };

  const deleteCoupon = async (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    try {
      await api.deleteCoupon(id);
    } catch (err) {
      console.warn("Server delete coupon note:", err);
    }
    toast.info("Coupon deleted");
  };

  const updateUPISettings = async (settings: Partial<UPISettings>) => {
    setUpiSettings(prev => ({ ...prev, ...settings }));
    try {
      await api.updateUPISettings(settings);
    } catch (err) {
      console.warn("Server update UPI note:", err);
    }
    toast.success("Admin UPI payment gateway settings updated across all devices!");
  };

  return (
    <SportsContext.Provider
      value={{
        products,
        categories,
        brands,
        coupons,
        cart,
        wishlist,
        orders: userOrders,
        allOrders,
        addresses: userAddresses,
        allAddresses,
        upiSettings,
        appliedCoupon,
        isAdmin,
        isAdminLoginModalOpen,
        userRole: isAdmin ? 'admin' : 'customer',
        adminEmail,
        supabaseConnected,
        isLoadingAuth,
        isLoadingProducts,
        customerUser,
        supabaseAuthUser,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        currentUser: customerUser,
        adminLogin,
        adminLogout,
        updateAdminCredentials,
        openAdminLoginModal,
        closeAdminLoginModal,
        toggleAdminView,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        addAddress,
        deleteAddress,
        placeOrderWithUPI,
        cancelOrder,
        refreshProductsFromSupabase,
        verifyPayment,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        addCoupon,
        deleteCoupon,
        updateUPISettings
      }}
    >
      {children}
    </SportsContext.Provider>
  );
};

export const useSports = () => {
  const context = useContext(SportsContext);
  if (!context) {
    throw new Error("useSports must be used within a SportsProvider");
  }
  return context;
};
