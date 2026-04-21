import { create } from "zustand";

export const useWishlistStore = create((set) => ({
  count: 0,
  items: [],

  setWishlist: (items) =>
    set({
      items,
      count: items.length,
    }),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
      count: state.count + 1,
    })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
      count: Math.max(0, state.count - 1),
    })),
}));