// src/router/publicRouter.tsx
import { Roles } from "@/constants/status";
import useAuthStore from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRouter() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (user?.roleName === Roles.STAFF) {
      return <Navigate to="/quan-ly-don-hang" />;
    }
    if (user?.roleName === Roles.ADMIN) {
      return <Navigate to="/bao-cao" />;
    }
  }

  return <Outlet />;
}
