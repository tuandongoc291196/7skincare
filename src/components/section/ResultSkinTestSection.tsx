import { SkinTestResult } from "@/types/schema/skin-test";
import { Container, Typography, Card, CardContent, Avatar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface ResultSkinTestSectionProps {
  result: SkinTestResult;
}

const ResultSkinTestSection: React.FC<ResultSkinTestSectionProps> = ({ result }) => {
  const skinTypeMap: Record<string, string> = {
    OILY: "Da dầu",
    DRY: "Da khô",
    COMBINATION: "Da hỗn hợp",
    SENSITIVE: "Da nhạy cảm",
  };

  return (
    <Container maxWidth="sm" sx={{ my: 8 }}>
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
              color: "primary.main",
              fontWeight: "bold",
              mt: 1,
            }}
          >
            Kết quả: {skinTypeMap[result.skinType.type] || "Không xác định"}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ResultSkinTestSection;
