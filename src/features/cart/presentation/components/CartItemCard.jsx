import React, { useState } from "react";
import { useCartStore } from "../store/cartStore";
import ConfirmModal from "../../../../shared/components/ConfirmModal";

export default function CartItemCard({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  const [modalOpen, setModalOpen] = useState(false);

  const increase = () => updateQuantity(item.id, item.quantity + 1);
  const decrease = () => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1);

  const handleRemove = async () => {
    await removeItem(item.id);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow hover:shadow-md transition items-center sm:items-start">
      <img
        src={item.product?.images?.[0] || "/placeholder.png"}
        alt={item.product?.name}
        className="w-32 h-32 sm:w-24 sm:h-24 object-cover rounded-lg"
      />
      <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
        <div>
          <h3 className="font-semibold text-lg">{item.product?.name}</h3>
          <p className="text-sm text-gray-500">{item.price} $</p>
          <div className="flex items-center gap-3 mt-3">
            <button onClick={decrease} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
            <span className="font-medium">{item.quantity}</span>
            <button onClick={increase} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
            <button onClick={() => setModalOpen(true)} className="ml-4 text-red-500 hover:underline">
              Supprimer
            </button>
          </div>
        </div>
        <div className="font-semibold text-lg mt-3 sm:mt-0">{(item.price * item.quantity).toFixed(2)} $</div>
      </div>

      {/* MODAL */}
      <ConfirmModal
        isOpen={modalOpen}
        message="Voulez-vous vraiment supprimer cet article ?"
        onConfirm={handleRemove}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}