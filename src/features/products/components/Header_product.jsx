// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ShoppingCart, Search, MapPin, X, User, Bell, Heart } from "lucide-react";
// import { useUserStore } from "../../../app/store/userStore";
// import AccountPopup from "../../dashboard/Users/AccountPopup";
// import { useCartStore } from "../../cart/presentation/store/cartStore";
// import { api } from "../../../shared/services/api";
// import MessageThreadRealtime from "../../messages/MessageThreadRealtime";
// import { useWishlistStore } from "../../cart/presentation/store/wishlistStore";

// export default function Header() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [hover, setHover] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [currentChatUserId, setCurrentChatUserId] = useState(null); 
//   const [unreadMessages, setUnreadMessages] = useState(0);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [notifications, setNotifications] = useState([]);
//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   const deliveryAddress = useUserStore((state) => state.deliveryAddress);
//   const { user, logout, token } = useUserStore();
//   const { cart } = useCartStore();

//   const { count, setWishlist } = useWishlistStore();

//   const navigate = useNavigate();

//   const items = cart?.items || [];
//   const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   useEffect(() => {
//   const fetchNotif = async () => {
//     if (!token) return;

//     try {
//       const { data } = await api.get("/notifications", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setNotifications(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchNotif();
// }, [token]);

//   // =========================
//   // FETCH WISHLIST
//   // =========================
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (!token) return;

//       try {
//         const res = await api.get("/wishlist", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setWishlist(res.data);
//       } catch (err) {
//         console.error("Erreur wishlist", err);
//       }
//     };

//     fetchWishlist();
//   }, [token]);

//   const handleSearch = () => {
//     if (!searchQuery.trim()) return;

//     navigate({
//       pathname: "/search",
//       search: `?q=${encodeURIComponent(searchQuery)}${selectedCategory ? `&category=${selectedCategory}` : ""}`,
//     });

//     setSuggestions([]);
//   };

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
//     { label: "Devenir livreur", onClick: handleSellClick_deliveryman },
//   ];

//   // =========================
//   // FETCH CATEGORIES
//   // =========================
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await api.get("/categories");
//         setCategories(Array.isArray(data) ? data : data.categories || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // =========================
//   // AUTOCOMPLETE
//   // =========================
//   useEffect(() => {
//     if (!searchQuery.trim()) return setSuggestions([]);

//     const timeout = setTimeout(async () => {
//       try {
//         const url = `/search?q=${encodeURIComponent(searchQuery)}${selectedCategory ? `&category=${selectedCategory}` : ""}`;
//         const { data } = await api.get(url);

//         setSuggestions(data.data ? data.data.slice(0, 5) : data.slice(0, 5));
//       } catch (err) {
//         console.error(err);
//       }
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [searchQuery, selectedCategory]);

//   return (
//     <header className="w-full relative z-50">

//       {/* TOP BAR */}
//       <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#131921] text-white">

//         {/* LOGO */}
//         <div
//           className="text-2xl font-bold text-yellow-400 cursor-pointer flex-shrink-0"
//           onClick={() => navigate("/")}
//         >
//           CongoShop
//         </div>

//         {/* LIVRAISON */}
//         <div
//           className="flex flex-col text-xs sm:text-sm cursor-pointer flex-shrink-0"
//           onClick={() => navigate("/delivery-address")}
//         >
//           <span className="text-gray-300 flex items-center gap-1">
//             <MapPin size={16} /> Livraison à
//           </span>

//           <span className="font-semibold truncate">
//             {deliveryAddress ? (
//               <>
//                 {deliveryAddress.city}, {deliveryAddress.street}
//               </>
//             ) : (
//               "Aucune adresse"
//             )}
//           </span>
//         </div>

//         {/* SEARCH */}
//         <div className="flex flex-1 max-w-full sm:max-w-xl relative">
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="px-2 py-2 bg-gray-200 text-black rounded-l-md"
//           >
//             <option value="">Toutes catégories</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>{cat.name}</option>
//             ))}
//           </select>

