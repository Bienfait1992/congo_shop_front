// import React, { useEffect, useState } from "react";
// import { useCartStore } from "../store/cartStore";
// // import CartItemCard from "../components/CartItemCard";
// import CartItemCard from ""
// import ConfirmModal from "../../../../shared/components/ConfirmModal";

// export default function CartPage() {
//   const { cart, fetchCart, loading, clearCart } = useCartStore();
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const items = cart?.items || [];

//   const subtotal = items.reduce((acc, item) => {
//     return acc + item.price * item.quantity;
//   }, 0);

//   const shipping = subtotal > 50 ? 0 : 5;
//   const total = subtotal + shipping;

//   if (loading) {
//     return (
//       <div className="p-10 flex justify-center">
//         <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <div className="p-10 text-center">
//         <h2 className="text-xl font-semibold">Votre panier est vide</h2>
//         <p className="text-gray-500">Ajoutez des produits</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">

//       {/* ITEMS */}
//       <div className="md:col-span-2 space-y-4">
//         <h1 className="text-2xl font-bold">Panier</h1>

//         {items.map((item) => (
//           <CartItemCard key={item.id} item={item} />
//         ))}

//         <button
//           onClick={() => setModalOpen(true)}
//           className="w-full bg-red-500 text-white py-3 rounded-xl mt-4"
//         >
//           Vider le panier
//         </button>
//       </div>

//       {/* SUMMARY AMAZON STYLE */}
//       <div className="bg-white shadow rounded-xl p-6 h-fit sticky top-6">

//         <h2 className="text-lg font-semibold mb-4">
//           Résumé de commande
//         </h2>

//         <div className="space-y-2 text-sm">

//           <div className="flex justify-between">
//             <span>Sous-total</span>
//             <span>{subtotal.toFixed(2)} $</span>
//           </div>

//           <div className="flex justify-between">
//             <span>Livraison</span>
//             <span>{shipping === 0 ? "Gratuite" : shipping + " $"}</span>
//           </div>

//           <div className="border-t pt-2 flex justify-between font-bold">
//             <span>Total</span>
//             <span>{total.toFixed(2)} $</span>
//           </div>

//         </div>

//         <button className="w-full mt-6 bg-yellow-400 py-3 rounded-xl font-semibold">
//           Passer la commande
//         </button>
//       </div>

//       {/* CLEAR MODAL */}
//       <ConfirmModal
//         isOpen={modalOpen}
//         message="Vider le panier ?"
//         onConfirm={clearCart}
//         onCancel={() => setModalOpen(false)}
//       />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useCartStore } from "../store/cartStore";
import CartItemCard from "../components/CartItemCard";
import ConfirmModal from "../../../../shared/components/ConfirmModal";
import { api } from "../../../../shared/services/api";
import { useUserStore } from "../../../../app/store/userStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, fetchCart, loading, clearCart } = useCartStore();
  const { token } = useUserStore();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const items = cart?.items || [];

  // ======================
  // PRICES
  // ======================
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  // ======================
  // CHECKOUT
  // ======================
  const handleCheckout = async () => {
    if (!token) return navigate("/auth/login");

    try {
      setLoadingCheckout(true);

      const res = await api.post(
        "/orders/checkout",
        {
          paymentMethod: "CASH",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await clearCart();

      toast.success("Commande créée avec succès");

      navigate(`/orders/${res.data.order.id}`);
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.error || "Erreur commande");
    } finally {
      setLoadingCheckout(false);
    }
  };

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // ======================
  // EMPTY CART
  // ======================
  if (items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Votre panier est vide</h2>
        <p className="text-gray-500">Ajoutez des produits</p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Continuer vos achats
        </button>
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">

      {/* ITEMS */}
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">Panier</h1>

        {items.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}

        <button
          onClick={() => setModalOpen(true)}
          className="w-full bg-red-500 text-white py-3 rounded-xl mt-4 hover:bg-red-600"
        >
          Vider le panier
        </button>
      </div>

      {/* SUMMARY AMAZON STYLE */}
      <div className="bg-white shadow rounded-xl p-6 h-fit sticky top-6">

        <h2 className="text-lg font-semibold mb-4">
          Résumé de commande
        </h2>

        <div className="space-y-2 text-sm">

          <div className="flex justify-between">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} $</span>
          </div>

          <div className="flex justify-between">
            <span>Livraison</span>
            <span>{shipping === 0 ? "Gratuite" : shipping + " $"}</span>
          </div>

          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>{total.toFixed(2)} $</span>
          </div>

        </div>

        <button
          onClick={handleCheckout}
          disabled={loadingCheckout}
          className="w-full mt-6 bg-yellow-400 py-3 rounded-xl font-semibold hover:bg-yellow-500 disabled:bg-gray-300"
        >
          {loadingCheckout ? "Traitement..." : "Passer la commande"}
        </button>
      </div>

      {/* MODAL */}
      <ConfirmModal
        isOpen={modalOpen}
        message="Vider le panier ?"
        onConfirm={clearCart}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}