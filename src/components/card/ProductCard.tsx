// ProductCard.tsx
import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { Product } from "@/types/schema/product";
import { useNavigate } from "react-router-dom";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();

  const totalQuantity = product.productDetails.reduce((sum, detail) => sum + detail.quantity, 0);

  const prices = product.productDetails.map(detail => detail.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRangeDisplay =
    minPrice === maxPrice
      ? `${minPrice.toLocaleString("vi-VN")}₫`
      : `${minPrice.toLocaleString("vi-VN")}₫ - ${maxPrice.toLocaleString("vi-VN")}₫`;

  return (
    <Card
      onClick={() => navigate(`/san-pham/${product.id}`)}
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        title={product.name}
        sx={{
          padding: "1em 1em 0 1em",
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "8px 16px",
        }}
      >
        <Typography
          gutterBottom
          variant="body2"
          component="div"
          textAlign={"justify"}
          sx={{
            maxHeight: "3.2em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </Typography>
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="body2" color="success">
            Đã bán: {product.noOfSold}
          </Typography>
          {totalQuantity > 0 ? (
            <Typography variant="body2" color="text.secondary">
              Còn hàng: {totalQuantity}
            </Typography>
          ) : (
            <Typography variant="body2" color="error">
              Hết hàng
            </Typography>
          )}
        </Box>
        <Typography variant="body1" color="primary" fontWeight="bold">
          {priceRangeDisplay}
        </Typography>
      </CardContent>
      <Box sx={{ px: 2, pb: 2 }}>
        <Button variant="contained" fullWidth>
          Xem chi tiết
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
