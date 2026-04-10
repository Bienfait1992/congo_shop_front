// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { api } from "../../../shared/services/api";
// import { useUserStore } from "../../../app/store/userStore";
// import toast from "react-hot-toast";
// import ReviewModal from "../../reviews/reviewModal";
// import { io } from "socket.io-client";
// import MessageThreadFull from "../../messages/MessageThreadRealtime";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Thumbs, Zoom } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";
// import "swiper/css/zoom";

// export default function ProductDetailsPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { token, user } = useUserStore();

//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [loadingBtn, setLoadingBtn] = useState(false);
//   const [thumbsSwiper, setThumbsSwiper] = useState(null);

//   const [isReviewOpen, setIsReviewOpen] = useState(false);
//   const [averageRating, setAverageRating] = useState(0);
//   const [reviewCount, setReviewCount] = useState(0);
//   const [reviews, setReviews] = useState([]);
//   const [reviewsPage, setReviewsPage] = useState(1);
//   const [reviewsLimit] = useState(5);
//   const [loadingReviews, setLoadingReviews] = useState(false);
//   const [reviewsFetched, setReviewsFetched] = useState(false);

//   const [activeTab, setActiveTab] = useState("shortDesc");
//   const reviewContainerRef = useRef(null);

//   const socketRef = useRef();
//   const [isSellerOnline, setSellerOnline] = useState(false);
//   const userId = user?.id;

//   // Helper: active promotion
//   const getActivePromotion = (promotions) => {
//     if (!promotions || promotions.length === 0) return null;
//     const now = new Date();
//     return promotions.find(p =>
//       new Date(p.startDate) <= now && new Date(p.endDate) >= now
//     );
//   };

//   // Helper: hours remaining
//   const getPromotionHoursLeft = (promo) => {
//     if (!promo) return 0;
//     const now = new Date();
//     const end = new Date(promo.endDate);
//     const diffMs = end - now;
//     return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
//   };

//   useEffect(() => {
//     if (!id) return;

//     api.get(`/products/${id}`)
//       .then(res => setProduct(res.data))
//       .catch(() => toast.error("Erreur chargement produit"));

//     api.get(`/reviews/average?targetId=${id}&targetType=PRODUCT`)
//       .then(res => {
//         setAverageRating(res.data.average || 0);
//         setReviewCount(res.data.count || 0);
//       })
//       .catch(err => console.error("Erreur fetch average rating", err));
//   }, [id]);

//   useEffect(() => {
//     socketRef.current = io("http://localhost:3000");
//     socketRef.current.on("connect", () => console.log("Socket connecté"));
//     socketRef.current.on("disconnect", (reason) => console.log("Socket déconnecté", reason));
//     return () => socketRef.current.disconnect();
//   }, []);

//   useEffect(() => {
//     if (!userId || !product?.shop?.ownerId) return;

//     const handleOnline = (id) => { if (id === product.shop.ownerId) setSellerOnline(true); };
//     const handleOffline = (id) => { if (id === product.shop.ownerId) setSellerOnline(false); };

//     socketRef.current.emit("register_message", userId);
//     socketRef.current.on("user_online", handleOnline);
//     socketRef.current.on("user_offline", handleOffline);

//     return () => {
//       socketRef.current.off("user_online", handleOnline);
//       socketRef.current.off("user_offline", handleOffline);
//     };
//   }, [userId, product?.shop?.ownerId]);

//   useEffect(() => { if (product?.shop?.isOnline !== undefined) setSellerOnline(product.shop.isOnline); }, [product]);

//   const fetchReviews = async (page = 1) => {
//     setLoadingReviews(true);
//     try {
//       const res = await api.get(`/reviews?targetId=${id}&targetType=PRODUCT&limit=${reviewsLimit}&page=${page}`);
//       const newReviews = Array.isArray(res.data) ? res.data : Array.isArray(res.data.data) ? res.data.data : [];
//       setReviews(prev => page === 1 ? newReviews : [...prev, ...newReviews]);
//       setReviewsFetched(true);
//       if (newReviews.length > 0) setReviewsPage(page + 1);
//     } catch (err) {
//       console.error("Erreur fetch reviews", err);
//     } finally { setLoadingReviews(false); }
//   };

