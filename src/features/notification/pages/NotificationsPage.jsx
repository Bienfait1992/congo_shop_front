import { useEffect } from "react";
import { useNotificationStore } from "../../cart/presentation/store/notificationStore";
import { Bell, Package, Truck, MessageCircle } from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    fetchNotifications,
    loading,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "ORDER":
        return <Package size={18} className="text-blue-600" />;
      case "DELIVERY":
        return <Truck size={18} className="text-green-600" />;
      case "CHAT":
        return <MessageCircle size={18} className="text-purple-600" />;
      default:
        return <Bell size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Chargement des notifications...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vos notifications</h1>

        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-600 hover:underline"
        >
          Tout marquer comme lu
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl shadow divide-y">

        {notifications.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            Aucune notification pour le moment
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-4 p-4 transition hover:bg-gray-50 cursor-pointer ${
              !n.isRead ? "bg-blue-50" : ""
            }`}
          >
            {/* ICON */}
            <div className="mt-1">
              {getIcon(n.type)}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <div className="flex justify-between items-center">

                <p className="font-semibold text-gray-800">
                  {n.title}
                </p>

                {/* BADGE NON LU */}
                {!n.isRead && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Nouveau
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {n.message}
              </p>

              {/* DATE */}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}