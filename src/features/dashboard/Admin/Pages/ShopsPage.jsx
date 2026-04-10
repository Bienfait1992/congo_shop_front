// import { useEffect, useState } from "react";
// import { api } from "../../../../shared/services/api";
// import toast from "react-hot-toast";
// import { useUserStore } from "../../../../app/store/userStore";

// export default function ShopsPage() {
//   const [shops, setShops] = useState([]);
//   const [shopFilter, setShopFilter] = useState("PENDING");
//   const { token, user } = useUserStore();

//   // Récupération des boutiques
//   useEffect(() => {
//     if (!token) return;
//     api
//       .get("/shops", { headers: { Authorization: `Bearer ${token}` } })
//       .then(res => setShops(res.data))
//       .catch(console.error);
//   }, [token]);

//   // Mise à jour du statut d’une boutique (admin seulement)
//   const updateShopStatus = async (id, approve) => {
//     if (!token || user.role !== "ADMIN") return;
//     try {
//       const { data } = await api.patch(
//         `/shops/${id}/approve`,
//         { approve },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setShops(prev => prev.map(s => (s.id === id ? data.shop : s)));
//       toast.success(approve ? "Boutique approuvée" : "Boutique rejetée", { duration: 3000 });
//     } catch {
//       toast.error("Erreur lors de la mise à jour");
//     }
//   };

//   const filteredShops = shops.filter(
//     s => shopFilter === "ALL" ? true : s.status === shopFilter
//   );

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Boutiques</h1>
//         {user.role === "ADMIN" && (
//           <select
//             value={shopFilter}
//             onChange={e => setShopFilter(e.target.value)}
//             className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
//           >
//             <option value="PENDING">PENDING</option>
//             <option value="APPROVED">APPROVED</option>
//             <option value="REJECTED">REJECTED</option>
//             <option value="ALL">ALL</option>
//           </select>
//         )}
//       </div>

//       {/* Liste des boutiques */}
//       {filteredShops.length === 0 ? (
//         <p className="text-gray-500 text-center mt-10">Aucune boutique</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredShops.map(shop => (
//             <div
//               key={shop.id}
//               className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-200 overflow-hidden flex flex-col"
//             >
//               {shop.logo ? (
//                 <img
//                   src={shop.logo}
//                   alt={shop.name}
//                   className="w-full h-48 object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 font-semibold">
//                   Pas de logo
//                 </div>
//               )}

//               <div className="p-4 flex flex-col flex-1 justify-between">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">{shop.name}</h2>
//                   {shop.description && (
//                     <p className="text-gray-600 text-sm mt-1">{shop.description}</p>
//                   )}
//                   <p className="text-gray-500 text-sm mt-2">
//                     Statut: <span className="font-medium">{shop.status}</span>
//                   </p>
//                 </div>

//                 {/* Boutons de statut (admin seulement) */}
//                 {user.role === "ADMIN" && (
//                   <div className="mt-4 flex gap-2">
//                     {shop.status !== "APPROVED" && (
//                       <button
//                         onClick={() => updateShopStatus(shop.id, true)}
//                         className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
//                       >
//                         Approuver
//                       </button>
//                     )}
//                     {shop.status !== "REJECTED" && (
//                       <button
//                         onClick={() => updateShopStatus(shop.id, false)}
//                         className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                       >
//                         Rejeter
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { api } from "../../../../shared/services/api";
import toast from "react-hot-toast";
import { useUserStore } from "../../../../app/store/userStore";

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [shopFilter, setShopFilter] = useState("PENDING");
  const { token, user } = useUserStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedAction, setSelectedAction] = useState(false);

  // Récupération des boutiques
  useEffect(() => {
    if (!token) return;
    api
      .get("/shops", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setShops(res.data))
      .catch(console.error);
  }, [token]);

  const openConfirmModal = (shop, approve) => {
    setSelectedShop(shop);
    setSelectedAction(approve);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    if (!token || !selectedShop) return;
    try {
      const { data } = await api.patch(
        `/shops/${selectedShop.id}/approve`,
        { approve: selectedAction },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShops(prev => prev.map(s => (s.id === selectedShop.id ? data.shop : s)));
      toast.success(selectedAction ? "Boutique approuvée" : "Boutique rejetée", { duration: 3000 });
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setModalOpen(false);
      setSelectedShop(null);
    }
  };

  const filteredShops = shops.filter(
    s => shopFilter === "ALL" ? true : s.status === shopFilter
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Boutiques</h1>
        {user.role === "ADMIN" && (
          <select
            value={shopFilter}
            onChange={e => setShopFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="ALL">ALL</option>
          </select>
        )}
      </div>

      {/* Liste des boutiques */}
      {filteredShops.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">Aucune boutique</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredShops.map(shop => (
            <div
              key={shop.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col relative"
            >
              {/* Badge de statut */}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold text-white
                ${shop.status === "APPROVED" ? "bg-green-500" :
                  shop.status === "REJECTED" ? "bg-red-500" : "bg-yellow-500"}`}>
                {shop.status}
              </div>

              {/* Logo */}
              <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="h-32 w-32 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-semibold">
                    Logo
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 truncate">{shop.name}</h2>
                  {shop.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">{shop.description}</p>
                  )}
                </div>

                {/* Actions */}
                {user.role === "ADMIN" && (
                  <div className="mt-4 flex gap-2">
                    {shop.status !== "APPROVED" && (
                      <button
                        onClick={() => openConfirmModal(shop, true)}
                        className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        Approuver
                      </button>
                    )}
                    {shop.status !== "REJECTED" && (
                      <button
                        onClick={() => openConfirmModal(shop, false)}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Rejeter
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmation */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Confirmation</h3>
            <p>Voulez-vous vraiment {selectedAction ? "approuver" : "rejeter"} la boutique "{selectedShop?.name}" ?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-md ${
                  selectedAction ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}