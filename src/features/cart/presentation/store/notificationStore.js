import { create } from "zustand";
import { api } from "../../../../shared/services/api";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  // 🔄 FETCH
  fetchNotifications: async (token) => {
    if (!token) return;

    set({ loading: true });

    try {
      const { data } = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ notifications: data });
    } catch (err) {
      console.error("Erreur notifications", err);
    } finally {
      set({ loading: false });
    }
  },

  // ➕ AJOUT REALTIME (socket)
  addNotification: (notif) => {
    set((state) => ({
      notifications: [notif, ...state.notifications],
    }));
  },

  // ✅ MARK AS READ
  markAsRead: async (id, token) => {
    try {
      await api.patch(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // 🔥 MARK ALL
  markAllAsRead: async (token) => {
    try {
      await api.patch("/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
        })),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // ❌ DELETE
  removeNotification: async (id, token) => {
    try {
      await api.delete(`/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // 🔢 COUNT NON LU
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },
}));