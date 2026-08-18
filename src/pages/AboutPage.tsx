import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Trophy, ShieldCheck, QrCode, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase">
            <Trophy className="h-4 w-4 text-amber-400" /> India's Premier Sports Equipment Destination
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Built For Athletes, <br />
            <span className="text-amber-400">MEERUTSPORTS</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            At Meerut Sports, we deliver 100% authentic Grade-1 English Willow cricket bats, FIFA match footballs, responsive running shoes, and tournament-spec badminton rackets directly from official manufacturer factories in Meerut and around the world.
          </p>
          <div className="pt-2">
            <RouterLink to="/products">
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-5 rounded-2xl gap-2">
                Explore Equipment Catalog <ArrowRight className="h-4 w-4" />
              </Button>
            </RouterLink>
          </div>
        </div>
      </div>

      {/* Core Values / Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="bg-amber-100 text-amber-600 h-14 w-14 rounded-2xl flex items-center justify-center font-bold">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">100% Brand Authenticity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every bat, shoe, ball, and racket comes with brand verification holograms and manufacturer warranty.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="bg-blue-100 text-blue-600 h-14 w-14 rounded-2xl flex items-center justify-center font-bold">
            <QrCode className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Direct Manual Paytm UPI Pay</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Zero gateway surcharge. Scan QR on Paytm, Google Pay, or PhonePe, submit 12-digit UTR, and get fast verification.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="bg-emerald-100 text-emerald-600 h-14 w-14 rounded-2xl flex items-center justify-center font-bold">
            <Truck className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Express Pan-India Shipping</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fast dispatch within 24 hours with complete shipment tracking timeline from Order Placed to Delivery.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-amber-400">50,000+</span>
          <p className="text-xs text-slate-400 font-bold uppercase">Happy Sportsmen</p>
        </div>
        <div className="space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-amber-400">100%</span>
          <p className="text-xs text-slate-400 font-bold uppercase">Genuine Equipment</p>
        </div>
        <div className="space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-amber-400">24/7</span>
          <p className="text-xs text-slate-400 font-bold uppercase">WhatsApp & Call Help</p>
        </div>
        <div className="space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-amber-400">4.9★</span>
          <p className="text-xs text-slate-400 font-bold uppercase">Customer Rating</p>
        </div>
      </div>

    </div>
  );
};