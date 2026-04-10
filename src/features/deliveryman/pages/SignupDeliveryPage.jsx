// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";

// export default function BecomeDeliveryPage({ onClose }) {
//   const [deliveryType, setDeliveryType] = useState("INDIVIDUAL");
//   const [companyId, setCompanyId] = useState("");
//   const [vehicleType, setVehicleType] = useState("MOTO");
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingLocation, setLoadingLocation] = useState(false);
//   const [error, setError] = useState(null);

//   // 🔹 Reset company si INDIVIDUAL
//   useEffect(() => {
//     if (deliveryType === "INDIVIDUAL") {
//       setCompanyId("");
//     }
//   }, [deliveryType]);

//   // 🔹 Charger les compagnies
//   useEffect(() => {
//     if (deliveryType === "COMPANY") {
//       const token = localStorage.getItem("token");

//       fetch("http://localhost:3000/api/deliverycompany", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then((res) => res.json())
//         .then((data) => setCompanies(data))
//         .catch(() => toast.error("Erreur chargement compagnies"));
//     }
//   }, [deliveryType]);

//   // 📍 Géolocalisation automatique
//   const getLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Géolocalisation non supportée");
//       return;
//     }

//     setLoadingLocation(true);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);
//         setLoadingLocation(false);
//         toast.success("Position récupérée");
//       },
//       () => {
//         toast.error("Impossible de récupérer la position");
//         setLoadingLocation(false);
//       }
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     // ✅ Validation propre
//     if (latitude === null || longitude === null) {
//       return setError("Position requise");
//     }

//     if (deliveryType === "COMPANY" && !companyId) {
//       return setError("Veuillez choisir une compagnie");
//     }

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       const body = {
//         vehicleType,
//         latitude,
//         longitude,
//         type: deliveryType,
//         ...(deliveryType === "COMPANY" && { companyId }),
//       };

//       const res = await fetch("http://localhost:3000/api/deliveryman", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       toast.success("Demande envoyée avec succès");

//       if (onClose) onClose();
//     } catch (err) {
//       setError(err.message);
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">
        
//         {onClose && (
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
//           >
//             ✕
//           </button>
//         )}

//         <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
//           Devenir livreur
//         </h2>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* 🔘 TYPE */}
//           <div>
//             <p className="text-sm font-medium mb-2">Type</p>
//             <div className="flex gap-4">
//               <button
//                 type="button"
//                 onClick={() => setDeliveryType("INDIVIDUAL")}
//                 className={`flex-1 p-2 rounded border ${
//                   deliveryType === "INDIVIDUAL"
//                     ? "bg-orange-500 text-white"
//                     : ""
//                 }`}
//               >
//                 Individuel
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setDeliveryType("COMPANY")}
//                 className={`flex-1 p-2 rounded border ${
//                   deliveryType === "COMPANY"
//                     ? "bg-orange-500 text-white"
//                     : ""
//                 }`}
//               >
//                 Compagnie
//               </button>
//             </div>
//           </div>

//           {/* 🏢 COMPAGNIE */}
//           {deliveryType === "COMPANY" && (
//             <select
//               value={companyId}
//               onChange={(e) => setCompanyId(e.target.value)}
//               className="w-full p-3 border rounded"
//             >
//               <option value="">Choisir une compagnie</option>
//               {companies.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           )}

//           {/* 🚗 VEHICULE */}
//           <select
//             value={vehicleType}
//             onChange={(e) => setVehicleType(e.target.value)}
//             className="w-full p-3 border rounded"
//           >
//             <option value="MOTO">Moto</option>
//             <option value="CAR">Voiture</option>
//             <option value="BIKE">Vélo</option>
//             <option value="TRUCK">Camion</option>
//           </select>

//           {/* 📍 POSITION */}
//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="Latitude"
//               value={latitude ?? ""}
//               readOnly
//               className="w-1/2 p-3 border rounded bg-gray-100"
//             />
//             <input
//               type="text"
//               placeholder="Longitude"
//               value={longitude ?? ""}
//               readOnly
//               className="w-1/2 p-3 border rounded bg-gray-100"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={getLocation}
//             disabled={loadingLocation}
//             className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
//           >
//             {loadingLocation ? "Localisation..." : "Utiliser ma position"}
//           </button>

