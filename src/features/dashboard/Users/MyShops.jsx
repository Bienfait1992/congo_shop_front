import { useEffect, useState } from "react";
import { api } from "../../../shared/services/api";
import { useUserStore } from "../../../app/store/userStore";
import { useNavigate } from "react-router-dom";

export default function MyShops() {
  const [shops, setShops] = useState([]);
  const { token } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    api
      .get("/shops", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setShops(res.data))
      .catch(console.error);
  }, [token]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mes boutiques</h1>

          <button
            onClick={() => navigate("/create-shop")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            + Créer une boutique
          </button>
        </div>

        {/* Liste */}
        {shops.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            Vous n'avez pas encore de boutique
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    Pas de logo
                  </div>
                )}

                <div className="p-4">
                  <h2 className="font-bold text-lg">{shop.name}</h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {shop.description}
                  </p>

                  {/* Status */}
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded 
                    ${
                      shop.status === "APPROVED"
                        ? "bg-green-100 text-green-600"
                        : shop.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {shop.status}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/my-shops/${shop.id}`)}
                      className="flex-1 border px-3 py-1 rounded hover:bg-gray-100"
                    >
                      Gérer
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/my-shops/${shop.id}/products`)
                      }
                      className="flex-1 bg-gray-900 text-white px-3 py-1 rounded hover:bg-black"
                    >
                      Produits
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}