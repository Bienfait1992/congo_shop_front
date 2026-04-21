import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../shared/services/api";
import { useUserStore } from "../app/store/userStore";

export default function LoginPage() {
  const navigate = useNavigate();

  // ⚠️ ICI ON UTILISE login (PAS setUser)
  const login = useUserStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      // { user, token }
      const { user, token } = data;

      // ✅ UTILISATION DU STORE CORRECTE
      login(user, token);

      // ✅ redirection
      if (user.role === "ADMIN") {
        navigate("/dashboard_admin");
      } else if (user.role === "DELIVERY") {
        navigate("/dashboard_delivery");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error || "Email ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white rounded-xl  p-6">

         <h1 onClick={() => navigate("/")} className="text-3xl font-bold text-green-600 mb-12 text-center">CONGO SHOP</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Mot de passe</label>
            <input
              type="password"
              className="w-full border p-2 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Pas de compte ?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/auth/signup")}
          >
            Créer un compte
          </span>
        </p>

      </div>
    </div>
  );
}