import React from "react";
import { Link } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const WishlistPage: React.FC = () => {
  const { wishlist } = useSports();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 uppercase flex items-center gap-2">
          <Heart className="h-7 w-7 text-red-600 fill-red-600" /> My Saved Wishlist ({wishlist.length})
        </h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Heart className="h-16 w-16 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any sports gear item to save it here for later.
          </p>
          <Link to="/products">
            <Button className="bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};