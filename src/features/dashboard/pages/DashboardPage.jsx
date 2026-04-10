// import { useEffect, useState } from "react";
// import { api } from "../../../shared/services/api";
// import toast from "react-hot-toast";

// export default function DashboardPage() {
//   // ✅ Stats
//   const [stats, setStats] = useState({
//     sales: 0,
//     orders: 0,
//     users: 0,
//     products: 0,
//   });

//   // ✅ Boutiques
//   const [pendingShops, setPendingShops] = useState([]);

//   // ✅ Utilisateurs et produits (exemple simplifié)
//   const [users, setUsers] = useState([]);
//   const [products, setProducts] = useState([]);

//   // 🔄 Fetch stats
//   useEffect(() => {
//     api.get("/admin/stats")
//       .then(res => setStats(res.data))
//       .catch(() => toast.error("Erreur chargement statistiques"));
//   }, []);

//   // 🔄 Fetch boutiques en attente
//   useEffect(() => {
//     api.get("/shops?status=PENDING")
//       .then(res => setPendingShops(res.data))
//       .catch(() => toast.error("Erreur chargement boutiques"));
//   }, []);

//   // 🔄 Fetch utilisateurs
//   useEffect(() => {
//     api.get("/users")
//       .then(res => setUsers(res.data))
//       .catch(() => toast.error("Erreur chargement utilisateurs"));
//   }, []);

//   // 🔄 Fetch produits
//   useEffect(() => {
//     api.get("/products")
//       .then(res => setProducts(res.data))
//       .catch(() => toast.error("Erreur chargement produits"));
//   }, []);

//   const approveShop = async (id) => {
//     try {
//       await api.patch(`/shops/${id}`, { status: "APPROVED" });
//       setPendingShops(prev => prev.filter(shop => shop.id !== id));
//       toast.success("Boutique approuvée");
//     } catch {
//       toast.error("Erreur lors de l'approbation");
//     }
//   };

//   const rejectShop = async (id) => {
//     try {
//       await api.patch(`/shops/${id}`, { status: "REJECTED" });
//       setPendingShops(prev => prev.filter(shop => shop.id !== id));
//       toast.success("Boutique rejetée");
//     } catch {
//       toast.error("Erreur lors du rejet");
//     }
//   };

//   return (
//     <div className="p-6 grid gap-6">

//       {/* --- STATISTIQUES --- */}
//       <div className="grid grid-cols-4 gap-4">
//         <div className="p-4 bg-white shadow rounded">
//           <h2>Ventes</h2>
//           <p>${stats.sales}</p>
//         </div>
//         <div className="p-4 bg-white shadow rounded">
//           <h2>Commandes</h2>
//           <p>{stats.orders}</p>
//         </div>
//         <div className="p-4 bg-white shadow rounded">
//           <h2>Utilisateurs</h2>
//           <p>{stats.users}</p>
//         </div>
//         <div className="p-4 bg-white shadow rounded">
//           <h2>Produits</h2>
//           <p>{stats.products}</p>
//         </div>
//       </div>

//       {/* --- BOUTIQUES EN ATTENTE --- */}
//       <div className="p-4 bg-white shadow rounded">
//         <h2>Boutiques en attente</h2>
//         {pendingShops.length === 0 ? (
//           <p className="text-gray-500">Aucune boutique en attente</p>
//         ) : (
//           pendingShops.map(shop => (
//             <div key={shop.id} className="flex justify-between items-center py-2 border-b">
//               <span>{shop.name}</span>
//               <div className="flex gap-2">
//                 <button onClick={() => approveShop(shop.id)} className="px-2 py-1 bg-green-500 text-white rounded">Approuver</button>
//                 <button onClick={() => rejectShop(shop.id)} className="px-2 py-1 bg-red-500 text-white rounded">Rejeter</button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* --- UTILISATEURS --- */}
//       <div className="p-4 bg-white shadow rounded">
//         <h2>Utilisateurs</h2>
//         {users.length === 0 ? (
//           <p className="text-gray-500">Aucun utilisateur</p>
//         ) : (
//           <ul>
//             {users.map(u => (
//               <li key={u.id} className="py-1 border-b flex justify-between">
//                 <span>{u.name} ({u.email})</span>
//                 <span className="text-sm text-gray-500">{u.role}</span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* --- PRODUITS --- */}
//       <div className="p-4 bg-white shadow rounded">
//         <h2>Produits</h2>
//         {products.length === 0 ? (
//           <p className="text-gray-500">Aucun produit</p>
//         ) : (
//           <ul>
//             {products.map(p => (
//               <li key={p.id} className="py-1 border-b flex justify-between">
//                 <span>{p.name}</span>
//                 <span className="text-sm text-gray-500">{p.stock} en stock</span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { api } from "../../../shared/services/api";
import toast from "react-hot-toast";
import { FaUser, FaStore, FaBoxOpen, FaShoppingCart } from "react-icons/fa";

