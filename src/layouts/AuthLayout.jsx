import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        {/* Logo ou en-tête */}
        {/* <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600">CongoShop</h1>
        </div> */}

        {/* Contenu de la page via Outlet */}
        <Outlet />

        {/* Footer ou lien commun */}
        <p className="mt-2 text-center text-sm text-gray-500">
          &copy; 2026 CongoShop. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}