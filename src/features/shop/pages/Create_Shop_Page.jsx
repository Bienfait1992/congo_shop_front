// import { useState } from "react";
// import { api } from "../../../shared/services/api";
// import { toast } from "react-hot-toast";

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

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setLogoFile(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setLogoPreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.address || !form.latitude || !form.longitude) {
//       toast.error("Les champs nom, adresse, latitude et longitude sont obligatoires");
//       return;
//     }

//     setLoading(true);
//     const toastId = toast.loading("Création de la boutique en cours...");

//     try {
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("description", form.description);
//       formData.append("address", form.address);
//       formData.append("phone", form.phone);
//       formData.append("latitude", parseFloat(form.latitude));
//       formData.append("longitude", parseFloat(form.longitude));
//       if (logoFile) formData.append("logo", logoFile);

//       const { data } = await api.post("/shops", formData);

//       // Reset formulaire
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

//       toast.success("Boutique créée avec succès !", { id: toastId });
//     } catch (err) {
//       toast.error(err.response?.data?.error || err.message, { id: toastId });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow">
//       <h1 className="text-2xl font-bold mb-6">Créer votre boutique</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Nom */}
//         <div>
//           <label className="block mb-1 font-semibold">Nom de la boutique *</label>
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block mb-1 font-semibold">Description</label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         {/* Logo */}
//         <div>
//           <label className="block mb-1 font-semibold">Logo de la boutique</label>
//           <input type="file" accept="image/*" onChange={handleLogoChange} />
//           {logoPreview && (
//             <img src={logoPreview} alt="Aperçu logo" className="mt-2 h-24 w-24 object-contain border p-1" />
//           )}
//         </div>

//         {/* Adresse et téléphone */}
//         <div>
//           <label className="block mb-1 font-semibold">Adresse *</label>
//           <input
//             type="text"
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-semibold">Téléphone</label>
//           <input
//             type="text"
//             name="phone"
//             value={form.phone}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         {/* Latitude / Longitude */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block mb-1 font-semibold">Latitude *</label>
//             <input
//               type="number"
//               name="latitude"
//               value={form.latitude}
//               onChange={handleChange}
//               step="0.000001"
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>
//           <div>
//             <label className="block mb-1 font-semibold">Longitude *</label>
//             <input
//               type="number"
//               name="longitude"
//               value={form.longitude}
//               onChange={handleChange}
//               step="0.000001"
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className={`w-full py-2 rounded font-semibold text-white ${
//             loading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Création..." : "Créer ma boutique"}
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { api } from "../../../shared/services/api";
import { toast } from "react-hot-toast";

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

      toast.success("Boutique créée avec succès, en attente de validation", {
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

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

          {/* GRID TOP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nom */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Nom de la boutique *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="Ex: Congo Shop"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Téléphone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="+243 ..."
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="mt-2 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="Décrivez votre boutique..."
            />
          </div>

          {/* UPLOAD LOGO */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Logo de la boutique
            </label>

            <div className="mt-2 flex flex-col md:flex-row items-start gap-6">
              <input type="file" accept="image/*" onChange={handleLogoChange} />

              {logoPreview && (
                <div className="w-24 h-24 border rounded-lg overflow-hidden shadow">
                  <img
                    src={logoPreview}
                    alt="logo preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Adresse *
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="Adresse complète"
            />
          </div>

          {/* COORDONNEES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Latitude *
              </label>
              <input
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                className="mt-2 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Longitude *
              </label>
              <input
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                className="mt-2 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            {loading ? "Création en cours..." : "Créer ma boutique"}
          </button>
        </form>
      </div>
    </div>
  );
}