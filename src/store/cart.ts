import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItemType } from "@/types";

interface CartState {
  items: CartItemType[];
  sessionId: string | null;
  addItem: (item: CartItemType) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setSessionId: (id: string) => void;
  getTotal: () => number;
  getItemCount: () => number;
  syncWithServer: (sessionId: string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: null,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      setSessionId: (id) => set({ sessionId: id }),

      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },

      syncWithServer: async (sessionId) => {
        try {
          const res = await fetch(`/api/cart?sessionId=${sessionId}`);
          if (res.ok) {
            const cart = await res.json();
            if (cart?.items) {
              set({ items: cart.items });
            }
          }
        } catch {
          // keep local state on error
        }
      },
    }),
    {
      name: "jewelry-cart",
    }
  )
);