import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, PackageCheck, Heart, ShieldCheck, LogOut, Plus, Trash2, X, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

export const ProfilePage: React.FC = () => {
  const { customerUser, orders, wishlist, addresses, addAddress, deleteAddress, toggleAdminView, logoutCustomer } = useSports();
  const navigate = useNavigate();

  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: customerUser?.name || "",
    phone: customerUser?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  if (!customerUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 shadow-2xl space-y-5">
          <div className="h-16 w-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <User className="h-8 w-8 text-amber-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">GUEST ACCOUNT</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Sign in or register an account to view your saved addresses, orders, and manage your account details.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Link to="/login" className="w-full">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-5 rounded-xl shadow-md gap-1.5 transition-all">
                <LogIn className="h-4 w-4" /> Sign In
              </Button>
            </Link>
            <Link to="/register" className="w-full">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-black text-xs py-5 rounded-xl shadow-md gap-1.5 transition-all">
                <UserPlus className="h-4 w-4 text-amber-400" /> Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.street) {
      toast.error("Please fill in all required address fields");
      return;
    }

    addAddress(newAddr);
    setShowAddAddr(false);
    setNewAddr({
      fullName: customerUser?.name || "",
      phone: customerUser?.phone || "",
      street: "",
      city: "",
      state: "",
      pincode: ""
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-6 border border-slate-800">
        <img
          src={customerUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
          alt={customerUser.name}
          className="h-24 w-24 rounded-full object-cover border-4 border-amber-400 shadow-lg"
        />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <h1 className="text-2xl font-black uppercase text-white">{customerUser.name}</h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-amber-400" /> {customerUser.email}</span>
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-amber-400" /> {customerUser.phone}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={logoutCustomer} variant="destructive" className="font-bold text-xs rounded-xl gap-1">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </Button>
          <Button onClick={toggleAdminView} variant="outline" className="border-amber-400/40 text-amber-400 hover:bg-slate-800 font-bold text-xs rounded-xl">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Admin Access
          </Button>
        </div>
      </div>

      {/* Overview Cards (Personalized) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/orders" className="block">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm hover:border-amber-400 hover:shadow-md transition-all">
            <PackageCheck className="h-8 w-8 text-blue-600 mx-auto" />
            <span className="text-2xl font-black text-slate-900">{orders.length}</span>
            <p className="text-xs text-slate-500 font-bold uppercase">My Placed Orders</p>
          </div>
        </Link>

        <Link to="/wishlist" className="block">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm hover:border-amber-400 hover:shadow-md transition-all">
            <Heart className="h-8 w-8 text-red-600 mx-auto" />
            <span className="text-2xl font-black text-slate-900">{wishlist.length}</span>
            <p className="text-xs text-slate-500 font-bold uppercase">My Wishlist</p>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm">
          <MapPin className="h-8 w-8 text-amber-500 mx-auto" />
          <span className="text-2xl font-black text-slate-900">{addresses.length}</span>
          <p className="text-xs text-slate-500 font-bold uppercase">My Saved Addresses</p>
        </div>
      </div>

      {/* Personal Address Book */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-black text-slate-900 text-lg uppercase">My Saved Delivery Addresses</h3>
            <p className="text-xs text-slate-500">Private shipping addresses saved for {customerUser.name}</p>
          </div>
          <Button 
            onClick={() => setShowAddAddr(!showAddAddr)} 
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl gap-1"
          >
            {showAddAddr ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add Address</>}
          </Button>
        </div>

        {/* Add Address Form */}
        {showAddAddr && (
          <form onSubmit={handleAddNewAddress} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-xs uppercase text-slate-800">New Address Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase">Recipient Full Name</Label>
                <Input value={newAddr.fullName} onChange={e => setNewAddr({...newAddr, fullName: e.target.value})} required className="text-xs rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase">Phone Number</Label>
                <Input value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} required className="text-xs rounded-xl mt-1" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700 uppercase">Street Address / House No.</Label>
              <Input value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} required className="text-xs rounded-xl mt-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase">City</Label>
                <Input value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} required className="text-xs rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase">State</Label>
                <Input value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} required className="text-xs rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase">Pincode</Label>
                <Input value={newAddr.pincode} onChange={e => setNewAddr({...newAddr, pincode: e.target.value})} required className="text-xs rounded-xl mt-1" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl py-5">
              Save Address to My Profile
            </Button>
          </form>
        )}

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-2">
            <MapPin className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">No saved addresses found for your account.</p>
            <Button onClick={() => setShowAddAddr(true)} variant="outline" className="text-xs font-bold rounded-xl mt-1">
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-sm block">{addr.fullName} ({addr.phone})</span>
                  <p className="text-slate-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
                <button 
                  onClick={() => deleteAddress(addr.id)}
                  className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors" 
                  title="Delete address"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};