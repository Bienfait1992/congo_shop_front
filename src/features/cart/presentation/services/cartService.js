import axios from "axios";
import { useUserStore } from "../../../../app/store/userStore";

const API = "http://localhost:3000/api/cart";

const getAuthHeader = () => {
  const { token } = useUserStore.getState(); // récupère token
  if (!token) throw new Error("Token manquant");
  return { Authorization: `Bearer ${token}` };
};

export const cartService = {
  getCart: async () => {
    const res = await axios.get(API, { headers: getAuthHeader() });
    return res.data;
  },

  updateItem: async (itemId, quantity) => {
    await axios.patch(`${API}/items/${itemId}`, 
      { quantity },
      { headers: getAuthHeader() }
    );
  },

  removeItem: async (itemId) => {
    await axios.delete(`${API}/items/${itemId}`, { headers: getAuthHeader() });
  },

  clearCart: async () => {
  const { token } = useUserStore.getState();
  await axios.delete(API, { headers: { Authorization: `Bearer ${token}` } });
},
};