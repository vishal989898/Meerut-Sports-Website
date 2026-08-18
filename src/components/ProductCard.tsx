import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types/sports";
import { useSports } from "@/context/SportsContext";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useSports();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      
      {/* Perfectly Aligned Product Image Container */}
      <div className="relative w-full h-56 bg-slate-50/80 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
        <img
          src={product.images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-sm"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercentage > 0 && (
            <Badge className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              {product.discountPercentage}% OFF
            </Badge>
          )}
          {product.isTrending && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Zap className="h-3 w-3 fill-slate-950" /> TRENDING
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-sm border transition-all z-10 ${
            inWishlist 
              ? "bg-red-50 text-red-600 border-red-200" 
              : "bg-white/90 hover:bg-white text-slate-600 hover:text-red-600 border-slate-200"
          }`}
          title="Add to wishlist"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-600" : ""}`} />
        </button>

        {/* Quick Add Button Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
          <Button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 rounded-xl shadow-md"
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            {product.stock > 0 ? "Quick Add" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span className="uppercase tracking-wider font-bold text-blue-600 text-[11px]">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Stock Status */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-normal">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div>
            {product.stock > 0 ? (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};