//           <input
//             type="text"
//             placeholder="Rechercher un produit..."
//             className="w-full px-3 py-2 text-black outline-none"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           />

//           <button onClick={handleSearch} className="bg-yellow-400 px-4 text-black">
//             <Search size={18} />
//           </button>

//           {suggestions.length > 0 && (
//             <div className="absolute top-11 left-0 w-full bg-white text-black shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
//               {suggestions.map((item) => (
//                 <div
//                   key={item.id}
//                   className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
//                   onClick={() => {
//                     navigate(`/products/${item.id}`);
//                     setSuggestions([]);
//                   }}
//                 >
//                   <span className="truncate">{item.name}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ACTIONS */}
//         <div className="flex items-center gap-4 flex-shrink-0">

//           {/* ❤️ FAVORIS */}
//           {user && (
//             <div
//               className="relative cursor-pointer"
//               onClick={() => navigate("/wishlist")}
//             >
//               <Heart size={22} />
//               {count > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
//                   {count}
//                 </span>
//               )}
//             </div>
//           )}

//           {/* 🔔 NOTIFICATIONS */}
//           {/* {user && (
//             <div
//               className="relative cursor-pointer"
//               onClick={() => {
//                 setCurrentChatUserId("id_de_l_autre_user");
//                 setChatOpen(true);
//                 setUnreadMessages(0);
//               }}
//             >
//               <Bell size={22} />
//               {unreadMessages > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
//                   {unreadMessages}
//                 </span>
//               )}
//             </div>
//           )} */}

//           <div className="relative cursor-pointer">
//           <Bell size={22} />

//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//               {unreadCount}
//             </span>
//           )}
//         </div>

//          {/* 👤 USER */}
// <div
//   className="relative flex items-center gap-1 cursor-pointer"
//   onMouseEnter={() => setHover(true)}
//   onMouseLeave={() => setHover(false)}
// >
//   <User size={20} />

//   <div className="hidden sm:flex flex-col text-xs sm:text-sm leading-tight">
//     <p className="text-gray-300">
//       {user ? `Bonjour, ${user.name}` : "Bonjour"}
//     </p>

//     <p className="font-semibold">
//       {user ? "Mon compte" : "Identifiez-vous"}
//     </p>
//   </div>

//   {hover && <AccountPopup />}
// </div>

//           {/* CART */}
//           <div
//             className="relative cursor-pointer"
//             onClick={() => (!user ? navigate("/auth/login") : navigate("/cart"))}
//           >
//             <ShoppingCart size={22} />
//             <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-xs px-1 rounded-full">
//               {itemCount}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* MENU */}
//       <div className="bg-[#232f3e] text-white px-4 py-2 text-sm flex gap-2">
//         <span className="cursor-pointer font-semibold" onClick={toggleSidebar}>
//           Tous
//         </span>
//         {menuItems.map((item, idx) => (
//           <span key={idx} className="cursor-pointer hidden sm:inline" onClick={item.onClick}>
//             {item.label}
//           </span>
//         ))}
//       </div>

//       {/* SIDEBAR */}
//       <div className={`fixed top-0 left-0 h-full bg-white text-black shadow-xl transform transition-transform duration-300 z-50 w-72 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
//         <div className="flex justify-between items-center p-4 border-b">
//           <p className="font-bold text-lg">Menu</p>
//           <button onClick={toggleSidebar}><X size={20} /></button>
//         </div>

//         <div className="p-4 space-y-2">
//           {menuItems.map((item, idx) => (
//             <p key={idx} className="cursor-pointer" onClick={item.onClick}>
//               {item.label}
//             </p>
//           ))}
//         </div>

//         {user && (
//           <div className="p-4 border-t">
//             <button onClick={logout} className="w-full bg-red-500 text-white py-2 rounded">
//               Déconnexion
//             </button>
//           </div>
//         )}
//       </div>

//       {/* OVERLAY */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar} />
//       )}

