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
import { Category, CategoryUpdate } from "@/types/schema/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "@/apis/category";
import { useAlert } from "@/hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Edit } from "@mui/icons-material";
import UpdateCategoryDialog from "../dialog/UpdateCategoryDialog";

interface CategoriesTableProps {
  categories: Category[];
  page: number;
  setPage: (page: number) => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({ categories, page, setPage }) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryUpdate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const updateCategoryMutation = useMutation({
    mutationKey: ["update-category"],
    mutationFn: (data: CategoryUpdate) => updateCategory(data),
    onSuccess: async () => {
      showAlert("Cập nhật danh mục thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-categories"] });
      setDialogOpen(false);
    },
    onError: (error: AxiosError) => {
      if (error?.status === 400 || error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Cập nhật danh mục thất bại", "error");
    },
  });

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (selectedCategory: Category) => {
    setCategory({
      description: selectedCategory.description,
      id: selectedCategory.id,
      name: selectedCategory.name,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCategory(null);
  };

  const handleUpdateCategory = () => {
    if (category) {
      updateCategoryMutation.mutate(category);
    }
  };

  const handleInputChange = (field: keyof CategoryUpdate, value: string) => {
    if (category) {
      setCategory({ ...category, [field]: value });
    }
  };

  const paginatedCategories = categories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map(category => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{new Date(category.createdAt).toLocaleString("vi-VN")}</TableCell>
                <TableCell>
                  <Chip
                    label={category.status === Statuses.ACTIVATED ? "Hoạt động" : "Vô hiệu hóa"}
                    color={category.status === Statuses.ACTIVATED ? "success" : "error"}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(category)}>
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
        count={categories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <UpdateCategoryDialog
        category={category}
        dialogOpen={dialogOpen}
        handleCloseDialog={handleCloseDialog}
        handleInputChange={handleInputChange}
        handleUpdateCategory={handleUpdateCategory}
      />
    </>
  );
};

export default CategoriesTable;
