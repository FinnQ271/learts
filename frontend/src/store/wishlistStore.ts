import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./cartStore";

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) return {};
          return { items: [...state.items, product] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (product) => {
        const isIn = get().items.some((item) => item.id === product.id);
        if (isIn) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "learts-wishlist-storage",
    }
  )
);
