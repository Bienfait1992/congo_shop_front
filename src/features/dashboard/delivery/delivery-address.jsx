// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useUserStore } from "../../../app/store/userStore";
// import { api } from "../../../shared/services/api";

// export default function DeliveryAddressPage() {
//   const navigate = useNavigate();
//   const user = useUserStore((state) => state.user);

//   const [label, setLabel] = useState("Maison");
//   const [address, setAddress] = useState("");
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [street, setStreet] = useState("");
//   const [city, setCity] = useState("");
//   const [zip, setZip] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   console.log("🔄 RENDER DeliveryAddressPage");
//   console.log("👤 user:", user);

//   useEffect(() => {
//     console.log("⚡ useEffect déclenché");
//     console.log("👤 user dans useEffect:", user);

//     if (user?.addresses?.length > 0) {
//       console.log("📦 Adresses trouvées:", user.addresses);

//       const defaultAddress =
//         user.addresses.find((a) => a.isDefault) || user.addresses[0];

//       console.log("🏠 Adresse sélectionnée:", defaultAddress);

//       setLabel(defaultAddress.label || "Maison");
//       setAddress(defaultAddress.address || "");
//       setLatitude(defaultAddress.latitude || "");
//       setLongitude(defaultAddress.longitude || "");
//       setStreet(defaultAddress.street || "");
//       setCity(defaultAddress.city || "");
//       setZip(defaultAddress.zip || "");
//     } else if (user) {
//       console.log("⚠️ Pas d'adresse, fallback user");

//       setAddress(user.address || "");
//       setLatitude(user.latitude || "");
//       setLongitude(user.longitude || "");
//     }
//   }, [user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("🚀 SUBMIT déclenché");
//     console.log("📦 Données envoyées:", {
//       label,
//       address,
//       latitude,
//       longitude,
//       street,
//       city,
//       zip,
//     });

//     if (!address || !latitude || !longitude) {
//       console.log("❌ Champs manquants");
//       setError("Tous les champs sont obligatoires !");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       console.log("📡 Envoi requête PATCH...");

//       const response = await api.patch("/deliveryadress", {
//         label,
//         address,
//         latitude: parseFloat(latitude),
//         longitude: parseFloat(longitude),
//         street,
//         city,
//         zip,
//       });

//       console.log("✅ Réponse serveur:", response.data);

//       navigate("/checkout");
//     } catch (err) {
//       console.error("❌ Erreur axios:", err);
//       console.error("❌ Détails:", err.response);

//       setError(err.response?.data?.error || "Erreur lors de la sauvegarde");
//     } finally {
//       console.log("⏹ Fin requête");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl flex flex-wrap gap-4"
//       >
//         <h2 className="w-full text-2xl font-bold mb-4">
//           Adresse de livraison
//         </h2>

//         {error && (
//           <>
//             {console.log("⚠️ Erreur affichée:", error)}
//             <p className="w-full text-red-500 mb-4">{error}</p>
//           </>
//         )}

//         <div className="flex flex-wrap w-full gap-4">
//           <input
//             type="text"
//             value={label}
//             onChange={(e) => {
//               console.log("✏️ label:", e.target.value);
//               setLabel(e.target.value);
//             }}
//             placeholder="Maison, Travail, Autre..."
//             className="flex-1 border rounded px-3 py-2"
//           />
//           <input
//             type="text"
//             value={address}
//             onChange={(e) => {
//               console.log("✏️ address:", e.target.value);
//               setAddress(e.target.value);
//             }}
//             placeholder="Ex : 123 Avenue de la Paix"
//             className="flex-1 border rounded px-3 py-2"
//           />
//         </div>

//         <div className="flex flex-wrap w-full gap-4">
//           <input
//             type="number"
//             value={latitude}
//             onChange={(e) => {
//               console.log("✏️ latitude:", e.target.value);
//               setLatitude(e.target.value);
//             }}
//             placeholder="Ex : -4.441930"
//             step="0.000001"
//             className="flex-1 border rounded px-3 py-2"
//           />
//           <input
//             type="number"
//             value={longitude}
//             onChange={(e) => {
//               console.log("✏️ longitude:", e.target.value);
//               setLongitude(e.target.value);
//             }}
//             placeholder="Ex : 15.266293"
//             step="0.000001"
//             className="flex-1 border rounded px-3 py-2"
//           />
//         </div>

