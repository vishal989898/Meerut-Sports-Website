import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { 
  ShoppingBag, Heart, Star, Check, ArrowLeft, QrCode 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, customerUser } = useSports();

  const product = products.find(p => p.id === id);

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  React.useEffect(() => {
    if (product) {
      if (product.sizes.length > 0) setSelectedSize(product.sizes[0]);
      if (product.colors.length > 0) setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <Button onClick={() => navigate("/products")} className="bg-amber-500 text-slate-950 font-bold">
          Back to Sports Shop
        </Button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    if (!customerUser) {
      toast.info("Please register or sign in first to complete your purchase.");
      navigate("/register?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-md relative flex items-center justify-center p-6">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain max-h-[500px]"
            />
            {product.discountPercentage > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-slate-50 ${
                    selectedImage === idx ? "border-amber-500 shadow-md scale-105" : "border-slate-200 opacity-70"
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {product.brand} • {product.category}
            </span>
            <h1 className="text-3xl font-black text-slate-900 uppercase mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400 font-medium">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-baseline gap-4">
            <span className="text-3xl font-black text-slate-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
              Inclusive of all taxes
            </span>
          </div>

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Select Size / Variant</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedSize === size
                        ? "bg-slate-900 text-amber-400 border-slate-900 shadow-md"
                        : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                      selectedColor === color
                        ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls & Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-700 hover:bg-slate-100 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-2 font-bold text-slate-900 text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-slate-700 hover:bg-slate-100 font-bold text-sm"
                >
                  +
                </button>
              </div>

              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="h-4 w-4" /> {product.stock} Units Available in Stock
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
                disabled={product.stock <= 0}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 rounded-2xl shadow-lg gap-2 text-sm"
              >
                <ShoppingBag className="h-4 w-4 text-amber-400" />
                Add To Cart
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-6 rounded-2xl shadow-lg text-sm"
              >
                Buy Now via UPI
              </Button>
            </div>

            <button
              onClick={() => toggleWishlist(product)}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 py-2"
            >
              <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-600 text-red-600" : ""}`} />
              {inWishlist ? "Saved in Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Specifications Table */}
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase">Technical Specifications</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold">{key}</span>
                  <span className="text-slate-900 font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* UPI Banner info */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-1 text-amber-900">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <QrCode className="h-4 w-4 text-amber-600" /> Instant Manual UPI Verification
            </p>
            <p className="text-slate-600">
              Pay using GPay, PhonePe or Paytm. Submit your 12-digit UTR code after placing order for instant admin approval.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};