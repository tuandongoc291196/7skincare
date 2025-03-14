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
} from "@mui/material";
import { ProductUpdate } from "@/types/schema/product";
import { Category } from "@/types/schema/category";
import { Brand } from "@/types/schema/brand";

interface ProductEditFormProps {
  updatedProduct: ProductUpdate;
  categories: Category[] | undefined;
  brands: Brand[] | undefined;
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
  onChange: (event: { target: { name: string; value: string | number } }) => void;
}
const ProductEditForm: React.FC<ProductEditFormProps> = ({
  updatedProduct,
  categories,
  brands,
  isLoadingCategories,
  isLoadingBrands,
  onChange,
}) => (
  <Grid item xs={12} sm={7}>
    {isLoadingBrands || isLoadingCategories ? (
      <Box display="flex" justifyContent="center" sx={{ alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    ) : (
      <>
        <TextField
          fullWidth
          label="Tên sản phẩm"
          name="name"
          value={updatedProduct.name}
          onChange={onChange}
          margin="dense"
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
        />
        <TextField
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
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Danh mục</InputLabel>
          <Select name="categoryId" value={updatedProduct.categoryId} onChange={onChange}>
            {categories?.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Thương hiệu</InputLabel>
          <Select name="brandId" value={updatedProduct.brandId} onChange={onChange}>
            {brands?.map(brand => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    )}
  </Grid>
);
export default ProductEditForm;
