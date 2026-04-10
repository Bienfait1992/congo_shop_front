// import { useEffect, useState } from "react";
// import { api } from "../../../../shared/services/api";

// export default function StatsPage() {
//   const [stats, setStats] = useState({ sales: 0, orders: 0, users: 0, products: 0 });

//   useEffect(() => {
//     api.get("/admin/stats").then(res => setStats(res.data)).catch(console.error);
//   }, []);

//   return (
//     <div className="grid grid-cols-4 gap-4">
//       <div className="p-4 bg-white shadow rounded">
//         <h2>Ventes</h2>
//         <p>${stats.sales}</p>
//       </div>
//       <div className="p-4 bg-white shadow rounded">
//         <h2>Commandes</h2>
//         <p>{stats.orders}</p>
//       </div>
//       <div className="p-4 bg-white shadow rounded">
//         <h2>Utilisateurs</h2>
//         <p>{stats.users}</p>
//       </div>
//       <div className="p-4 bg-white shadow rounded">
//         <h2>Produits</h2>
//         <p>{stats.products}</p>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { api } from "../../../../shared/services/api";

export default function StatsPage() {
  const [stats, setStats] = useState({ sales: 0, orders: 0, users: 0, products: 0 });

  useEffect(() => {
    api.get("/admin/stats").then(res => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="p-4 bg-white shadow rounded">
        <h2>Ventes</h2>
        <p>${stats.sales}</p>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h2>Commandes</h2>
        <p>{stats.orders}</p>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h2>Utilisateurs</h2>
        <p>{stats.users}</p>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h2>Produits</h2>
        <p>{stats.products}</p>
      </div>
    </div>
  );
}