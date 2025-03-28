import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import useCartStore from "@/hooks/useCart";
import { Product } from "@/types/schema/product";
import { useAlert } from "@/hooks/useAlert";
import { skinTypeMap } from "@/constants/skinTypes";
import { useNavigate } from "react-router-dom";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addItem, items } = useCartStore();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();

    const isProductInCart = items.some(item => item.id === product.id);
    if (isProductInCart) {
      showAlert("Sản phẩm đã có trong giỏ hàng", "error");
    } else {
      const cartItem = {
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
        quantity: 1,
      };

      addItem(cartItem);
      showAlert("Thêm vào giỏ hàng thành công", "success");
    }
  };

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
        <Typography gutterBottom variant="body2" component="div" textAlign={"justify"}>
          {product.name}
        </Typography>
        <Typography gutterBottom variant="subtitle2" component="div" textAlign={"justify"}>
          {typeof product.suitableFor === "string"
            ? product.suitableFor
                .replace(/,\s*$/, "")
                .split(", ")
                .map(type => skinTypeMap[type.trim()] || type)
                .join(", ")
            : product.suitableFor || ""}{" "}
        </Typography>
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h6" color="text.primary">
            {product.price.toLocaleString()} đ
          </Typography>
          {product.quantity > 0 ? (
            <Typography variant="body2" color="text.secondary">
              Còn hàng: {product.quantity}
            </Typography>
          ) : (
            <Typography variant="body2" color="error">
              Hết hàng
            </Typography>
          )}
        </Box>
      </CardContent>
      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
        >
          {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
