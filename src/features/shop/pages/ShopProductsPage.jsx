// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { api } from "../../../shared/services/api";
// import { useUserStore } from "../../../app/store/userStore";
// import toast from "react-hot-toast";
// import PromotionModal from "../../products/pages/ApplyPromotion";

// export default function ShopProductsPage() {
//   const { shopId } = useParams();
//   const { token } = useUserStore();

//   const [products, setProducts] = useState([]);
//   const [shop, setShop] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     price: "",
//     stock: "",
//     description: "",
//     images: [],
//     currency: "USD",
//   });
//   const [previewImages, setPreviewImages] = useState([]);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [showPromotionModal, setShowPromotionModal] = useState(false);

//   // --- Fetch products ---
//   useEffect(() => {
//     if (!token) return;
//     api
//       .get(`/shops/${shopId}/products`, { headers: { Authorization: `Bearer ${token}` } })
//       .then(res => {
//         setProducts(res.data.products);
//         setShop(res.data.shop);
//       })
//       .catch(() => toast.error("Erreur lors du chargement des produits"));
//   }, [shopId, token]);

//   useEffect(() => {
//     if (!token) return;
//     api
//       .get("/categories", { headers: { Authorization: `Bearer ${token}` } })
//       .then(res => setCategories(res.data))
//       .catch(() => toast.error("Impossible de charger les catégories"));
//   }, [token]);

//   // --- Handle images ---
//   const handleImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewProduct(prev => ({ ...prev, images: [...prev.images, ...files] }));
//     setPreviewImages(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
//   };

//   // --- Add / Update product ---
//   const handleSubmitProduct = async () => {
//     if (!newProduct.name || !newProduct.price) {
//       toast.error("Nom et prix requis");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", newProduct.name);
//     formData.append("price", parseFloat(newProduct.price));
//     formData.append("stock", parseInt(newProduct.stock || "0"));
//     formData.append("currency", newProduct.currency);
//     formData.append("description", newProduct.description);
//     if (newProduct.images.length > 0) newProduct.images.forEach(file => formData.append("images", file));
//     if (newProduct.categoryId) formData.append("categoryId", newProduct.categoryId);

//     try {
//       if (editingProduct) {
//         const { data } = await api.put(
//           `/shops/${shopId}/products/${editingProduct.id}`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
//         );
//         setProducts(prev => prev.map(p => p.id === data.id ? data : p));
//         toast.success("Produit mis à jour");
//       } else {
//         const { data } = await api.post(
//           `/shops/${shopId}/products`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
//         );
//         setProducts(prev => [...prev, data]);
//         toast.success("Produit ajouté");
//       }

//       setEditingProduct(null);
//       setNewProduct({ name: "", price: "", stock: "", description: "", images: [], currency: "USD" });
//       setPreviewImages([]);
//       setShowModal(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Erreur lors de l'opération");
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
//     try {
//       await api.delete(`/shops/${shopId}/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
//       setProducts(prev => prev.filter(p => p.id !== productId));
//       toast.success("Produit supprimé");
//     } catch (err) {
//       console.error(err);
//       toast.error("Erreur lors de la suppression");
//     }
//   };

//   const handleEditProduct = (product) => {
//     setEditingProduct(product);
//     setShowModal(true);
//     setNewProduct({
//       name: product.name,
//       price: product.price,
//       stock: product.stock,
//       description: product.description,
//       images: [],
//       currency: product.currency || "USD",
//       categoryId: product.categoryId || "",
//     });
//     setPreviewImages([]);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-4 md:p-8">
//       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-10">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">{shop?.name || "Chargement..."} - Produits</h1>
        // <button
        //   onClick={() => { setShowModal(true); setEditingProduct(null); }}
        //   className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        // >
        //   {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
        // </button>

