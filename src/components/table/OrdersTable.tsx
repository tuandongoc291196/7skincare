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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveOrder, doneOrder, rejectOrder } from "@/apis/order";
import { AxiosError } from "axios";
import { useAlert } from "@/hooks/useAlert";
import { useNavigate, useSearchParams } from "react-router-dom";
import RejectReasonDialog from "../dialog/RejectReasonDialog";

interface OrdersTableProps {
  orders: Order[];
  page: number;
  setPage: (page: number) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, page, setPage }) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFromUrl = searchParams.get("status") || "All";
  const idFromUrl = searchParams.get("id");
  const [statusFilter, setStatusFilter] = useState<string>(statusFromUrl);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [id, setId] = useState<number>();
  const [reason, setReason] = useState("");
  const [openRejectReason, setOpenRejectReason] = useState(false);
  const approveOrderMutation = useMutation({
    mutationKey: ["approve-order"],
    mutationFn: (id: number) => approveOrder(id),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: ["get-orders"] });
      showAlert("Chấp nhận đơn hàng thành công", "success");
      window.location.href = `/quan-ly-don-hang?id=${data.data.id}`;
    },
    onError: (error: AxiosError) => {
      if (error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Thanh toán thất bại", "error");
    },
  });
  const doneOrderMutation = useMutation({
    mutationKey: ["done-order"],
    mutationFn: (id: number) => doneOrder(id),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: ["get-orders"] });
      showAlert("Xác nhận giao hàng thành công", "success");
      window.location.href = `/quan-ly-don-hang?id=${data.data.id}`;
    },
    onError: (error: AxiosError) => {
      if (error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Thanh toán thất bại", "error");
    },
  });
  const rejectOrderMutation = useMutation({
    mutationKey: ["cancel-order"],
    mutationFn: (data: { id: number; reason: string }) => rejectOrder(data.id, data.reason),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: ["get-orders"] });
      setId(undefined);
      setOpenRejectReason(false);
      setReason("");
      showAlert("Từ chối đơn hàng thành công", "success");
      window.location.href = `/quan-ly-don-hang?id=${data.data.id}`;
    },
    onError: (error: AxiosError) => {
      if (error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Hủy đơn hàng thất bại", "error");
    },
  });
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setStatusFilter(newValue);
    setPage(0);
    setSearchParams({ status: newValue });
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
  const handleReject = (id: number, reason: string) => {
    rejectOrderMutation.mutate({ id, reason });
  };
  const handleApprove = (id: number) => {
    approveOrderMutation.mutate(id);
  };
  const handleDone = (id: number) => {
    doneOrderMutation.mutate(id);
  };
  // Filter orders based on the selected status
  const filteredOrders =
    orders?.filter((order: Order) => {
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      const matchesId = idFromUrl ? order.id === parseInt(idFromUrl) : true;

      return matchesStatus && matchesId;
    }) || [];
  const reversedOrders = [...filteredOrders].reverse();

  // Paginate orders
  const paginatedOrders = reversedOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const isShowingActions = reversedOrders.some(
    order => order.status === OrderStatuses.PENDING || order.status === OrderStatuses.SUCCESS
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
          <Tab label="Chờ thanh toán" value={OrderStatuses.APPROVED} />
          <Tab label="Đã thanh toán" value={OrderStatuses.SUCCESS} />
          <Tab label="Giao hàng thành công" value={OrderStatuses.DONE} />
          <Tab label="Bị từ chối" value={OrderStatuses.REJECTED} />
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
              {isShowingActions && <TableCell align="center">Hành động</TableCell>}
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
                        : order.status === OrderStatuses.APPROVED
                          ? "Đã phê duyệt"
                          : order.status === OrderStatuses.SUCCESS
                            ? "Đã thanh toán"
                            : order.status === OrderStatuses.DONE
                              ? "Giao hàng thành công"
                              : order.status === OrderStatuses.REJECTED
                                ? "Bị từ chối"
                                : "Thất bại"
                    }
                    color={
                      order.status === OrderStatuses.PENDING
                        ? "warning"
                        : order.status === OrderStatuses.APPROVED
                          ? "primary"
                          : order.status === OrderStatuses.SUCCESS
                            ? "secondary"
                            : order.status === OrderStatuses.DONE
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
                      label={"Chấp nhận"}
                      color={"secondary"}
                      onClick={() => handleApprove(order.id)}
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
                      label={"Từ chối"}
                      color={"error"}
                      onClick={() => {
                        setId(order.id);
                        setOpenRejectReason(true);
                      }}
                    />
                  </TableCell>
                ) : order.status === OrderStatuses.SUCCESS ? (
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
                      label={"Xác nhận giao hàng"}
                      color={"success"}
                      onClick={() => handleDone(order.id)}
                    />
                  </TableCell>
                ) : (
                  isShowingActions && <TableCell></TableCell>
                )}
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
      <RejectReasonDialog
        open={openRejectReason}
        handleClose={() => setOpenRejectReason(false)}
        setReason={setReason}
        reason={reason}
        onReject={handleReject}
        orderId={id}
      />
    </>
  );
};

export default OrdersTable;
