// import React from "react";
// import { FaHome, FaUsers, FaStore, FaBox, FaSignOutAlt } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { useUserStore } from "../../../app/store/userStore";

// export const Sidebar = ({ isOpen }) => {
//   const authStore = useUserStore();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     authStore.logout();
//     navigate("/login");
//   };

//   return (
//     <div
//       className={`flex flex-col p-4 bg-gray-800 text-white h-screen transition-all duration-300 ${
//         isOpen ? "w-64" : "w-16"
//       }`}
//     >
//       {/* Titre */}
//       <h2 className="text-xl font-bold mb-6">{isOpen ? "Menu" : "M"}</h2>

//       {/* Menu */}
//       <ul className="flex flex-col gap-6">
//         <li>
//           <Link
//             to="/dashboard_admin"
//             className={`flex items-center ${isOpen ? "gap-3" : "justify-center"} hover:text-blue-400`}
//           >
//             <FaHome />
//             {isOpen && <span>Statistiques</span>}
//           </Link>
//         </li>

//         <li>
//           <Link
//             to="/dashboard_admin/shops"
//             className={`flex items-center ${isOpen ? "gap-3" : "justify-center"} hover:text-blue-400`}
//           >
//             <FaStore />
//             {isOpen && <span>Boutiques</span>}
//           </Link>
//         </li>

//         <li>
//           <Link
//             to="/dashboard_admin/users"
//             className={`flex items-center ${isOpen ? "gap-3" : "justify-center"} hover:text-blue-400`}
//           >
//             <FaUsers />
//             {isOpen && <span>Utilisateurs</span>}
//           </Link>
//         </li>

//         <li>
//           <Link
//             to="/dashboard_admin/products"
//             className={`flex items-center ${isOpen ? "gap-3" : "justify-center"} hover:text-blue-400`}
//           >
//             <FaBox />
//             {isOpen && <span>Produits</span>}
//           </Link>
//         </li>

//         {/* Logout en bas */}
//         <li
//           onClick={handleLogout}
//           className={`flex items-center cursor-pointer hover:text-blue-400 mt-auto ${
//             isOpen ? "gap-3" : "justify-center"
//           }`}
//         >
//           <FaSignOutAlt />
//           {isOpen && <span>Déconnexion</span>}
//         </li>
//       </ul>
//     </div>
//   );
// };

// components/Sidebar.jsx
import React from "react";
import { FaHome, FaUsers, FaStore, FaBox, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../../app/store/userStore";

export const Sidebar = ({ isOpen }) => {
  const authStore = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate("/login");
  };

  return (
    <aside
      className={`flex flex-col bg-gray-800 text-white h-screen transition-all duration-300 overflow-y-auto
        ${isOpen ? "w-64" : "w-16"}`}
    >
      {/* Titre */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h2 className="text-xl font-bold">{isOpen ? "Menu Admin" : "M"}</h2>
      </div>

      {/* Menu */}
      <ul className="flex flex-col mt-4 px-2 gap-2">
        <li>
          <Link
            to="/dashboard_admin"
            className={`flex items-center p-2 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            }`}
          >
            <FaHome />
            {isOpen && <span>Statistiques</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard_admin/shops"
            className={`flex items-center p-2 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            }`}
          >
            <FaStore />
            {isOpen && <span>Boutiques</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard_admin/users"
            className={`flex items-center p-2 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            }`}
          >
            <FaUsers />
            {isOpen && <span>Utilisateurs</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard_admin/products"
            className={`flex items-center p-2 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            }`}
          >
            <FaBox />
            {isOpen && <span>Produits</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard_admin/category"
            className={`flex items-center p-2 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            }`}
          >
            <FaBox />
            {isOpen && <span>Categories</span>}
          </Link>
        </li>

        <li>
          <Link
            to="/dashboard_admin/livreur"
            className={`flex items-center p-2 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            }`}
          >
            <FaBox />
            {isOpen && <span>Livreurs</span>}
          </Link>
        </li>

        {/* Logout */}
        <li
          onClick={handleLogout}
          className={`flex items-center p-2 rounded cursor-pointer hover:bg-red-600 mt-auto ${
            isOpen ? "gap-3" : "justify-center"
          }`}
        >
          <FaSignOutAlt />
          {isOpen && <span>Déconnexion</span>}
        </li>
      </ul>
    </aside>
  );
};