//         {/* --- Modal --- */}
        // {showModal && (
        //   <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
        //     <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8">
        //       <h2 className="text-2xl font-semibold mb-5">{editingProduct ? "Modifier le produit" : "Nouveau produit"}</h2>
        //       <div className="flex flex-col gap-3">
        //         <input type="text" placeholder="Nom" value={newProduct.name}
        //           onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
        //           className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"/>
        //         <div className="flex gap-2">
        //           <input type="number" placeholder="Prix" value={newProduct.price}
        //             onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
        //             className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"/>
        //           <select value={newProduct.currency} onChange={e => setNewProduct(prev => ({ ...prev, currency: e.target.value }))}
        //             className="border rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-green-500">
        //             <option value="USD">USD</option>
        //             <option value="EUR">EUR</option>
        //             <option value="CDF">CDF</option>
        //           </select>
        //         </div>
        //         <select value={newProduct.categoryId || ""} onChange={e => setNewProduct(prev => ({ ...prev, categoryId: e.target.value }))}
        //           className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500">
        //           <option value="">Sélectionner une catégorie</option>
        //           {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        //         </select>
        //         <input type="number" placeholder="Stock" value={newProduct.stock}
        //           onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
        //           className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"/>
        //         <textarea placeholder="Description" value={newProduct.description}
        //           onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
        //           className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 resize-none"/>
        //         <input type="file" multiple accept="image/*" onChange={handleImagesChange}
        //           className="border rounded-lg px-3 py-2 w-full"/>
        //         {previewImages.length > 0 && (
        //           <div className="flex flex-wrap gap-2 mt-2">
        //             {previewImages.map((src, idx) => (
        //               <div key={idx} className="w-20 h-20 border rounded-lg overflow-hidden">
        //                 <img src={src} alt={`preview-${idx}`} className="object-cover w-full h-full"/>
        //               </div>
        //             ))}
        //           </div>
        //         )}
        //         <div className="flex justify-end gap-3 mt-4">
        //           <button onClick={() => { setShowModal(false); setEditingProduct(null); setPreviewImages([]); setNewProduct({ name: "", price: "", stock: "", description: "", images: [], currency: "USD" }); }}
        //             className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition">Annuler</button>
        //           <button onClick={handleSubmitProduct} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
        //             {editingProduct ? "Mettre à jour" : "Ajouter"}
        //           </button>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // )}

//         {/* --- Products list --- */}
//         <section className="mt-8">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-700">Produits existants</h2>
//           {products.length === 0 ? (
//             <p className="text-gray-500">Aucun produit disponible</p>
//           ) : (

// <div className="overflow-x-auto bg-white rounded-xl shadow">
//   <table className="w-full text-sm text-left">
    
//     {/* HEADER */}
//     <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
//       <tr>
//         <th className="px-4 py-3">Produit</th>
//         <th className="px-4 py-3">Prix</th>
//         <th className="px-4 py-3">Stock</th>
//         <th className="px-4 py-3">Statut</th>
//         <th className="px-4 py-3 text-right">Actions</th>
//       </tr>
//     </thead>

//     {/* BODY */}
//     <tbody className="divide-y">
//       {products.map((p) => {
        
//         //Promo active
//         const promo = p.promotions?.find(pr =>
//           new Date(pr.startDate) <= new Date() &&
//           new Date(pr.endDate) >= new Date()
//         );

//         const finalPrice = promo
//           ? p.price - (p.price * promo.discount) / 100
//           : p.price;

//         return (
//           <tr
//             key={p.id}
//             className="hover:bg-gray-50 transition"
//           >

//             {/* PRODUIT */}
//             <td className="px-4 py-3 flex items-center gap-3">
//               <img
//                 src={
//                   p.images?.[0]
//                     ? `http://localhost:3000${p.images[0]}`
//                     : "/placeholder.png"
//                 }
//                 className="w-12 h-12 object-cover rounded-lg border"
//               />
//               <div>
//                 <p className="font-semibold text-gray-800">{p.name}</p>
//                 <p className="text-xs text-gray-500 line-clamp-1">
//                   {p.description || "Pas de description"}
//                 </p>
//               </div>
//             </td>

//             {/* PRIX */}
//             <td className="px-4 py-3">
//               {promo ? (
//                 <div className="flex flex-col">
//                   <span className="text-gray-400 line-through text-xs">
//                     {p.price} {p.currency}
//                   </span>
//                   <span className="text-red-600 font-bold">
//                     {finalPrice.toFixed(2)} {p.currency}
//                   </span>
//                 </div>
//               ) : (
//                 <span className="font-semibold text-gray-800">
//                   {p.price} {p.currency}
//                 </span>
//               )}
//             </td>

//             {/* STOCK */}
            // <td className="px-4 py-3">
            //   <span
            //     className={`px-2 py-1 rounded-full text-xs font-medium ${
            //       p.stock > 10
            //         ? "bg-green-100 text-green-700"
            //         : p.stock > 0
            //         ? "bg-yellow-100 text-yellow-700"
            //         : "bg-red-100 text-red-600"
            //     }`}
            //   >
            //     {p.stock > 0 ? `${p.stock} en stock` : "Rupture"}
            //   </span>
            // </td>

