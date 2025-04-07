import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Statuses } from "@/constants/status";
import { Product } from "@/types/schema/product";
import ProductDialog from "../dialog/ProductDialog";
import { Brand } from "@/types/schema/brand";
import { Category } from "@/types/schema/category";
import { SkinType } from "@/types/schema/skin-type";

interface ProductsTableProps {
  products: Product[];
  page: number;
  setPage: (page: number) => void;
  categories: Category[];
  brands: Brand[];
  skins: SkinType[];
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
  isLoadingSkins: boolean;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  page,
  setPage,
  brands,
  categories,
  skins,
  isLoadingBrands,
  isLoadingCategories,
  isLoadingSkins,
}) => {
  console.log(products);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const paginated = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} sx={{ my: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
              <TableCell align="center">Danh mục</TableCell>
              <TableCell align="center">Thương hiệu</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell sx={{ width: 80, height: 80, overflow: "hidden" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover", border: "1px solid grey", borderRadius: "5px" }}
                  />
                </TableCell>
                <TableCell width={"30%"}>{product.name}</TableCell>
                <TableCell align="center">
                  {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell align="center">{product.category.name}</TableCell>
                <TableCell align="center">{product.brand.name}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={product.status === Statuses.ACTIVATED ? "Hoạt động" : "Vô hiệu hóa"}
                    color={product.status === Statuses.ACTIVATED ? "success" : "error"}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(product)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ProductDialog
        open={open}
        onClose={handleCloseDialog}
        product={selectedProduct}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        brands={brands}
        isLoadingBrands={isLoadingBrands}
        skins={skins}
        isLoadingSkins={isLoadingSkins}
      />
    </>
  );
};

export default ProductsTable;
