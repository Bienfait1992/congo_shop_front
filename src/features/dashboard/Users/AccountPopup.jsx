import React from "react";

import { useNavigate } from "react-router-dom";

export default function AccountPopup({ className }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div
      className={`absolute top-full mt-2 right-0 w-80 bg-white shadow-lg border rounded-md z-50 p-4 text-sm text-blue-600 ${className}`}
    >
      <div className="space-y-3">
        {/* Section Connexion */}
        <div className="border-b pb-2 text-center">
          <button  onClick={() => navigate("/auth/login")} className="font-semibold bg-blue-500 p-2 text-black rounded-lg w-full hover:bg-blue-600 transition">
            Identifiez-vous
          </button>
          <button onClick={() => navigate("/auth/signup")} className="text-blue-600 hover:underline mt-1">
            Nouveau client ? Commencer ici.
          </button>
        </div>

        {/* Listes d'envies */}
        <div className="border-b pb-2">
          <p className="font-semibold">Vos listes d'envies</p>
          <ul className="mt-1 space-y-1">
            <li><button className="hover:underline">Créer une liste</button></li>
            <li><button className="hover:underline">Liste de mariage</button></li>
            <li><button className="hover:underline">Liste de naissance</button></li>
          </ul>
        </div>

        {/* Votre compte */}
        <div className="border-b pb-2">
          <p className="font-semibold">Votre compte</p>
          <ul className="mt-1 space-y-1">
            <li>
              <button
                onClick={() => handleNavigate("/account")}
                className="hover:underline"
              >
                Votre compte
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavigate("/orders")}
                className="hover:underline"
              >
                Vos commandes
              </button>
            </li>

            <li>
              <button className="hover:underline">
                Votre compte vendeur
              </button>
            </li>

            <li>
              <button className="hover:underline">
                Votre liste d'envies
              </button>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <p className="font-semibold">Services</p>
          <ul className="mt-1 space-y-1">
            <li><button className="hover:underline">Vos recommandations</button></li>
            <li><button className="hover:underline">Vos animaux de compagnie</button></li>
            <li><button className="hover:underline">Adhésions et abonnements</button></li>
            <li><button className="hover:underline">Gérer vos appareils</button></li>
            <li><button className="hover:underline">Votre Abonnement Kindle</button></li>
            <li><button className="hover:underline">Créer un compte professionnel</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}