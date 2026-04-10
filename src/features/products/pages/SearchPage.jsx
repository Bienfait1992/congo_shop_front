import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../../shared/services/api";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const page = parseInt(params.get("page")) || 1;
  const limit = parseInt(params.get("limit")) || 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const url = `/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(
          category
        )}&page=${page}&limit=${limit}`;

        const { data } = await api.get(url);

        setProducts(data.data || []);
        setPagination(data.pagination || {});
      } catch (err) {
        setError("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [q, category, page, limit]);

  // Suggestions alternatives (simples produits populaires ou fallback)
  useEffect(() => {
    const fetchFallback = async () => {
      if (products.length === 0) {
        try {
          const { data } = await api.get("/products/popular?limit=6");
          setSuggestions(data || []);
        } catch {
          setSuggestions([]);
        }
      }
    };
    fetchFallback();
  }, [products]);

  const handleNewSearch = (newQuery) => {
    setParams({ q: newQuery, category, page: "1", limit: limit.toString() });
    navigate(`/search?q=${encodeURIComponent(newQuery)}${category ? `&category=${category}` : ""}`);
  };

  return (
    <div className="p-6">
      {loading && <p>Chargement des produits…</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* ❌ État “Aucun résultat trouvé” */}
      {!loading && products.length === 0 && (
        <div className="text-center py-10 space-y-4">
          <h2 className="text-2xl font-bold">
            Aucun produit ne correspond à « <span className="text-yellow-500">{q}</span> »
          </h2>
          <p className="text-gray-600">
            Essayez une autre recherche ou parcourez nos suggestions ci‑dessous.
          </p>

          {/* Barre de recherche réutilisable */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Rechercher un autre produit…"
              defaultValue={q}
              className="px-3 py-2 border rounded-l-md w-1/2"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNewSearch(e.target.value.trim());
              }}
            />
            <button
              onClick={() => handleNewSearch(q)}
              className="bg-yellow-400 px-4 rounded-r-md font-semibold"
            >
              Rechercher
            </button>
          </div>

          {/* Suggestions / produits populaires */}
          {suggestions.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-6">
                Voici quelques produits populaires
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {suggestions.map((p) => (
                  <div key={p.id} className="border rounded-lg p-3 shadow">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-full h-32 object-cover mb-2 rounded"
                    />
                    <h4 className="font-medium text-sm">{p.name}</h4>
                    <p className="text-yellow-500 font-bold">{p.price} $</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 📦 État normal avec résultats */}
      {!loading && products.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg p-3 shadow hover:shadow-lg transition"
              >
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="font-semibold text-sm">{p.name}</h3>
                <p className="text-yellow-500 font-bold">{p.price} $</p>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex gap-2 mt-6 justify-center">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setParams({
                      q,
                      category,
                      page: (i + 1).toString(),
                      limit: limit.toString(),
                    })
                  }
                  className={`px-3 py-1 rounded ${
                    page === i + 1 ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { api } from "../../../shared/services/api";
// import ProductCard from "../../../shared/components/ProductCard";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";

// export default function SearchPage() {
//   const [params, setParams] = useSearchParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [recommendations, setRecommendations] = useState([]);
//   const [error, setError] = useState("");

//   const q = params.get("q") || "";
//   const category = params.get("category") || "";

//   useEffect(() => {
//     const fetchSearch = async () => {
//       setLoading(true);
//       try {
//         const url = `/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`;
//         const { data } = await api.get(url);
//         setProducts(data.data || []);

//         if (data.data?.length === 0) {
//           // suggestions : produits populaires
//           const { data: popular } = await api.get("/products/popular?limit=8");
//           setSuggestions(popular);
//           // recommandations genre “produits similaires”
//           const { data: recs } = await api.get("/products/recommended?limit=8");
//           setRecommendations(recs);
//         }
//       } catch (err) {
//         setError("Erreur de chargement");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSearch();
//   }, [q, category]);

//   if (loading) return <p>Chargement …</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="p-6">
//       {products.length > 0 ? (
//         <>
//           <h2 className="text-xl mb-4">Résultats pour "{q}"</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {products.map((p) => (
//               <ProductCard key={p.id} product={p} />
//             ))}
//           </div>
//         </>
//       ) : (
//         <div className="text-center space-y-4">
//           <h2 className="text-2xl font-bold">Aucun résultat pour "{q}"</h2>
//           <p>Nous avons trouvé ces recommandations pour vous :</p>

//           {/* Carrousel suggestions populaires */}
//           {suggestions.length > 0 && (
//             <>
//               <h3 className="text-lg font-semibold mt-4">Suggestions populaires</h3>
//               <Carousel responsive={{
//                 desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
//                 tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
//                 mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
//               }}>
//                 {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
//               </Carousel>
//             </>
//           )}

//           {/* Recommandations (similaires aux populaires) */}
//           {recommendations.length > 0 && (
//             <>
//               <h3 className="text-lg font-semibold mt-6">Vous pourriez aussi aimer</h3>
//               <Carousel responsive={{
//                 desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
//                 tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
//                 mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
//               }}>
//                 {recommendations.map((p) => <ProductCard key={p.id} product={p} />)}
//               </Carousel>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }