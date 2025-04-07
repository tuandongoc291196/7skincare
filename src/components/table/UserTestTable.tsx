import { skinTypeMap } from "@/constants/skinTypes";
import { UserTest } from "@/types/schema/skin-test";
import { Visibility } from "@mui/icons-material";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import UserTestDetailDialog from "../dialog/UserTestDetailDialog";

interface UserTestTableProps {
  data: UserTest[];
  page: number;
  setPage: (page: number) => void;
}
const UserTestTable = ({ page, setPage, data }: UserTestTableProps) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [id, setId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenDialog = (id: number) => {
    setId(id);
    setDialogOpen(true);
  };
  const paginated = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ngày kiểm tra</TableCell>
            <TableCell>Tổng điểm</TableCell>
            <TableCell>Thời gian</TableCell>
            <TableCell>Loại da</TableCell>
            <TableCell align="center">Chi tiết</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map(test => (
            <TableRow key={test.id}>
              <TableCell>{new Date(test.createdAt).toLocaleString("vi-vn")}</TableCell>
              <TableCell>
                {test.totalPoint}/{test.maxPoint}
              </TableCell>
              <TableCell>{test.testTime}</TableCell>
              <TableCell>{skinTypeMap[test.skinType.type]}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleOpenDialog(test.id)}>
                  <Visibility />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {id && (
        <UserTestDetailDialog id={id} handleClose={() => setDialogOpen(false)} open={dialogOpen} />
      )}
    </TableContainer>
  );
};

export default UserTestTable;
