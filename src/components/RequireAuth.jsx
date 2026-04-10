// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useUserStore } from "../app/store/userStore";

// export const RequireAuth = ({ role }) => {
//   const { user, token } = useUserStore();
//   const location = useLocation();

//   // ❌ Pas connecté
//   if (!token || !user) {
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   // ❌ Mauvais rôle
//   if (role && user.role !== role) {
//     switch (user.role) {
//       case "ADMIN":
//         return <Navigate to="/dashboard_admin" replace />;
//       case "DELIVERY":
//         return <Navigate to="/dashboard_delivery" replace />;
//       case "CLIENT":
//         return <Navigate to="/dashboard" replace />;
//       default:
//         return <Navigate to="/" replace />;
//     }
//   }

//   //Autorisé
//   return <Outlet />;
// };

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserStore } from "../app/store/userStore";

export const RequireAuth = ({ role }) => {
  const { user, token } = useUserStore();
  const location = useLocation();

  //Pas connecté → login
  if (!token || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Mauvais rôle → page unauthorized avec message clair
  if (role && user.role !== role) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          message: `Accès refusé : cette page est réservée aux ${role}`,
          from: location.pathname,
        }}
        replace
      />
    );
  }

  // ✅ Autorisé
  return <Outlet />;
};