//   useEffect(() => { fetchReviews(1); }, [id]);

//   const handleAddToCart = async () => {
//     if (!token) return navigate("/auth/login");
//     if (!product?.id || quantity < 1 || quantity > product.stock) return toast.error("Quantité invalide ou produit invalide");

//     setLoadingBtn(true);
//     try { 
//       await api.post("/cart/items", { productId: String(product.id), quantity }); 
//       toast.success("Produit ajouté au panier"); 
//     } catch (err) { 
//       toast.error(err.response?.data?.error || "Erreur"); 
//     } finally { 
//       setLoadingBtn(false); 
//     }
//   };

//   const renderStarsBreakdown = () => {
//     const distribution = [0, 0, 0, 0, 0];
//     if (Array.isArray(reviews)) reviews.forEach(r => { if (r?.rating) distribution[r.rating - 1] += 1; });
//     return distribution.map((count, idx) => {
//       const percent = reviewCount ? (count / reviewCount) * 100 : 0;
//       return (
//         <div key={idx} className="flex items-center gap-2 mt-1">
//           <span className="text-sm">{5 - idx}⭐</span>
//           <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
//             <div className="bg-yellow-400 h-2" style={{ width: `${percent}%` }}></div>
//           </div>
//           <span className="text-xs text-gray-500">{count}</span>
//         </div>
//       );
//     });
//   };

//   const handleScroll = () => {
//     if (!reviewContainerRef.current) return;
//     const { scrollTop, scrollHeight, clientHeight } = reviewContainerRef.current;
//     if (scrollTop + clientHeight >= scrollHeight - 10 && !loadingReviews) fetchReviews(reviewsPage);
//   };

//   const renderReviewList = () => {
//     if (reviews.length === 0 && reviewsFetched) return <p className="text-gray-500">Aucun avis pour ce produit.</p>;
//     return reviews.map(r => (
//       <div key={r.id} className="border-b py-4 flex gap-3 items-start">
//         <img src={r.user?.photo || "/default-avatar.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
//         <div className="flex-1">
//           <div className="flex items-center justify-between">
//             <span className="font-semibold text-gray-800">{r.user?.name || "Utilisateur"}</span>
//             <span className="text-yellow-500 font-semibold">{r.rating}⭐</span>
//           </div>
//           {r.comment && <p className="text-gray-700 mt-1">{r.comment}</p>}
//         </div>
//       </div>
//     ));
//   };

//   if (!product) return (
//     <div className="p-6 animate-pulse grid md:grid-cols-2 gap-8">
//       <div className="bg-gray-200 h-96 rounded-xl"></div>
//       <div className="space-y-4">
//         <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
//         <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
//         <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
//       </div>
//     </div>
//   );

//   // Promotion
//   const promo = getActivePromotion(product.promotions);
//   const discountedPrice = promo ? (product.price * (1 - promo.discount / 100)).toFixed(2) : null;
//   const promoHoursLeft = promo ? getPromotionHoursLeft(promo) : 0;
//   const savings = promo ? (product.price - discountedPrice).toFixed(2) : null;

//   return (
//     <div className="p-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
      
//       {/* Galerie principale */}
//       <div>
//         <Swiper
//           modules={[Navigation, Thumbs, Zoom]}
//           navigation
//           zoom
//           thumbs={{ swiper: thumbsSwiper }}
//           className="rounded-xl shadow-lg"
//           style={{ "--swiper-navigation-color": "#1e40af" }}
//         >
//           {product.images?.map((img, idx) => (
//             <SwiperSlide key={idx}>
//               <div className="swiper-zoom-container">
//                 <img src={`http://localhost:3000${img}`} alt={product.name} className="w-full h-[500px] object-cover rounded-xl" />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>