//       {/* CHAT DRAWER */}
//       {chatOpen && currentChatUserId && (
//         <div className="fixed bottom-0 right-0 w-full sm:w-[400px] h-[50vh] bg-white shadow-lg z-50 flex flex-col rounded-t-lg">
//           <div className="flex justify-between items-center p-4 border-b">
//             <h2 className="font-semibold text-lg text-black">Message</h2>
//             <button onClick={() => setChatOpen(false)}>X</button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-2">
//             <MessageThreadRealtime
//               currentUserId={user.id}
//               otherUserId={currentChatUserId}
//             />
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Search, MapPin, X, User, Bell, Heart } from "lucide-react";
import { useUserStore } from "../../../app/store/userStore";
import AccountPopup from "../../dashboard/Users/AccountPopup";
import { useCartStore } from "../../cart/presentation/store/cartStore";
import { api } from "../../../shared/services/api";
import MessageThreadRealtime from "../../messages/MessageThreadRealtime";
import { useWishlistStore } from "../../cart/presentation/store/wishlistStore";
import { io } from "socket.io-client"; // ✅ AJOUT

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentChatUserId, setCurrentChatUserId] = useState(null); 
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false); // 
  // const [deliveryAddress, setDeliveryAddress] = useState(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

const deliveryAddress = useUserStore((state) => state.deliveryAddress);
const setDeliveryAddress = useUserStore((state) => state.setDeliveryAddress);


  const { user, logout, token } = useUserStore();
  const { cart, fetchCart } = useCartStore();

  const { count, setWishlist } = useWishlistStore();

  const navigate = useNavigate();

  const items = cart?.items || [];
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  useEffect(() => {
    const fetchNotif = async () => {
      if (!token) return;

      try {
        const { data } = await api.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotif();
  }, [token]);

  // =========================
  // SOCKET TEMPS REEL 🔥
  // =========================
  useEffect(() => {
    if (!user) return;

    const socket = io("http://localhost:3000");

    socket.emit("join", user.id);

    socket.on("notification:new", (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => socket.disconnect();
  }, [user]);

  useEffect(() => {
  if (user) {
    fetchCart();
  }
}, [user]);

  // =========================
  // MARK AS READ
  // =========================
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // FETCH WISHLIST
  // =========================
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;

      try {
        const res = await api.get("/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWishlist(res.data);
      } catch (err) {
        console.error("Erreur wishlist", err);
      }
    };

    fetchWishlist();
  }, [token]);

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

const handleNotificationClick = async (notif) => {

  console.log("🔥 RAW NOTIF:", notif);
  console.log("📌 entityId:", notif.entityId);
  console.log("📌 type:", notif.type);

  console.log("🟡 BEFORE markAsRead:", notif);

  if (!notif?.entityId) {
    console.warn("❌ ENTITY ID MANQUANT (SOURCE BUG):", notif);
    console.trace();
    setNotifOpen(false);
    return;
  }

  await markAsRead(notif.id);

  console.log("🟢 AFTER markAsRead:", notif);
  console.log("🚀 NAVIGATING TO:", notif.type, notif.entityId);

  switch (notif.type) {
    case "ORDER":
      navigate(`/orders/${notif.entityId}`);
      break;

    case "DELIVERY":
      navigate(`/delivery/${notif.entityId}`);
      break;

    case "MESSAGE":
      setCurrentChatUserId(notif.entityId);
      setChatOpen(true);
      break;

    case "SHOP":
      navigate(`/shops/${notif.entityId}`);
      break;

    default:
      console.warn("Type inconnu:", notif.type);
  }

  setNotifOpen(false);
};


  const menuItems = [
    { label: "Tendances" },
    { label: "Meilleures ventes" },
    { label: "Dernières Nouveautés" },
    { label: "Baromètre des ventes" },
    { label: "Vendre sur Congo Shop", onClick: handleSellClick },
    { label: "Devenir livreur", onClick: handleSellClick_deliveryman },
  ];

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // =========================
  // AUTOCOMPLETE
  // =========================
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

useEffect(() => {
  const fetchAddress = async () => {
    if (!token) return;

    try {
      const { data } = await api.get("/deliveryadress/default", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data) {
        useUserStore.getState().setDeliveryAddress(data);
      }
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  fetchAddress();
}, [token]);

  return (
    <header className="w-full relative z-50">

      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#131921] text-white">

        {/* LOGO */}
        <div
          className="text-2xl font-bold text-yellow-400 cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        >
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
              <>
                {deliveryAddress.city}, {deliveryAddress.street}
              </>
            ) : (
              "Aucune adresse"
            )}
          </span>
        </div>

        {/* SEARCH */}
        <div className="flex flex-1 max-w-full sm:max-w-xl relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-2 bg-gray-200 text-black rounded-l-md"
          >
            <option value="">Toutes catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full px-3 py-2 text-black outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button onClick={handleSearch} className="bg-yellow-400 px-4 text-black">
            <Search size={18} />
          </button>

          {suggestions.length > 0 && (
            <div className="absolute top-11 left-0 w-full bg-white text-black shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    navigate(`/products/${item.id}`);
                    setSuggestions([]);
                  }}
                >
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 flex-shrink-0">

          {/* ❤️ FAVORIS */}
          {user && (
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/wishlist")}
            >
              <Heart size={22} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {count}
                </span>
              )}
            </div>
          )}

          {/*NOTIFICATIONS */}
<div className="relative cursor-pointer">

  <div onClick={() => setNotifOpen(!notifOpen)}>
    <Bell size={22} />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
        {unreadCount}
      </span>
    )}
  </div>

  {notifOpen && (
    <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">

      <div className="p-3 border-b font-semibold">
        Notifications
      </div>

      {notifications.length === 0 && (
        <p className="p-4 text-gray-500 text-center">
          Aucune notification
        </p>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
            !n.isRead ? "bg-gray-50" : ""
          }`}
          onClick={() => handleNotificationClick(n)}
        >
          <p className="font-medium">{n.title}</p>
          <p className="text-sm text-gray-500">{n.message}</p>
        </div>
      ))}
    </div>
  )}

</div>

          {/* 👤 USER */}
          <div
            className="relative flex items-center gap-1 cursor-pointer"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <User size={20} />

            <div className="hidden sm:flex flex-col text-xs sm:text-sm leading-tight">
              <p className="text-gray-300">
                {user ? `Bonjour, ${user.name}` : "Bonjour"}
              </p>

              <p className="font-semibold">
                {user ? "Mon compte" : "Identifiez-vous"}
              </p>
            </div>

            {hover && <AccountPopup />}
          </div>

          {/* CART */}
          <div
            className="relative cursor-pointer"
            onClick={() => (!user ? navigate("/auth/login") : navigate("/cart"))}
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-xs px-1 rounded-full">
              {itemCount}
            </span>
          </div>
        </div>
      </div>

      {/* MENU + SIDEBAR + CHAT */}
      {/*RIEN MODIFIÉ ICI (ton code reste tel quel) */}
       {/* MENU */}
      <div className="bg-[#232f3e] text-white px-4 py-2 text-sm flex gap-2">
        <span className="cursor-pointer font-semibold" onClick={toggleSidebar}>
          Tous
        </span>
        {menuItems.map((item, idx) => (
          <span key={idx} className="cursor-pointer hidden sm:inline" onClick={item.onClick}>
            {item.label}
          </span>
        ))}
      </div>

      {/* SIDEBAR */}
      <div className={`fixed top-0 left-0 h-full bg-white text-black shadow-xl transform transition-transform duration-300 z-50 w-72 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <p className="font-bold text-lg">Menu</p>
          <button onClick={toggleSidebar}><X size={20} /></button>
        </div>

        <div className="p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <p key={idx} className="cursor-pointer" onClick={item.onClick}>
              {item.label}
            </p>
          ))}
        </div>

        {user && (
          <div className="p-4 border-t">
            <button onClick={logout} className="w-full bg-red-500 text-white py-2 rounded">
              Déconnexion
            </button>
          </div>
        )}
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar} />
      )}

    </header>
  );
}