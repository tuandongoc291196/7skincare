import { SkinTestResult } from "@/types/schema/skin-test";
import { Container, Typography, Card, CardContent, Avatar, Grid, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { skinTypeMap } from "@/constants/skinTypes";
import ProductCard from "../card/ProductCard";

interface ResultSkinTestSectionProps {
  result: SkinTestResult;
  totalPoint: number;
}

const ResultSkinTestSection: React.FC<ResultSkinTestSectionProps> = ({ result, totalPoint }) => {
  return (
    <Container>
      <Card
        sx={{
          boxShadow: 3,
          borderRadius: 3,
          textAlign: "center",
          p: 3,
          background: "linear-gradient(135deg, #f5f7fa,rgb(232, 241, 255))",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "success.main",
            width: 56,
            height: 56,
            mx: "auto",
            mb: 2,
          }}
        >
          <CheckCircleIcon fontSize="large" />
        </Avatar>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Cảm ơn bạn đã hoàn thành bài kiểm tra!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "red",
              fontWeight: "bold",
              mt: 1,
            }}
          >
            Tổng điểm: {result.totalPoint} / {totalPoint}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            Kết quả: {skinTypeMap[result.skinType.type] || "Không xác định"}
          </Typography>
        </CardContent>
      </Card>
      <Typography variant="h5" fontWeight={600} mt={4} mb={2}>
        Các sản phẩm liên quan
      </Typography>
      <Divider />
      <Grid container spacing={4} mt={1}>
        {result.suitableProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ResultSkinTestSection;
