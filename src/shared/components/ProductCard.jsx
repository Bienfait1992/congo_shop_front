// src/features/shared/ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* IMAGE */}
      <div className="w-full h-48 md:h-60 lg:h-72 overflow-hidden flex items-center justify-center bg-gray-100">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* INFO */}
      <div className="p-3 flex flex-col justify-between h-36">
        <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-yellow-500 font-bold mt-2 text-base md:text-lg">
          {product.price?.toFixed(2)} $
        </p>
        {product.rating && (
          <p className="text-xs text-gray-500 mt-1">{`⭐ ${product.rating} / 5`}</p>
        )}
      </div>
    </div>
  );
}