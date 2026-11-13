import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Currency = "AUD" | "NZD" | "EUR" | "GBP" | "USD";

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; label: string }> = {
  AUD: { symbol: "A$", rate: 1.0, label: "Australian Dollar" },
  NZD: { symbol: "NZ$", rate: 1.1, label: "New Zealand Dollar" },
  EUR: { symbol: "€", rate: 0.62, label: "Euro" },
  GBP: { symbol: "£", rate: 0.52, label: "British Pound" },
  USD: { symbol: "$", rate: 0.66, label: "US Dollar" },
};

export function formatPrice(priceInAud: number, currency: Currency = "AUD"): string {
  const info = CURRENCY_RATES[currency] || CURRENCY_RATES.AUD;
  const converted = priceInAud * info.rate;
  return `${info.symbol}${converted.toFixed(2)}`;
}

export const FREE_SHIPPING_THRESHOLD_AUD = 60;
