import React, { useState } from "react";
import { useCartStore } from "../store/cartStore";

export default function CartItemCard({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  const [loading, setLoading] = useState(false);

  const price = item.price;
  const total = price * item.quantity;

  const imageUrl =
  item.variant?.images?.[0] ||
  item.product?.images?.[0] ||
  item.product?.image ||
  "/placeholder.png";

  const handleQtyChange = async (newQty) => {
    if (newQty < 1) return;

    setLoading(true);
    await updateQuantity(item.id, newQty);
    setLoading(false);
  };

  return (
    <div className="flex gap-4 border rounded-xl p-4 bg-white shadow-sm">

      {/* IMAGE VARIANT / PRODUCT */}
      {/* <img
      src={
        item.variant?.images?.[0] ||
        item.product?.image ||
        "/placeholder.png"
      }
      className="w-24 h-24 object-cover rounded-lg"
      alt={item.product.name}
    /> */}

  <img
  src={
    item.variant?.images?.[0]
      ? `http://localhost:3000${item.variant.images[0]}`
      : item.product?.images?.[0]
      ? `http://localhost:3000${item.product.images[0]}`
      : item.product?.image
      ? `http://localhost:3000${item.product.image}`
      : "/placeholder.png"
  }
  className="w-24 h-24 object-cover rounded-lg"
  alt={item.product.name}
/>

      {/* DETAILS */}
      <div className="flex-1">

        <h3 className="font-semibold text-gray-800">
          {item.product.name}
        </h3>

        {/* VARIANT DISPLAY */}
    
{item.variant?.attributes ? (
  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
    {Object.entries(item.variant.attributes).map(([key, val]) => (
      <span
        key={key}
        className="px-2 py-1 bg-gray-100 rounded-full"
      >
        {key}: {val}
      </span>
    ))}
  </div>
) : (
  <p className="text-sm text-gray-400">
    Chargement variante...
  </p>
)}
        {/* PRICE */}
        <p className="text-sm text-gray-500">
          {price.toFixed(2)} $
        </p>

        {/* QTY CONTROLLER */}
        <div className="flex items-center gap-2 mt-3">

          <button
            onClick={() => handleQtyChange(item.quantity - 1)}
            className="px-2 py-1 bg-gray-200 rounded"
            disabled={loading}
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() => handleQtyChange(item.quantity + 1)}
            className="px-2 py-1 bg-gray-200 rounded"
            disabled={loading}
          >
            +
          </button>

          {/* DELETE */}
          <button
            onClick={() => removeItem(item.id)}
            className="ml-4 text-red-500 text-sm hover:underline"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* TOTAL */}
      <div className="font-bold text-right">
        {total.toFixed(2)} $
      </div> 
    </div>
  );
}

// import React, { useState } from "react";
// import { useCartStore } from "../store/cartStore";

// export default function CartItemCard({ item }) {
//   const { updateQuantity, removeItem } = useCartStore();
//   const [loading, setLoading] = useState(false);

//   const price = item.price;
//   const total = price * item.quantity;

//   const imageUrl =
//     item.variant?.images?.[0] ||
//     item.product?.images?.[0] ||
//     item.product?.image ||
//     "/placeholder.png";

//   const handleQtyChange = async (newQty) => {
//     if (newQty < 1) return;

//     setLoading(true);
//     await updateQuantity(item.id, newQty);
//     setLoading(false);
//   };

//   return (
//     <div className="flex gap-4 border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition">

//       {/* IMAGE */}
//       <img
//         src={
//           imageUrl.startsWith("http")
//             ? imageUrl
//             : `http://localhost:3000${imageUrl}`
//         }
//         className="w-24 h-24 object-cover rounded-lg"
//         alt={item.product.name}
//       />

//       {/* DETAILS */}
//       <div className="flex-1">

//         <h3 className="font-semibold text-gray-800">
//           {item.product.name}
//         </h3>

//         {/* VARIANT */}
//         {item.variant?.attributes ? (
//           <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-1">
//             {Object.entries(item.variant.attributes).map(([key, val]) => (
//               <span key={key} className="px-2 py-1 bg-gray-100 rounded-full">
//                 {key}: {val}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <p className="text-sm text-gray-400">Produit standard</p>
//         )}

//         {/* PRICE */}
//         <p className="text-sm text-gray-500 mt-1">
//           {price.toFixed(2)} $
//         </p>

//         {/* QTY */}
//         <div className="flex items-center gap-2 mt-3">

//           <button
//             onClick={() => handleQtyChange(item.quantity - 1)}
//             className="px-2 py-1 bg-gray-200 rounded"
//             disabled={loading}
//           >
//             -
//           </button>

//           <span>{item.quantity}</span>

//           <button
//             onClick={() => handleQtyChange(item.quantity + 1)}
//             className="px-2 py-1 bg-gray-200 rounded"
//             disabled={loading}
//           >
//             +
//           </button>

//           <button
//             onClick={() => removeItem(item.id)}
//             className="ml-4 text-red-500 text-sm hover:underline"
//           >
//             Supprimer
//           </button>
//         </div>
//       </div>

//       {/* TOTAL */}
//       <div className="font-bold text-right">
//         {total.toFixed(2)} $
//       </div>

//     </div>
//   );
// }