import { Box, Container } from "@mui/material";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import useAuthStore from "@/hooks/useAuth";

const Layout: React.FC = () => {
  const { user } = useAuthStore();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, paddingTop: 2, paddingBottom: 2 }}>
        <Container
          maxWidth={user?.roleName === undefined || user.roleName === "USER" ? "lg" : "xl"}
        >
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;
