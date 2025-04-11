import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  Person,
  ShoppingBag,
  ShoppingCart,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExitToApp,
  AccountCircle,
  History,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "@/hooks/useAuth";
import useCartStore from "@/hooks/useCart";
import { Roles } from "@/constants/status";
import { publicRoutes } from "@/routes/config/publicRoutes";
import { staffRoutes } from "@/routes/config/staffRoutes";
import { adminRoutes } from "@/routes/config/adminRoutes";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/dang-nhap");
  };

  const getRoutes = () => {
    if (user?.roleName === Roles.USER) return publicRoutes;
    if (user?.roleName === Roles.STAFF) return staffRoutes;
    if (user?.roleName === Roles.ADMIN) return adminRoutes;
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
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" width={90} height={90} />
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: "20px" }}>
            {getRoutes()
              .filter(item => !item.hidden)
              .map(route => (
                <Button
                  key={route.path}
                  color="inherit"
                  href={route.path}
                  sx={{
                    color: location.pathname.startsWith(route.path)
                      ? "var(--primary-color)"
                      : "inherit",
                    fontWeight: location.pathname.startsWith(route.path) ? "bold" : "normal",
                    "&:hover": { color: "var(--primary-color)" },
                  }}
                >
                  {route.name}
                </Button>
              ))}
          </Box>
        )}

        {/* Actions (Cart & User) */}
        <Box sx={{ display: "flex", gap: "10px" }}>
          {(user === null || user.roleName === Roles.USER) && (
            <IconButton color="inherit" href="/gio-hang">
              <Badge badgeContent={items.length} color="error">
                <ShoppingCart />
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
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  Thông tin cá nhân
                </MenuItem>
                {(user === null || user.roleName === Roles.USER) && (
                  <>
                    <MenuItem onClick={() => navigate("/theo-doi-don-hang")}>
                      <ListItemIcon>
                        <ShoppingBag />
                      </ListItemIcon>
                      Đơn hàng
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/lich-su-kiem-tra-loai-da")}>
                      <ListItemIcon>
                        <History />
                      </ListItemIcon>
                      Lịch sử kiểm tra loại da
                    </MenuItem>
                  </>
                )}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton color="inherit" href="/dang-nhap">
              <Person />
            </IconButton>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Drawer Header with Close Button */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
          >
            <img src="/logo.png" width={70} height={70} />
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Navigation Links */}
          <List>
            {getRoutes()
              .filter(item => !item.hidden)
              .map(route => (
                <ListItem key={route.path} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(route.path);
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText primary={route.name} sx={{ textTransform: "capitalize" }} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>

          <Divider />

          {/* User Section */}
          {isAuthenticated ? (
            <>
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate("/thong-tin-ca-nhan")}>
                    <ListItemIcon>
                      <AccountCircle />
                    </ListItemIcon>
                    <ListItemText primary="Thông tin cá nhân" />
                  </ListItemButton>
                </ListItem>
                {(user === null || user.roleName === Roles.USER) && (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => navigate("/theo-doi-don-hang")}>
                        <ListItemIcon>
                          <ShoppingBag />
                        </ListItemIcon>
                        <ListItemText primary="Đơn hàng" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => navigate("/lich-su-kiem-tra-loai-da")}>
                        <ListItemIcon>
                          <History />
                        </ListItemIcon>
                        <ListItemText primary="Lịch sử kiểm tra loại da" />
                      </ListItemButton>
                    </ListItem>
                  </>
                )}

                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="Đăng xuất" />
                  </ListItemButton>
                </ListItem>
              </List>
            </>
          ) : (
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate("/dang-nhap");
                  }}
                >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Đăng nhập" />
                </ListItemButton>
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