export default function DashboardPage() {
  const [stats, setStats] = useState({ sales: 0, orders: 0, users: 0, products: 0 });
  const [pendingShops, setPendingShops] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/admin/stats")
      .then(res => setStats(res.data))
      .catch(() => toast.error("Erreur chargement statistiques"));

    api.get("/shops?status=PENDING")
      .then(res => setPendingShops(res.data))
      .catch(() => toast.error("Erreur chargement boutiques"));

    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => toast.error("Erreur chargement utilisateurs"));

    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(() => toast.error("Erreur chargement produits"));
  }, []);

  const approveShop = async (id) => {
    try {
      await api.patch(`/shops/${id}`, { status: "APPROVED" });
      setPendingShops(prev => prev.filter(shop => shop.id !== id));
      toast.success("Boutique approuvée");
    } catch {
      toast.error("Erreur lors de l'approbation");
    }
  };

  const rejectShop = async (id) => {
    try {
      await api.patch(`/shops/${id}`, { status: "REJECTED" });
      setPendingShops(prev => prev.filter(shop => shop.id !== id));
      toast.success("Boutique rejetée");
    } catch {
      toast.error("Erreur lors du rejet");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* --- STATISTIQUES --- */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<FaShoppingCart />} title="Ventes" value={`$${stats.sales}`} color="bg-indigo-100 text-indigo-600" />
        <StatCard icon={<FaBoxOpen />} title="Commandes" value={stats.orders} color="bg-yellow-100 text-yellow-600" />
        <StatCard icon={<FaUser />} title="Utilisateurs" value={stats.users} color="bg-green-100 text-green-600" />
        <StatCard icon={<FaStore />} title="Produits" value={stats.products} color="bg-red-100 text-red-600" />
      </div>

      {/* --- BOUTIQUES EN ATTENTE --- */}
      <Section title="Boutiques en attente">
        {pendingShops.length === 0 ? (
          <p className="text-gray-500">Aucune boutique en attente</p>
        ) : (
          pendingShops.map(shop => (
            <div key={shop.id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50 transition">
              <span className="font-medium">{shop.name}</span>
              <div className="flex gap-2">
                <button onClick={() => approveShop(shop.id)} className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Approuver</button>
                <button onClick={() => rejectShop(shop.id)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Rejeter</button>
              </div>
            </div>
          ))
        )}
      </Section>

      {/* --- UTILISATEURS --- */}
      <Section title="Utilisateurs">
        {users.length === 0 ? (
          <p className="text-gray-500">Aucun utilisateur</p>
        ) : (
          <ul>
            {users.map(u => (
              <li key={u.id} className="flex justify-between py-2 border-b hover:bg-gray-50 transition">
                <span>{u.name} ({u.email})</span>
                <span className="text-sm text-gray-500">{u.role}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* --- PRODUITS --- */}
      <Section title="Produits">
        {products.length === 0 ? (
          <p className="text-gray-500">Aucun produit</p>
        ) : (
          <ul>
            {products.map(p => (
              <li key={p.id} className="flex justify-between py-2 border-b hover:bg-gray-50 transition">
                <span>{p.name}</span>
                <span className="text-sm text-gray-500">{p.stock} en stock</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

// 🔹 Components
const StatCard = ({ icon, title, value, color }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl shadow-sm ${color}`}>
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white shadow rounded-xl p-4 mb-6">
    <h2 className="text-lg font-semibold text-gray-700 mb-3">{title}</h2>
    {children}
  </div>
);