import { Box, Button, Typography } from "@mui/material";

interface SkinTestIntroSectionProps {
  onStart: () => void;
}

const SkinTestIntroSection: React.FC<SkinTestIntroSectionProps> = ({ onStart }) => {
  return (
    <Box sx={{ my: 4, display: "flex" }}>
      <img src="doctor.jpg" alt="Doctor" style={{ width: "300px", borderRadius: "50%" }} />
      <Box sx={{ alignContent: "center", textAlign: "center" }}>
        <Typography variant="h4" sx={{ mt: 2 }}>
          TRẮC NGHIỆM PHÂN TÍCH DA
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          NHẬN NGAY ROUTINE CHUẨN CHUYÊN KHOA
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Bài trắc nghiệm này được xây dựng với bộ câu hỏi chuyên sâu cho phép đánh giá tình trạng
          da của bạn đúng đắn nhất. Hãy dành khoảng 30 phút để thấu hiểu làn da mình nhé!
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={onStart}>
          LÀM TRẮC NGHIỆM
        </Button>
      </Box>
    </Box>
  );
};

export default SkinTestIntroSection;
