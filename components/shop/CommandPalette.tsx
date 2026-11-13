"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { Currency } from "@/lib/utils";
import { Search, ShoppingBag, Coffee, MapPin, Compass, ArrowRight, DollarSign } from "lucide-react";

export default function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { openCart } = useCartStore();
  const { setCurrency } = useCurrencyStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10001] bg-[#0D1B16]/80 backdrop-blur-md flex items-start justify-center pt-24 px-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-xl bg-[#0D1B16] border border-[#EFEBE3]/20 text-[#EFEBE3] rounded-lg shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Global Command Menu" shouldFilter={true}>
          {/* Search Input */}
          <div className="flex items-center px-4 border-b border-[#EFEBE3]/15 py-3">
            <Search className="w-4 h-4 text-[#EFEBE3]/50 mr-3 shrink-0" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search roasts, origins, gear, or jump to section..."
              className="w-full bg-transparent text-sm text-[#EFEBE3] placeholder-[#EFEBE3]/40 focus:outline-none font-mono"
              autoFocus
            />
            <span className="text-[10px] font-mono uppercase bg-[#EFEBE3]/10 text-[#EFEBE3]/60 px-2 py-0.5 rounded">
              ESC
            </span>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 no-scrollbar text-xs">
            <Command.Empty className="py-6 text-center text-[#EFEBE3]/50 font-mono">
              No matching roasts or commands found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="QUICK JUMP" className="text-[10px] font-mono uppercase text-[#E8472B] px-2 py-1 tracking-wider">
              <Command.Item
                onSelect={() => {
                  onOpenChange(false);
                  router.push("/shop");
                }}
                className="flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-[#EFEBE3]/10 aria-selected:bg-[#E8472B] aria-selected:text-[#EFEBE3]"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 opacity-70" />
                  <span className="font-medium text-sm">Explore All Roasts & Equipment</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onOpenChange(false);
                  openCart();
                }}
                className="flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-[#EFEBE3]/10 aria-selected:bg-[#E8472B] aria-selected:text-[#EFEBE3]"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 opacity-70" />
                  <span className="font-medium text-sm">View Cart Drawer</span>
                </div>
                <span className="font-mono text-[10px] opacity-70">DRAWER</span>
              </Command.Item>
            </Command.Group>

            {/* Products (24 items searchable) */}
            <Command.Group heading="SPECIALTY COFFEE CATALOG" className="text-[10px] font-mono uppercase text-[#EFEBE3]/40 px-2 py-1 mt-2 tracking-wider">
              {PRODUCTS.map((prod) => (
                <Command.Item
                  key={prod.id}
                  value={`${prod.name} ${prod.originCountry} ${prod.region} ${prod.tastingNotes.join(" ")} ${prod.process}`}
                  onSelect={() => {
                    onOpenChange(false);
                    router.push(`/shop/${prod.slug}`);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-[#EFEBE3]/10 aria-selected:bg-[#E8472B] aria-selected:text-[#EFEBE3]"
                >
                  <div className="flex items-center gap-2.5">
                    <Coffee className="w-4 h-4 text-[#CFE0C3]" />
                    <div>
                      <div className="font-medium text-sm text-[#EFEBE3]">{prod.name}</div>
                      <div className="text-[10px] font-mono text-[#EFEBE3]/60">
                        {prod.originCountry} · {prod.process} · {prod.tastingNotes.slice(0, 2).join(", ")}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#CFE0C3]">A${prod.priceAud}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Currency Switcher */}
            <Command.Group heading="SWITCH CURRENCY" className="text-[10px] font-mono uppercase text-[#EFEBE3]/40 px-2 py-1 mt-2 tracking-wider">
              {(["AUD", "NZD", "EUR", "GBP", "USD"] as Currency[]).map((cur) => (
                <Command.Item
                  key={cur}
                  value={`currency ${cur}`}
                  onSelect={() => {
                    setCurrency(cur);
                    onOpenChange(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-[#EFEBE3]/10 aria-selected:bg-[#E8472B] aria-selected:text-[#EFEBE3]"
                >
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-3.5 h-3.5 opacity-60" />
                    <span>Set display currency to {cur}</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-70">RATES LIVE</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="px-4 py-2 border-t border-[#EFEBE3]/10 bg-[#0A1410] flex justify-between items-center text-[10px] font-mono text-[#EFEBE3]/40">
            <span>SLOW TIDE REPOSITORY SEARCH</span>
            <span>PRESS ESC TO CLOSE</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
