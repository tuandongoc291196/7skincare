import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  CircularProgress,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { ProductDetails, ProductUpdate } from "@/types/schema/product";
import { Category } from "@/types/schema/category";
import { Brand } from "@/types/schema/brand";
import { SkinType } from "@/types/schema/skin-type";
import { skinTypeMap } from "@/constants/skinTypes";
import { Add, Delete } from "@mui/icons-material";

interface ProductEditFormProps {
  updatedProduct: ProductUpdate;
  categories: Category[] | undefined;
  brands: Brand[] | undefined;
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
  onChange: (event: { target: { name: string; value: string | number | number[] } }) => void;
  skins: SkinType[];
  isLoadingSkins: boolean;
  errors?: { [key: string]: string };
  handleProductDetailChange: (
    index: number,
    field: keyof ProductDetails,
    value: string | number
  ) => void;
  removeProductDetail: (index: number) => void;
  addProductDetail: () => void;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({
  updatedProduct,
  categories,
  brands,
  isLoadingCategories,
  isLoadingBrands,
  onChange,
  skins,
  isLoadingSkins,
  errors = {},
  handleProductDetailChange,
  removeProductDetail,
  addProductDetail,
}) => (
  <Grid item xs={12} sm={7}>
    {isLoadingBrands || isLoadingCategories || isLoadingSkins ? (
      <Box display="flex" justifyContent="center" sx={{ alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    ) : (
      <>
        <TextField
          size="small"
          fullWidth
          label="Tên sản phẩm"
          name="name"
          value={updatedProduct.name}
          onChange={onChange}
          margin="dense"
          error={!!errors.name}
          helperText={errors.name}
        />
        <FormControl size="small" fullWidth margin="dense" error={!!errors.categoryId}>
          <InputLabel>Danh mục</InputLabel>
          <Select name="categoryId" value={updatedProduct.categoryId} onChange={onChange}>
            {categories?.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {errors.categoryId && (
            <Typography color="error" variant="caption">
              {errors.categoryId}
            </Typography>
          )}
        </FormControl>
        <FormControl size="small" fullWidth margin="dense" error={!!errors.brandId}>
          <InputLabel>Thương hiệu</InputLabel>
          <Select name="brandId" value={updatedProduct.brandId} onChange={onChange}>
            {brands?.map(brand => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
          {errors.brandId && (
            <Typography color="error" variant="caption">
              {errors.brandId}
            </Typography>
          )}
        </FormControl>
        <FormControl size="small" fullWidth margin="dense" error={!!errors.skinTypeId}>
          <InputLabel>Chọn loại da</InputLabel>
          <Select
            multiple
            name="skinTypeId"
            value={updatedProduct.skinTypeId}
            onChange={event => {
              const value = event.target.value as number[];
              onChange({ target: { name: "skinTypeId", value } });
            }}
            renderValue={selected =>
              skins
                .filter(skin => selected.includes(skin.id))
                .map(skin => skinTypeMap[skin.type] || skin.type)
                .join(", ")
            }
          >
            {skins.map(skin => (
              <MenuItem key={skin.id} value={skin.id}>
                {skinTypeMap[skin.type] || skin.type}
              </MenuItem>
            ))}
          </Select>
          {errors.skinTypeId && (
            <Typography color="error" variant="caption">
              {errors.skinTypeId}
            </Typography>
          )}
        </FormControl>
        <TextField
          size="small"
          fullWidth
          label="Mô tả"
          name="description"
          value={updatedProduct.description}
          onChange={onChange}
          margin="dense"
          multiline
          minRows={2}
          maxRows={4}
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          size="small"
          fullWidth
          label="Thành phần"
          name="ingredient"
          value={updatedProduct.ingredient}
          onChange={onChange}
          margin="dense"
          multiline
          minRows={2}
          maxRows={4}
          error={!!errors.ingredient}
          helperText={errors.ingredient}
        />
        <TextField
          size="small"
          fullWidth
          label="Công dụng"
          name="effect"
          value={updatedProduct.effect}
          onChange={onChange}
          margin="dense"
          multiline
          minRows={2}
          maxRows={4}
          error={!!errors.effect}
          helperText={errors.effect}
        />
        <TextField
          size="small"
          fullWidth
          label="Hướng dẫn sử dụng"
          name="instructionManual"
          value={updatedProduct.instructionManual}
          onChange={onChange}
          margin="dense"
          multiline
          minRows={2}
          maxRows={4}
          error={!!errors.instructionManual}
          helperText={errors.instructionManual}
        />
        <TextField
          size="small"
          fullWidth
          label="Thông số sản phẩm"
          name="productSpecifications"
          value={updatedProduct.productSpecifications}
          onChange={onChange}
          margin="dense"
          multiline
          minRows={2}
          maxRows={4}
          error={!!errors.productSpecifications}
          helperText={errors.productSpecifications}
        />
        {/* Product Details Section */}
        <Box mt={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography fontWeight={500}>Chi tiết sản phẩm</Typography>
            <Button startIcon={<Add />} onClick={addProductDetail} size="small" variant="outlined">
              Thêm
            </Button>
          </Box>
          {updatedProduct.productDetails.map((detail, index) => (
            <Box key={index} mb={2}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Dung tích"
                    value={detail.capacity}
                    onChange={e => handleProductDetailChange(index, "capacity", e.target.value)}
                    error={!!errors[`detail_${index}_capacity`]}
                    helperText={errors[`detail_${index}_capacity`]}
                  />
                </Grid>
                <Grid item xs={3.5}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Giá"
                    type="number"
                    value={detail.price}
                    onChange={e => {
                      const value = e.target.value;
                      if (value === "" || parseInt(value, 10) >= 0)
                        handleProductDetailChange(index, "price", e.target.value);
                    }}
                    onKeyDown={e => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    inputProps={{ min: 0 }}
                    error={!!errors[`detail_${index}_price`]}
                    helperText={errors[`detail_${index}_price`]}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Số lượng"
                    type="number"
                    value={detail.quantity}
                    onChange={e => {
                      const value = e.target.value;
                      if (value === "" || parseInt(value, 10) >= 0)
                        handleProductDetailChange(index, "quantity", parseInt(e.target.value));
                    }}
                    onKeyDown={e => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    inputProps={{ min: 0 }}
                    error={!!errors[`detail_${index}_quantity`]}
                    helperText={errors[`detail_${index}_quantity`]}
                  />
                </Grid>
                <Grid item xs={1.5}>
                  <IconButton
                    onClick={() => removeProductDetail(index)}
                    color="error"
                    disabled={detail.id !== 0} // Only enable delete when id is 0
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      </>
    )}
  </Grid>
);

export default ProductEditForm;
