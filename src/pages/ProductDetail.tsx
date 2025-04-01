import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/apis/product";
import { Container, Grid, Typography, Box, Button, CircularProgress, Paper } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { skinTypeMap } from "@/constants/skinTypes";
import useCartStore from "@/hooks/useCart";
import { useAlert } from "@/hooks/useAlert";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
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
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" height={"90vh"} alignItems={"center"}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !product) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <ErrorOutlineIcon color="error" />
        <Typography color="error" ml={1}>
          Không tìm thấy sản phẩm.
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={5}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="h6" color="primary" mt={1}>
              {product.price.toLocaleString()} VNĐ
            </Typography>
            <Typography
              mt={2}
              variant="body1"
              sx={{
                lineHeight: "1.2",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            {/* Stock Status */}
            <Typography
              variant="body1"
              mt={2}
              fontWeight={600}
              color={product.quantity > 0 ? "success.main" : "error.main"}
            >
              {product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : "Hết hàng"}
            </Typography>

            {/* Category and Brand */}
            <Box mt={3}>
              <Typography variant="body2">
                <strong>Danh mục:</strong> {product.category.name}
              </Typography>
              <Typography variant="body2">
                <strong>Thương hiệu:</strong> {product.brand.name}
              </Typography>
              <Typography variant="body2">
                <strong>Phù hợp với loại da:</strong>{" "}
                {typeof product.suitableFor === "string"
                  ? product.suitableFor
                      .replace(/,\s*$/, "")
                      .split(", ")
                      .map((type: string) => skinTypeMap[type.trim()] || type)
                      .join(", ")
                  : product.suitableFor || ""}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box mt={3} display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                startIcon={<ShoppingCartIcon />}
                disabled={product.quantity === 0}
              >
                Thêm vào giỏ hàng
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail;