//             {/* STATUT */}
//             <td className="px-4 py-3">
//               {promo ? (
//                 <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
//                 -{promo.discount}%
//                 </span>
//               ) : (
//                 <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
//                   Normal
//                 </span>
//               )}
//             </td>

//             {/* ACTIONS */}
//             <td className="px-4 py-3">
//               <div className="flex justify-end gap-2">
                
                // <button
                //   onClick={() => handleEditProduct(p)}
                //   className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                // >
                //   Modifier
                // </button>

                // <button
                //   onClick={() => {
                //     setEditingProduct(p);
                //     setShowPromotionModal(true);
                //   }}
                //   className="px-3 py-1 text-xs bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition"
                // >
                //   Promo
                // </button>

                // <button
                //   onClick={() => handleDeleteProduct(p.id)}
                //   className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                // >
                //   Supprimer
                // </button>

//               </div>
//             </td>

//           </tr>
//         );
//       })}
//     </tbody>
//   </table>
// </div>
//           )}
//         </section>

//         {/* --- Promotion modal --- */}
//         {showPromotionModal && editingProduct && (
//           <PromotionModal
//             productId={editingProduct.id}
//             onClose={() => setShowPromotionModal(false)}
//             onSuccess={(promotion) => {
//               setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, promotions: [promotion] } : p));
//             }}
//           />
//         )}

//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../shared/services/api";
import { useUserStore } from "../../../app/store/userStore";
import toast from "react-hot-toast";
import PromotionModal from "../../products/pages/ApplyPromotion";

