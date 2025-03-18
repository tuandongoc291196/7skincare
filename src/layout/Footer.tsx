// Footer.tsx
import React from "react";
import { Box, Typography, Divider, Container, Link } from "@mui/material";
import useAuthStore from "@/hooks/useAuth";
import { Roles } from "@/constants/status";

const Footer: React.FC = () => {
  const { user } = useAuthStore();
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        padding: 4,
        borderTop: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        {(user === null || user.roleName === Roles.USER) && (
          <>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={5}>
              {/* Left Section - Logo and Contact Info */}
              <Box sx={{ flex: 1, minWidth: 200, marginBottom: 2 }}>
                <Box>
                  <img src="/logo.png" width={85} height={"auto"} />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    marginBottom: 1,
                    color: "text.secondary",
                  }}
                >
                  ☎ Phone/Zalo/Viber: 0987.776.489
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    marginBottom: 1,
                    color: "text.secondary",
                  }}
                >
                  ✉ Email: info@7skincare.com
                </Typography>
              </Box>

              {/* Middle Section - Introduction */}
              <Box sx={{ flex: 2, minWidth: 200, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom>
                  GIỚI THIỆU
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="body2">
                    7skincare là mẫu đơn án của Hi Beauty hợp tác cùng nhau - Sự lựa chọn hàng đầu
                    cho bạn khi có nhu cầu tư vấn và điều trị các vấn đề về da.
                  </Typography>
                  <Typography variant="body2">
                    Cùng các dịch vụ dành riêng, dinh dưỡng liệu trình điều trị phù hợp riêng cho
                    từng khách hàng, với sản phẩm chính hãng được lựa chọn tỉ mỉ từ các thương hiệu
                    uy tín như Mỹ, Pháp, Đức, Úc...
                  </Typography>
                </Box>
              </Box>

              {/* Right Section - Customer Support */}
              <Box sx={{ flex: 1, minWidth: 200, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom>
                  HỖ TRỢ KHÁCH HÀNG
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Link
                    href="/huong-dan-mua-hang"
                    variant="body2"
                    sx={{
                      color: "inherit",
                      textDecoration: "none",
                      "&:hover": {
                        color: "var(--primary-color)",
                      },
                    }}
                  >
                    Hướng dẫn mua hàng
                  </Link>
                  <Link
                    href="/chinh-sach-hang"
                    variant="body2"
                    sx={{
                      color: "inherit",
                      textDecoration: "none",
                      "&:hover": {
                        color: "var(--primary-color)",
                      },
                    }}
                  >
                    Chính sách hàng
                  </Link>
                  <Link
                    href="/chinh-sach-doi-tra"
                    variant="body2"
                    sx={{
                      color: "inherit",
                      textDecoration: "none",
                      "&:hover": {
                        color: "var(--primary-color)",
                      },
                    }}
                  >
                    Chính sách đổi trả
                  </Link>
                  <Link
                    href="/dieu-khoan-bao-mat"
                    variant="body2"
                    sx={{
                      color: "inherit",
                      textDecoration: "none",
                      "&:hover": {
                        color: "var(--primary-color)",
                      },
                    }}
                  >
                    Điều khoản bảo mật
                  </Link>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        <Typography variant="body2" color="textSecondary" align="center">
          Copyright © 2025 by 7skincare . All Rights Reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
