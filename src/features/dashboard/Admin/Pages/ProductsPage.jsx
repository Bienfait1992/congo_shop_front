import { useEffect, useState } from "react";
import { api } from "../../../../shared/services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="bg-white p-4 shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2>Produits</h2>
        <input
          type="text"
          placeholder="Rechercher..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      <ul>
        {filteredProducts.map(p => (
          <li key={p.id} className="flex justify-between py-1 border-b">
            <span>{p.name}</span>
            <span className="text-sm text-gray-500">{p.stock} en stock</span>
          </li>
        ))}
      </ul>
    </div>
  );
}