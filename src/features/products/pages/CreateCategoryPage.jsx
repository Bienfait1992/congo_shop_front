import React, { useState, useEffect } from "react";
import { api } from "../../../shared/services/api";
import { useUserStore } from "../../../app/store/userStore";
import toast from "react-hot-toast";

export default function CreateCategoryPage() {
  const { token } = useUserStore();
  const [category, setCategory] = useState({ name: "", icon: "" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Récupération des catégories au chargement
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (err) {
        console.error(err.response?.data || err);
        toast.error("Impossible de charger les catégories");
      }
    };
    fetchCategories();
  }, []);

  // Création d'une catégorie
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.name || !category.icon) {
      toast.error("Le nom et l'icône sont obligatoires");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", category.name);
      formData.append("icon", category.icon);

      const { data } = await api.post("/categories", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
      setCategory({ name: "", icon: "" });

      setCategories((prev) => [...prev, data.category]);
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.error || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'une catégorie
  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;

    try {
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Catégorie supprimée");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Impossible de supprimer la catégorie");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle catégorie</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={category.name}
          onChange={(e) =>
            setCategory((prev) => ({ ...prev, name: e.target.value }))
          }
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setCategory((prev) => ({ ...prev, icon: e.target.files[0] }))
          }
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? "Création..." : "Créer la catégorie"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Catégories existantes</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id} className="flex items-center gap-3 mb-2">
            {cat.icon && (
              <img
                src={`http://localhost:3000/${cat.icon}`} // fonctionne toujours
                alt={cat.name}
                className="w-10 h-10 object-cover rounded"
                />
            )}
            <span>{cat.name}</span>
            <button
              className="ml-auto bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              onClick={() => handleDelete(cat.id, cat.name)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}