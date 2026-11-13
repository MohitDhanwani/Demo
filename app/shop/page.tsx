"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { PRODUCTS, Product } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar, { FilterState } from "@/components/shop/FilterSidebar";
import QuickViewModal from "@/components/shop/QuickViewModal";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  Sparkles,
  ArrowUpDown,
  Coffee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useCurrencyStore();

  // Initialize filter state from URL query params or defaults
  const [filters, setFilters] = useState<FilterState>(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "all";
    const origin = searchParams.get("origin") ? [searchParams.get("origin")!] : [];
    return {
      search: q,
      category: cat,
      roastLevels: [],
      origins: origin,
      processes: [],
      brewMethods: [],
      tastingNotes: [],
      maxPrice: 500,
      inStockOnly: false,
      organicOnly: false,
      sortBy: "featured",
    };
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync state to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("q", filters.search);
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.origins.length === 1) params.set("origin", filters.origins[0]);
    if (filters.sortBy !== "featured") params.set("sort", filters.sortBy);

    const qs = params.toString();
    const newPath = qs ? `/shop?${qs}` : "/shop";
    router.replace(newPath, { scroll: false });
  }, [filters.search, filters.category, filters.origins, filters.sortBy, router]);

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(PRODUCTS, {
      keys: [
        { name: "name", weight: 0.35 },
        { name: "originCountry", weight: 0.25 },
        { name: "region", weight: 0.15 },
        { name: "tastingNotes", weight: 0.2 },
        { name: "varietal", weight: 0.1 },
        { name: "process", weight: 0.1 },
      ],
      threshold: 0.35,
      includeScore: true,
    });
  }, []);

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    // 1. Search Query
    if (filters.search.trim()) {
      const searchResults = fuse.search(filters.search.trim());
      result = searchResults.map((res) => res.item);
    }

    // 2. Category
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // 3. Roast Levels
    if (filters.roastLevels.length > 0) {
      result = result.filter((p) => filters.roastLevels.includes(p.roastValue));
    }

    // 4. Origins
    if (filters.origins.length > 0) {
      result = result.filter((p) => filters.origins.includes(p.originCountry));
    }

    // 5. Processing Methods
    if (filters.processes.length > 0) {
      result = result.filter((p) => filters.processes.includes(p.process));
    }

    // 6. Tasting Notes
    if (filters.tastingNotes.length > 0) {
      result = result.filter((p) =>
        filters.tastingNotes.some((n) => p.tastingNotes.includes(n))
      );
    }

    // 7. Max Price (in AUD)
    if (filters.maxPrice < 500) {
      result = result.filter((p) => p.priceAud <= filters.maxPrice);
    }

    // 8. Toggles
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    if (filters.organicOnly) {
      result = result.filter((p) => p.isOrganic);
    }

    // 9. Sorting
    return [...result].sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.priceAud - b.priceAud;
      if (filters.sortBy === "price-desc") return b.priceAud - a.priceAud;
      if (filters.sortBy === "rating") return b.rating - a.rating;
      if (filters.sortBy === "newest") return a.roastedDaysAgo - b.roastedDaysAgo;
      // Default: featured first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [filters, fuse]);

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      roastLevels: [],
      origins: [],
      processes: [],
      brewMethods: [],
      tastingNotes: [],
      maxPrice: 500,
      inStockOnly: false,
      organicOnly: false,
      sortBy: "featured",
    });
  };

  // Active filter count for removable tags
  const hasActiveFilters =
    filters.search ||
    filters.category !== "all" ||
    filters.roastLevels.length > 0 ||
    filters.origins.length > 0 ||
    filters.processes.length > 0 ||
    filters.tastingNotes.length > 0 ||
    filters.maxPrice < 500 ||
    filters.inStockOnly ||
    filters.organicOnly;

  return (
    <div className="w-full min-h-screen bg-[#0D1B16] text-[#EFEBE3] pt-28 pb-24 select-none">
      {/* Top Shipping Region Alert Banner */}
      <div className="border-b border-[#EFEBE3]/10 bg-[#13261F] py-2 px-6 text-center text-xs font-mono text-[#CFE0C3] flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#E8472B]" />
        <span>
          Worldwide Air Freight: Complimentary Express Shipping on Orders Over A$60 ({currency} Calculated at Checkout)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#EFEBE3]/15 gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#E8472B] mb-2">
              <span className="w-2.5 h-[1px] bg-[#E8472B]" />
              <span>THE SPECIALTY REPOSITORY</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight text-[#EFEBE3] leading-none">
              Current Harvest.
            </h1>
          </div>

          <div className="font-mono text-xs uppercase tracking-widest text-[#EFEBE3]/60 flex items-center gap-2">
            <span>SHOWING</span>
            <span className="font-bold text-sm text-[#CFE0C3]">{filteredProducts.length}</span>
            <span>OF {PRODUCTS.length} ROASTS & HARDWARE</span>
          </div>
        </div>

        {/* Search Bar & Action Toolbar */}
        <div className="py-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-[#EFEBE3]/10">
          {/* Instant Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EFEBE3]/40" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Fuzzy search by name, origin country, process, or tasting notes..."
              className="w-full bg-[#13261F] border border-[#EFEBE3]/20 rounded-sm pl-10 pr-10 py-2.5 text-xs font-mono text-[#EFEBE3] placeholder-[#EFEBE3]/40 focus:outline-none focus:border-[#E8472B]"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EFEBE3]/40 hover:text-[#E8472B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort, View Toggle, Mobile Filter Trigger */}
          <div className="flex items-center gap-3 justify-between lg:justify-end">
            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-sm border border-[#EFEBE3]/20 text-xs font-mono uppercase tracking-wider"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#E8472B]" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#EFEBE3]/50 hidden sm:inline" />
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState["sortBy"],
                  }))
                }
                className="bg-[#13261F] border border-[#EFEBE3]/20 text-[#EFEBE3] rounded-sm px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#E8472B] cursor-pointer"
              >
                <option value="featured" className="bg-[#0D1B16]">Sort: Featured Lots</option>
                <option value="price-asc" className="bg-[#0D1B16]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#0D1B16]">Price: High to Low</option>
                <option value="rating" className="bg-[#0D1B16]">Highest Customer Rating</option>
                <option value="newest" className="bg-[#0D1B16]">Freshly Roasted First</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-[#EFEBE3]/20 rounded-sm overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#E8472B] text-[#EFEBE3]"
                    : "hover:bg-[#EFEBE3]/10 text-[#EFEBE3]/60"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-[#E8472B] text-[#EFEBE3]"
                    : "hover:bg-[#EFEBE3]/10 text-[#EFEBE3]/60"
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Removable Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="py-4 flex flex-wrap items-center gap-2 border-b border-[#EFEBE3]/10 font-mono text-xs">
            <span className="text-[10px] uppercase text-[#EFEBE3]/40 mr-1">ACTIVE FILTERS:</span>

            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#EFEBE3]/10 border border-[#EFEBE3]/20 text-[11px]">
                <span>Query: "{filters.search}"</span>
                <button
                  onClick={() => setFilters((p) => ({ ...p, search: "" }))}
                  className="hover:text-[#E8472B]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.category !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#EFEBE3]/10 border border-[#EFEBE3]/20 text-[11px]">
                <span className="capitalize">{filters.category}</span>
                <button
                  onClick={() => setFilters((p) => ({ ...p, category: "all" }))}
                  className="hover:text-[#E8472B]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.origins.map((orig) => (
              <span
                key={orig}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#E8472B]/15 border border-[#E8472B]/30 text-[#E8472B] text-[11px]"
              >
                <span>{orig}</span>
                <button
                  onClick={() =>
                    setFilters((p) => ({ ...p, origins: p.origins.filter((o) => o !== orig) }))
                  }
                  className="hover:opacity-75"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.processes.map((proc) => (
              <span
                key={proc}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#CFE0C3]/15 border border-[#CFE0C3]/30 text-[#CFE0C3] text-[11px]"
              >
                <span>{proc}</span>
                <button
                  onClick={() =>
                    setFilters((p) => ({
                      ...p,
                      processes: p.processes.filter((pr) => pr !== proc),
                    }))
                  }
                  className="hover:opacity-75"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              onClick={handleResetFilters}
              className="text-[10px] uppercase tracking-wider text-[#E8472B] underline hover:no-underline ml-2"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Main Catalog Layout: Sidebar + Product Grid */}
        <div className="flex gap-10 mt-8 items-start">
          {/* Faceted Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            isMobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          {/* Product Feed */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center border border-[#EFEBE3]/10 bg-[#13261F] rounded-sm p-8 space-y-4">
                <Coffee className="w-10 h-10 text-[#EFEBE3]/30 mx-auto" />
                <h3 className="font-serif text-3xl text-[#EFEBE3]">
                  No matching roasts found.
                </h3>
                <p className="font-sans text-xs text-[#EFEBE3]/60 max-w-md mx-auto leading-relaxed">
                  We roast in small deliberate micro-batches. Try broadening your origin or roast level filter to view current offerings.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-block px-5 py-2.5 rounded-sm bg-[#E8472B] text-[#EFEBE3] text-xs font-mono uppercase tracking-widest font-semibold hover:bg-[#d63f24] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col space-y-4"
                }
              >
                <AnimatePresence>
                  {filteredProducts.map((prod) => (
                    <motion.div
                      key={prod.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ProductCard
                        product={prod}
                        onQuickView={setQuickViewProduct}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D1B16] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#EFEBE3]/60">
          Loading Specialty Repository...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
