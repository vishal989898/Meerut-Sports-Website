import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  QrCode, Copy, MapPin, ArrowRight, ArrowLeft, UserPlus, LogIn, AlertCircle 
} from "lucide-react";
import { toast } from "sonner";

export const CheckoutPage: React.FC = () => {
  const { cart, addresses, addAddress, upiSettings, appliedCoupon, placeOrderWithUPI, customerUser } = useSports();
  const navigate = useNavigate();

  // Wizard Step State
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || "");
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: customerUser?.name || "",
    phone: customerUser?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  // UPI Payment Details
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  let discount = 0;
  if (appliedCoupon) {
    const calc = (subtotal * appliedCoupon.discountPercent) / 100;
    discount = Math.min(calc, appliedCoupon.maxDiscount);
  }
  const shippingFee = subtotal > 1500 ? 0 : 99;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  // Mandatory Customer Registration / Login Screen Guard
  if (!customerUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="h-16 w-16 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <UserPlus className="h-9 w-9 text-slate-950" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase text-white tracking-tight">Registration Required</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              To place orders, receive instant UPI payment confirmation, and track shipping, please create an account or sign in first.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link to="/register?redirect=/checkout" className="block">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-6 rounded-2xl text-sm gap-2 shadow-lg">
                <UserPlus className="h-4 w-4" /> Create New Customer Account
              </Button>
            </Link>

            <Link to="/login?redirect=/checkout" className="block">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold py-6 rounded-2xl text-sm gap-2 shadow-lg">
                <LogIn className="h-4 w-4 text-amber-400" /> Already Have An Account? Sign In
              </Button>
            </Link>
          </div>

          <div className="pt-2 text-[11px] text-slate-400">
            Items in cart: <strong className="text-amber-400">{cart.length} item(s)</strong> • Subtotal: <strong className="text-white">₹{subtotal.toLocaleString("en-IN")}</strong>
          </div>
        </div>
      </div>
    );
  }

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.street) {
      toast.error("Please fill in required address fields");
      return;
    }
    addAddress(newAddr);
    setShowAddAddr(false);
    setNewAddr({ fullName: customerUser?.name || "", phone: customerUser?.phone || "", street: "", city: "", state: "", pincode: "" });
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiSettings.upiId);
    toast.success(`UPI ID (${upiSettings.upiId}) copied!`);
  };

  const handleSubmitUPIPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 8) {
      toast.error("Please enter a valid 12-digit UPI UTR / Transaction ID");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a valid delivery address");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrderWithUPI(selectedAddress, utrNumber.trim(), screenshotUrl).then((order) => {
        setIsSubmitting(false);
        navigate(`/orders?newOrder=${order.id}`);
      });
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Button onClick={() => navigate("/products")} className="bg-amber-500 text-slate-950 font-bold">
          Go To Store
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Checkout Wizard Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between border border-slate-800">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Checkout Wizard</h1>
          <p className="text-xs text-slate-400">Logged in as: <strong className="text-amber-400">{customerUser.name}</strong> ({customerUser.email})</p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s ? "bg-amber-500 text-slate-950 shadow-lg" : step > s ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Step Flow */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="font-black text-slate-900 uppercase text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-500" /> Delivery Address
                </h2>
                <Button variant="outline" onClick={() => setShowAddAddr(!showAddAddr)} className="text-xs rounded-xl">
                  {showAddAddr ? "Cancel" : "+ Add New Address"}
                </Button>
              </div>

              {showAddAddr ? (
                <form onSubmit={handleAddNewAddress} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Full Name</Label>
                      <Input value={newAddr.fullName} onChange={e => setNewAddr({...newAddr, fullName: e.target.value})} required className="text-xs" />
                    </div>
                    <div>
                      <Label className="text-xs">Phone Number</Label>
                      <Input value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} required className="text-xs" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Street / House No.</Label>
                    <Input value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} required className="text-xs" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">City</Label>
                      <Input value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} required className="text-xs" />
                    </div>
                    <div>
                      <Label className="text-xs">State</Label>
                      <Input value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} required className="text-xs" />
                    </div>
                    <div>
                      <Label className="text-xs">Pincode</Label>
                      <Input value={newAddr.pincode} onChange={e => setNewAddr({...newAddr, pincode: e.target.value})} required className="text-xs" />
                    </div>
                  </div>
                  <Button type="submit" className="bg-slate-900 text-white font-bold text-xs rounded-xl w-full">Save Address</Button>
                </form>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedAddressId === addr.id 
                          ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400" 
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{addr.fullName}</span>
                        <span className="text-xs text-slate-500 font-medium">{addr.phone}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  ))}

                  <Button 
                    onClick={() => setStep(2)} 
                    disabled={!selectedAddressId}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 rounded-2xl text-sm mt-4 gap-2"
                  >
                    Continue to Order Review <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Order Review */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="font-black text-slate-900 uppercase text-lg border-b pb-3">Review Items</h2>

              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b pb-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt={item.product.name} className="h-12 w-12 object-cover rounded-lg border" />
                      <div>
                        <p className="font-bold text-slate-900">{item.product.name}</p>
                        <p className="text-slate-500">Variant: {item.selectedSize} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="w-1/3 rounded-xl text-xs font-bold">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="w-2/3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl py-6 text-sm">
                  Proceed to UPI Payment <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: UPI Payment */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b pb-3">
                <h2 className="font-black text-slate-900 uppercase text-lg flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-amber-500" /> Pay via Paytm UPI
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Scan the Official Paytm QR code below or send to UPI ID: <strong className="text-slate-900">{upiSettings.upiId}</strong>
                </p>
              </div>

              {/* QR Display */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="bg-white p-2 rounded-2xl shadow-xl border-4 border-amber-400 max-w-[220px]">
                  <img src={upiSettings.qrCodeUrl} alt="Paytm UPI QR Code" className="w-full h-auto rounded-xl object-contain" />
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Merchant Paytm UPI ID</span>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <span className="font-mono text-base font-bold bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
                        {upiSettings.upiId}
                      </span>
                      <button onClick={handleCopyUPI} className="p-2 bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400" title="Copy UPI ID">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Amount Payable</span>
                    <span className="text-3xl font-black text-amber-400">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* UTR Form */}
              <form onSubmit={handleSubmitUPIPayment} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs font-extrabold uppercase text-slate-800 flex items-center justify-between">
                    <span>12-Digit UPI Transaction ID / UTR Number</span>
                    <span className="text-red-500">*Required</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. 409821371289"
                    value={utrNumber}
                    onChange={e => setUtrNumber(e.target.value)}
                    required
                    className="font-mono text-sm tracking-wider rounded-xl border-slate-300 py-5"
                  />
                  <p className="text-[11px] text-slate-500">
                    Find this 12-digit number in your Paytm / GPay / PhonePe payment history after paying.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-extrabold uppercase text-slate-800">Payment Screenshot Proof (Optional Image Link)</Label>
                  <Input
                    type="text"
                    placeholder="Optional image URL link..."
                    value={screenshotUrl}
                    onChange={e => setScreenshotUrl(e.target.value)}
                    className="text-xs rounded-xl"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-600" /> Manual Payment Verification Note
                  </p>
                  <p className="text-slate-600">
                    Your order will be created with status <strong className="text-amber-700">Pending Verification</strong>. Admin will cross-check the UTR and approve it shortly.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-1/3 rounded-xl font-bold text-xs">
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 rounded-xl text-sm shadow-xl"
                  >
                    {isSubmitting ? "Submitting Order..." : "Submit Order & Verify Payment"}
                  </Button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Right Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
            <h3 className="font-black text-slate-900 uppercase text-sm">Summary</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-base font-black text-slate-900">
                <span>Total</span>
                <span className="text-amber-600">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {selectedAddress && (
              <div className="border-t pt-3 space-y-1 text-xs">
                <p className="font-bold text-slate-800">Delivering to:</p>
                <p className="text-slate-600">{selectedAddress.fullName}, {selectedAddress.city}</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};