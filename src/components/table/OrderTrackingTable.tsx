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
import { OrderStatuses } from "@/constants/status";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, paymentOrder } from "@/apis/order";
import { useAlert } from "@/hooks/useAlert";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface OrderTrackingTableProps {
  orders: Order[];
  page: number;
  setPage: (page: number) => void;
  status: string;
}

const OrderTrackingTable: React.FC<OrderTrackingTableProps> = ({ orders, page, setPage }) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const payOrderMutation = useMutation({
    mutationKey: ["pay-order"],
    mutationFn: (id: number) => paymentOrder(id),
    onSuccess: async data => {
      window.location.href = data;
    },
    onError: (error: AxiosError) => {
      if (error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Thanh toán thất bại", "error");
    },
  });

  const cancelOrderMutation = useMutation({
    mutationKey: ["cancel-order"],
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: async () => {
      showAlert("Hủy đơn hàng thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-orders-by-account-id"] });
    },
    onError: (error: AxiosError) => {
      if (error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Hủy đơn hàng thất bại", "error");
    },
  });
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
  const handlePayment = (id: number) => {
    payOrderMutation.mutate(id);
  };
  const handleCancelOrder = (id: number) => {
    cancelOrderMutation.mutate(id);
  };
  const paginated = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const hasPendingOrders = orders.some(order => order.status === OrderStatuses.PENDING);

  return (
    <>
      <TableContainer component={Paper} sx={{ my: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
              <TableCell align="center">Tổng tiền (VNĐ)</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Chi tiết</TableCell>
              {hasPendingOrders && <TableCell align="center">Hành động</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell align="center">
                  {new Date(order.createAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell align="center">{order.totalPrice.toLocaleString()}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={
                      order.status === OrderStatuses.PENDING
                        ? "Đang xử lí"
                        : order.status === OrderStatuses.SUCCESS
                          ? "Hoàn Thành"
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
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(order)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
                {order.status === OrderStatuses.PENDING ? (
                  <TableCell align="center">
                    <Chip
                      sx={{
                        height: "24px",
                        borderRadius: "4px",
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
                      }}
                      variant="outlined"
                      label={"Thanh toán"}
                      color={"info"}
                      onClick={() => handlePayment(order.id)}
                    />

                    <Chip
                      sx={{
                        height: "24px",
                        borderRadius: "4px",
                        fontWeight: 600,
                        ml: 2,
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
                      }}
                      variant="outlined"
                      label={"Hủy"}
                      color={"error"}
                      onClick={() => handleCancelOrder(order.id)}
                    />
                  </TableCell>
                ) : (
                  hasPendingOrders && <TableCell></TableCell>
                )}
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
