import React from "react";
import { FaHome, FaTruck, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../../app/store/userStore";

export default function DeliverySidebar({ isOpen }) {
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`flex flex-col h-screen p-4 bg-gray-800 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
      <h2 className="text-xl font-bold mb-6">{isOpen ? "Menu Livreur" : "L"}</h2>
      <ul className="flex flex-col gap-4">
        <li>
          <Link to="/dashboard_delivery" className="flex items-center gap-2 hover:text-blue-400">
            <FaHome />
            {isOpen && <span>Accueil</span>}
          </Link>
        </li>
        <li>
          <Link to="/dashboard_delivery/orders" className="flex items-center gap-2 hover:text-blue-400">
            <FaTruck />
            {isOpen && <span>Livraisons</span>}
          </Link>
        </li>
        <li className="flex items-center gap-2 cursor-pointer hover:text-red-400" onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen && <span>Déconnexion</span>}
        </li>
      </ul>
    </div>
  );
}