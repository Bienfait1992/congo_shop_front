import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../shared/services/api";
import { useUserStore } from "../../../../app/store/userStore";
import { Package, Truck, Eye } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const { token } = useUserStore();
  const navigate = useNavigate();

  // =========================
  // FETCH ORDERS
  // =========================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(data);
      } catch (err) {
        console.error("Erreur orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  // =========================
  // PAGINATION LOGIC
  // =========================
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  // =========================
  // STATUS COLOR
  // =========================
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "CONFIRMED":
        return "text-blue-600 bg-blue-100";
      case "DELIVERING":
        return "text-purple-600 bg-purple-100";
      case "DELIVERED":
        return "text-green-600 bg-green-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Chargement des commandes...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6">
        Mes commandes
      </h1>

      {/* EMPTY */}
      {orders.length === 0 && (
        <div className="text-center text-gray-500">
          Vous n’avez encore aucune commande
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {currentOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow rounded-xl p-4 border flex flex-col gap-3"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  Commande #{order.id}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* SHOP + TOTAL */}
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1 text-gray-700">
                <Package size={16} />
                {order.shop?.name || "Boutique"}
              </span>

              <span className="font-bold">
                {order.totalPrice} $
              </span>
            </div>

            {/* DELIVERY */}
            {order.delivery && (
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <Truck size={16} />
                Livraison: {order.delivery.status}
              </div>
            )}

            {/* ACTION */}
            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                <Eye size={16} />
                Voir détails
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* =========================
          PAGINATION CONTROLS
      ========================= */}
      {orders.length > ordersPerPage && (
        <div className="flex justify-center items-center gap-4 mt-6">

          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Précédent
          </button>

          <span className="text-sm">
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Suivant
          </button>

        </div>
      )}

    </div>
  );
}