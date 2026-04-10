
import { useEffect, useState } from "react";
import { api } from "../../../shared/services/api";
import { useNavigate } from "react-router-dom";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getActivePromotion = (promotions) => {
    if (!promotions || promotions.length === 0) return null;
    const now = new Date();
    return promotions.find(p =>
      new Date(p.startDate) <= now && new Date(p.endDate) >= now
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-[60vh]">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Chargement des produits...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => {
          const promo = getActivePromotion(p.promotions);
          const discountedPrice = promo
            ? (p.price * (1 - promo.discount / 100)).toFixed(2)
            : null;

          return (
            <div
              key={p.id}
              className="relative bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 flex flex-col overflow-hidden group"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={p.images?.[0] ? `http://localhost:3000${p.images[0]}` : "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                />

                {/* BADGE PROMO */}
                {promo && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                    -{promo.discount}%
                  </span>
                )}

                {/* BADGE STOCK */}
                {p.stock === 0 && (
                  <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg">
                    Épuisé
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                {/* NOM */}
                <h2 className="text-md font-semibold line-clamp-1">
                  {p.name}
                </h2>

                {/* SHOP */}
                <p className="text-xs text-gray-500 mb-1">
                  {p.shop?.name || "Boutique"}
                </p>

                {/* PRIX */}
                <div className="mt-2">
                  {promo ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-bold text-lg">
                        {discountedPrice} {p.currency || "USD"}
                      </span>
                      <span className="text-gray-400 line-through text-sm">
                        {p.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-blue-600 font-bold text-lg">
                      {p.price} {p.currency || "USD"}
                    </span>
                  )}
                </div>

                {/* STOCK */}
                <p
                  className={`text-xs mt-1 ${
                    p.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {p.stock > 0
                    ? `En stock (${p.stock})`
                    : "Rupture de stock"}
                </p>

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-xs line-clamp-2 mt-2">
                  {p.description || "Pas de description"}
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => navigate(`/products/${p.id}`)}
                  disabled={p.stock === 0}
                  className="mt-auto w-full mt-4 bg-blue-600 text-white py-2 rounded-xl 
                  hover:bg-blue-700 transition text-sm font-medium
                  disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Voir le produit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}