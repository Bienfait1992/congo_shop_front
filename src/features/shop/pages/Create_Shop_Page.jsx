// import { useState } from "react";
// import { api } from "../../../shared/services/api";
// import { toast } from "react-hot-toast";
// import ShopTermsModal from "./ShopTermsPage";

// export default function CreateShopPage({ token }) {
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     address: "",
//     phone: "",
//     latitude: "",
//     longitude: "",
//   });

//   const [logoFile, setLogoFile] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [showTerms, setShowTerms] = useState(true);
//   const [termsAccepted, setTermsAccepted] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.size > 2 * 1024 * 1024) {
//       toast.error("Image trop lourde (max 2MB)");
//       return;
//     }

//     setLogoFile(file);

//     const reader = new FileReader();
//     reader.onloadend = () => setLogoPreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.address || !form.latitude || !form.longitude) {
//       toast.error("Veuillez remplir les champs obligatoires");
//       return;
//     }

//     if (isNaN(form.latitude) || isNaN(form.longitude)) {
//       toast.error("Coordonnées invalides");
//       return;
//     }

//     if (!termsAccepted) {
//       toast.error("Vous devez accepter la charte vendeur");
//       return;
//     }

//     setLoading(true);
//     const toastId = toast.loading("Création de votre boutique...");

//     try {
//       const formData = new FormData();

//       formData.append("name", form.name);
//       formData.append("description", form.description);
//       formData.append("address", form.address);
//       formData.append("phone", form.phone);
//       formData.append("latitude", form.latitude);
//       formData.append("longitude", form.longitude);

//       // IMPORTANT CHARTE BACKEND
//       formData.append("termsAccepted", "true");
//       formData.append("termsAcceptedVersion", "v1.0");

//       if (logoFile) formData.append("logo", logoFile);

//       await api.post("/shops", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setForm({
//         name: "",
//         description: "",
//         address: "",
//         phone: "",
//         latitude: "",
//         longitude: "",
//       });

//       setLogoFile(null);
//       setLogoPreview(null);

//       toast.success("Boutique créée avec succès, en attente de validation", {
//         id: toastId,
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Erreur serveur", {
//         id: toastId,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* MODAL CHARTE */}
//       <ShopTermsModal
//         open={showTerms}
//         onClose={() => setShowTerms(false)}
//         onAccept={() => {
//           setTermsAccepted(true);
//           setShowTerms(false);
//         }}
//       />

//       {/* PAGE */}
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
//         <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden">

//           {/* HEADER */}
//           <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6">
//             <h1 className="text-2xl md:text-3xl font-bold text-white">
//               Créer votre boutique
//             </h1>
//             <p className="text-white/90 text-sm mt-1">
//               Remplissez les informations pour lancer votre activité
//             </p>
//           </div>

//           {/* FORM */}
//           <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//               <div>
//                 <label className="text-sm font-semibold text-gray-700">
//                   Nom de la boutique *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   className="mt-2 w-full border rounded-lg px-4 py-3"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-700">
//                   Téléphone
//                 </label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={form.phone}
//                   onChange={handleChange}
//                   className="mt-2 w-full border rounded-lg px-4 py-3"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 rows="4"
//                 className="mt-2 w-full border rounded-lg px-4 py-3"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Logo
//               </label>
//               <input type="file" accept="image/*" onChange={handleLogoChange} />
//               {logoPreview && (
//                 <img
//                   src={logoPreview}
//                   className="w-24 h-24 mt-2 object-cover border rounded"
//                 />
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Adresse *
//               </label>
//               <input
//                 type="text"
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 className="mt-2 w-full border rounded-lg px-4 py-3"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <input
//                 type="number"
//                 name="latitude"
//                 value={form.latitude}
//                 onChange={handleChange}
//                 placeholder="Latitude"
//                 className="border p-3 rounded"
//               />
//               <input
//                 type="number"
//                 name="longitude"
//                 value={form.longitude}
//                 onChange={handleChange}
//                 placeholder="Longitude"
//                 className="border p-3 rounded"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 bg-yellow-400 rounded-lg font-semibold text-white"
//             >
//               {loading ? "Création..." : "Créer ma boutique"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }


import { useState } from "react";
import { api } from "../../../shared/services/api";
import { toast } from "react-hot-toast";
import ShopTermsModal from "./ShopTermsPage";

export default function CreateShopPage({ token }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // MODAL CHARTE
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image trop lourde (max 2MB)");
      return;
    }

    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.latitude || !form.longitude) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    if (isNaN(form.latitude) || isNaN(form.longitude)) {
      toast.error("Coordonnées invalides");
      return;
    }

    if (!termsAccepted) {
      toast.error("Vous devez accepter la charte vendeur");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Création de votre boutique...");

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("phone", form.phone);
      formData.append("latitude", form.latitude);
      formData.append("longitude", form.longitude);

      // IMPORTANT BACKEND CHARTE
      formData.append("termsAccepted", "true");
      formData.append("termsAcceptedVersion", "v1.0");

      if (logoFile) formData.append("logo", logoFile);

      await api.post("/shops", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        name: "",
        description: "",
        address: "",
        phone: "",
        latitude: "",
        longitude: "",
      });

      setLogoFile(null);
      setLogoPreview(null);

      toast.success("Boutique créée avec succès", {
        id: toastId,
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur serveur", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MODAL CHARTE */}
      <ShopTermsModal
        open={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setShowTerms(false);
        }}
      />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Créer votre boutique
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Remplissez les informations pour lancer votre activité
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

            {/* NOM + PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nom de la boutique *"
                className="border p-3 rounded-lg"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Téléphone"
                className="border p-3 rounded-lg"
              />
            </div>

            {/* DESCRIPTION */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-3 rounded-lg w-full"
              rows={4}
            />

            {/* LOGO */}
            <div>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
              {logoPreview && (
                <img
                  src={logoPreview}
                  className="w-24 h-24 mt-2 rounded border object-cover"
                />
              )}
            </div>

            {/* ADRESSE */}
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Adresse *"
              className="border p-3 rounded-lg w-full"
            />

            {/* GPS */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className="border p-3 rounded-lg"
              />
              <input
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="border p-3 rounded-lg"
              />
            </div>

            {/* CHARTE BUTTON */}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="w-full border py-2 rounded-lg text-sm hover:bg-gray-100"
            >
              Lire et accepter la charte vendeur
            </button>

            {/* STATUS CHARTE */}
            {/* <p className="text-sm text-center">
              Statut :{" "}
              {termsAccepted ? (
                <span className="text-green-600 font-bold">Acceptée</span>
              ) : (
                <span className="text-red-500 font-bold">Non acceptée</span>
              )}
            </p> */}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-400 rounded-lg font-semibold text-white"
            >
              {loading ? "Création..." : "Créer ma boutique"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}