//         <Swiper
//           onSwiper={setThumbsSwiper}
//           slidesPerView={4}
//           spaceBetween={10}
//           className="mt-4"
//         >
//           {product.images?.map((img, idx) => (
//             <SwiperSlide key={idx}>
//               <img src={`http://localhost:3000${img}`} alt={product.name} className="w-full h-24 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition" />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Infos produit */}
//       <div className="flex flex-col gap-4">
//         <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
//         <p className="text-gray-500 flex items-center gap-2">
//           Boutique : {product.shop?.name}
//           <span className={isSellerOnline ? "text-green-600 text-sm" : "text-gray-400 text-sm"}>
//             {isSellerOnline ? "En ligne" : "Hors ligne"}
//           </span>
//         </p>

//         {/* PRIX & PROMO */}
//         {promo ? (
//           <div className="bg-red-50 p-4 rounded-lg border border-red-200">
//             <p className="text-red-600 font-bold text-2xl">
//               {discountedPrice} {product.currency || "USD"}
//             </p>
//             <p className="text-gray-500 line-through">{product.price} {product.currency || "USD"}</p>
//             <p className="text-sm text-red-500 mt-1">
//               Promotion active ! Économisez {savings} {product.currency || "USD"} • {promoHoursLeft}h restantes
//             </p>
//           </div>
//         ) : (
//           <p className="text-blue-600 font-bold text-2xl">
//             Prix: {product.price} {product.currency || "USD"}
//           </p>
//         )}

//         {product.shop?.phone && (
//           <a
//             href={`https://wa.me/${product.shop.phone}?text=${encodeURIComponent(`Bonjour, je veux des infos sur : ${product.name}`)}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="mt-2 flex items-center justify-center gap-3 border border-green-500 text-green-600 font-semibold py-3 rounded-xl hover:bg-green-50 transition"
//           >
//             Contacter le vendeur
//           </a>
//         )}

//         <p className={`mt-2 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
//           {product.stock > 0 ? `En stock (${product.stock})` : "Rupture de stock"}
//         </p>
         
// <MessageThreadFull />
//         <div className="mt-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span className="text-yellow-500 font-semibold">{averageRating.toFixed(1)} / 5</span>
//             <span className="text-gray-500 text-sm">({reviewCount} avis)</span>
//           </div>
//           <button onClick={() => setIsReviewOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
//             Noter ce produit
//           </button>
//         </div>

//         <div className="mt-4">{renderStarsBreakdown()}</div>
//         <div className="mt-4 max-h-96 overflow-y-auto border rounded p-3" ref={reviewContainerRef} onScroll={handleScroll}>
//           {renderReviewList()}
//           {loadingReviews && <p className="text-gray-500 mt-2">Chargement...</p>}
//         </div>

//         <div className="mt-6">
//           <div className="flex gap-4 border-b">
//             <button onClick={() => setActiveTab("shortDesc")} className={`py-2 font-semibold ${activeTab === "shortDesc" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}>Description courte</button>
//             <button onClick={() => setActiveTab("longDesc")} className={`py-2 font-semibold ${activeTab === "longDesc" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}>Détails</button>
//           </div>
//           <div className="mt-4 text-gray-700 leading-relaxed">
//             {activeTab === "shortDesc"
//               ? product.description ? product.description.substring(0, 100) + "..." : "Pas de description courte disponible"
//               : product.description || "Pas de détails disponibles"}
//           </div>
//         </div>

//         <div className="mt-6 flex items-center gap-4 flex-wrap">
//           <div className="flex items-center border rounded-lg overflow-hidden">
//             <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 bg-gray-100 hover:bg-gray-200">-</button>
//             <input type="number" value={quantity} readOnly className="w-12 text-center outline-none" />
//             <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 bg-gray-100 hover:bg-gray-200">+</button>
//           </div>
//           <button onClick={handleAddToCart} disabled={product.stock === 0 || loadingBtn} className="flex items-center justify-center gap-2 bg-yellow-400 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition disabled:bg-gray-300">
//             {loadingBtn ? <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span> : "Ajouter au panier"}
//           </button>
//         </div>
//       </div>

