import React from "react";
import { Box, Typography, Divider, Grid } from "@mui/material";
import { Product } from "@/types/schema/product";
import { Statuses } from "@/constants/status";
import { skinTypeMap } from "@/constants/skinTypes";

interface ProductDetailsViewProps {
  product: Product;
}
const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ product }) => (
  <Grid item xs={12} sm={7}>
    <Typography variant="h6" gutterBottom>
      {product.name}
    </Typography>
    <Typography variant="body2" gutterBottom textAlign="justify" color="textSecondary">
      {product.description}
    </Typography>
    <Divider sx={{ my: 2 }} />
    <Box display="flex" gap={3}>
      <Box flex={1} display="flex" justifyContent="space-between">
        <Box flex={1}>
          <Typography variant="body2" fontWeight={500}>
            Mã sản phẩm:
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            Giá:
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            Số lượng:
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            Danh mục:
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            Loại da:
          </Typography>
        </Box>
        <Box flex={1}>
          <Typography variant="body2">{product.id}</Typography>
          <Typography variant="body2">
            {new Intl.NumberFormat("vi-VN").format(product.price)} VNĐ
          </Typography>
          <Typography variant="body2">{product.quantity}</Typography>
          <Typography variant="body2">{product.category.name}</Typography>
          <Typography variant="body2">
            {typeof product.suitableFor === "string"
              ? product.suitableFor
                  .replace(/,\s*$/, "")
                  .split(", ")
                  .map(type => skinTypeMap[type.trim()] || type)
                  .join(", ")
              : product.suitableFor || ""}
          </Typography>
        </Box>
      </Box>
      <Box flex={1} display="flex" justifyContent="space-between">
        <Box flex={1}>
          <Typography variant="body2" fontWeight={500}>
            Thương hiệu:
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            Ngày tạo:
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            Người tạo:
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            Trạng thái:
          </Typography>
        </Box>
        <Box flex={1}>
          <Typography variant="body2">{product.brand.name}</Typography>
          <Typography variant="body2">
            {new Date(product.createdAt).toLocaleDateString("vi-VN")}
          </Typography>
          <Typography variant="body2">{product.createdBy}</Typography>
          <Typography
            variant="body2"
            color={product.status === Statuses.ACTIVATED ? "success" : "error"}
          >
            {product.status === Statuses.ACTIVATED ? "Hoạt động" : "Vô hiệu hóa"}
          </Typography>
        </Box>
      </Box>
    </Box>
  </Grid>
);
export default ProductDetailsView;
