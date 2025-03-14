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
import { Position } from "@/types/schema/position";

interface PositionsTableProps {
  positions: Position[];
  page: number;
  setPage: (page: number) => void;
}

const PositionsTable: React.FC<PositionsTableProps> = ({ positions, page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPositions = positions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên vị trí</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPositions.map(position => (
              <TableRow key={position.id}>
                <TableCell>{position.id}</TableCell>
                <TableCell>{position.name}</TableCell>
                <TableCell>{new Date(position.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={position.status === Statuses.ACTIVATED ? "Hoạt động" : "Vô hiệu hóa"}
                    color={position.status === Statuses.ACTIVATED ? "success" : "error"}
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
        count={positions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default PositionsTable;
