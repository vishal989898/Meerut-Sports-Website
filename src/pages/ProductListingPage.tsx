import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, Search, RotateCcw, Filter, Check } from "lucide-react";

export const ProductListingPage: React.FC = () => {
  const { products, categories, brands } = useSports();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL changes
  React.useEffect(() => {
    if (searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category") || "All");
    }
    if (searchParams.get("search")) {
      setSearchQuery(searchParams.get("search") || "");
    }
  }, [searchParams]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== "All" && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== "All" && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Price filter
      if (product.price > maxPrice) {
        return false;
      }
      // Rating filter
      if (product.rating < minRating) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "discount") return b.discountPercentage - a.discountPercentage;
      return 0; // Default featured order
    });
  }, [products, selectedCategory, selectedBrand, maxPrice, minRating, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand("All");
    setMaxPrice(20000);
    setMinRating(0);
    setSearchQuery("");
    setSortBy("featured");
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">
            Sports Equipment & Gear
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Showing {filteredProducts.length} items from official sports manufacturers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <Button 
            variant="outline" 
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)} 
            className="md:hidden flex items-center gap-2"
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="featured">Featured / Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className={`md:block space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'} bg-white p-6 rounded-2xl border border-slate-200 h-fit sticky top-24`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-amber-500" />
              Filter Products
            </h3>
            <button onClick={resetFilters} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Search Field */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase">Search Product</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs rounded-xl pr-8"
              />
              <Search className="h-3.5 w-3.5 absolute right-2.5 top-3 text-slate-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase">Sports Category</Label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedCategory === "All" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === "All" && <Check className="h-3.5 w-3.5" />}
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase() 
                      ? "bg-amber-500 text-slate-950 font-bold" 
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory.toLowerCase() === cat.name.toLowerCase() && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase">Brand</Label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBrand("All")}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                  selectedBrand === "All" ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>All Brands</span>
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrand(b.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    selectedBrand === b.name ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 uppercase">
              <span>Max Price</span>
              <span className="text-amber-600">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase">Minimum Rating</Label>
            <div className="grid grid-cols-4 gap-1">
              {[0, 3, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`py-1 text-xs rounded-lg font-bold border transition-colors ${
                    minRating === rating 
                      ? "bg-slate-900 text-amber-400 border-slate-900" 
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {rating === 0 ? "Any" : `${rating}★+`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-3 space-y-6">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
              <div className="bg-amber-100 text-amber-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No products match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your price slider or clearing selected category filters.
              </p>
              <Button onClick={resetFilters} className="bg-slate-900 text-white font-bold rounded-xl text-xs px-6">
                Reset All Filters
              </Button>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};