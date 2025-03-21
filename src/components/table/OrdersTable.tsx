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
  Tabs,
  Tab,
  Box,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { OrderStatuses } from "@/constants/status";
import { Order } from "@/types/schema/order";
import OrderDetailDialog from "../dialog/OrderDetailDialog";

interface OrdersTableProps {
  orders: Order[];
  page: number;
  setPage: (page: number) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setStatusFilter(newValue);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetailDialog = (order: Order) => {
    setSelectedOrder(order);
  };

  // Filter orders based on the selected status
  const filteredOrders =
    statusFilter === "All" ? orders : orders.filter(order => order.status === statusFilter);

  // Paginate orders
  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      {/* Tabs for Filtering */}
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={statusFilter}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tất cả" value="All" />
          <Tab label="Chờ xử lý" value={OrderStatuses.PENDING} />
          <Tab label="Hoàn thành" value={OrderStatuses.SUCCESS} />
          <Tab label="Thất bại" value={OrderStatuses.CANCELED} />
        </Tabs>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper} sx={{ marginBottom: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Tổng giá</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{new Date(order.createAt).toLocaleString("vi-VN")}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.phoneNumber}</TableCell>
                <TableCell>{order.totalPrice.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      order.status === OrderStatuses.PENDING
                        ? "Chờ xử lý"
                        : order.status === OrderStatuses.SUCCESS
                          ? "Hoàn thành"
                          : "Thất bại"
                    }
                    color={
                      order.status === OrderStatuses.PENDING
                        ? "warning"
                        : order.status === OrderStatuses.SUCCESS
                          ? "success"
                          : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDetailDialog(order)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <OrderDetailDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  );
};

export default OrdersTable;
