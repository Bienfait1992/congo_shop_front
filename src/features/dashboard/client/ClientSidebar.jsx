import React from "react";
import { FaHome, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../../app/store/userStore";

export default function ClientSidebar({ isOpen }) {
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={`flex flex-col h-screen p-4 bg-gray-800 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
      <h2 className="text-xl font-bold mb-6">{isOpen ? "Menu Client" : "C"}</h2>
      <ul className="flex flex-col gap-4">
        <li>
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-green-400">
            <FaHome />
            {isOpen && <span>Accueil</span>}
          </Link>
        </li>
        <li>
          <Link to="/dashboard/orders" className="flex items-center gap-2 hover:text-green-400">
            <FaShoppingCart />
            {isOpen && <span>Commandes</span>}
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