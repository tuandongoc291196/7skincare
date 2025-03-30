import { Container, Typography, Button, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg" style={{ padding: "2rem" }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            Trắc nghiệm phân tích da
          </Typography>
          <Typography variant="h4" component="h1" gutterBottom>
            Nhận ngay Routine chuẩn chuyên khoa!
          </Typography>
          <Typography variant="body1" paragraph>
            Hãy khám phá liệu trình chăm sóc da được xây dựng riêng cho bạn theo tình trạng da bởi
            bác sĩ da liễu Anh Trung!
          </Typography>
          <Box mt={2} sx={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate("/phan-tich-da")}
            >
              PHÂN TÍCH DA
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <img src="/doctor.jpg" alt="Doctor" style={{ width: "100%", borderRadius: "8px" }} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HeroSection;