export default function ShopProductsPage() {
  const { shopId } = useParams();
  const { token } = useUserStore();

  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    images: [],
    currency: "USD",
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showPromotionModal, setShowPromotionModal] = useState(false);

  // FILTRES
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [promoFilter, setPromoFilter] = useState("all");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // RESET PAGE
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, promoFilter]);

  // FETCH PRODUCTS
  useEffect(() => {
    if (!token) return;
    api
      .get(`/shops/${shopId}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProducts(res.data.products);
        setShop(res.data.shop);
      })
      .catch(() => toast.error("Erreur lors du chargement des produits"));
  }, [shopId, token]);

  // FETCH CATEGORIES
  useEffect(() => {
    if (!token) return;
    api
      .get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Impossible de charger les catégories"));
  }, [token]);

  // HANDLE IMAGES
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewProduct((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviewImages((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  // ADD / UPDATE PRODUCT
  const handleSubmitProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Nom et prix requis");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", parseFloat(newProduct.price));
    formData.append("stock", parseInt(newProduct.stock || "0"));
    formData.append("currency", newProduct.currency);
    formData.append("description", newProduct.description);

    if (newProduct.images.length > 0)
      newProduct.images.forEach((file) =>
        formData.append("images", file)
      );

    if (newProduct.categoryId)
      formData.append("categoryId", newProduct.categoryId);

    try {
      if (editingProduct) {
        const { data } = await api.put(
          `/shops/${shopId}/products/${editingProduct.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProducts((prev) =>
          prev.map((p) => (p.id === data.id ? data : p))
        );
        toast.success("Produit mis à jour");
      } else {
        const { data } = await api.post(
          `/shops/${shopId}/products`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProducts((prev) => [...prev, data]);
        toast.success("Produit ajouté");
      }

      setEditingProduct(null);
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        description: "",
        images: [],
        currency: "USD",
      });
      setPreviewImages([]);
      setShowModal(false);
    } catch (err) {
      toast.error("Erreur lors de l'opération");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await api.delete(`/shops/${shopId}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Produit supprimé");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
    setNewProduct({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      images: [],
      currency: product.currency || "USD",
      categoryId: product.categoryId || "",
    });
    setPreviewImages([]);
  };

  // FILTRE
  const filteredProducts = products.filter((p) => {
    const promo = p.promotions?.find(
      (pr) =>
        new Date(pr.startDate) <= new Date() &&
        new Date(pr.endDate) >= new Date()
    );

    const matchSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = categoryFilter
      ? String(p.categoryId) === String(categoryFilter)
      : true;

    const matchPromo =
      promoFilter === "all"
        ? true
        : promoFilter === "promo"
        ? !!promo
        : !promo;

    return matchSearch && matchCategory && matchPromo;
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {shop?.name || "Chargement..."} - Produits
        </h1>
                <button
          onClick={() => { setShowModal(true); setEditingProduct(null); }}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
        </button>

        {/* FILTRES */}
        <div className="flex flex-wrap gap-3 mt-6 bg-gray-50 p-4 rounded-xl border">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Toutes catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={promoFilter}
            onChange={(e) => setPromoFilter(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="all">Tous</option>
            <option value="promo">En promo</option>
            <option value="noPromo">Sans promo</option>
          </select>
        </div>




        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-5">{editingProduct ? "Modifier le produit" : "Nouveau produit"}</h2>
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Nom" value={newProduct.name}
                  onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"/>
                <div className="flex gap-2">
                  <input type="number" placeholder="Prix" value={newProduct.price}
                    onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"/>
                  <select value={newProduct.currency} onChange={e => setNewProduct(prev => ({ ...prev, currency: e.target.value }))}
                    className="border rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-green-500">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CDF">CDF</option>
                  </select>
                </div>
                <select value={newProduct.categoryId || ""} onChange={e => setNewProduct(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500">
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <input type="number" placeholder="Stock" value={newProduct.stock}
                  onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"/>
                <textarea placeholder="Description" value={newProduct.description}
                  onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 resize-none"/>
                <input type="file" multiple accept="image/*" onChange={handleImagesChange}
                  className="border rounded-lg px-3 py-2 w-full"/>
                {previewImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewImages.map((src, idx) => (
                      <div key={idx} className="w-20 h-20 border rounded-lg overflow-hidden">
                        <img src={src} alt={`preview-${idx}`} className="object-cover w-full h-full"/>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => { setShowModal(false); setEditingProduct(null); setPreviewImages([]); setNewProduct({ name: "", price: "", stock: "", description: "", images: [], currency: "USD" }); }}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition">Annuler</button>
                  <button onClick={handleSubmitProduct} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
                    {editingProduct ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* TABLE */}
        <section className="mt-8">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">Aucun résultat</p>
          ) : (
            <>
              <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Produit</th>
                      <th className="px-4 py-3">Prix</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {paginatedProducts.map((p) => {
                      const promo = p.promotions?.find(
                        (pr) =>
                          new Date(pr.startDate) <= new Date() &&
                          new Date(pr.endDate) >= new Date()
                      );

                      const finalPrice = promo
                        ? p.price - (p.price * promo.discount) / 100
                        : p.price;

                      return (
                        <tr key={p.id} className="hover:bg-gray-50">

                          <td className="px-4 py-3 flex items-center gap-3">
                            <img
                              src={
                                p.images?.[0]
                                  ? `http://localhost:3000${p.images[0]}`
                                  : "/placeholder.png"
                              }
                              className="w-12 h-12 rounded-lg"
                            />
                            <div>
                              <p className="font-semibold">{p.name}</p>
                              <p className="text-xs text-gray-500">
                                {p.description}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            {promo ? (
                              <>
                                <span className="line-through text-xs text-gray-400">
                                  {p.price}
                                </span>
                                <br />
                                <span className="text-red-600 font-bold">
                                  {finalPrice.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              p.price
                            )}
                          </td>

                                    <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    p.stock > 10
                                        ? "bg-green-100 text-green-700"
                                        : p.stock > 0
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-600"
                                    }`}
                                >
                                    {p.stock > 0 ? `${p.stock} en stock` : "Rupture"}
                                </span>
                                </td>

                          <td className="px-4 py-3">
                            {promo ? `-${promo.discount}%` : "Normal"}
                          </td>

                          <td className="px-4 py-3 text-right">
                           
                                            <button
                  onClick={() => handleEditProduct(p)}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  Modifier
                </button>

                <button
                  onClick={() => {
                    setEditingProduct(p);
                    setShowPromotionModal(true);
                  }}
                  className="px-3 py-1 text-xs bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition"
                >
                  Promo
                </button>

                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  Supprimer
                </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  ←
                </button>

                <span>
                  {currentPage} / {totalPages || 1}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            </>
          )}
        </section>

        {/* PROMO */}
        {showPromotionModal && editingProduct && (
          <PromotionModal
            productId={editingProduct.id}
            onClose={() => setShowPromotionModal(false)}
            onSuccess={(promotion) => {
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === editingProduct.id
                    ? { ...p, promotions: [promotion] }
                    : p
                )
              );
            }}
          />
        )}
      </div>
    </div>
  );
}