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
} from "@mui/material";
import { ProductUpdate } from "@/types/schema/product";
import { Category } from "@/types/schema/category";
import { Brand } from "@/types/schema/brand";
import { SkinType } from "@/types/schema/skin-type";
import { skinTypeMap } from "@/constants/skinTypes";

interface ProductEditFormProps {
  updatedProduct: ProductUpdate;
  categories: Category[] | undefined;
  brands: Brand[] | undefined;
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
  onChange: (event: { target: { name: string; value: string | number | number[] } }) => void; // Updated to handle arrays
  skins: SkinType[];
  isLoadingSkins: boolean;
  errors?: { [key: string]: string }; // Optional prop for validation errors
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
        <TextField
          fullWidth
          label="Mô tả"
          name="description"
          value={updatedProduct.description}
          onChange={onChange}
          margin="dense"
          multiline
        />
        <TextField
          size="small"
          fullWidth
          label="Giá (VNĐ)"
          name="price"
          type="number"
          value={updatedProduct.price}
          onChange={e => {
            const value = e.target.value;
            if (value === "" || parseInt(value, 10) >= 0) onChange(e);
          }}
          onKeyDown={e => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          margin="dense"
          inputProps={{ min: 0, step: 500 }}
          error={!!errors.price}
          helperText={errors.price}
        />
        <TextField
          size="small"
          fullWidth
          label="Số lượng"
          name="quantity"
          type="number"
          value={updatedProduct.quantity}
          onChange={e => {
            const value = e.target.value;
            if (value === "" || parseInt(value, 10) >= 0) onChange(e);
          }}
          onKeyDown={e => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          margin="dense"
          inputProps={{ min: 0 }}
          error={!!errors.quantity}
          helperText={errors.quantity}
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
      </>
    )}
  </Grid>
);

export default ProductEditForm;
