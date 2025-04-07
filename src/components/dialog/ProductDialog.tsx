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
import { Product, ProductDetails, ProductUpdate } from "@/types/schema/product";
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
import { SkinType } from "@/types/schema/skin-type";

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  brands: Brand[];
  skins: SkinType[];
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
  isLoadingSkins: boolean;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onClose,
  product,
  brands,
  categories,
  skins,
  isLoadingBrands,
  isLoadingCategories,
  isLoadingSkins,
}) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState<ProductUpdate | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateProductMutation = useMutation({
    mutationKey: ["update-product"],
    mutationFn: (data: ProductUpdate) => updateProduct(data),
    onSuccess: async () => {
      showAlert("Cập nhật sản phẩm thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-products"] });
      setIsEditing(false);
      setErrors({});
    },
    onError: () => {
      showAlert("Cập nhật sản phẩm thất bại", "error");
    },
  });

  const getSkinIdsFromSuitableFor = (
    suitableFor: string,
    skins: { id: number; type: string }[]
  ): number[] => {
    if (typeof suitableFor !== "string") return [];
    return suitableFor
      .replace(/,\s*$/, "")
      .split(", ")
      .map(type => {
        const skin = skins.find(s => s.type === type.trim());
        return skin ? skin.id : null;
      })
      .filter((id): id is number => id !== null);
  };

  useEffect(() => {
    setIsEditing(false);
    setUpdatedProduct(null);
    setSelectedFile(null);
    setErrors({});
  }, []);

  useEffect(() => {
    if (product) {
      setUpdatedProduct({
        brandId: product.brand?.id as number,
        categoryId: product.category?.id as number,
        description: product.description || "",
        id: product.id as number,
        image: product.image || "",
        name: product.name || "",
        skinTypeId: getSkinIdsFromSuitableFor(product.suitableFor || "", skins),
        effect: product.effect || "",
        ingredient: product.ingredient || "",
        instructionManual: product.instructionManual || "",
        productSpecifications: product.productSpecifications || "",
        productDetails: product.productDetails.map(detail => ({
          id: detail.id,
          price: detail.price,
          quantity: detail.quantity,
          capacity: detail.capacity,
        })),
      });
    }
  }, [product, isEditing]);

  const handleChange = (event: { target: { name: string; value: string | number | number[] } }) => {
    if (updatedProduct) {
      setUpdatedProduct({ ...updatedProduct, [event.target.name]: event.target.value });
      if (errors[event.target.name]) {
        setErrors({ ...errors, [event.target.name]: "" });
      }
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

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!updatedProduct?.name) newErrors.name = "Tên sản phẩm không được để trống";
    if (!updatedProduct?.brandId) newErrors.brandId = "Vui lòng chọn thương hiệu";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductDetailChange = (
    index: number,
    field: keyof ProductDetails,
    value: string | number
  ) => {
    if (!updatedProduct) return;
    const updatedDetails = [...updatedProduct.productDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setUpdatedProduct({ ...updatedProduct, productDetails: updatedDetails });
    if (errors[`detail_${index}_${field}`]) {
      setErrors({ ...errors, [`detail_${index}_${field}`]: "" });
    }
  };

  const removeProductDetail = (index: number) => {
    if (!updatedProduct) return;
    const updatedDetails = updatedProduct.productDetails.filter((_, i) => i !== index);
    setUpdatedProduct({ ...updatedProduct, productDetails: updatedDetails });
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`detail_${index}_`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };
  const addProductDetail = () => {
    if (!updatedProduct) return;
    setUpdatedProduct({
      ...updatedProduct,
      productDetails: [
        ...updatedProduct.productDetails,
        {
          id: 0,
          price: 0,
          capacity: "",
          quantity: 0,
        },
      ],
    });
  };
  const handleSave = async () => {
    if (validateFields())
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
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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
              skins={skins}
              isLoadingSkins={isLoadingSkins}
              isLoadingCategories={isLoadingCategories}
              isLoadingBrands={isLoadingBrands}
              onChange={handleChange}
              errors={errors}
              handleProductDetailChange={handleProductDetailChange}
              removeProductDetail={removeProductDetail}
              addProductDetail={addProductDetail}
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
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={updateProductMutation.isPending}
          >
            Lưu
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
