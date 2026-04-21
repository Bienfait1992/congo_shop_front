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
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    images: [],
    currency: "USD",
    variants: [],
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
    formData.append("variants", JSON.stringify(newProduct.variants || []));

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
        variants: [],
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
      variants: product.variants || [],
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    
    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
      
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">
          {editingProduct ? "Modifier le produit" : "Nouveau produit"}
        </h2>
        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="overflow-y-auto px-6 py-4 space-y-4">

        {/* NOM */}
        <input
          type="text"
          placeholder="Nom du produit"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct(prev => ({ ...prev, name: e.target.value }))
          }
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
        />

        {/* PRIX + DEVISE */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Prix"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct(prev => ({ ...prev, price: e.target.value }))
            }
            className="w-full border rounded-lg px-3 py-2"
          />

          <select
            value={newProduct.currency}
            onChange={(e) =>
              setNewProduct(prev => ({ ...prev, currency: e.target.value }))
            }
            className="w-32 border rounded-lg px-3 py-2"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CDF">CDF</option>
          </select>
        </div>

        {/* CATEGORY */}
        <select
          value={newProduct.categoryId || ""}
          onChange={(e) =>
            setNewProduct(prev => ({
              ...prev,
              categoryId: e.target.value,
            }))
          }
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* STOCK */}
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct(prev => ({ ...prev, stock: e.target.value }))
          }
          className="w-full border rounded-lg px-3 py-2"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct(prev => ({ ...prev, description: e.target.value }))
          }
          className="w-full border rounded-lg px-3 py-2 resize-none"
        />

        {/* TAGS */}
        <input
          type="text"
          placeholder="Tags (ex: promo, nouveau, bio)"
          onChange={(e) =>
            setNewProduct(prev => ({
              ...prev,
              tags: e.target.value.split(","),
            }))
          }
          className="w-full border rounded-lg px-3 py-2"
        />

        {/* IMAGES */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        {/* PREVIEW */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {previewImages.map((src, idx) => (
              <div key={idx} className="h-24 rounded-lg overflow-hidden border">
                <img src={src} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* VARIANTS */}
{/* ================= VARIANTS ================= */}
<div>
  <h3 className="font-semibold mb-3 text-lg">Variantes</h3>

  {/* GENERATE BUTTONS */}
  <div className="flex gap-2 mb-4 flex-wrap">
    
    {/* GENERER TAILLES */}
    <button
      onClick={() => {
        const sizes = ["S", "M", "L", "XL"];

        const variants = sizes.map(size => ({
          attributes: { size },
          price: newProduct.price || 0,
          stock: 0,
        }));

        setNewProduct(prev => ({
          ...prev,
          variants
        }));
      }}
      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm"
    >
      Générer tailles (S,M,L,XL)
    </button>

    {/* GENERER COULEURS + TAILLES */}
    <button
      onClick={() => {
        const sizes = ["S", "M", "L"];
        const colors = ["Rouge", "Bleu", "Noir"];

        const variants = [];

        sizes.forEach(size => {
          colors.forEach(color => {
            variants.push({
              attributes: { size, color },
              price: newProduct.price || 0,
              stock: 0,
            });
          });
        });

        setNewProduct(prev => ({
          ...prev,
          variants
        }));
      }}
      className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm"
    >
      Générer tailles + couleurs
    </button>
  </div>

  {/* LISTE DES VARIANTS */}
  {(newProduct.variants || []).map((v, i) => (
    <div
      key={i}
      className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2 items-center"
    >

      {/* COLOR */}
      <input
        placeholder="Couleur"
        value={v.attributes?.color || ""}
        onChange={(e) => {
          const variants = [...newProduct.variants];
          variants[i].attributes = {
            ...variants[i].attributes,
            color: e.target.value
          };
          setNewProduct(prev => ({ ...prev, variants }));
        }}
        className="border px-2 py-1 rounded"
      />

      {/* SIZE */}
      <input
        placeholder="Taille"
        value={v.attributes?.size || ""}
        onChange={(e) => {
          const variants = [...newProduct.variants];
          variants[i].attributes = {
            ...variants[i].attributes,
            size: e.target.value
          };
          setNewProduct(prev => ({ ...prev, variants }));
        }}
        className="border px-2 py-1 rounded"
      />

      {/* PRICE */}
      <input
        type="number"
        placeholder="Prix"
        value={v.price || ""}
        onChange={(e) => {
          const variants = [...newProduct.variants];
          variants[i].price = Number(e.target.value);
          setNewProduct(prev => ({ ...prev, variants }));
        }}
        className="border px-2 py-1 rounded"
      />

      {/* STOCK */}
      <input
        type="number"
        placeholder="Stock"
        value={v.stock || ""}
        onChange={(e) => {
          const variants = [...newProduct.variants];
          variants[i].stock = Number(e.target.value);
          setNewProduct(prev => ({ ...prev, variants }));
        }}
        className="border px-2 py-1 rounded"
      />

      {/* DELETE */}
      <button
        onClick={() => {
          setNewProduct(prev => ({
            ...prev,
            variants: prev.variants.filter((_, idx) => idx !== i),
          }));
        }}
        className="text-red-500 text-lg"
      >
        ✕
      </button>
    </div>
  ))}

  {/* ADD MANUAL */}
  <button
    onClick={() =>
      setNewProduct(prev => ({
        ...prev,
        variants: [
          ...(prev.variants || []),
          {
            attributes: { color: "", size: "" },
            price: 0,
            stock: 0,
          },
        ],
      }))
    }
    className="mt-2 text-sm text-green-600"
  >
    + Ajouter manuellement
  </button>
</div> x
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
        <button
          onClick={() => {
            setShowModal(false);
            setEditingProduct(null);
            setPreviewImages([]);
            setNewProduct({
              name: "",
              price: "",
              stock: "",
              description: "",
              images: [],
              currency: "USD",
              variants: [],
            });
          }}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Annuler
        </button>

        <button
          onClick={async () => {
            const formData = new FormData();

            const slug = newProduct.name
              .toLowerCase()
              .replace(/\s+/g, "-");

            formData.append("name", newProduct.name);
            formData.append("slug", slug);
            formData.append("price", parseFloat(newProduct.price));
            formData.append("stock", parseInt(newProduct.stock || "0"));
            formData.append("currency", newProduct.currency);
            formData.append("description", newProduct.description);

            if (newProduct.tags)
              formData.append("tags", JSON.stringify(newProduct.tags));

            if (newProduct.variants)
              formData.append("variants", JSON.stringify(newProduct.variants));

            newProduct.images.forEach(file =>
              formData.append("images", file)
            );

            if (newProduct.categoryId)
              formData.append("categoryId", newProduct.categoryId);

            try {
              if (editingProduct) {
                const { data } = await api.put(
                  `/shops/${shopId}/products/${editingProduct.id}`,
                  formData,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setProducts(prev =>
                  prev.map(p => (p.id === data.id ? data : p))
                );
                toast.success("Produit mis à jour");
              } else {
                const { data } = await api.post(
                  `/shops/${shopId}/products`,
                  formData,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setProducts(prev => [...prev, data]);
                toast.success("Produit ajouté");
              }

              setShowModal(false);
            } catch {
              toast.error("Erreur");
            }
          }}
          className="px-5 py-2 bg-green-600 text-white rounded-lg"
        >
          {editingProduct ? "Mettre à jour" : "Ajouter"}
        </button>
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