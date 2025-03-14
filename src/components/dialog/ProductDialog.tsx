import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { Product, ProductUpdate } from "@/types/schema/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProduct } from "@/apis/product";
import ProductImage from "./product/ProductImage";
import ProductDetailsView from "./product/ProductDetails";
import ProductEditForm from "./product/ProductEditForm";
import { Category } from "@/types/schema/category";
import { Brand } from "@/types/schema/brand";
import { useAlert } from "@/hooks/useAlert";

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  brands: Brand[];
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
}
const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onClose,
  product,
  brands,
  categories,
  isLoadingBrands,
  isLoadingCategories,
}) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState<ProductUpdate | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const updateProductMutation = useMutation({
    mutationKey: ["update-product"],
    mutationFn: (data: ProductUpdate) => updateProduct(data),
    onSuccess: async () => {
      showAlert("Cập nhật sản phẩm thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-products"] });
      setIsEditing(false);
    },
    onError: () => {
      showAlert("Cập nhật sản phẩm thất bại", "error");
    },
  });

  useEffect(() => {
    setUpdatedProduct({
      brandId: product?.brand.id as number,
      categoryId: product?.category.id as number,
      description: product?.description as string,
      id: product?.id as number,
      image: product?.image as string,
      name: product?.name as string,
      price: product?.price as number,
      quantity: product?.quantity as number,
    });
  }, [product, isEditing]);

  const handleChange = (event: { target: { name: string; value: string | number } }) => {
    if (updatedProduct) {
      setUpdatedProduct({ ...updatedProduct, [event.target.name]: event.target.value });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedProduct && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedProduct({ ...updatedProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (updatedProduct) {
      if (selectedFile) {
        const storageRef = ref(storage, `images/${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        if (downloadURL) updateProductMutation.mutate({ ...updatedProduct, image: downloadURL });
      } else {
        updateProductMutation.mutate(updatedProduct);
      }
    }
  };

  if (!updatedProduct || !product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography fontSize={20} fontWeight={600}>
          {isEditing ? "Chỉnh sửa sản phẩm" : "Chi tiết sản phẩm"}
        </Typography>
        <IconButton onClick={() => setIsEditing(!isEditing)} style={{ marginLeft: "auto" }}>
          {isEditing ? <ArrowBack /> : <Edit />}
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <ProductImage
            isEditing={isEditing}
            image={updatedProduct.image || product.image}
            productName={product.name}
            onImageChange={handleImageChange}
          />
          {isEditing ? (
            <ProductEditForm
              updatedProduct={updatedProduct}
              categories={categories}
              brands={brands}
              isLoadingCategories={isLoadingCategories}
              isLoadingBrands={isLoadingBrands}
              onChange={handleChange}
            />
          ) : (
            <ProductDetailsView product={product} />
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Đóng
        </Button>
        {isEditing && (
          <Button onClick={handleSave} color="primary" variant="contained">
            Lưu
          </Button>
        )}
      </DialogActions>{" "}
    </Dialog>
  );
};

export default ProductDialog;
