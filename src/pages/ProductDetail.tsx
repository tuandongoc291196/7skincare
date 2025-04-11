import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductById } from "@/apis/product";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { skinTypeMap } from "@/constants/skinTypes";
import useCartStore from "@/hooks/useCart";
import { useAlert } from "@/hooks/useAlert";
import { useState } from "react";
import { CartProduct } from "@/types/schema/cart";
import CapacitySelector from "@/components/selector/CapacitySelector";

const ProductDetail = () => {
  const queryClient = useQueryClient();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
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

  const renderTabContent = (content: string) => (
    <Typography
      mt={2}
      variant="body1"
      sx={{ lineHeight: 1.2, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    const selectedDetail = product?.productDetails.find(detail => detail.id === selectedDetailId);
    if (value >= 1 && (!selectedDetail || value <= selectedDetail.quantity)) {
      setQuantity(value);
    }
  };
  const handleAddToCart = async () => {
    if (!product) {
      return;
    }
    if (!selectedDetailId) {
      showAlert("Vui lòng chọn dung tích", "error");
      return;
    }

    // Re-fetch the latest product data before adding to the cart
    try {
      await queryClient.invalidateQueries({ queryKey: ["get-product", productId] });
      const updatedProduct = await getProductById(productId);
      const selectedDetail = updatedProduct.productDetails.find(
        detail => detail.id === selectedDetailId
      );

      if (!selectedDetail) {
        showAlert("Không tìm thấy chi tiết sản phẩm", "error");
        return;
      }

      if (selectedDetail.quantity < quantity) {
        showAlert("Số lượng yêu cầu vượt quá số lượng có sẵn", "error");
        return;
      }

      const isProductInCart = items.some(item => item.productDetailId === selectedDetail.id);

      if (isProductInCart) {
        showAlert("Sản phẩm với dung tích này đã có trong giỏ hàng", "error");
      } else {
        const cartItem: CartProduct = {
          productId: updatedProduct.id,
          productDetailId: selectedDetail.id,
          image: updatedProduct.image,
          name: `${updatedProduct.name}`,
          price: selectedDetail.price,
          quantity: quantity,
          capacity: selectedDetail.capacity,
          maxQuantity: selectedDetail.quantity,
        };

        addItem(cartItem);
        showAlert("Thêm vào giỏ hàng thành công", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Có lỗi xảy ra, vui lòng thử lại sau", "error");
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

  // Calculate total available quantity
  const totalQuantity = product.productDetails.reduce((sum, detail) => sum + detail.quantity, 0);

  // Set default selected detail if not set
  if (!selectedDetailId && product.productDetails.length > 0) {
    setSelectedDetailId(product.productDetails[0].id);
  }

  const selectedDetail = product.productDetails.find(detail => detail.id === selectedDetailId);

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
              mt={1}
              fontWeight={600}
              color={totalQuantity > 0 ? "success.main" : "error.main"}
            >
              {totalQuantity > 0 ? `Còn ${totalQuantity} sản phẩm` : "Hết hàng"}
            </Typography>

            {/* Category and Brand */}
            <Box mt={1}>
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

            {/* Capacity Selection and Quantity */}
            <Box mt={1} display="flex" flexDirection={"column"} gap={2}>
              <CapacitySelector
                product={product}
                selectedDetailId={selectedDetailId}
                setSelectedDetailId={setSelectedDetailId}
              />

              <TextField
                size="small"
                type="number"
                label="Số lượng"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: selectedDetail?.quantity || 1 }}
                sx={{ width: "100px", mb: 2 }}
                disabled={!selectedDetail || selectedDetail.quantity === 0}
              />
            </Box>

            {/* Action Buttons */}
            <Box mt={3} display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                startIcon={<ShoppingCartIcon />}
                disabled={!selectedDetail || selectedDetail.quantity === 0}
              >
                Thêm vào giỏ hàng
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {["Mô tả", "Thành phần", "Công dụng", "Hướng dẫn sử dụng", "Thông số kỹ thuật"].map(
                (label, index) => (
                  <Tab key={index} label={label} />
                )
              )}
            </Tabs>
            <Box mt={2}>
              {tabIndex === 0 && renderTabContent(product.description)}
              {tabIndex === 1 && renderTabContent(product.ingredient)}
              {tabIndex === 2 && renderTabContent(product.effect)}
              {tabIndex === 3 && renderTabContent(product.instructionManual)}
              {tabIndex === 4 && renderTabContent(product.productSpecifications)}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail;
