"use client";

import { useCurrencyStore } from "@/store/useCurrencyStore";
import { Currency, CURRENCY_RATES } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CurrencySelector({ darkTheme = false }: { darkTheme?: boolean }) {
  const { currency, setCurrency } = useCurrencyStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencies: Currency[] = ["AUD", "NZD", "EUR", "GBP", "USD"];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block font-mono text-xs" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-sm border transition-colors ${
          darkTheme
            ? "border-[#EFEBE3]/20 bg-[#0D1B16]/60 text-[#EFEBE3] hover:border-[#EFEBE3]/40"
            : "border-[#0D1B16]/20 bg-[#EFEBE3]/60 text-[#0D1B16] hover:border-[#0D1B16]/40"
        }`}
        aria-label="Select currency"
      >
        <span>{currency}</span>
        <span className="text-[10px] opacity-60">({CURRENCY_RATES[currency].symbol})</span>
        <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-1.5 w-36 rounded-sm shadow-2xl py-1 z-50 border ${
            darkTheme
              ? "bg-[#0D1B16] border-[#EFEBE3]/20 text-[#EFEBE3]"
              : "bg-[#EFEBE3] border-[#0D1B16]/20 text-[#0D1B16]"
          }`}
        >
          {currencies.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCurrency(c);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs transition-colors ${
                c === currency
                  ? "bg-[#E8472B] text-[#EFEBE3] font-medium"
                  : darkTheme
                  ? "hover:bg-[#EFEBE3]/10"
                  : "hover:bg-[#0D1B16]/10"
              }`}
            >
              <span>{c}</span>
              <span className="font-mono text-[10px] opacity-75">{CURRENCY_RATES[c].symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
