import { useState } from "react";
import { Box, TextField, Button, Typography, Link, Container } from "@mui/material";
import useAuthStore from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "@/utils/validation";
import { AxiosError } from "axios";
import { useAlert } from "@/hooks/useAlert";

const Login = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation error state
  const [formError, setFormError] = useState("");

  // Auth store
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    // Reset form error
    setFormError("");

    try {
      await login({ email, password });
      showAlert("Đăng nhập thành công!", "success");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        setFormError(error.response?.data.message || "Đã xảy ra lỗi");
      }
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            boxShadow: 3,
            p: 4,
          }}
        >
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="h4" gutterBottom>
              Đăng nhập
            </Typography>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              disabled={isLoading}
              error={email.length > 0 && !isValidEmail(email)}
              helperText={
                email.length > 0 && !isValidEmail(email) ? "Vui lòng nhập email hợp lệ" : ""
              }
            />
            <TextField
              label="Mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              disabled={isLoading}
            />

            {/* Show error message above button */}
            {formError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {formError}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              onClick={handleLogin}
              disabled={isLoading || !email || !password || !isValidEmail(email)}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <Link href="#" variant="body2" sx={{ display: "block", mt: 1 }}>
              Quên mật khẩu
            </Link>
          </Box>
          <Box sx={{ flex: 1, pl: 2, textAlign: "center", alignContent: "center" }}>
            <Typography variant="h4" gutterBottom>
              ĐĂNG KÝ
            </Typography>
            <Typography variant="body1" gutterBottom color="primary">
              Hãy đăng ký ngay để trở thành thành viên của chúng tôi và tận hưởng những tính năng,
              dịch vụ ưu đãi đặc biệt chỉ dành cho người dùng đã đăng ký.
            </Typography>
            <Button onClick={() => navigate("/dang-ky")} variant="contained" color="inherit">
              Đăng ký
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
