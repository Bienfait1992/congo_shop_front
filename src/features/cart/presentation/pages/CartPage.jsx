// import React, { useEffect } from "react";
// import { useCartStore } from "../store/cartStore";
// import CartItemCard from "../components/CartItemCard";

// export default function CartPage() {
//   const { cart, fetchCart, loading, clearCart } = useCartStore();

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const handleClearCart = async () => {
//     if (window.confirm("Voulez-vous vraiment vider votre panier ?")) {
//       await clearCart();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-10 flex justify-center items-center">
//         <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   if (!cart || cart.items.length === 0) {
//     return (
//       <div className="p-10 text-center">
//         <h2 className="text-xl font-semibold">Votre panier est vide</h2>
//         <p className="text-gray-500 mt-2">Ajoutez des produits pour commencer</p>
//       </div>
//     );
//   }

//   const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   return (
//     <div className="p-4 md:p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      
//       {/* LISTE PRODUITS */}
//       <div className="md:col-span-2 space-y-4">
//         <h1 className="text-2xl font-bold mb-4">Votre panier</h1>

//         <div className="space-y-4">
//           {cart.items.map((item) => (
//             <CartItemCard key={item.id} item={item} />
//           ))}
//         </div>

//         <button
//           onClick={handleClearCart}
//           className="mt-6 w-full bg-red-500 py-3 rounded-xl font-semibold text-white hover:bg-red-600 transition"
//         >
//           Vider le panier
//         </button>
//       </div>

//       {/* RÉSUMÉ */}
//       <div className="bg-white shadow rounded-xl p-6 sticky top-6 h-fit">
//         <h2 className="text-lg font-semibold mb-4">Résumé</h2>

//         <div className="flex justify-between mb-2">
//           <span>Sous-total</span>
//           <span>{total.toFixed(2)} $</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span>Livraison</span>
//           <span className="text-green-600">Gratuite</span>
//         </div>

//         <div className="border-t pt-4 flex justify-between font-bold text-lg">
//           <span>Total</span>
//           <span>{total.toFixed(2)} $</span>
//         </div>

//         <button className="w-full mt-6 bg-yellow-400 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition">
//           Passer la commande
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useCartStore } from "../store/cartStore";
import CartItemCard from "../components/CartItemCard";
import ConfirmModal from "../../../../shared/components/ConfirmModal";

export default function CartPage() {
  const { cart, fetchCart, loading, clearCart } = useCartStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { fetchCart(); }, []);

  const handleClearCart = async () => {
    await clearCart();
    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className="p-10 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Votre panier est vide</h2>
        <p className="text-gray-500 mt-2">Ajoutez des produits pour commencer</p>
      </div>
    );
  }

  const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LISTE PRODUITS */}
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Votre panier</h1>
        <div className="space-y-4">
          {cart.items.map((item) => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="mt-6 w-full bg-red-500 py-3 rounded-xl font-semibold text-white hover:bg-red-600 transition"
        >
          Vider le panier
        </button>
      </div>

      {/* RÉSUMÉ */}
      <div className="bg-white shadow rounded-xl p-6 sticky top-6 h-fit">
        <h2 className="text-lg font-semibold mb-4">Résumé</h2>
        <div className="flex justify-between mb-2">
          <span>Sous-total</span>
          <span>{total.toFixed(2)} $</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Livraison</span>
          <span className="text-green-600">Gratuite</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{total.toFixed(2)} $</span>
        </div>
        <button className="w-full mt-6 bg-yellow-400 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition">
          Passer la commande
        </button>
      </div>

      {/* MODAL */}
      <ConfirmModal
        isOpen={modalOpen}
        message="Voulez-vous vraiment vider votre panier ?"
        onConfirm={handleClearCart}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}