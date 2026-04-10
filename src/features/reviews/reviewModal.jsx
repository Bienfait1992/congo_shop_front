import React, { useState } from "react";
import axios from "axios";
import { api } from "../../shared/services/api";
export default function ReviewModal({ 
  isOpen, 
  onClose, 
  targetId, 
  targetType, 
  existingReview, 
  averageRating, 
  onReviewSubmitted 
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Veuillez sélectionner une note entre 1 et 5 étoiles.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = { targetId, targetType, rating, comment };
      let res;
      if (existingReview) {
        res = await api.patch(`/reviews/${existingReview.id}`, payload);
      } else {
        res = await api.post("/reviews", payload);      }
      onReviewSubmitted?.(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur lors de l'envoi de la review.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 transform transition-transform duration-200 scale-95 animate-scale-up">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Évaluer {targetType.toLowerCase()}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {averageRating !== undefined && (
            <p className="text-gray-600 mb-2">Note moyenne : {averageRating.toFixed(1)} / 5 ⭐</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex gap-1 justify-center">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="border border-gray-300 rounded p-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              rows={3}
              placeholder="Laissez un commentaire (optionnel)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 transition text-white font-semibold py-2 rounded"
            >
              {loading ? "Envoi..." : existingReview ? "Mettre à jour" : "Envoyer"}
            </button>
          </form>
        </div>
      </div>

      {/* Style pour l'animation sans jsx */}
      <style>
        {`
          @keyframes scaleUp {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale-up {
            animation: scaleUp 0.2s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}