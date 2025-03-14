import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import useCartStore from "@/hooks/useCart";
import { Product } from "@/types/schema/product";
import { useAlert } from "@/hooks/useAlert";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addItem, items } = useCartStore();
  const { showAlert } = useAlert();

  const handleAddToCart = () => {
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
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        title={product.name}
        sx={{ padding: "2em 2em 0 2em" }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography gutterBottom variant="body1" component="div">
          {product.name}
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
