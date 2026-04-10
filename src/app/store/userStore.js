import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  // ⚡ état initial
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  deliveryAddress: null, // <-- nouvelle propriété pour l'adresse

  // Connexion : stocke token et infos utilisateur
  login: (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData, token });
  },

  // Déconnexion : supprime token et infos utilisateur
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  // Vérifie si l'utilisateur est connecté
  isLoggedIn: () => !!get().token,

  // Vérifie si l'utilisateur a un rôle spécifique
  hasRole: (role) => get().user?.role === role,

  // 🔹 Mise à jour de l'adresse de livraison
  setDeliveryAddress: (addr) => set({ deliveryAddress: addr }),
}));