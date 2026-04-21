import { useEffect, useState } from "react";
import { api } from "../../../shared/services/api";
import { useUserStore } from "../../../app/store/userStore";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistButton({ productId }) {
  const { token } = useUserStore();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ vérifier si déjà dans wishlist
  useEffect(() => {
    if (!token) return;

    api.get(`/wishlist/check/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setLiked(res.data.isInWishlist))
      .catch(() => {});
  }, [productId, token]);

  // ✅ toggle
  const toggleWishlist = async () => {
    if (!token) {
      toast.error("Connecte-toi");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        `/wishlist/toggle/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.action === "added") {
        setLiked(true);
        toast.success("Ajouté aux favoris");
      } else {
        setLiked(false);
        toast.success("Retiré des favoris");
      }
    } catch {
      toast.error("Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`
        relative p-2 rounded-full transition-all duration-300
        ${liked ? "bg-red-100" : "bg-gray-100 hover:bg-gray-200"}
      `}
    >
      <Heart
        size={22}
        className={`
          transition-all duration-300
          ${liked ? "fill-red-500 text-red-500 scale-110" : "text-gray-500"}
        `}
      />

      {/* animation */}
      {liked && (
        <span className="absolute inset-0 rounded-full animate-ping bg-red-300 opacity-50"></span>
      )}
    </button>
  );
}