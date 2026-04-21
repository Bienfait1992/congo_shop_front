import { useEffect, useState } from "react";
import { api } from "../../../../shared/services/api";
import toast from "react-hot-toast";
import { useUserStore } from "../../../../app/store/userStore";

const STATUS_COLORS = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
  SUSPENDED: "bg-orange-500",
  BANNED: "bg-black",
};

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [shopFilter, setShopFilter] = useState("PENDING");
  const { token, user } = useUserStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");

  useEffect(() => {
    if (!token) return;
    api
      .get("/shops", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setShops(res.data))
      .catch(console.error);
  }, [token]);

  const openConfirmModal = (shop, action) => {
    setSelectedShop(shop);
    setSelectedAction(action);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    try {
      const { data } = await api.patch(
        `/shops/${selectedShop.id}/approve`,
        { action: selectedAction },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShops(prev =>
        prev.map(s => (s.id === selectedShop.id ? data.shop : s))
      );

      toast.success(`Boutique ${selectedAction}`);
    } catch {
      toast.error("Erreur lors de l'action");
    } finally {
      setModalOpen(false);
    }
  };

  const getActions = (shop) => {
    switch (shop.status) {
      case "PENDING":
        return [
          { label: "Approuver", action: "APPROVE", color: "bg-green-500" },
          { label: "Rejeter", action: "REJECT", color: "bg-red-500" },
        ];
      case "APPROVED":
        return [
          { label: "Suspendre", action: "SUSPEND", color: "bg-orange-500" },
          { label: "Bannir", action: "BAN", color: "bg-black" },
        ];
      case "SUSPENDED":
        return [
          { label: "Réactiver", action: "ACTIVATE", color: "bg-green-500" },
          { label: "Bannir", action: "BAN", color: "bg-black" },
        ];
      default:
        return [];
    }
  };

  const filteredShops = shops.filter(
    s => shopFilter === "ALL" || s.status === shopFilter
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des boutiques</h1>

        <select
          value={shopFilter}
          onChange={(e) => setShopFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="ALL">Toutes</option>
          <option value="PENDING">En attente</option>
          <option value="APPROVED">Actives</option>
          <option value="SUSPENDED">Suspendues</option>
          <option value="REJECTED">Rejetées</option>
          <option value="BANNED">Bannies</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredShops.map(shop => (
          <div key={shop.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

            {/* STATUS */}
            <div className={`text-white text-xs px-3 py-1 ${STATUS_COLORS[shop.status]}`}>
              {shop.status}
            </div>

            {/* LOGO */}
            <div className="h-40 flex items-center justify-center bg-gray-100">
              {shop.logo ? (
                <img src={shop.logo} className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  Logo
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h2 className="font-semibold">{shop.name}</h2>
              <p className="text-sm text-gray-500 line-clamp-2">{shop.description}</p>

              {/* ACTIONS */}
              {user.role === "ADMIN" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {getActions(shop).map(btn => (
                    <button
                      key={btn.action}
                      onClick={() => openConfirmModal(shop, btn.action)}
                      className={`px-3 py-1 text-white rounded ${btn.color}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="font-bold text-lg mb-3">Confirmation</h3>
            <p>
              Confirmer l'action <b>{selectedAction}</b> pour{" "}
              <b>{selectedShop?.name}</b> ?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalOpen(false)}>Annuler</button>
              <button
                onClick={confirmAction}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}