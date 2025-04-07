// src/components/brands/BrandsTableWithPagination.tsx
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
import { Statuses } from "@/constants/status";
import { Brand, BrandUpdate } from "@/types/schema/brand";
import { useAlert } from "@/hooks/useAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updateBrand } from "@/apis/brand";
import { AxiosError } from "axios";
import { Edit } from "@mui/icons-material";
import UpdateBrandDialog from "../dialog/UpdateBrandDialog";

interface BrandsTableProps {
  brands: Brand[];
  page: number;
  setPage: (page: number) => void;
}

const BrandsTable: React.FC<BrandsTableProps> = ({ brands, page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<BrandUpdate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const updateBrandMutation = useMutation({
    mutationKey: ["update-brand"],
    mutationFn: (data: BrandUpdate) => updateBrand(data),
    onSuccess: async () => {
      showAlert("Cập nhật thương hiệu thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-brands"] });
      setDialogOpen(false);
    },
    onError: (error: AxiosError) => {
      if (error?.status === 400 || error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Cập nhật thương hiệu thất bại", "error");
    },
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (brand: Brand) => {
    setBrand({
      id: brand.id,
      name: brand.name,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setBrand(null);
  };

  const handleUpdateBrand = () => {
    if (brand) {
      updateBrandMutation.mutate(brand);
    }
  };

  const handleInputChange = (field: keyof BrandUpdate, value: string) => {
    if (brand) {
      setBrand({ ...brand, [field]: value });
    }
  };

  const paginatedBrands = brands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên thương hiệu</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBrands.map(brand => (
              <TableRow key={brand.id}>
                <TableCell>{brand.id}</TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell align="center">
                  {new Date(brand.createdAt).toLocaleString("vi-VN")}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={brand.status === Statuses.ACTIVATED ? "Hoạt động" : "Vô hiệu hóa"}
                    color={brand.status === Statuses.ACTIVATED ? "success" : "error"}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(brand)}>
                    <Edit />
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
        count={brands.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />{" "}
      <UpdateBrandDialog
        brand={brand}
        dialogOpen={dialogOpen}
        handleCloseDialog={handleCloseDialog}
        handleInputChange={handleInputChange}
        handleUpdateBrand={handleUpdateBrand}
      />
    </>
  );
};

export default BrandsTable;
