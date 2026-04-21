import { create } from "zustand";
import { cartService } from "../services/cartService";

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const data = await cartService.getCart();
      set({ cart: data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await cartService.updateItem(itemId, quantity);
      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        },
      }));
    } catch (err) {
      console.error(err);
    }
  },

  removeItem: async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item.id !== itemId),
        },
      }));
    } catch (err) {
      console.error(err);
    }
  },

  clearCart: async () => {
  try {
    await cartService.clearCart(); // appel API DELETE /
    set({ cart: { ...get().cart, items: [] } });
  } catch (err) {
    console.error(err);
  }
},
}));