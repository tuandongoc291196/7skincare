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
import { Order } from "@/types/schema/order";
import OrderDialog from "../dialog/OrderDialog";

interface OrderTrackingTableProps {
  orders: Order[];
  page: number;
  setPage: (page: number) => void;
}

const OrderTrackingTable: React.FC<OrderTrackingTableProps> = ({ orders, page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const paginated = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
              <TableCell align="center">Số lượng sản phẩm</TableCell>
              <TableCell align="center">Tổng tiền</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell align="center">
                  {new Date(order.createAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell align="center">{order.listProducts.length}</TableCell>
                <TableCell align="center">{order.totalPrice.toLocaleString()}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={order.status === "PENDING" ? "Đang xử lí" : "Vô hiệu hóa"}
                    color={order.status === "PENDING" ? "warning" : "error"}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(order)}>
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
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <OrderDialog open={open} onClose={handleCloseDialog} order={selectedOrder} />
    </>
  );
};

export default OrderTrackingTable;
