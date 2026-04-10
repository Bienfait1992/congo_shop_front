// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUserStore } from "../app/store/userStore";
// import { toast } from "react-hot-toast";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false); //loading state
//   const navigate = useNavigate();

//   const login = useUserStore((state) => state.login);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);

//     const toastId = toast.loading("Connexion en cours..."); //toast loading

//     try {
//       const res = await fetch("http://localhost:3000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Erreur serveur");
//       }

//       login(data.user, data.token);

//       toast.success("Connexion réussie", { id: toastId }); //remplace le loading

//       switch (data.user.role) {
//         case "CLIENT":
//           navigate("/");
//           break;
//         case "ADMIN":
//           navigate("/dashboard_admin");
//           break;
//         case "DELIVERY":
//           navigate("/dashboard_delivery");
//           break;
//         default:
//           navigate("/");
//       }
//     } catch (err) {
//       toast.error(err.message, { id: toastId }); //remplace loading par erreur
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">

//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-bold text-green-600">CongoShop</h1>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           />

//           <input
//             type="password"
//             placeholder="Mot de passe"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           />

//           <button
//             type="submit"
//             disabled={loading} // ✅ désactivé pendant loading
//             className={`w-full p-3 rounded text-white transition flex items-center justify-center ${
//               loading
//                 ? "bg-green-300 cursor-not-allowed"
//                 : "bg-green-500 hover:bg-green-600"
//             }`}
//           >
//             {loading ? (
//               <span className="flex items-center gap-2">
//                 {/* Spinner simple */}
//                 <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                 Connexion...
//               </span>
//             ) : (
//               "Se connecter"
//             )}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm text-gray-500">
//           Pas encore de compte ?{" "}
//           <a href="/auth/signup" className="text-green-500 hover:underline">
//             Créer un compte
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../app/store/userStore";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = useUserStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Formulaire soumis avec :", { email, password });

    setLoading(true);
    const toastId = toast.loading("Connexion en cours...");
    console.log("⏳ Début de la connexion, toastId :", toastId);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("📤 Requête envoyée au serveur");

      const data = await res.json();
      console.log("📥 Réponse reçue :", data);

      if (!res.ok) {
        console.error("Erreur serveur ou identifiants invalides :", data);
        throw new Error(data.error || "Erreur serveur");
      }

      // Stockage dans le store Zustand
      console.log("🔑 Stockage token et infos utilisateur dans le store");
      login(data.user, data.token);

      // Vérifier ce qui est stocké
      console.log("👤 Utilisateur connecté :", data.user);
      console.log("🛡 Token :", data.token);

      toast.success("Connexion réussie", { id: toastId }, { duration: 3000 });
      console.log("✅ Toast de succès affiché");

      // Navigation selon le rôle
      console.log("🚀 Redirection selon rôle :", data.user.role);
      switch (data.user.role) {
        case "CLIENT":
          navigate("/");
          break;
        case "ADMIN":
          navigate("/dashboard_admin");
          break;
        case "DELIVERY":
          navigate("/dashboard_delivery");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("❌ Erreur lors de la connexion :", err);
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
      console.log("⏹ Fin de la tentative de connexion, loading = false");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen  px-4">
      <div className="w-full max-w-md bg-white p-8 ">

        <div className="text-center mb-8">
          <h1 onClick={() => navigate("/")} className="text-3xl font-bold text-green-600 cursor-pointer">CongoShop</h1>
        </div>
<h2 className="text-xl  mb-6 text-center">Se connecter</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded text-white transition flex items-center justify-center ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Connexion...
              </span>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <a href="/auth/signup" className="text-green-500 hover:underline">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}