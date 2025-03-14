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
} from "@mui/material";
import { Statuses } from "@/constants/status";
import { Category } from "@/types/schema/category";

interface CategoriesTableProps {
  categories: Category[];
  page: number;
  setPage: (page: number) => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({ categories, page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
              <TableCell>Mô tả</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map(categories => (
              <TableRow key={categories.id}>
                <TableCell>{categories.id}</TableCell>
                <TableCell>{categories.name}</TableCell>
                <TableCell>{categories.description}</TableCell>
                <TableCell>{new Date(categories.createdAt).toLocaleString()}</TableCell>{" "}
                <TableCell>
                  <Chip
                    label={categories.status === Statuses.ACTIVATED ? "Hoạt động" : "Vô hiệu hóa"}
                    color={categories.status === Statuses.ACTIVATED ? "success" : "error"}
                  />
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
    </>
  );
};

export default CategoriesTable;
