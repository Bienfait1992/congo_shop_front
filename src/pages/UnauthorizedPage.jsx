// pages/UnauthorizedPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Accès refusé 🚫
      </h1>

      <p className="text-gray-600 mb-6 max-w-md">
        Vous n'êtes pas autorisé à accéder à cette page.
        Votre rôle ne permet pas d'effectuer cette action.
      </p>

      <Link
        to="/"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default UnauthorizedPage;