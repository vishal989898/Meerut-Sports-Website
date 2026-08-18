import React from "react";
import { Link } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, ArrowRight, Zap, Flame, Sparkles, ChevronRight 
} from "lucide-react";

export const HomePage: React.FC = () => {
  const { products, categories } = useSports();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const trendingProducts = products.filter(p => p.isTrending || p.rating >= 4.7).slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-4 shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1600&q=80"
          alt="Sports Hero Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>DIRECT FROM MEERUT FACTORIES</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none font-sans">
              GEAR UP WITH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
                MEERUT SPORTS
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
              Equip yourself with Grade-1 English Willow bats, FIFA Match footballs, professional tennis & Yonex badminton rackets. Guaranteed authentic gear with direct Paytm UPI payments.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/products">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/20 gap-2">
                  Shop Now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products?category=Cricket">
                <Button variant="outline" size="lg" className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-white font-bold text-base px-6 py-6 rounded-2xl">
                  Cricket Bats & Gear
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-5 rounded-2xl space-y-2">
              <Trophy className="h-8 w-8 text-amber-400" />
              <h3 className="font-bold text-white text-lg">Pro Grade Quality</h3>
              <p className="text-xs text-slate-400">Tested and approved for competitive sports matches.</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-5 rounded-2xl space-y-2">
              <Zap className="h-8 w-8 text-blue-400" />
              <h3 className="font-bold text-white text-lg">Instant Paytm UPI</h3>
              <p className="text-xs text-slate-400">Scan QR Code or send to 7417031520@ptyes with UTR entry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Explore By Sport</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">Top Sports Categories</h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All Categories <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative overflow-hidden rounded-2xl bg-slate-900 text-white aspect-[4/3] border border-slate-200/50 shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                <div>
                  <h3 className="font-black text-white text-base leading-tight group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">{cat.itemCount}+ Products</p>
                </div>
                <div className="bg-amber-500 text-slate-950 p-1.5 rounded-full group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
              <Flame className="h-4 w-4 fill-red-600" /> Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">Featured Gear</h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Shop All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <Badge className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 uppercase">
              Exclusive Offer
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Save Up to ₹1,500 via Paytm UPI
            </h2>
            <p className="text-slate-300 text-sm">
              Use promo code <strong className="text-amber-400 underline">SPORTS20</strong> during checkout to get 20% discount. Scan Paytm QR Code for instant approval!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/products">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base px-8 py-6 rounded-2xl shadow-lg">
                Claim Offer Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Most Popular Choice</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">Trending Now</h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Browse All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
};