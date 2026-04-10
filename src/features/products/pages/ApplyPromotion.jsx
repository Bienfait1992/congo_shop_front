import { useState } from "react";
import { api } from "../../../shared/services/api";

export default function PromotionModal({ productId, onClose, onSuccess }) {
  const [discount, setDiscount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApplyPromotion = async () => {
    setError("");
    if (!discount || !startDate || !endDate) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/products/${productId}/promotion`, {
        discount: parseFloat(discount),
        startDate,
        endDate,
      });

      if (onSuccess) onSuccess(data.promotion);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'application de la promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Appliquer une promotion</h3>

        <input
          type="number"
          placeholder="Remise (%)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-3"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-3"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-3"
        />
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleApplyPromotion}
            className="px-4 py-2 rounded bg-yellow-400 text-white hover:bg-yellow-500"
            disabled={loading}
          >
            {loading ? "En cours..." : "Appliquer"}
          </button>
        </div>
      </div>
    </div>
  );
}