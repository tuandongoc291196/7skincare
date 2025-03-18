import { Box, Container, Typography } from "@mui/material";

const ResultSkinTestSection: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Cảm ơn bạn đã hoàn thành bài kiểm tra!
        </Typography>
        <Typography variant="body1">
          Chúng tôi sẽ phân tích kết quả và đề xuất một routine chăm sóc da phù hợp nhất cho bạn.
        </Typography>
      </Box>
    </Container>
  );
};

export default ResultSkinTestSection;
