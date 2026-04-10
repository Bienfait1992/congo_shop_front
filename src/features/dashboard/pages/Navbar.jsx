import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUserStore } from "../../../app/store/userStore";
import { toast } from "react-hot-toast";
import { FaBars } from "react-icons/fa";

export default function DashboardNavbar({ toggleSidebar }) {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate(); 


  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie"); 
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Produits", path: "/dashboard/products" },
    { name: "Commandes", path: "/dashboard/orders" },
    { name: "Clients", path: "/dashboard/clients" },
    { name: "Livraisons", path: "/dashboard/deliveries" },
  ];

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        
        {/* 🔥 Bouton toggle */}
        <button onClick={toggleSidebar} className="text-xl">
          <FaBars />
        </button>
        <Link to="/dashboard" className="text-xl font-bold text-green-600">
          CongoShop
        </Link>
        
      </div>

      <div className="flex items-center space-x-4">
        {user && <span className="hidden md:inline text-gray-700">Bonjour, {user.name}</span>}
        <button
          onClick={handleLogout}
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}