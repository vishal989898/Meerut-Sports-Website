import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Ticket, UserPlus } from "lucide-react";
import { toast } from "sonner";

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, appliedCoupon, applyCoupon, removeCoupon, customerUser } = useSports();
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  let discount = 0;
  if (appliedCoupon) {
    const calc = (subtotal * appliedCoupon.discountPercent) / 100;
    discount = Math.min(calc, appliedCoupon.maxDiscount);
  }

  const shippingFee = subtotal > 1500 || cart.length === 0 ? 0 : 99;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode("");
    }
  };

  const handleProceedToCheckout = () => {
    if (!customerUser) {
      toast.info("Please register or sign in first to complete your purchase.");
      navigate("/register?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-slate-100 text-slate-400 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our range of cricket bats, running shoes, and fitness gear to add products to your cart.
        </p>
        <Link to="/products">
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-6 rounded-2xl">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 uppercase">Shopping Cart ({cart.length} Items)</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div 
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
              className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-20 w-20 object-cover rounded-xl bg-slate-100 border"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">{item.product.brand}</span>
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-amber-600">
                      {item.product.name}
                    </h3>
                  </Link>
                  <div className="text-xs text-slate-500 font-medium">
                    Size: <strong className="text-slate-800">{item.selectedSize}</strong> • Color: <strong className="text-slate-800">{item.selectedColor}</strong>
                  </div>
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                    className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-bold text-slate-900 text-xs">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                    className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-black text-slate-900 text-base">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-slate-400">₹{item.product.price} each</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                  className="text-slate-400 hover:text-red-600 p-2"
                  title="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-6">
            <h3 className="text-lg font-black text-slate-900 uppercase">Order Summary</h3>

            {/* Coupon Code Input */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                <Ticket className="h-3.5 w-3.5 text-amber-500" /> Promo Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
                  <span className="font-bold text-emerald-800">Code: {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)</span>
                  <button onClick={removeCoupon} className="text-red-600 hover:underline text-[11px] font-bold">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter SPORTS20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="text-xs uppercase font-bold rounded-xl"
                  />
                  <Button type="submit" className="bg-slate-900 text-white font-bold text-xs rounded-xl px-4">
                    Apply
                  </Button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                {shippingFee === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">₹{shippingFee}</span>
                )}
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-amber-600">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <Button
              onClick={handleProceedToCheckout}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-6 rounded-2xl shadow-xl gap-2 text-sm"
            >
              {customerUser ? (
                <>Proceed to UPI Checkout <ArrowRight className="h-4 w-4" /></>
              ) : (
                <>Register & Proceed to Buy <UserPlus className="h-4 w-4" /></>
              )}
            </Button>
          </div>

          <div className="bg-slate-950 text-white p-4 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Pure Manual UPI Payment
            </p>
            <p className="text-slate-400">
              No Gateway Fees charged. Direct QR code pay with instant admin approval.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};