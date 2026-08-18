export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  iconName: string;
  itemCount: number;
};

export type Brand = {
  id: string;
  name: string;
  logo: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
};

export type CartItem = {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
};

export type Address = {
  id: string;
  userId?: string;
  userEmail?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};

export type PaymentStatus = 'Pending Verification' | 'Paid' | 'Rejected' | 'Refunded';

export type OrderStatus = 
  | 'Order Placed' 
  | 'Payment Verified' 
  | 'Processing' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export type PaymentDetails = {
  upiId: string;
  utrNumber: string;
  screenshotUrl?: string;
  submittedAt: string;
  verifiedAt?: string;
  rejectedReason?: string;
};

export type Order = {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  shippingAddress: Address;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentDetails: PaymentDetails;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
};

export type Coupon = {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscount: number;
  expiryDate: string;
  isActive: boolean;
};

export type UPISettings = {
  upiId: string;
  merchantName: string;
  qrCodeUrl: string;
  instructions: string;
};