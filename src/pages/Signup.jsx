import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../app/store/userStore";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // store Zustand
  const login = useUserStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role: "CLIENT" }), // 🔹 rôle forcé
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      // Stockage du user et token via Zustand
      login(data.user, data.token);

      toast.success("Inscription réussie !");
      navigate("/"); // 🔹 redirection vers l'accueil pour tous
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 ">
        {/* Logo cliquable */}
        <div className="flex justify-center mb-6 cursor-pointer" onClick={() => navigate("/")}>
          {/* <img
            src="/logo.png" // remplace par le chemin réel de ton logo
            alt="Logo"
            className="h-12"
          /> */}
          <h1 onClick={() => navigate("/")} className="text-3xl font-bold text-green-600">CONGO SHOP</h1>
        </div>

        <h2 className="text-xl mb-6 text-center">Créer un compte</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="tel"
            placeholder="Téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />

          {/* 🔹 Plus de choix de rôle, tout le monde est client */}

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition"
          >
            S’inscrire
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Déjà un compte ? <Link to="/auth/login" className="text-green-500">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}