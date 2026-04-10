import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../app/store/userStore";

export const GuestOnly = () => {
  const { user } = useUserStore();

  if (user) {
    switch (user.role) {
      case "CLIENT":
        return <Navigate to="/dashboard" replace />;
      case "ADMIN":
        return <Navigate to="/dashboard_admin" replace />;
      case "DELIVERY":
        return <Navigate to="/dashboard_delivery" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};