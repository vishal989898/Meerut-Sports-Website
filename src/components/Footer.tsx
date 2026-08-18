import React from "react";
import { Link } from "react-router-dom";
import { Trophy, ShieldCheck, QrCode, Truck, RefreshCw, PhoneCall, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      
      {/* Guarantees Bar */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 text-amber-400 p-3 rounded-2xl border border-amber-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Authentic</h4>
              <p className="text-xs text-slate-400">Direct from official brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 text-blue-400 p-3 rounded-2xl border border-blue-500/20">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">UPI Direct Pay</h4>
              <p className="text-xs text-slate-400">Scan & pay via Paytm / GPay / PhonePe</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-2xl border border-emerald-500/20">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast Dispatch</h4>
              <p className="text-xs text-slate-400">Free shipping above ₹1500</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-purple-500/10 text-purple-400 p-3 rounded-2xl border border-purple-500/20">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">7 Day Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free replacements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-2 rounded-xl">
              <Trophy className="h-5 w-5 text-slate-950" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tight">
              MEERUT<span className="text-amber-400">SPORTS</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            India's premier online store for authentic sports equipment, professional cricket bats, football match balls, and tournament rackets.
          </p>
          <div className="pt-2 text-xs text-slate-400 space-y-1">
            <p className="flex items-center gap-2"><PhoneCall className="h-3.5 w-3.5 text-amber-400" /> +91 1800-890-MEERUT (Toll Free)</p>
            <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-amber-400" /> support@meerutsports.in</p>
          </div>
        </div>

        <div>
          <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Sports Categories</h5>
          <ul className="space-y-2 text-xs text-slate-400 font-medium">
            <li><Link to="/products?category=Cricket" className="hover:text-amber-400">Cricket Gear</Link></li>
            <li><Link to="/products?category=Football" className="hover:text-amber-400">Football & Match Balls</Link></li>
            <li><Link to="/products?category=Basketball" className="hover:text-amber-400">Basketball</Link></li>
            <li><Link to="/products?category=Badminton" className="hover:text-amber-400">Badminton Rackets</Link></li>
            <li><Link to="/products?category=Tennis" className="hover:text-amber-400">Tennis Equipment</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company & Customer Care</h5>
          <ul className="space-y-2 text-xs text-slate-400 font-medium">
            <li><Link to="/about" className="hover:text-amber-400">About Meerut Sports</Link></li>
            <li><Link to="/contact" className="hover:text-amber-400">Help & Support FAQs</Link></li>
            <li><Link to="/orders" className="hover:text-amber-400">Track Order Status</Link></li>
            <li><Link to="/login" className="hover:text-amber-400">Customer Sign In</Link></li>
            <li><Link to="/register" className="hover:text-amber-400">Register Account</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">UPI Accepted</h5>
          <p className="text-xs text-slate-400 mb-3">Pay securely with Paytm, Google Pay, PhonePe, or BHIM.</p>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700">Paytm UPI</span>
            <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700">Google Pay</span>
            <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700">PhonePe</span>
            <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700">BHIM UPI</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} MEERUTSPORTS E-Commerce Ltd. All Rights Reserved. Built with React, Tailwind CSS & Vite.</p>
      </div>
    </footer>
  );
};