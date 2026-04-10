import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../shared/services/api";
import { useUserStore } from "../../../app/store/userStore";
import toast from "react-hot-toast";

export default function ShopDetailPage() {
  const { shopId } = useParams();
  const { token } = useUserStore();

  const [shopInfo, setShopInfo] = useState({
    name: "",
    description: "",
    logo: "",
    address: "",
    hours: "",
  });

  const [stats, setStats] = useState({
    orders: 0,
    sales: 0,
    products: 0,
  });

  const [loading, setLoading] = useState(true);

  // --- Récupération des infos réelles ---
  useEffect(() => {
    if (!token || !shopId) return;

    const fetchShop = async () => {
      try {
        const res = await api.get(`/shops/${shopId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShopInfo({
          name: res.data.name,
          description: res.data.description || "",
          logo: res.data.logo || "",
          address: res.data.address || "",
          hours: res.data.hours || "",
        });

        // Si ton API retourne des stats séparées
        setStats({
          orders: res.data.stats?.orders || 0,
          sales: res.data.stats?.sales || 0,
          products: res.data.stats?.products || 0,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Impossible de charger les informations de la boutique");
        setLoading(false);
      }
    };

    fetchShop();
  }, [token, shopId]);

  const handleChange = (e) => {
  setShopInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
};
 const handleLogoChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    setShopInfo(prev => ({ ...prev, logo: url }));
  }
};

  const handleSave = async () => {
    if (!token || !shopId) return;

    const formData = new FormData();
    formData.append("name", shopInfo.name);
    formData.append("description", shopInfo.description);
    formData.append("address", shopInfo.address);
    formData.append("hours", shopInfo.hours);
    if (shopInfo._file) formData.append("logo", shopInfo._file);

    try {
      await api.patch(`/shops/${shopId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Boutique mise à jour avec succès");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  if (loading) return <p className="p-6 text-center">Chargement...</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{shopInfo.name}</h1>

        {/* Infos */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Informations</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {shopInfo.logo ? (
                <img src={shopInfo.logo} alt="Logo boutique" className="w-40 h-40 object-cover rounded" />
              ) : (
                <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded text-gray-400">
                  Pas de logo
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleLogoChange} className="mt-2" />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={shopInfo.name}
                onChange={handleChange}
                placeholder="Nom de la boutique"
                className="border px-3 py-2 rounded"
              />
              <textarea
                name="description"
                value={shopInfo.description}
                onChange={handleChange}
                placeholder="Description"
                className="border px-3 py-2 rounded h-24"
              />
              <input
                type="text"
                name="address"
                value={shopInfo.address}
                onChange={handleChange}
                placeholder="Adresse"
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="hours"
                value={shopInfo.hours}
                onChange={handleChange}
                placeholder="Horaires"
                className="border px-3 py-2 rounded"
              />
              <button
                onClick={handleSave}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Statistiques</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-gray-500">Commandes</p>
              <p className="text-2xl font-bold">{stats.orders}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-gray-500">Ventes</p>
              <p className="text-2xl font-bold">${stats.sales}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-gray-500">Produits</p>
              <p className="text-2xl font-bold">{stats.products}</p>
            </div>
          </div>
        </section>

        {/* Paramètres */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Paramètres</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">Adresse</label>
              <input
                type="text"
                name="address"
                value={shopInfo.address}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">Horaires</label>
              <input
                type="text"
                name="hours"
                value={shopInfo.hours}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}