import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FREE_SHIPPING_THRESHOLD_AUD } from "@/lib/utils";

export interface CartItem {
  cartItemId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  sizeLabel: string;
  grams: number;
  grind: string;
  priceAud: number;
  quantity: number;
  isSubscription: boolean;
  subscriptionIntervalWeeks?: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotalAud: () => number;
  getTotalItemsCount: () => number;
  getShippingProgress: () => { threshold: number; remaining: number; progressPercent: number; isFree: boolean };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [
        // Default realistic initial sample item so cart isn't empty on first visit
        {
          cartItemId: "sample-halo-beriti-250g",
          productId: "prod-01",
          slug: "halo-beriti-ethiopia",
          name: "Halo Beriti (Yirgacheffe)",
          image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop",
          sizeLabel: "250g",
          grams: 250,
          grind: "Filter / V60 (Medium)",
          priceAud: 26,
          quantity: 1,
          isSubscription: false,
        },
      ],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem) => {
        const { items } = get();
        // Check if matching item exists
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === newItem.productId &&
            i.sizeLabel === newItem.sizeLabel &&
            i.grind === newItem.grind &&
            i.isSubscription === newItem.isSubscription
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += newItem.quantity;
          set({ items: updated, isOpen: true });
        } else {
          const cartItemId = `${newItem.productId}-${newItem.sizeLabel}-${newItem.grind}-${Date.now()}`;
          set({
            items: [...items, { ...newItem, cartItemId }],
            isOpen: true,
          });
        }
      },

      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((i) => i.cartItemId !== cartItemId),
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set({
          items: get().items.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotalAud: () => {
        return get().items.reduce((total, item) => {
          const unitPrice = item.isSubscription ? item.priceAud * 0.9 : item.priceAud;
          return total + unitPrice * item.quantity;
        }, 0);
      },

      getTotalItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getShippingProgress: () => {
        const subtotal = get().getSubtotalAud();
        const threshold = FREE_SHIPPING_THRESHOLD_AUD;
        const remaining = Math.max(0, threshold - subtotal);
        const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
        return {
          threshold,
          remaining,
          progressPercent,
          isFree: subtotal >= threshold,
        };
      },
    }),
    {
      name: "slow-tide-cart-v1",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
