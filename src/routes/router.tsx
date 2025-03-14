import { Route, Routes } from "react-router-dom";
import PublicRouter from "./publicRouter";
import { publicRoutes } from "./config/publicRoutes";
import GuestLayout from "../layout/Layout";
import ProtectedRouter from "./protectedRouter";
import { staffRoutes } from "./config/staffRoutes";
import { adminRoutes } from "./config/adminRoutes";
import Layout from "../layout/Layout";
import Profile from "@/pages/Profile";

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRouter />}>
        <Route element={<Layout />}>
          {publicRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.component} />
          ))}
        </Route>
      </Route>
      <Route element={<ProtectedRouter />}>
        <Route element={<Layout />}>
          {staffRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.component} />
          ))}
          {adminRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.component} />
          ))}
          <Route path="/thong-tin-ca-nhan" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<GuestLayout />} />
    </Routes>
  );
}

export default AppRouter;
