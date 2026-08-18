import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { OrderStatus } from "@/types/sports";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, Clock, Truck, PackageCheck, AlertCircle, RefreshCw, XCircle, ChevronRight, QrCode, LogIn, UserPlus 
} from "lucide-react";

export const OrdersPage: React.FC = () => {
  const { orders, customerUser, cancelOrder } = useSports();
  const [searchParams] = useSearchParams();
  const highlightedOrderId = searchParams.get("newOrder");

  const getStatusBadge = (paymentStatus: string, orderStatus: OrderStatus) => {
    if (orderStatus === "Cancelled") {
      return <Badge className="bg-red-600 text-white font-bold">Cancelled</Badge>;
    }
    if (paymentStatus === "Pending Verification") {
      return <Badge className="bg-amber-500 text-slate-950 font-bold">Pending UPI Verification</Badge>;
    }
    if (paymentStatus === "Paid") {
      return <Badge className="bg-emerald-600 text-white font-bold">Paid & Verified</Badge>;
    }
    if (paymentStatus === "Rejected") {
      return <Badge className="bg-red-600 text-white font-bold">Payment Rejected</Badge>;
    }
    return <Badge className="bg-slate-700 text-white">{orderStatus}</Badge>;
  };

  const timelineSteps: OrderStatus[] = [
    "Order Placed",
    "Payment Verified",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered"
  ];

  if (!customerUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 shadow-2xl space-y-5">
          <div className="h-16 w-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <PackageCheck className="h-8 w-8 text-amber-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">Sign In to View Orders</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Please log in to your account to view your past purchases, shipment statuses, and UPI verification records.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Link to="/login?redirect=/orders" className="w-full">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-5 rounded-xl shadow-md gap-1.5 transition-all">
                <LogIn className="h-4 w-4" /> Sign In
              </Button>
            </Link>
            <Link to="/register?redirect=/orders" className="w-full">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-black text-xs py-5 rounded-xl shadow-md gap-1.5 transition-all">
                <UserPlus className="h-4 w-4 text-amber-400" /> Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 uppercase">My Orders & Trackers</h1>
        <p className="text-xs text-slate-500 font-medium">
          Viewing orders placed by <strong className="text-slate-800">{customerUser.name}</strong> ({customerUser.email})
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <PackageCheck className="h-16 w-16 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">No Orders Found</h2>
          <p className="text-xs text-slate-500">You have not placed any orders under this account yet.</p>
          <Link to="/products">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = timelineSteps.indexOf(order.orderStatus);
            const isHighlighted = highlightedOrderId === order.id;

            return (
              <div 
                key={order.id}
                className={`bg-white rounded-3xl border shadow-md overflow-hidden transition-all ${
                  isHighlighted ? "ring-2 ring-amber-500 border-amber-500" : "border-slate-200"
                }`}
              >
                {/* Header */}
                <div className="bg-slate-900 text-white p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Order ID</span>
                    <span className="text-lg font-mono font-bold text-white">#{order.id}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.paymentStatus, order.orderStatus)}
                    <span className="text-xl font-black text-amber-400">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  
                  {/* Timeline Tracker */}
                  {order.orderStatus !== "Cancelled" && (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-extrabold uppercase text-slate-700">Order Progress Timeline</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center pt-2">
                        {timelineSteps.map((stepName, sIdx) => {
                          const isDone = sIdx <= currentStepIdx;
                          return (
                            <div key={stepName} className="space-y-1">
                              <div 
                                className={`h-3 rounded-full ${
                                  isDone ? "bg-emerald-500" : "bg-slate-200"
                                }`} 
                              />
                              <span className={`text-[10px] font-bold block ${isDone ? "text-slate-900" : "text-slate-400"}`}>
                                {stepName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.product.images[0]} alt={item.product.name} className="h-12 w-12 object-cover rounded-lg border" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{item.product.name}</p>
                            <p className="text-slate-500">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 text-sm">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Details */}
                  <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-900">
                      <span className="flex items-center gap-1.5">
                        <QrCode className="h-4 w-4 text-amber-600" /> UPI UTR / Transaction ID:
                      </span>
                      <span className="font-mono text-sm font-black text-slate-900">{order.paymentDetails.utrNumber}</span>
                    </div>
                    {order.paymentStatus === "Pending Verification" && (
                      <p className="text-slate-600 mt-1">
                        Admin is verifying this UTR with bank records. Once approved, order status will update to Payment Verified.
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-xs text-slate-500">
                      Ship to: <strong className="text-slate-800">{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city})
                    </div>

                    {order.orderStatus === "Order Placed" && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => cancelOrder(order.id)}
                        className="text-xs font-bold rounded-xl"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};