// src/router/protectedRouter.tsx
import useAuthStore from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRouter() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" state={{ from: location }} />;
  }

  return <Outlet />;
}
