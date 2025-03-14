import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const BannerContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: theme.spacing(4),
  backgroundColor: "#fff",
}));

const BannerImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(20),
}));

const SkinTestBanner: React.FC = () => {
  const navigate = useNavigate();
  return (
    <BannerContainer>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Liệu trình được xây dựng bởi Bác sỹ chuyên khoa
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        Gần 100 liệu trình khác nhau cho từng loại da và các vấn đề gặp phải, được xây dựng bởi đội
        ngũ chuyên viên và bác sỹ da liễu của 7skincare.
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Bạn chăm sóc da đã lâu nhưng da vẫn không cải thiện?
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        Hãy bắt đầu cuộc hành trình da khỏe da đẹp với chúng tôi ngay từ hôm nay.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: 4 }}
        onClick={() => navigate("/phan-tich-da")}
      >
        TRẮC NGHIỆM PHÂN TÍCH DA
      </Button>
      <BannerImage src={"/skintest.png"} alt="Banner" />
    </BannerContainer>
  );
};

export default SkinTestBanner;
