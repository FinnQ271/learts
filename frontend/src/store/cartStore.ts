import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;
  title: string;
  price: number;
  priceDisplay: string;
  image: string;
  hoverImage?: string;
  category: string;
  stock: number;
  oldPrice?: string;
  badges?: string[];
  sku?: string;
  brand?: string;
  description?: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          const currentQty = existingItem ? existingItem.quantity : 0;
          const targetQty = currentQty + quantity;

          // Clamp to stock
          const finalQty = Math.min(product.stock, Math.max(1, targetQty));

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: finalQty } : item
              ),
            };
          } else {
            return {
              items: [...state.items, { ...product, quantity: finalQty }],
            };
          }
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const item = state.items.find((item) => item.id === id);
          if (!item) return {};

          const finalQty = Math.min(item.stock, Math.max(1, quantity));
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity: finalQty } : item
            ),
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "learts-cart-storage", // local storage key
    }
  )
);
