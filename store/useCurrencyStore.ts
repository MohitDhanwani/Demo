import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Currency } from "@/lib/utils";

interface CurrencyStore {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "AUD",
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "slow-tide-currency-v1",
    }
  )
);
