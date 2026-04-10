// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ShoppingCart, Search, MapPin, X, User, MessageCircle, Bell } from "lucide-react";
// import { useUserStore } from "../../../app/store/userStore";
// import AccountPopup from "../../dashboard/Users/AccountPopup";
// import { useCartStore } from "../../cart/presentation/store/cartStore";
// import { api } from "../../../shared/services/api";
// import { io } from "socket.io-client";
// import MessageThreadRealtime from "../../messages/MessageThreadRealtime";

// export default function Header() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [hover, setHover] = useState(false);
//   const [cartOpen, setCartOpen] = useState(false);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [chatOpen, setChatOpen] = useState(false);
//   const [currentChatUserId, setCurrentChatUserId] = useState(null); 
//   const [unreadMessages, setUnreadMessages] = useState(0);

//   const deliveryAddress = useUserStore((state) => state.deliveryAddress);

 
//   const { user, logout } = useUserStore();
//   const { cart } = useCartStore();

//   const items = cart?.items || [];

//   const total = items.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   const itemCount = items.reduce(
//     (acc, item) => acc + item.quantity,
//     0
//   );

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   const handleDashboardClick = () => {
//     if (!user) return navigate("/auth/login");

//     if (user.role === "ADMIN") navigate("/dashboard_admin");
//     if (user.role === "DELIVERY") navigate("/dashboard_delivery");
//   };

//   const handleSellClick = () => {
//     if (!user) return navigate("/auth/login");
//     navigate("/create-shop");
//   };
//   const handleSellClick_deliveryman = () => {
//     if (!user) return navigate("/auth/login");
//     navigate("/create-deliveryman");
//   };

//   const menuItems = [
//     { label: "Tendances" },
//     { label: "Meilleures ventes" },
//     { label: "Dernières Nouveautés" },
//     { label: "Baromètre des ventes" },
//     { label: "Vendre sur Congo Shop", onClick: handleSellClick },
//     { label: "Dvenir livreur" , onClick: handleSellClick_deliveryman},
   
//   ];

//   // 🔹 Fetch catégories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await api.get("/categories");
//         setCategories(Array.isArray(data) ? data : data.categories || []);
//       } catch (err) {
//         console.error(err);
//         setCategories([]);
//       }
//     };
//     fetchCategories();
//   }, []);


//   // 🔥 AUTOCOMPLETE PRODUITS AVEC LOGS
// useEffect(() => {
//   const fetchSuggestions = async () => {
//     console.log("=== fetchSuggestions called ===");
//     console.log("searchQuery:", searchQuery);
//     console.log("selectedCategory:", selectedCategory);

//     if (!searchQuery.trim()) {
//       console.log("searchQuery vide, on vide les suggestions et navigue à /");
//       setSuggestions([]);
//       navigate("/");
//       return;
//     }


//     try {
//       const url = `/search?q=${encodeURIComponent(searchQuery)}${selectedCategory ? `&category=${selectedCategory}` : ""}`;
//       console.log("URL API:", url);

//       const { data } = await api.get(url);
//       console.log("Données reçues:", data);

//       const suggestionsData = data.data ? data.data.slice(0, 5) : data.slice(0, 5);
//       console.log("Suggestions filtrées (max 5):", suggestionsData);

//       setSuggestions(suggestionsData);
//     } catch (err) {
//       console.error("Erreur fetchSuggestions:", err);
//     }
//   };

//   const delay = setTimeout(fetchSuggestions, 300); // debounce
//   return () => clearTimeout(delay);
// }, [searchQuery, selectedCategory]);

// // 🔥 HANDLE SEARCH AVEC LOGS
// const handleSearch = () => {
//   console.log("=== handleSearch called ===");
//   console.log("searchQuery:", searchQuery);
//   console.log("selectedCategory:", selectedCategory);

//   if (!searchQuery.trim()) {
//     console.log("Recherche vide, rien à faire");
//     return;
//   }

//   const url = `/search?q=${encodeURIComponent(searchQuery)}${selectedCategory ? `&category=${selectedCategory}` : ""}`;
//   console.log("Navigation vers URL:", url);

//   navigate({
//     pathname: "/search",
//     search: `?q=${encodeURIComponent(searchQuery)}${selectedCategory ? `&category=${selectedCategory}` : ""}`,
//   });

//   setSuggestions([]);
// };

// const navigate = useNavigate();

//   return (
//     <header className="bg-[#131921] text-white w-full relative z-50">
//       {/* TOP BAR */}
//       <div className="flex items-center px-6 py-2 gap-4 flex-wrap">
//         <div
//           className="text-2xl font-bold text-yellow-400 cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           CongoShop
//         </div>

//         <div className="flex flex-col text-sm cursor-pointer" onClick={() => navigate("/delivery-address")}>
//           <span className="text-gray-300 flex items-center gap-1">
//             <MapPin size={16} /> Livraison à
//           </span>
//           <span className="font-semibold">{deliveryAddress ? (
//         <div className="text-gray-500">
//           <p className=""> {deliveryAddress.city}</p>
//           <p className="text-[10px]">{deliveryAddress.street}</p>
//         </div>
//       ) : (
//         <div className="text-gray-400">Aucune adresse sélectionnée</div>
//       )}</span>
//         </div>

//         {/*SEARCH AMAZON STYLE */}
//         <div className="flex flex-1 max-w-xl relative">
//           {/* CATEGORY */}
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="px-2 bg-gray-200 text-black rounded-l-md outline-none"
//           >
//             <option value="">Toutes catégories</option>
//             {(Array.isArray(categories) ? categories : []).map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           {/* INPUT */}
//           <input
//           type="text"
//           placeholder="Rechercher un produit..."
//           className="w-full px-3 py-2 text-black outline-none"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSearch();
//           }}
//         />

//           {/* BUTTON */}
//           <button
//             onClick={handleSearch}
//             className="bg-yellow-400 px-4 rounded-r-md text-black"
//           >
//             <Search size={18} />
//           </button>

//           {/*AUTOCOMPLETE DROPDOWN */}
//           {suggestions.length > 0 && (
//             <div className="absolute top-11 left-0 w-full bg-white text-black shadow-lg rounded-md z-50">
//               {suggestions.map((item) => (
//                 <div
//                   key={item.id}
//                   className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                
//                   onClick={() => {
//                   setSearchQuery(item.name);
//                   handleSearch();
//                 }}
//                 >
//                   <img
//                     src={item.images?.[0]}
//                     alt={item.name}
//                     className="w-8 h-8 object-cover"
//                   />
//                   <span>{item.name}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>


//  {/* Chat drawer */}
//         {chatOpen && currentChatUserId && (
//           <div className="fixed bottom-0 right-0 w-full md:w-[400px] h-[50vh] bg-white shadow-lg z-50 flex flex-col rounded-t-lg">
//             {/* Header du chat */}
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="font-semibold text-lg text-black">Message</h2>
//               <button
//                 onClick={() => setChatOpen(false)}
//                 className="text-gray-500 hover:text-black border p-1 rounded px-2 hover:bg-gray-200"
//               >
//                 X
//               </button>
//             </div>

//             {/* Corps du chat */}
//             <div className="flex-1 overflow-y-auto p-2">
//               <MessageThreadRealtime
//                 currentUserId={user.id}
//                 otherUserId={currentChatUserId}
//               />
//             </div>
//           </div>
//         )}

//                 {user && (
//           <div
//             className="relative cursor-pointer"
//             onClick={() => {
//               setCurrentChatUserId("id_de_l_autre_user"); 
//               setChatOpen(true);
//               setUnreadMessages(0);
//             }}
//           >
//             <Bell size={22} />
//             {unreadMessages > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
//                 {unreadMessages}
//               </span>
//             )}
//           </div>
//         )}


//         {/* COMPTE */}
//         <div
//           className="relative text-sm flex items-center gap-1"
//           onMouseEnter={() => setHover(true)}
//           onMouseLeave={() => setHover(false)}
//         >
//           <div className="flex items-center gap-1 cursor-pointer" onClick={toggleSidebar}>
//             <User size={20} />
//             <div>
//               <p className="text-gray-300">
//                 {user ? `Bonjour, ${user.name}` : "Bonjour"}
//               </p>
//               <p className="font-semibold">
//                 {user ? "Mon compte" : "Identifiez-vous"}
//               </p>
//             </div>
//           </div>
//           {hover && <AccountPopup />}
//         </div>

//         {/* PANIER */}
//         <div
//           className="relative"
//           onMouseEnter={() => setCartOpen(true)}
//           onMouseLeave={() => setCartOpen(false)}
//         >
//           <div
//             onClick={() => {
//               if (!user) return navigate("/auth/login");
//               navigate("/cart");
//             }}
//             className="relative flex items-center gap-1 cursor-pointer hover:text-yellow-400"
//           >
//             <ShoppingCart size={22} />
//             <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
//               {itemCount}
//             </span>
//             <span className="font-semibold">Panier</span>
//           </div>

//           {cartOpen && (
//             <div className="absolute right-0 mt-3 w-80 bg-white text-black shadow-xl rounded-xl p-4 z-50">
//               <h3 className="font-bold mb-3">Panier</h3>

//               {items.length === 0 ? (
//                 <p className="text-sm text-gray-500">
//                   Votre panier est vide
//                 </p>
//               ) : (
//                 <>
//                   <div className="max-h-60 overflow-y-auto space-y-3">
//                     {items.map((item) => (
//                       <div key={item.id} className="flex gap-3">
//                         <img
//                           src={item.product.image}
//                           alt={item.product.name}
//                           className="w-12 h-12 object-cover rounded"
//                         />
//                         <div className="flex-1">
//                           <p className="text-sm font-medium">
//                             {item.product.name}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {item.quantity} x {item.price} $
//                           </p>
//                         </div>
//                         <div className="text-sm font-semibold">
//                           {(item.price * item.quantity).toFixed(2)} $
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
//                     <span>Total</span>
//                     <span>{total.toFixed(2)} $</span>
//                   </div>

//                   <button
//                     onClick={() => navigate("/cart")}
//                     className="mt-3 w-full bg-yellow-400 py-2 rounded hover:bg-yellow-500"
//                   >
//                     Voir panier
//                   </button>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MENU */}
//       <div className="bg-[#232f3e] text-white px-6 py-2 text-sm flex gap-4">
//         <span className="cursor-pointer font-semibold" onClick={toggleSidebar}>
//           Tous
//         </span>
//         {menuItems.map((item, idx) => (
//           <span
//             key={idx}
//             className="cursor-pointer hidden md:inline"
//             onClick={item.onClick}
//           >
//             {item.label}
//           </span>
//         ))}
//       </div>

//       {/* SIDEBAR */}
//       <div
//         className={`fixed top-0 left-0 h-full bg-white text-black shadow-xl transform transition-transform duration-300 z-50
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//         w-72 flex flex-col`}
//       >
//         <div className="flex justify-between items-center p-4 border-b">
//           <div className="flex items-center gap-2">
//             <User size={20} />
//             <div>
//               <p className="text-sm text-gray-500">
//                 {user ? `Bonjour, ${user.name}` : "Bonjour"}
//               </p>
//               <p
//                 className="font-bold text-lg cursor-pointer"
//                 onClick={handleDashboardClick}
//               >
//                 {user ? "Mon compte" : "Identifiez-vous"}
//               </p>
//             </div>
//           </div>
//           <button onClick={toggleSidebar}>
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-4 overflow-y-auto flex-1 space-y-1">
//           {menuItems.map((item, idx) => (
//             <p
//               key={idx}
//               className="py-2 border-b cursor-pointer hover:bg-gray-200 px-2 rounded"
//               onClick={item.onClick}
//             >
//               {item.label}
//             </p>
//           ))}
//         </div>

//         {user && (
//           <div className="p-4 border-t">
//             <button
//               onClick={logout}
//               className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
//             >
//               Déconnexion
//             </button>
//           </div>
//         )}
//       </div>

//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={toggleSidebar}
//         />
//       )}
//     </header>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Search, MapPin, X, User, Bell } from "lucide-react";
import { useUserStore } from "../../../app/store/userStore";
import AccountPopup from "../../dashboard/Users/AccountPopup";
import { useCartStore } from "../../cart/presentation/store/cartStore";
import { api } from "../../../shared/services/api";
import MessageThreadRealtime from "../../messages/MessageThreadRealtime";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentChatUserId, setCurrentChatUserId] = useState(null); 
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const deliveryAddress = useUserStore((state) => state.deliveryAddress);
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();

  const items = cart?.items || [];
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate({
      pathname: "/search",
      search: `?q=${encodeURIComponent(searchQuery)}${selectedCategory ? `&category=${selectedCategory}` : ""}`,
    });
    setSuggestions([]);
  };

  const handleDashboardClick = () => {
    if (!user) return navigate("/auth/login");
    if (user.role === "ADMIN") navigate("/dashboard_admin");
    if (user.role === "DELIVERY") navigate("/dashboard_delivery");
  };

  const handleSellClick = () => {
    if (!user) return navigate("/auth/login");
    navigate("/create-shop");
  };
  const handleSellClick_deliveryman = () => {
    if (!user) return navigate("/auth/login");
    navigate("/create-deliveryman");
  };

  const menuItems = [
    { label: "Tendances" },
    { label: "Meilleures ventes" },
    { label: "Dernières Nouveautés" },
    { label: "Baromètre des ventes" },
    { label: "Vendre sur Congo Shop", onClick: handleSellClick },
    { label: "Devenir livreur", onClick: handleSellClick_deliveryman },
  ];

  // 🔹 Fetch catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (err) {
        console.error(err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Autocomplete suggestions
  useEffect(() => {
    if (!searchQuery.trim()) return setSuggestions([]);
    const timeout = setTimeout(async () => {
      try {
        const url = `/search?q=${encodeURIComponent(searchQuery)}${selectedCategory ? `&category=${selectedCategory}` : ""}`;
        const { data } = await api.get(url);
        setSuggestions(data.data ? data.data.slice(0, 5) : data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCategory]);

  return (
    <header className="w-full relative z-50">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#131921] text-white">
        {/* LOGO */}
        <div className="text-2xl font-bold text-yellow-400 cursor-pointer flex-shrink-0" onClick={() => navigate("/")}>
          CongoShop
        </div>

        {/* LIVRAISON */}
        <div
          className="flex flex-col text-xs sm:text-sm cursor-pointer flex-shrink-0"
          onClick={() => navigate("/delivery-address")}
        >
          <span className="text-gray-300 flex items-center gap-1">
            <MapPin size={16} /> Livraison à
          </span>
          <span className="font-semibold truncate">
            {deliveryAddress ? (
              <div className="text-gray-500">
                <span className="truncate">{deliveryAddress.city}</span>, 
                 <span className="truncate text-[10px] sm:text-xs">{deliveryAddress.street}</span>
              </div>
            ) : (
              <div className="text-gray-400">Aucune adresse</div>
            )}
          </span>
        </div>

        {/* RECHERCHE */}
        <div className="flex flex-1 max-w-full sm:max-w-xl relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-2 bg-gray-200 text-black rounded-l-md outline-none text-xs sm:text-sm"
          >
            <option value="">Toutes catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full px-2 py-2 sm:px-3 sm:py-2 text-black outline-none text-xs sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button
            onClick={handleSearch}
            className="bg-yellow-400 px-3 sm:px-4 rounded-r-md text-black"
          >
            <Search size={18} />
          </button>

          {suggestions.length > 0 && (
            <div className="absolute top-11 left-0 w-full bg-white text-black shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="px-2 sm:px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  onClick={() => { setSearchQuery(item.name); handleSearch(); }}
                >
                  <img src={item.images?.[0]} alt={item.name} className="w-6 h-6 sm:w-8 sm:h-8 object-cover" />
                  <span className="truncate text-xs sm:text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ICONES NOTIFICATIONS / COMPTE / PANIER */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {user && (
            <div
              className="relative cursor-pointer"
              onClick={() => { setCurrentChatUserId("id_de_l_autre_user"); setChatOpen(true); setUnreadMessages(0); }}
            >
              <Bell size={22} />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {unreadMessages}
                </span>
              )}
            </div>
          )}

          {/* Compte */}
          <div
            className="relative flex items-center gap-1 cursor-pointer"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <User size={20} />
            <div className="hidden sm:flex flex-col text-xs sm:text-sm">
              <p className="text-gray-300">{user ? `Bonjour, ${user.name}` : "Bonjour"}</p>
              <p className="font-semibold">{user ? "Mon compte" : "Identifiez-vous"}</p>
            </div>
            {hover && <AccountPopup />}
          </div>

          {/* Panier */}
          <div className="relative cursor-pointer" onClick={() => (!user ? navigate("/auth/login") : navigate("/cart"))}>
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-xs px-1 py-0.5 rounded-full font-bold">{itemCount}</span>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="bg-[#232f3e] text-white px-4 py-2 text-sm flex gap-2 flex-wrap sm:flex-nowrap">
        <span className="cursor-pointer font-semibold" onClick={toggleSidebar}>Tous</span>
        {menuItems.map((item, idx) => (
          <span key={idx} className="cursor-pointer hidden sm:inline" onClick={item.onClick}>{item.label}</span>
        ))}
      </div>

      {/* SIDEBAR MOBILE */}
      <div className={`fixed top-0 left-0 h-full bg-white text-black shadow-xl transform transition-transform duration-300 z-50 w-72 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <User size={20} />
            <div>
              <p className="text-sm text-gray-500">{user ? `Bonjour, ${user.name}` : "Bonjour"}</p>
              <p className="font-bold text-lg cursor-pointer" onClick={handleDashboardClick}>{user ? "Mon compte" : "Identifiez-vous"}</p>
            </div>
          </div>
          <button onClick={toggleSidebar}><X size={20} /></button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-1">
          {menuItems.map((item, idx) => (
            <p key={idx} className="py-2 border-b cursor-pointer hover:bg-gray-200 px-2 rounded" onClick={item.onClick}>{item.label}</p>
          ))}
        </div>

        {user && (
          <div className="p-4 border-t">
            <button onClick={logout} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Déconnexion</button>
          </div>
        )}
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" onClick={toggleSidebar} />}

      {/* CHAT DRAWER */}
      {chatOpen && currentChatUserId && (
        <div className="fixed bottom-0 right-0 w-full sm:w-[400px] h-[50vh] bg-white shadow-lg z-50 flex flex-col rounded-t-lg">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-lg text-black">Message</h2>
            <button onClick={() => setChatOpen(false)} className="text-gray-500 hover:text-black border p-1 rounded px-2 hover:bg-gray-200">X</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <MessageThreadRealtime currentUserId={user.id} otherUserId={currentChatUserId} />
          </div>
        </div>
      )}
    </header>
  );
}