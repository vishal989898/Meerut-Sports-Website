import { Product, Category, Coupon, Order, UPISettings, OrderStatus, Address } from "@/types/sports";
import { CustomerUser } from "@/context/SportsContext";

const API_BASE = "/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `API error (${res.status})`;
    try {
      const errorJson = await res.json();
      if (errorJson.error) message = errorJson.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  // Store / Products
  getProducts: () => request<Product[]>("/products"),
  getProductById: (id: string) => request<Product>(`/products/${id}`),
  createProduct: (product: Omit<Product, "id">) =>
    request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  updateProduct: (id: string, updates: Partial<Product>) =>
    request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deleteProduct: (id: string) =>
    request<{ success: boolean; id: string }>(`/products/${id}`, {
      method: "DELETE",
    }),

  // Categories
  getCategories: () => request<Category[]>("/categories"),
  createCategory: (category: Omit<Category, "id">) =>
    request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    }),
  deleteCategory: (id: string) =>
    request<{ success: boolean; id: string }>(`/categories/${id}`, {
      method: "DELETE",
    }),

  // Coupons
  getCoupons: () => request<Coupon[]>("/coupons"),
  createCoupon: (coupon: Omit<Coupon, "id">) =>
    request<Coupon>("/coupons", {
      method: "POST",
      body: JSON.stringify(coupon),
    }),
  deleteCoupon: (id: string) =>
    request<{ success: boolean; id: string }>(`/coupons/${id}`, {
      method: "DELETE",
    }),

  // Orders
  getOrders: () => request<Order[]>("/orders"),
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) =>
    request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  verifyPayment: (id: string, approve: boolean, reason?: string) =>
    request<Order>(`/orders/${id}/verify-payment`, {
      method: "POST",
      body: JSON.stringify({ approve, reason }),
    }),
  cancelOrder: (id: string) =>
    request<Order>(`/orders/${id}/cancel`, {
      method: "POST",
    }),

  // UPI Gateway Settings
  getUPISettings: () => request<UPISettings>("/upi-settings"),
  updateUPISettings: (settings: Partial<UPISettings>) =>
    request<UPISettings>("/upi-settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  // Admin Credentials
  getAdminConfig: () => request<{ email: string }>("/admin/config"),
  updateAdminCredentials: (email: string, passcode: string) =>
    request<{ success: boolean; email: string }>("/admin/credentials", {
      method: "PUT",
      body: JSON.stringify({ email, passcode }),
    }),
  verifyAdminLogin: (email: string, pass: string) =>
    request<{ success: boolean; message?: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password: pass }),
    }),

  // Customer Users
  getUsers: () => request<CustomerUser[]>("/users"),
  registerUser: (user: Omit<CustomerUser, "id">) =>
    request<{ success: boolean; user?: CustomerUser; message?: string }>("/users/register", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  loginUser: (email: string, pass: string) =>
    request<{ success: boolean; user?: CustomerUser; message?: string }>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password: pass }),
    }),

  // Addresses
  getAddresses: () => request<Address[]>("/addresses"),
  createAddress: (address: Address) =>
    request<Address>("/addresses", {
      method: "POST",
      body: JSON.stringify(address),
    }),
  deleteAddress: (id: string) =>
    request<{ success: boolean; id: string }>(`/addresses/${id}`, {
      method: "DELETE",
    }),
};
