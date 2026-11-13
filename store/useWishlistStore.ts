import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      toggleWishlist: (productId: string) => {
        const { wishlistIds } = get();
        if (wishlistIds.includes(productId)) {
          set({ wishlistIds: wishlistIds.filter((id) => id !== productId) });
        } else {
          set({ wishlistIds: [...wishlistIds, productId] });
        }
      },
      isInWishlist: (productId: string) => get().wishlistIds.includes(productId),
    }),
    {
      name: "slow-tide-wishlist-v1",
    }
  )
);
