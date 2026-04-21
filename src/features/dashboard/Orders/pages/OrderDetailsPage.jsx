import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../../shared/services/api";
import { useUserStore } from "../../../../app/store/userStore";
import toast from "react-hot-toast";
import MessageThreadRealtime from "../../../messages/MessageThreadRealtime";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useUserStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

const [chatOpen, setChatOpen] = useState(false);
const [chatType, setChatType] = useState(""); // seller | delivery
const [receiverId, setReceiverId] = useState(null);
const [message, setMessage] = useState("");
const [messages, setMessages] = useState([]);

const { user } = useUserStore();



  // =========================
  // FETCH ORDER
  // =========================
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || !token) return;

      try {
        const res = await api.get(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(res.data);
      } catch (err) {
        toast.error("Impossible de charger la commande");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const handleContactSeller = () => {
    navigate(`/chat/seller/${order.shopId}`);
  };

  const handleContactDelivery = () => {
    if (!order.deliverymanId) return;
    navigate(`/chat/delivery/${order.deliverymanId}`);
  };

  const cancelOrder = async () => {
    try {
      await api.patch(`/orders/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Commande annulée");
      navigate("/orders");
    } catch (err) {
      toast.error("Impossible d'annuler");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-red-500">Commande introuvable</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-black text-white px-4 py-2 rounded"
        >
          Retour accueil
        </button>
      </div>
    );
  }

  const total = order.totalPrice + (order.deliveryFee || 0);

// const openChat = (type) => {
//   if (type === "seller") {
//     if (!order?.shop?.userId) {
//       console.log("❌ shop.userId manquant");
//       return;
//     }

//     setReceiverId(order.shop.userId);
//   }

//   if (type === "delivery") {
//     if (!order?.delivery?.deliveryMan?.id) return;

//     setReceiverId(order.delivery.deliveryMan.id);
//   }

//   setChatOpen(true);
// };

const openChat = (type) => {
  if (!order) return;

  setChatType(type);

  if (type === "seller") {
    setReceiverId(order.shop?.ownerId || order.shopId);
  }

  if (type === "delivery") {
    setReceiverId(order.delivery?.deliveryMan?.id || order.deliverymanId);
  }

  setChatOpen(true);
};

console.log("ORDER FULL:", order);
const sendMessage = async () => {
  if (!message.trim()) return;

  try {
    const res = await api.post(
      "/messages",
      {
        receiverId,
        message,
        orderId: order.id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages((prev) => [...prev, res.data]);
    setMessage("");
  } catch (err) {
    console.log(err);
    toast.error("Message non envoyé");
  }
};

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">

      {/* CONTAINER */}
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Commande #{order.id.slice(0, 8)}
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Statut :
              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-semibold">
                {order.status}
              </span>
            </p>
          </div>

          <button
            onClick={() => navigate("/orders")}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm"
          >
            Mes commandes
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* DELIVERY */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold mb-3">Livraison</h2>
              <p>{order.addressSnapshot?.address}</p>
              <p>{order.addressSnapshot?.city}</p>
              <p>{order.addressSnapshot?.zip}</p>
            </div>

            {/* ITEMS */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold mb-4">Produits</h2>

              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start border-b pb-3"
                  >
                    <div>
                      <p className="font-medium">{item.product?.name}</p>

                      {item.variant && (
                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                          <p>Couleur: {item.variant.attributes?.color || "Option"}</p>
                          <p>Taille: {item.variant.attributes?.size || "Standard"}</p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-1">
                        Quantité: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-right">
                      {item.price} $
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* SUMMARY */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold mb-4">Résumé</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{order.totalPrice} $</span>
                </div>

                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{order.deliveryFee || 0} $</span>
                </div>

                <hr />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{total} $</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="bg-white rounded-xl shadow p-5 space-y-3">

              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200"
              >
                Continuer les achats
              </button>

             <button
  onClick={() => openChat("seller")}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  Contacter vendeur
</button>

<button
  onClick={() => openChat("delivery")}
  className="bg-green-500 text-white px-4 py-2 rounded"
>
  Contacter livreur
</button>

              {order.status === "PENDING" && (
                <button
                  onClick={cancelOrder}
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Annuler la commande
                </button>
              )}

            </div>

          </div>
        </div>
      </div>


 {/* {chatOpen && (
  <MessageThreadRealtime
    currentUserId={user.id}
    otherUserId={order.shop?.userId}
    onClose={() => setChatOpen(false)}
  />
)} */}

{chatOpen && receiverId && (
  <MessageThreadRealtime
    currentUserId={user.id}
    otherUserId={receiverId}
    onClose={() => setChatOpen(false)}
  />
)}i
    </div>
  );
}