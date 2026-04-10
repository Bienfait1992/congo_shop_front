import React from "react";
import { useCartStore } from "../store/cartStore";

export default function CartItemCard({ item }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 border-b pb-4">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-24 h-24 object-cover"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{item.product.name}</h3>
        <p className="text-sm text-gray-500">{item.price} $</p>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            value={item.quantity}
            min={1}
            onChange={(e) =>
              updateQuantity(item.id, parseInt(e.target.value))
            }
            className="w-16 border rounded p-1"
          />

          <button
            onClick={() => removeItem(item.id)}
            className="text-red-500 hover:underline"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="font-semibold">
        {(item.price * item.quantity).toFixed(2)} $
      </div>
    </div>
  );
}