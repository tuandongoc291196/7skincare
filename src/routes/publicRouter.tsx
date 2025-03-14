// src/router/publicRouter.tsx
import useAuthStore from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRouter() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (user?.roleName === "STAFF") {
      return <Navigate to="/quan-ly-san-pham" />;
    }
    if (user?.roleName === "ADMIN") {
      return <Navigate to="/quan-ly-tai-khoan" />;
    }
  }

  return <Outlet />;
}
