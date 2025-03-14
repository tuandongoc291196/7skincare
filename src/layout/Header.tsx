import { AppBar, Badge, Box, Button, IconButton, Toolbar, Menu, MenuItem } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { publicRoutes } from "@/routes/config/publicRoutes";
import { staffRoutes } from "@/routes/config/staffRoutes";
import { adminRoutes } from "@/routes/config/adminRoutes";
import { useLocation, useNavigate } from "react-router-dom";
import { Person, ShoppingBag } from "@mui/icons-material";
import { useState } from "react";
import useAuthStore from "@/hooks/useAuth";
import useCartStore from "@/hooks/useCart";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { items } = useCartStore();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/dang-nhap");
  };

  const getRoutes = () => {
    if (user?.roleName === "USER") {
      return publicRoutes;
    }
    if (user?.roleName === "STAFF") {
      return staffRoutes;
    }
    if (user?.roleName === "ADMIN") {
      return adminRoutes;
    }
    return publicRoutes;
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        color: "#000",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Box>
          <img src="/logo.png" width={90} height={90} />
        </Box>

        <Box
          className="nav"
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {getRoutes()
            .filter(item => item.hidden === false)
            .map(route => {
              const isActive = location.pathname === route.path;
              return (
                <Button
                  key={route.path}
                  color="inherit"
                  href={route.path}
                  sx={{
                    color: isActive ? "var(--primary-color)" : "inherit",
                    fontWeight: isActive ? "bold" : "normal",
                    "&:hover": {
                      color: "var(--primary-color)",
                    },
                  }}
                >
                  {route.name}
                </Button>
              );
            })}
        </Box>

        <Box
          className="actions"
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          {(user === null || user.roleName === "USER") && (
            <IconButton color="inherit" href="/gio-hang">
              <Badge badgeContent={items.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}

          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handleMenuOpen}>
                <Person />
                {user?.name}
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => navigate("/thong-tin-ca-nhan")}>
                  <Person sx={{ marginRight: "10px" }} />
                  Thông tin cá nhân
                </MenuItem>
                {(user === null || user.roleName === "USER") && (
                  <MenuItem onClick={() => navigate("/theo-doi-don-hang")}>
                    <ShoppingBag sx={{ marginRight: "10px" }} />
                    Đơn hàng
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogout}>
                  <Person sx={{ marginRight: "10px" }} />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton color="inherit" href="/dang-nhap">
              <Person />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