//           {/*SUBMIT */}
//           <button
//             disabled={loading}
//             className="w-full bg-orange-500 text-white p-3 rounded font-semibold disabled:opacity-50"
//           >
//             {loading ? "Envoi..." : "Envoyer la demande"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function BecomeDeliveryPage({ onClose }) {
  const [deliveryType, setDeliveryType] = useState("INDIVIDUAL");
  const [companyId, setCompanyId] = useState("");
  const [vehicleType, setVehicleType] = useState("MOTO");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateCompany, setShowCreateCompany] = useState(false);

  // Reset company
  useEffect(() => {
    if (deliveryType === "INDIVIDUAL") {
      setCompanyId("");
    }
  }, [deliveryType]);

  // Load companies
  useEffect(() => {
    if (deliveryType === "COMPANY") {
      const token = localStorage.getItem("token");

      fetch("http://localhost:3000/api/deliverycompany", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCompanies(data))
        .catch(() => toast.error("Erreur chargement compagnies"));
    }
  }, [deliveryType]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Géolocalisation non supportée");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoadingLocation(false);
        toast.success("Position récupérée");
      },
      () => {
        toast.error("Impossible de récupérer la position");
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (latitude === null || longitude === null) {
      return setError("Position requise");
    }

    if (deliveryType === "COMPANY" && !companyId) {
      return setError("Veuillez choisir une compagnie");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const body = {
        vehicleType,
        latitude,
        longitude,
        type: deliveryType,
        ...(deliveryType === "COMPANY" && { companyId }),
      };

      const res = await fetch("http://localhost:3000/api/deliveryman", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Demande envoyée avec succès");
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
        )}

        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
          Devenir livreur
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TYPE */}
          <div>
            <p className="text-sm font-medium mb-2">Type</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType("INDIVIDUAL")}
                className={`flex-1 p-2 rounded border ${
                  deliveryType === "INDIVIDUAL" ? "bg-orange-500 text-white" : ""
                }`}
              >
                Individuel
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType("COMPANY")}
                className={`flex-1 p-2 rounded border ${
                  deliveryType === "COMPANY" ? "bg-orange-500 text-white" : ""
                }`}
              >
                Compagnie
              </button>
            </div>
          </div>

          {/* COMPANY */}
          {deliveryType === "COMPANY" && (
            <div className="space-y-2">
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full p-3 border rounded"
              >
                <option value="">Choisir une compagnie</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowCreateCompany(true)}
                className="text-sm text-blue-500 underline"
              >
                + Créer une compagnie
              </button>
            </div>
          )}

          {/* VEHICLE */}
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full p-3 border rounded"
          >
            <option value="MOTO">Moto</option>
            <option value="CAR">Voiture</option>
            <option value="BIKE">Vélo</option>
            <option value="TRUCK">Camion</option>
          </select>

          {/* LOCATION */}
          <div className="flex gap-2">
            <input
              type="text"
              value={latitude ?? ""}
              readOnly
              placeholder="Latitude"
              className="w-1/2 p-3 border rounded bg-gray-100"
            />
            <input
              type="text"
              value={longitude ?? ""}
              readOnly
              placeholder="Longitude"
              className="w-1/2 p-3 border rounded bg-gray-100"
            />
          </div>

          <button
            type="button"
            onClick={getLocation}
            disabled={loadingLocation}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {loadingLocation ? "Localisation..." : "Utiliser ma position"}
          </button>

          <button
            disabled={loading}
            className="w-full bg-orange-500 text-white p-3 rounded font-semibold"
          >
            {loading ? "Envoi..." : "Envoyer la demande"}
          </button>
        </form>
      </div>

      {/* MODAL */}
      {showCreateCompany && (
        <CreateCompanyModal
          onClose={() => setShowCreateCompany(false)}
          onCreated={(company) => {
            setCompanies((prev) => [...prev, company]);
            setCompanyId(company.id);
            setShowCreateCompany(false);
          }}
        />
      )}
    </div>
  );
}

/* MODAL */
function CreateCompanyModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/deliverycompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Compagnie créée");
      onCreated(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-80 space-y-4">
        <h3 className="font-bold text-lg">Créer une compagnie</h3>

        <input
          type="text"
          placeholder="Nom de la compagnie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-2">
          <button
            onClick={handleCreate}
            className="flex-1 bg-orange-500 text-white p-2 rounded"
          >
            {loading ? "..." : "Créer"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 p-2 rounded"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}