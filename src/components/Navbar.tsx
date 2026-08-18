import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { 
  ShoppingBag, Heart, Search, ShieldCheck, Menu, X, Trophy, PackageCheck, Zap, LogOut, LogIn 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Navbar: React.FC = () => {
  const { cart, wishlist, customerUser, logoutCustomer, isAdmin, openAdminLoginModal, adminLogout } = useSports();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-xl border-b border-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 px-4 py-1.5 text-xs text-center font-medium tracking-wide flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 mx-auto">
          <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
          <span>OFFICIAL MEERUT SPORTS GEAR - FLAT 20% OFF ON UPI PAYMENTS WITH CODE: <strong className="underline">SPORTS20</strong></span>
        </div>
        <div className="flex items-center gap-3 ml-auto text-[11px]">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link to="/admin" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-0.5 rounded-full transition-all">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin Panel
              </Link>
              <button
                onClick={adminLogout}
                className="text-slate-200 hover:text-red-300 flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded-full"
                title="Logout from Admin"
              >
                <LogOut className="h-3 w-3" /> Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={openAdminLoginModal} 
              className="flex items-center gap-1.5 bg-slate-950/60 hover:bg-slate-950 px-2.5 py-0.5 rounded-full text-amber-400 font-semibold border border-amber-400/30 transition-all"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Login
            </button>
          )}
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-amber-500 to-red-600 p-2.5 rounded-2xl group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white font-sans uppercase">
                MEERUT <span className="text-amber-400">SPORTS</span>
              </span>
              <p className="text-[10px] text-slate-400 -mt-1 font-semibold tracking-widest">AUTHENTIC GEAR</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <Input
              type="text"
              placeholder="Search bats, footballs, rackets, gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/80 border-slate-700 text-slate-100 placeholder:text-slate-400 rounded-xl pr-10 focus:ring-amber-400 focus:border-amber-400 text-sm py-5"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative hover:bg-slate-800 text-slate-200">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white rounded-full text-[10px]">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="outline" className="relative bg-slate-800 hover:bg-slate-700 border-slate-700 text-white gap-2 rounded-xl">
                <ShoppingBag className="h-5 w-5 text-amber-400" />
                <span className="hidden sm:inline font-semibold text-sm">Cart</span>
                {totalCartCount > 0 && (
                  <Badge className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 text-xs rounded-full">
                    {totalCartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* My Orders */}
            <Link to="/orders">
              <Button variant="ghost" className="hidden lg:flex items-center gap-2 hover:bg-slate-800 text-slate-200 rounded-xl">
                <PackageCheck className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium">Orders</span>
              </Button>
            </Link>

            {/* Customer User Account Button / Sign In */}
            {customerUser ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="ghost" className="hover:bg-slate-800 text-slate-200 rounded-xl gap-2 text-xs font-bold">
                    <img src={customerUser.avatar} alt="Avatar" className="h-6 w-6 rounded-full border border-amber-400 object-cover" />
                    <span className="hidden sm:inline">{customerUser.name}</span>
                  </Button>
                </Link>
                <button onClick={logoutCustomer} className="text-slate-400 hover:text-red-400 p-1.5" title="Sign Out">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link to="/login">
                  <Button variant="ghost" className="hover:bg-slate-800 text-amber-400 font-bold text-xs gap-1 rounded-xl">
                    <LogIn className="h-4 w-4" /> <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:inline-block">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl px-3">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-200 hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Secondary Nav Links */}
        <div className="hidden md:flex items-center justify-between border-t border-slate-800/80 py-2.5 text-sm font-medium text-slate-300">
          <div className="flex items-center gap-6">
            <Link to="/products" className="hover:text-amber-400 transition-colors font-semibold text-white">
              All Products
            </Link>
            <Link to="/products?category=Cricket" className="hover:text-amber-400 transition-colors">Cricket</Link>
            <Link to="/products?category=Football" className="hover:text-amber-400 transition-colors">Football</Link>
            <Link to="/products?category=Basketball" className="hover:text-amber-400 transition-colors">Basketball</Link>
            <Link to="/products?category=Badminton" className="hover:text-amber-400 transition-colors">Badminton</Link>
            <Link to="/products?category=Tennis" className="hover:text-amber-400 transition-colors">Tennis</Link>
            <Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-amber-400 transition-colors">Help & Contact</Link>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Paytm UPI Verification Active
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex relative">
            <Input
              type="text"
              placeholder="Search sports gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border-slate-700 text-slate-100 rounded-lg pr-10 text-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded text-center">All Gear</Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded text-center">My Orders</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded text-center">About Us</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded text-center">Contact & FAQs</Link>
          </div>

          <div className="pt-2 border-t border-slate-800">
            {customerUser ? (
              <Button onClick={() => { logoutCustomer(); setMobileMenuOpen(false); }} variant="outline" className="w-full border-slate-700 text-white font-bold">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out ({customerUser.name})
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-1/2">
                  <Button className="w-full bg-amber-500 text-slate-950 font-bold">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-1/2">
                  <Button variant="outline" className="w-full border-slate-700 text-white font-bold">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};