//       {isReviewOpen && (
//         <ReviewModal
//           isOpen={isReviewOpen}
//           targetId={product.id}
//           targetType="PRODUCT"
//           onClose={() => setIsReviewOpen(false)}
//           onReviewSubmitted={(review) => {
//             setAverageRating(prev => {
//               const newAverage = (prev * reviewCount + review.rating) / (reviewCount + 1);
//               setReviewCount(prevCount => prevCount + 1);
//               return newAverage;
//             });
//             setReviews(prev => [review, ...prev]);
//             setIsReviewOpen(false);
//             if (reviewContainerRef.current) reviewContainerRef.current.scrollTop = 0;
//           }}
//         />
//       )}
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../shared/services/api";
import { useUserStore } from "../../../app/store/userStore";
import toast from "react-hot-toast";
import ReviewModal from "../../reviews/reviewModal";
import { io } from "socket.io-client";
import MessageThreadFull from "../../messages/MessageThreadRealtime";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Zoom } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useUserStore();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsLimit] = useState(5);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsFetched, setReviewsFetched] = useState(false);

  const [activeTab, setActiveTab] = useState("shortDesc");
  const reviewContainerRef = useRef(null);

  const socketRef = useRef();
  const [isSellerOnline, setSellerOnline] = useState(false);
  const userId = user?.id;

  // Mobile panel toggle
  const [isMessagePanelOpen, setMessagePanelOpen] = useState(false);

  const getActivePromotion = (promotions) => {
    if (!promotions || promotions.length === 0) return null;
    const now = new Date();
    return promotions.find(p =>
      new Date(p.startDate) <= now && new Date(p.endDate) >= now
    );
  };

  const getPromotionHoursLeft = (promo) => {
    if (!promo) return 0;
    const now = new Date();
    const end = new Date(promo.endDate);
    const diffMs = end - now;
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  };

  useEffect(() => {
    if (!id) return;

    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => toast.error("Erreur chargement produit"));

    api.get(`/reviews/average?targetId=${id}&targetType=PRODUCT`)
      .then(res => {
        setAverageRating(res.data.average || 0);
        setReviewCount(res.data.count || 0);
      })
      .catch(err => console.error("Erreur fetch average rating", err));
  }, [id]);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");
    socketRef.current.on("connect", () => console.log("Socket connecté"));
    socketRef.current.on("disconnect", (reason) => console.log("Socket déconnecté", reason));
    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    if (!userId || !product?.shop?.ownerId) return;

    const handleOnline = (id) => { if (id === product.shop.ownerId) setSellerOnline(true); };
    const handleOffline = (id) => { if (id === product.shop.ownerId) setSellerOnline(false); };

    socketRef.current.emit("register_message", userId);
    socketRef.current.on("user_online", handleOnline);
    socketRef.current.on("user_offline", handleOffline);

    return () => {
      socketRef.current.off("user_online", handleOnline);
      socketRef.current.off("user_offline", handleOffline);
    };
  }, [userId, product?.shop?.ownerId]);

  useEffect(() => { if (product?.shop?.isOnline !== undefined) setSellerOnline(product.shop.isOnline); }, [product]);

  const fetchReviews = async (page = 1) => {
    setLoadingReviews(true);
    try {
      const res = await api.get(`/reviews?targetId=${id}&targetType=PRODUCT&limit=${reviewsLimit}&page=${page}`);
      const newReviews = Array.isArray(res.data) ? res.data : Array.isArray(res.data.data) ? res.data.data : [];
      setReviews(prev => page === 1 ? newReviews : [...prev, ...newReviews]);
      setReviewsFetched(true);
      if (newReviews.length > 0) setReviewsPage(page + 1);
    } catch (err) {
      console.error("Erreur fetch reviews", err);
    } finally { setLoadingReviews(false); }
  };

  useEffect(() => { fetchReviews(1); }, [id]);

  const handleAddToCart = async () => {
    if (!token) return navigate("/auth/login");
    if (!product?.id || quantity < 1 || quantity > product.stock) return toast.error("Quantité invalide ou produit invalide");

    setLoadingBtn(true);
    try { 
      await api.post("/cart/items", { productId: String(product.id), quantity }); 
      toast.success("Produit ajouté au panier"); 
    } catch (err) { 
      toast.error(err.response?.data?.error || "Erreur"); 
    } finally { 
      setLoadingBtn(false); 
    }
  };

  const renderStarsBreakdown = () => {
    const distribution = [0, 0, 0, 0, 0];
    if (Array.isArray(reviews)) reviews.forEach(r => { if (r?.rating) distribution[r.rating - 1] += 1; });
    return distribution.map((count, idx) => {
      const percent = reviewCount ? (count / reviewCount) * 100 : 0;
      return (
        <div key={idx} className="flex items-center gap-2 mt-1">
          <span className="text-sm">{5 - idx}⭐</span>
          <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
            <div className="bg-yellow-400 h-2" style={{ width: `${percent}%` }}></div>
          </div>
          <span className="text-xs text-gray-500">{count}</span>
        </div>
      );
    });
  };

  const handleScroll = () => {
    if (!reviewContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = reviewContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loadingReviews) fetchReviews(reviewsPage);
  };

  const renderReviewList = () => {
    if (reviews.length === 0 && reviewsFetched) return <p className="text-gray-500">Aucun avis pour ce produit.</p>;
    return reviews.map(r => (
      <div key={r.id} className="border-b py-4 flex gap-3 items-start">
        <img src={r.user?.photo || "/default-avatar.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">{r.user?.name || "Utilisateur"}</span>
            <span className="text-yellow-500 font-semibold">{r.rating}⭐</span>
          </div>
          {r.comment && <p className="text-gray-700 mt-1">{r.comment}</p>}
        </div>
      </div>
    ));
  };

  if (!product) return (
    <div className="p-6 animate-pulse grid md:grid-cols-2 gap-8">
      <div className="bg-gray-200 h-96 rounded-xl"></div>
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
        <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
        <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
      </div>
    </div>
  );

  const promo = getActivePromotion(product.promotions);
  const discountedPrice = promo ? (product.price * (1 - promo.discount / 100)).toFixed(2) : null;
  const promoHoursLeft = promo ? getPromotionHoursLeft(promo) : 0;
  const savings = promo ? (product.price - discountedPrice).toFixed(2) : null;

  return (
    <div className="relative max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-12">

      {/* Galerie principale */}
      <div>
        <Swiper
          modules={[Navigation, Thumbs, Zoom]}
          navigation
          zoom
          thumbs={{ swiper: thumbsSwiper }}
          className="rounded-xl shadow-lg"
          style={{ "--swiper-navigation-color": "#1e40af" }}
        >
          {product.images?.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="swiper-zoom-container">
                <img src={`http://localhost:3000${img}`} alt={product.name} className="w-full h-[500px] object-cover rounded-xl" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <Swiper
          onSwiper={setThumbsSwiper}
          slidesPerView={4}
          spaceBetween={10}
          className="mt-4"
        >
          {product.images?.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={`http://localhost:3000${img}`} alt={product.name} className="w-full h-24 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Infos produit */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-gray-500 flex items-center gap-2">
          Boutique : {product.shop?.name}
          <span className={isSellerOnline ? "text-green-600 text-sm" : "text-gray-400 text-sm"}>
            {isSellerOnline ? "En ligne" : "Hors ligne"}
          </span>
        </p>

        {promo ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600 font-bold text-2xl">{discountedPrice} {product.currency || "USD"}</p>
            <p className="text-gray-500 line-through">{product.price} {product.currency || "USD"}</p>
            <p className="text-sm text-red-500 mt-1">
              Promotion active ! Économisez {savings} {product.currency || "USD"} • {promoHoursLeft}h restantes
            </p>
          </div>
        ) : (
          <p className="text-blue-600 font-bold text-2xl">Prix: {product.price} {product.currency || "USD"}</p>
        )}


<div className="flex space-x-5">
  {user ? (
    <>
      {product.shop?.phone && (
        <a
          href={`https://wa.me/${product.shop.phone}?text=${encodeURIComponent(
            `Bonjour, je veux des infos sur : ${product.name}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-3 border border-green-500 text-green-600 font-semibold p-3 rounded-xl hover:bg-green-50 transition"
        >
          Contact WhatsApp
        </a>
      )}

      <button
        onClick={() => setMessagePanelOpen(true)}
        className="mt-2 flex items-center justify-center gap-3 border border-blue-500 text-blue-600 font-semibold p-3 rounded-xl hover:bg-blue-50 transition"
      >
        Chater avec le vendeur
      </button>
    </>
  ) : (
    <div className="mt-2 text-gray-500 italic">
      Connectez-vous pour contacter le vendeur
    </div>
  )}
</div>

        <p className={`mt-2 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {product.stock > 0 ? `En stock (${product.stock})` : "Rupture de stock"}
        </p>

        {/* Panel latéral style Amazon */}
        {isMessagePanelOpen && (
  <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 translate-x-0">
            <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold text-lg">Messagerie</h2>
        <button
            onClick={() => setMessagePanelOpen(false)}
            className=" font-normal text-xl border px-2  rounded hover:bg-gray-200"
        >
        x
        </button>
</div>
    <div className="p-4 overflow-y-auto h-full">
      <MessageThreadFull otherUserId={product.shop.ownerId} currentUserId={user?.id} />
    </div>
  </div>
)}

        {/* Bouton flottant mobile */}
        {/* <button
          onClick={() => setMessagePanelOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
        </button> */}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 font-semibold">{averageRating.toFixed(1)} / 5</span>
            <span className="text-gray-500 text-sm">({reviewCount} avis)</span>
          </div>
          <button onClick={() => setIsReviewOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            Noter ce produit
          </button>
        </div>

        <div className="mt-4">{renderStarsBreakdown()}</div>
        <div className="mt-4 max-h-96 overflow-y-auto border rounded p-3" ref={reviewContainerRef} onScroll={handleScroll}>
          {renderReviewList()}
          {loadingReviews && <p className="text-gray-500 mt-2">Chargement...</p>}
        </div>

        <div className="mt-6">
          <div className="flex gap-4 border-b">
            <button onClick={() => setActiveTab("shortDesc")} className={`py-2 font-semibold ${activeTab === "shortDesc" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}>Description courte</button>
            <button onClick={() => setActiveTab("longDesc")} className={`py-2 font-semibold ${activeTab === "longDesc" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}>Détails</button>
          </div>
          <div className="mt-4 text-gray-700 leading-relaxed">
            {activeTab === "shortDesc"
              ? product.description ? product.description.substring(0, 100) + "..." : "Pas de description courte disponible"
              : product.description || "Pas de détails disponibles"}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 flex-wrap">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 bg-gray-100 hover:bg-gray-200">-</button>
            <input type="number" value={quantity} readOnly className="w-12 text-center outline-none" />
            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 bg-gray-100 hover:bg-gray-200">+</button>
          </div>
          <button onClick={handleAddToCart} disabled={product.stock === 0 || loadingBtn} className="flex items-center justify-center gap-2 bg-yellow-400 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition disabled:bg-gray-300">
            {loadingBtn ? <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span> : "Ajouter au panier"}
          </button>
        </div>
      </div>

      {isReviewOpen && (
        <ReviewModal
          isOpen={isReviewOpen}
          targetId={product.id}
          targetType="PRODUCT"
          onClose={() => setIsReviewOpen(false)}
          onReviewSubmitted={(review) => {
            setAverageRating(prev => {
              const newAverage = (prev * reviewCount + review.rating) / (reviewCount + 1);
              setReviewCount(prevCount => prevCount + 1);
              return newAverage;
            });
            setReviews(prev => [review, ...prev]);
            setIsReviewOpen(false);
            if (reviewContainerRef.current) reviewContainerRef.current.scrollTop = 0;
          }}
        />
      )}
    </div>
  );
}