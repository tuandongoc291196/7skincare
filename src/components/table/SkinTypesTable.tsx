import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { SkinType } from "@/types/schema/skin-type";

interface SkinTypesTableProps {
  skinTypes: SkinType[];
  page: number;
  setPage: (page: number) => void;
}

const SkinTypesTable: React.FC<SkinTypesTableProps> = ({ skinTypes, page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginated = skinTypes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Loại da</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map(skinType => (
              <TableRow key={skinType.id}>
                <TableCell>{skinType.id}</TableCell>
                <TableCell>{skinType.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={skinTypes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default SkinTypesTable;
