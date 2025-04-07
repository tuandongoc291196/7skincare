import { SentimentDissatisfiedOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
interface EmptyProductFilterProps {
  clearFilters: () => void;
}
const EmptyProductFilter = ({ clearFilters }: EmptyProductFilterProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        height: "auto",
        width: "100%",
        borderRadius: 2,
        p: 4,
      }}
    >
      <SentimentDissatisfiedOutlined
        sx={{
          fontSize: 64,
          color: "grey.400",
          mb: 2,
        }}
      />
      <Typography
        variant="h5"
        color="text.secondary"
        sx={{
          mb: 1,
          fontWeight: "medium",
        }}
      >
        Không có sản phẩm nào
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{
          maxWidth: "400px",
          mb: 3,
        }}
      >
        Rất tiếc, không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn. Hãy thử thay đổi tiêu chí
        tìm kiếm!
      </Typography>
      <Button variant="outlined" color="primary" onClick={clearFilters}>
        Xóa bộ lọc
      </Button>
    </Box>
  );
};

export default EmptyProductFilter;
