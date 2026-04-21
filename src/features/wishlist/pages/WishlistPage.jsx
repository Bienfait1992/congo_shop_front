// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { api } from "../../../shared/services/api";
// import { useUserStore } from "../../../app/store/userStore";
// import WishlistButton from "./WishlistButton";
// import { useNavigate } from "react-router-dom";
// import { useWishlistStore } from "../../cart/presentation/store/wishlistStore";

// export default function WishlistPage() {
//   const { token } = useUserStore();
//   const navigate = useNavigate();

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const { setWishlist } = useWishlistStore();

//   // =========================
//   // FETCH WISHLIST
//   // =========================
//   const fetchWishlist = async () => {
//     if (!token) return;

//     setLoading(true);

//     try {
//       const res = await api.get("/wishlist", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setItems(res.data || []);
//       setWishlist(res.data || []);
//     } catch (err) {
//       toast.error("Erreur chargement favoris");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWishlist();
//   }, [token]);

//   // =========================
//   // REMOVE ITEM
//   // =========================
//   const handleRemove = (productId) => {
//     setItems((prev) => {
//       const updated = prev.filter(
//         (item) => item.product.id !== productId
//       );
//       setWishlist(updated);
//       return updated;
//     });
//   };

//   // =========================
//   // NAVIGATE DETAILS (NEW UX)
//   // =========================
//   const goToProduct = (productId) => {
//     navigate(`/products/${productId}`);
//   };

//   // =========================
//   // LOADING
//   // =========================
//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6 animate-pulse">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="bg-gray-100 h-72 rounded-xl" />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Mes favoris ❤️</h1>

//       {items.length === 0 ? (
//         <div className="text-center text-gray-500 mt-20">
//           <p className="mb-4">Aucun produit en favoris</p>

//           <button
//             onClick={() => navigate("/")}
//             className="bg-blue-600 text-white px-5 py-2 rounded-lg"
//           >
//             Découvrir des produits
//           </button>
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-3 gap-6">
//           {items.map((item) => {
//             const p = item.product;

//             return (
//               <div
//                 key={item.id}
//                 className="bg-white rounded-xl shadow p-4 flex flex-col"
//               >
//                 {/* IMAGE */}
//                 <img
//                   src={
//                     p.images?.[0]
//                       ? `http://localhost:3000${p.images[0]}`
//                       : "/placeholder.png"
//                   }
//                   alt={p.name}
//                   className="h-48 w-full object-cover rounded-lg cursor-pointer"
//                   onClick={() => goToProduct(p.id)}
//                 />

//                 {/* NAME */}
//                 <div className="mt-3 flex justify-between">
//                   <h2
//                     className="font-semibold cursor-pointer hover:text-blue-600"
//                     onClick={() => goToProduct(p.id)}
//                   >
//                     {p.name}
//                   </h2>

//                   <WishlistButton
//                     productId={p.id}
//                     onRemove={() => handleRemove(p.id)}
//                   />
//                 </div>

//                 {/* PRICE */}
//                 <p className="text-blue-600 font-bold mt-2">
//                   {p.price} {p.currency}
//                 </p>

//                 {/* STOCK */}
//                 <p className="text-sm text-gray-500">
//                   {p.stock > 0 ? "En stock" : "Rupture"}
//                 </p>

//                 {/* BUTTON CLEAN UX */}
//                 <button
//                   onClick={() => goToProduct(p.id)}
//                   className="mt-auto bg-yellow-400 py-2 rounded-lg font-semibold hover:bg-yellow-500"
//                 >
//                   Voir les détails
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../shared/services/api";
import { useUserStore } from "../../../app/store/userStore";
import WishlistButton from "./WishlistButton";
import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "../../cart/presentation/store/wishlistStore";

export default function WishlistPage() {
  const { token } = useUserStore();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCart, setLoadingCart] = useState(null);

  const { setWishlist } = useWishlistStore();

  // =========================
  // FETCH WISHLIST
  // =========================
  const fetchWishlist = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const res = await api.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(res.data || []);
      setWishlist(res.data || []);
    } catch (err) {
      toast.error("Erreur chargement favoris");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  // =========================
  // REMOVE ITEM
  // =========================
  const handleRemove = (productId) => {
    setItems((prev) => {
      const updated = prev.filter(
        (item) => item.product.id !== productId
      );
      setWishlist(updated);
      return updated;
    });
  };

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = async (product) => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    if (product.variants?.length > 0) {
      navigate(`/products/${product.id}`);
      return;
    }

    setLoadingCart(product.id);

    try {
      await api.post(
        "/cart/items",
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Ajouté au panier");
    } catch (err) {
      toast.error("Erreur ajout panier");
    } finally {
      setLoadingCart(null);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 h-72 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Mes favoris ❤️
      </h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="mb-4">Aucun produit en favoris</p>

          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Découvrir des produits
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => {
            const p = item.product;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={
                      p.images?.[0]
                        ? `http://localhost:3000${p.images[0]}`
                        : "/placeholder.png"
                    }
                    alt={p.name}
                    className="h-52 w-full object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
                    onClick={() => navigate(`/products/${p.id}`)}
                  />

                  {/* gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* wishlist */}
                  <div className="absolute top-2 right-2">
                    <WishlistButton
                      productId={p.id}
                      onRemove={() => handleRemove(p.id)}
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col flex-1">
                  {/* NAME */}
                  <h2
                    className="font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/products/${p.id}`)}
                  >
                    {p.name}
                  </h2>

                  {/* PRICE */}
                  <p className="text-blue-600 font-bold mt-2 text-lg">
                    {p.price} {p.currency}
                  </p>

                  {/* STOCK BADGE */}
                  <span
                    className={`text-xs mt-1 inline-block px-2 py-1 rounded-full w-fit ${
                      p.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {p.stock > 0 ? "En stock" : "Rupture"}
                  </span>

                  {/* SHOP */}
                  <p className="text-sm text-gray-500 mt-2">
                    {p.shop?.name || "Boutique"}
                  </p>

                  {/* ACTIONS */}
                  <div className="mt-auto pt-4 space-y-2">
                    {/* DETAILS */}
                    <button
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      Voir les détails
                    </button>

                    {/* CART */}
                    {/* <button
                      onClick={() => handleAddToCart(p)}
                      disabled={p.stock === 0 || loadingCart === p.id}
                      className="w-full bg-yellow-400 py-2 rounded-lg font-semibold hover:bg-yellow-500 disabled:bg-gray-300 transition"
                    >
                      {p.stock === 0
                        ? "Indisponible"
                        : loadingCart === p.id
                        ? "Ajout..."
                        : "Ajouter au panier"}
                    </button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}