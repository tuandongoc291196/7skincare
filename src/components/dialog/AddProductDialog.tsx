import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ProductCreate } from "@/types/schema/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createProduct } from "@/apis/product";
import { Category } from "@/types/schema/category";
import { Brand } from "@/types/schema/brand";
import { Image } from "@mui/icons-material";
import { useAlert } from "@/hooks/useAlert";
import useAuthStore from "@/hooks/useAuth";

interface AddProductDialogProps {
  open: boolean;
  handleClose: () => void;
  categories: Category[];
  brands: Brand[];
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  handleClose,
  brands,
  categories,
  isLoadingBrands,
  isLoadingCategories,
}) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newProduct, setNewProduct] = useState<ProductCreate>({
    accountId: user?.accountId as number,
    brandId: 0,
    categoryId: 0,
    description: "",
    image: "",
    name: "",
    price: 0,
    quantity: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setErrors({});
  }, [open]);

  const createProductMutation = useMutation({
    mutationKey: ["create-product"],
    mutationFn: (data: ProductCreate) => createProduct(data),
    onSuccess: async () => {
      showAlert("Thêm sản phẩm mới thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-products"] });
      setNewProduct({
        accountId: user?.accountId as number,
        brandId: 0,
        categoryId: 0,
        description: "",
        image: "",
        name: "",
        price: 0,
        quantity: 0,
      });
      setSelectedFile(null);
      setErrors({});
      handleClose();
    },
    onError: () => {
      showAlert("Thêm sản phẩm mới thất bại", "error");
    },
  });

  const handleChange = (event: { target: { name: string; value: string | number } }) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
        setErrors({ ...errors, image: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newProduct.name) newErrors.name = "Tên sản phẩm không được để trống";
    if (newProduct.price <= 0) newErrors.price = "Giá phải lớn hơn 0";
    if (newProduct.quantity < 0) newErrors.quantity = "Số lượng không được nhỏ hơn 0";
    if (newProduct.categoryId === 0) newErrors.categoryId = "Vui lòng chọn danh mục";
    if (newProduct.brandId === 0) newErrors.brandId = "Vui lòng chọn thương hiệu";
    if (!newProduct.image) newErrors.image = "Vui lòng chọn hình ảnh";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleCreate = async () => {
    if (validateFields()) {
      if (selectedFile) {
        const storageRef = ref(storage, `images/${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        if (downloadURL) {
          createProductMutation.mutate({ ...newProduct, image: downloadURL });
        }
      } else {
        createProductMutation.mutate(newProduct);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography fontSize={20} fontWeight={600}>
          Sản phẩm mới
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Box
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  borderRadius: 2,
                  border: errors.image ? "1px solid red" : "1px solid grey",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {newProduct.image ? (
                  <img
                    src={newProduct.image}
                    alt="New Product"
                    style={{ width: "100%", display: "block" }}
                  />
                ) : (
                  <Box display={"flex"} flexDirection={"column"} alignItems={"center"} gap={1}>
                    <Image color="action" sx={{ height: 50, width: 50 }} />
                    <Typography fontWeight={500} color="textSecondary">
                      Chọn hình ảnh
                    </Typography>
                  </Box>
                )}
              </Box>
            </label>
            {errors.image && (
              <Typography color="error" variant="caption">
                {errors.image}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={7}>
            {isLoadingBrands || isLoadingCategories ? (
              <Box
                display="flex"
                justifyContent="center"
                sx={{ alignItems: "center", height: "100%" }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                  margin="dense"
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="description"
                  value={newProduct.description}
                  onChange={handleChange}
                  margin="dense"
                  multiline
                  minRows={2}
                  maxRows={3}
                />
                <TextField
                  fullWidth
                  label="Giá (VNĐ)"
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value, 10) >= 0) handleChange(e);
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
                  fullWidth
                  label="Số lượng"
                  name="quantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value, 10) >= 0) handleChange(e);
                  }}
                  onKeyDown={e => {
                    if (e.key === "-" || e.key === "e") e.preventDefault();
                  }}
                  margin="dense"
                  inputProps={{ min: 0 }}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                />
                <FormControl fullWidth margin="dense" error={!!errors.categoryId}>
                  <InputLabel>Danh mục</InputLabel>
                  <Select name="categoryId" value={newProduct.categoryId} onChange={handleChange}>
                    <MenuItem value={0} disabled>
                      Chọn danh mục
                    </MenuItem>
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
                <FormControl fullWidth margin="dense" error={!!errors.brandId}>
                  <InputLabel>Thương hiệu</InputLabel>
                  <Select name="brandId" value={newProduct.brandId} onChange={handleChange}>
                    <MenuItem value={0} disabled>
                      Chọn thương hiệu
                    </MenuItem>
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
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="outlined">
          Đóng
        </Button>
        <Button
          onClick={handleCreate}
          color="primary"
          variant="contained"
          disabled={createProductMutation.isPending}
        >
          Tạo mới
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
