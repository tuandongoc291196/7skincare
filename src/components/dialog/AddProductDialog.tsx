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
  IconButton,
} from "@mui/material";
import { ProductCreate, ProductDetails } from "@/types/schema/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createProduct } from "@/apis/product";
import { Category } from "@/types/schema/category";
import { Brand } from "@/types/schema/brand";
import { Image, Add, Delete } from "@mui/icons-material";
import { useAlert } from "@/hooks/useAlert";
import useAuthStore from "@/hooks/useAuth";
import { SkinType } from "@/types/schema/skin-type";
import { skinTypeMap } from "@/constants/skinTypes";

interface AddProductDialogProps {
  open: boolean;
  handleClose: () => void;
  categories: Category[];
  brands: Brand[];
  skins: SkinType[];
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
  isLoadingSkins: boolean;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  handleClose,
  brands,
  skins,
  categories,
  isLoadingBrands,
  isLoadingCategories,
  isLoadingSkins,
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
    skinTypeId: [],
    effect: "",
    ingredient: "",
    instructionManual: "",
    productSpecifications: "",
    productDetails: [
      {
        price: 0,
        capacity: "",
        quantity: 0,
      },
    ],
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
      resetForm();
      handleClose();
    },
    onError: () => {
      showAlert("Thêm sản phẩm mới thất bại", "error");
    },
  });

  const resetForm = () => {
    setNewProduct({
      accountId: user?.accountId as number,
      brandId: 0,
      categoryId: 0,
      description: "",
      image: "",
      name: "",
      skinTypeId: [],
      effect: "",
      ingredient: "",
      instructionManual: "",
      productSpecifications: "",
      productDetails: [],
    });
    setSelectedFile(null);
    setErrors({});
  };

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

  const handleProductDetailChange = (
    index: number,
    field: keyof ProductDetails,
    value: string | number
  ) => {
    const updatedDetails = [...newProduct.productDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setNewProduct({ ...newProduct, productDetails: updatedDetails });
    // Clear error when field changes
    if (errors[`detail_${index}_${field}`]) {
      setErrors({ ...errors, [`detail_${index}_${field}`]: "" });
    }
  };

  const addProductDetail = () => {
    setNewProduct({
      ...newProduct,
      productDetails: [
        ...newProduct.productDetails,
        {
          price: 0,
          capacity: "",
          quantity: 0,
        },
      ],
    });
  };

  const removeProductDetail = (index: number) => {
    const updatedDetails = newProduct.productDetails.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, productDetails: updatedDetails });
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`detail_${index}_`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newProduct.name) newErrors.name = "Tên sản phẩm không được để trống";
    if (newProduct.categoryId === 0) newErrors.categoryId = "Vui lòng chọn danh mục";
    if (newProduct.brandId === 0) newErrors.brandId = "Vui lòng chọn thương hiệu";
    if (!newProduct.image) newErrors.image = "Vui lòng chọn hình ảnh";
    if (!newProduct.effect) newErrors.effect = "Công dụng không được để trống";
    if (!newProduct.ingredient) newErrors.ingredient = "Thành phần không được để trống";
    if (!newProduct.description) newErrors.description = "Mô tả không được để trống";
    if (!newProduct.instructionManual)
      newErrors.instructionManual = "Hướng dẫn sử dụng không được để trống";
    if (!newProduct.productSpecifications)
      newErrors.productSpecifications = "Thông số sản phẩm không được để trống";
    if (newProduct.skinTypeId.length === 0)
      newErrors.skinTypeId = "Vui lòng chọn ít nhất một loại da";

    // Validate product details
    const capacities = new Set<string>();
    newProduct.productDetails.forEach((detail, index) => {
      if (!detail.capacity) {
        newErrors[`detail_${index}_capacity`] = "Dung tích không được để trống";
      } else if (capacities.has(detail.capacity)) {
        newErrors[`detail_${index}_capacity`] = "Dung tích không được trùng lặp";
      } else {
        capacities.add(detail.capacity);
      }

      if (detail.price <= 0) newErrors[`detail_${index}_price`] = "Giá phải lớn hơn 0";
      if (detail.quantity < 0)
        newErrors[`detail_${index}_quantity`] = "Số lượng không được nhỏ hơn 0";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          <Grid item xs={12} sm={4}>
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
                  height: "300px",
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
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
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
          <Grid item xs={12} sm={8}>
            {isLoadingBrands || isLoadingCategories || isLoadingSkins ? (
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
                  size="small"
                  fullWidth
                  label="Tên sản phẩm"
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                  margin="dense"
                  error={!!errors.name}
                  helperText={errors.name}
                />

                <FormControl size="small" fullWidth margin="dense" error={!!errors.categoryId}>
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
                <FormControl size="small" fullWidth margin="dense" error={!!errors.brandId}>
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
                <FormControl size="small" fullWidth margin="dense" error={!!errors.skinTypeId}>
                  <InputLabel>Chọn loại da</InputLabel>
                  <Select
                    multiple
                    name="skinTypeId"
                    value={newProduct.skinTypeId}
                    onChange={event => {
                      const value = event.target.value as number[];
                      setNewProduct({ ...newProduct, skinTypeId: value });
                      if (errors.skinTypeId) setErrors({ ...errors, skinTypeId: "" });
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
                  value={newProduct.description}
                  onChange={handleChange}
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
                  value={newProduct.ingredient}
                  onChange={handleChange}
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
                  value={newProduct.effect}
                  onChange={handleChange}
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
                  value={newProduct.instructionManual}
                  onChange={handleChange}
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
                  value={newProduct.productSpecifications}
                  onChange={handleChange}
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
                    <Button
                      startIcon={<Add />}
                      onClick={addProductDetail}
                      size="small"
                      variant="outlined"
                    >
                      Thêm
                    </Button>
                  </Box>
                  {newProduct.productDetails.map((detail, index) => (
                    <Box key={index} mb={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Dung tích"
                            value={detail.capacity}
                            onChange={e =>
                              handleProductDetailChange(index, "capacity", e.target.value)
                            }
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
                                handleProductDetailChange(
                                  index,
                                  "quantity",
                                  parseInt(e.target.value)
                                );
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
                          <IconButton onClick={() => removeProductDetail(index)} color="error">
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
