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
import { OrderStatuses } from "@/constants/status";
import { Order } from "@/types/schema/order";

interface OrdersTableProps {
  orders: Order[];
  page: number;
  setPage: (page: number) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
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
              <TableCell>Sản phẩm</TableCell>
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
                        : order.status === OrderStatuses.COMPLETED
                          ? "Hoàn thành"
                          : "Thất bại"
                    }
                    color={
                      order.status === OrderStatuses.PENDING
                        ? "warning"
                        : order.status === OrderStatuses.COMPLETED
                          ? "success"
                          : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  {order.listProducts.map(product => (
                    <div key={product.id}>
                      {product.productResponse.name} - {product.quantity} x {product.price}
                    </div>
                  ))}
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
    </>
  );
};

export default OrdersTable;
