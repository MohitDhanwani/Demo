"use client";

import { useMemo } from "react";
import { PRODUCTS } from "@/data/products";
import { SlidersHorizontal, RotateCcw, X, Check } from "lucide-react";

export interface FilterState {
  search: string;
  category: string;
  roastLevels: number[];
  origins: string[];
  processes: string[];
  brewMethods: string[];
  tastingNotes: string[];
  maxPrice: number;
  inStockOnly: boolean;
  organicOnly: boolean;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function FilterSidebar({
  filters,
  setFilters,
  onReset,
  isMobileOpen = false,
  onMobileClose,
}: FilterSidebarProps) {
  // Compute origin counts dynamically from the catalog
  const originCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PRODUCTS.forEach((p) => {
      counts[p.originCountry] = (counts[p.originCountry] || 0) + 1;
    });
    return counts;
  }, []);

  const categories = [
    { id: "all", label: "All Offerings" },
    { id: "single-origin", label: "Single Origins" },
    { id: "blend", label: "Signature Blends" },
    { id: "reserve", label: "Limited Reserves" },
    { id: "decaf", label: "Specialty Decaf" },
    { id: "gear", label: "Precision Gear" },
  ];

  const processes = ["Washed", "Natural", "Honey", "Anaerobic", "Koji", "EA Sugarcane"];
  const popularTastingNotes = ["Bergamot", "Jasmine Bloom", "Blackcurrant", "Dark Chocolate", "Peach", "Citrus", "Vanilla", "Caramel"];

  const toggleOrigin = (origin: string) => {
    setFilters((prev) => ({
      ...prev,
      origins: prev.origins.includes(origin)
        ? prev.origins.filter((o) => o !== origin)
        : [...prev.origins, origin],
    }));
  };

  const toggleProcess = (proc: string) => {
    setFilters((prev) => ({
      ...prev,
      processes: prev.processes.includes(proc)
        ? prev.processes.filter((p) => p !== proc)
        : [...prev.processes, proc],
    }));
  };

  const toggleTastingNote = (note: string) => {
    setFilters((prev) => ({
      ...prev,
      tastingNotes: prev.tastingNotes.includes(note)
        ? prev.tastingNotes.filter((n) => n !== note)
        : [...prev.tastingNotes, note],
    }));
  };

  const content = (
    <div className="space-y-8 font-mono text-xs text-[#EFEBE3]">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE3]/15">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E8472B] font-semibold">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>HARVEST FILTERS</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#EFEBE3]/50 hover:text-[#E8472B] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Category Switcher */}
      <div>
        <span className="text-[10px] uppercase tracking-widest text-[#EFEBE3]/40 block mb-2.5">
          COLLECTION CATEGORY
        </span>
        <div className="flex flex-col space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
              className={`text-left px-3 py-1.5 rounded-sm transition-colors text-xs flex items-center justify-between ${
                filters.category === cat.id
                  ? "bg-[#E8472B] text-[#EFEBE3] font-medium"
                  : "text-[#EFEBE3]/75 hover:bg-[#EFEBE3]/5"
              }`}
            >
              <span>{cat.label}</span>
              {filters.category === cat.id && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Roast Level Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase tracking-widest text-[#EFEBE3]/40">
            ROAST LEVEL (LIGHT → DARK)
          </span>
          <span className="text-[10px] text-[#CFE0C3]">
            {filters.roastLevels.length === 0
              ? "All Levels"
              : filters.roastLevels.length === 1
              ? `Level ${filters.roastLevels[0]}`
              : `${filters.roastLevels.length} Selected`}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const isSelected = filters.roastLevels.includes(lvl);
            return (
              <button
                key={lvl}
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    roastLevels: isSelected
                      ? prev.roastLevels.filter((l) => l !== lvl)
                      : [...prev.roastLevels, lvl],
                  }));
                }}
                className={`py-1.5 rounded-sm border text-[10px] text-center transition-colors ${
                  isSelected
                    ? "border-[#E8472B] bg-[#E8472B] text-[#EFEBE3] font-bold"
                    : "border-[#EFEBE3]/20 text-[#EFEBE3]/70 hover:border-[#EFEBE3]/40"
                }`}
              >
                0{lvl}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-[9px] text-[#EFEBE3]/40 uppercase mt-1">
          <span>Nordic Light</span>
          <span>Rich Espresso</span>
        </div>
      </div>

      {/* 3. Origin Checklist */}
      <div>
        <span className="text-[10px] uppercase tracking-widest text-[#EFEBE3]/40 block mb-2.5">
          ORIGIN COUNTRY
        </span>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
          {Object.entries(originCounts).map(([country, count]) => {
            const isChecked = filters.origins.includes(country);
            return (
              <label
                key={country}
                className="flex items-center justify-between text-xs cursor-pointer py-1 px-2 rounded-sm hover:bg-[#EFEBE3]/5 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOrigin(country)}
                    className="accent-[#E8472B] w-3.5 h-3.5 rounded"
                  />
                  <span className={isChecked ? "text-[#EFEBE3] font-medium" : "text-[#EFEBE3]/70"}>
                    {country}
                  </span>
                </div>
                <span className="text-[10px] opacity-40">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Processing Method */}
      <div>
        <span className="text-[10px] uppercase tracking-widest text-[#EFEBE3]/40 block mb-2.5">
          PROCESSING METHOD
        </span>
        <div className="flex flex-wrap gap-1.5">
          {processes.map((proc) => {
            const isSelected = filters.processes.includes(proc);
            return (
              <button
                key={proc}
                onClick={() => toggleProcess(proc)}
                className={`px-2.5 py-1 rounded-sm border text-[10px] transition-colors ${
                  isSelected
                    ? "border-[#E8472B] bg-[#E8472B] text-[#EFEBE3] font-semibold"
                    : "border-[#EFEBE3]/20 text-[#EFEBE3]/70 hover:border-[#EFEBE3]/40"
                }`}
              >
                {proc}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Sensory Tasting Notes */}
      <div>
        <span className="text-[10px] uppercase tracking-widest text-[#EFEBE3]/40 block mb-2.5">
          SENSORY NOTES
        </span>
        <div className="flex flex-wrap gap-1.5">
          {popularTastingNotes.map((note) => {
            const isSelected = filters.tastingNotes.includes(note);
            return (
              <button
                key={note}
                onClick={() => toggleTastingNote(note)}
                className={`px-2.5 py-1 rounded-sm border text-[10px] transition-colors ${
                  isSelected
                    ? "border-[#CFE0C3] bg-[#CFE0C3] text-[#0D1B16] font-semibold"
                    : "border-[#EFEBE3]/20 text-[#EFEBE3]/70 hover:border-[#EFEBE3]/40"
                }`}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase tracking-widest text-[#EFEBE3]/40">
            MAX PRICE
          </span>
          <span className="font-semibold text-[#EFEBE3]">A${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="20"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-[#E8472B] cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-[#EFEBE3]/40 mt-1">
          <span>A$20</span>
          <span>A$500</span>
        </div>
      </div>

      {/* 7. Stock & Organic Toggles */}
      <div className="space-y-2 pt-2 border-t border-[#EFEBE3]/10">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
            }
            className="accent-[#E8472B] w-3.5 h-3.5 rounded"
          />
          <span className="text-[#EFEBE3]/80">In Stock Offerings Only</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={filters.organicOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, organicOnly: e.target.checked }))
            }
            className="accent-[#E8472B] w-3.5 h-3.5 rounded"
          />
          <span className="text-[#EFEBE3]/80">Certified Organic Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-28 bg-[#13261F] border border-[#EFEBE3]/15 rounded-sm p-6">
        {content}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[10002] lg:hidden flex">
          <div
            onClick={onMobileClose}
            className="fixed inset-0 bg-[#0D1B16]/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xs bg-[#13261F] text-[#EFEBE3] border-r border-[#EFEBE3]/20 h-full p-6 overflow-y-auto z-10 no-scrollbar">
            <div className="flex justify-end mb-4">
              <button
                onClick={onMobileClose}
                className="w-8 h-8 rounded-full border border-[#EFEBE3]/20 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
