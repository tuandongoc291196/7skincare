import React, { useState } from "react";
import { Box, Typography, Divider, Grid, Tabs, Tab } from "@mui/material";
import { Product } from "@/types/schema/product";
import { Statuses } from "@/constants/status";
import { skinTypeMap } from "@/constants/skinTypes";

interface ProductDetailsViewProps {
  product: Product;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ product }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const renderTabContent = (content: string) => (
    <Typography
      mt={2}
      variant="body1"
      sx={{ lineHeight: 1.2, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
  const renderProductDetails = () => (
    <Box sx={{ mt: 2 }}>
      {product.productDetails.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center" p={2}>
          Không có chi tiết sản phẩm nào
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {product.productDetails.map(detail => (
            <Grid item xs={12} sm={6} md={4} key={detail.id}>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                  backgroundColor: "white",
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Dung tích: {detail.capacity}
                </Typography>
                <Typography variant="body2">
                  Giá:{" "}
                  {detail.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Typography>
                <Typography variant="body2">Số lượng: {detail.quantity}</Typography>
                <Typography variant="body2">
                  Ngày tạo: {new Date(detail.createdAt).toLocaleDateString("vi-VN")}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
  return (
    <>
      <Grid item xs={12} sm={7}>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" gap={3}>
          <Box flex={1} display="flex" justifyContent="space-between">
            <Box flex={1}>
              <Typography variant="body2" fontWeight={500}>
                Mã sản phẩm:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                Thương hiệu:
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
              <Typography variant="body2">{product.brand.name}</Typography>
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
        <Grid item xs={12}>
          <Typography variant="body2" fontWeight={500} mt={3}>
            Dung tích sản phẩm:
          </Typography>
          {renderProductDetails()}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
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
    </>
  );
};

export default ProductDetailsView;