//         <div className="flex flex-wrap w-full gap-4">
//           <input
//             type="text"
//             value={street}
//             onChange={(e) => {
//               console.log("✏️ street:", e.target.value);
//               setStreet(e.target.value);
//             }}
//             placeholder="Ex : Rue des Fleurs"
//             className="flex-1 border rounded px-3 py-2"
//           />
//           <input
//             type="text"
//             value={city}
//             onChange={(e) => {
//               console.log("✏️ city:", e.target.value);
//               setCity(e.target.value);
//             }}
//             placeholder="Ex : Kinshasa"
//             className="flex-1 border rounded px-3 py-2"
//           />
//           <input
//             type="text"
//             value={zip}
//             onChange={(e) => {
//               console.log("✏️ zip:", e.target.value);
//               setZip(e.target.value);
//             }}
//             placeholder="Ex : 1000"
//             className="flex-1 border rounded px-3 py-2"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 mt-4"
//           disabled={loading}
//         >
//           {loading ? "Enregistrement..." : "Enregistrer l'adresse"}
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../shared/services/api";
import { useUserStore } from "../../../app/store/userStore";

export default function DeliveryAddressPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    label: "Maison",
    address: "",
    latitude: "",
    longitude: "",
    street: "",
    city: "",
    zip: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchAddresses = async () => {
      try {
        const res = await api.get("/deliveryadress");
        setAddresses(res.data);
        if (res.data.length > 0) {
          const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
          setSelectedId(defaultAddr.id);
        }
      } catch (err) {
        console.error("Erreur chargement adresses:", err);
      }
    };
    fetchAddresses();
  }, [user]);

  const openModal = (addr = null) => {
    if (addr) {
      setSelectedId(addr.id);
      setForm({
        label: addr.label,
        address: addr.address,
        latitude: addr.latitude,
        longitude: addr.longitude,
        street: addr.street,
        city: addr.city,
        zip: addr.zip,
        isDefault: addr.isDefault,
      });
    } else {
      setSelectedId(null);
      setForm({
        label: "Maison",
        address: "",
        latitude: "",
        longitude: "",
        street: "",
        city: "",
        zip: "",
        isDefault: false,
      });
    }
    setModalOpen(true);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address || !form.latitude || !form.longitude) {
      setError("Adresse, latitude et longitude obligatoires !");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      };
      let res;
      if (selectedId) {
        res = await api.patch(`/deliveryadress/${selectedId}`, payload);
        setAddresses((prev) =>
          prev.map((a) => (a.id === selectedId ? res.data : a))
        );
      } else {
        res = await api.post("/deliveryadress", payload);
        setAddresses((prev) => [...prev, res.data]);
        setSelectedId(res.data.id);
        res = { data: { ...res.data } }; // pour uniformité
      }

 // 🔹 Mettre à jour le store avec l'adresse sélectionnée
    useUserStore.getState().setDeliveryAddress(res.data);

      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette adresse ?")) return;
    try {
      await api.delete(`/deliveryadress/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer cette adresse.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Mes adresses de livraison</h2>

      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 border rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
              selectedId === addr.id
                ? "border-blue-600 bg-blue-50"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold text-lg text-gray-900">{addr.label}</div>
                <div className="text-gray-600">{addr.address}</div>
                <div className="text-gray-600">{addr.city} {addr.zip}</div>
                {addr.isDefault && (
                  <span className="text-green-600 text-sm font-medium mt-1 inline-block">
                    Par défaut
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="text-blue-600 text-sm hover:underline"
                  onClick={() => openModal(addr)}
                >
                  Modifier
                </button>
                <button
                  className="text-red-500 text-sm hover:underline"
                  onClick={() => handleDelete(addr.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          className="p-5 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center text-gray-500 hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
          onClick={() => openModal()}
        >
          + Ajouter une nouvelle adresse
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 flex flex-col gap-4 relative"
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg font-bold"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>

            {error && <p className="text-red-500 font-medium">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="Maison, Travail, Autre..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Ex : 123 Avenue de la Paix"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="Ex : -4.441930"
                step="0.000001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="Ex : 15.266293"
                step="0.000001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder="Rue des Fleurs"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Kinshasa"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="1000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-600"
              />
              Définir par défaut
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Enregistrement..." : selectedId ? "Mettre à jour" : "Ajouter l'adresse"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}