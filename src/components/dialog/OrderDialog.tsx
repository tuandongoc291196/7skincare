import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Box,
  useTheme,
  Chip,
} from "@mui/material";
import { Order } from "@/types/schema/order";
import useAuthStore from "@/hooks/useAuth";
import { OrderStatuses } from "@/constants/status";
import { useQuery } from "@tanstack/react-query";
import { getStatusHistory } from "@/apis/order";
import OrderStatusHistorySteps from "../step/OrderStatusHistorySteps";

interface OrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDialog: React.FC<OrderDialogProps> = ({ open, onClose, order }) => {
  const theme = useTheme();
  const { user } = useAuthStore();

  const { data: steps, isLoading: isLoadingSteps } = useQuery({
    queryKey: ["get-steps-by-order-id"],
    queryFn: () => getStatusHistory(order?.id ?? 0),
    enabled: !!order,
  });

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography fontSize={20} fontWeight={600}>
          Chi tiết đơn hàng
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {!isLoadingSteps && steps.length > 0 && <OrderStatusHistorySteps steps={steps} />}
          <Grid item xs={12}>
            <Typography>
              <strong>Người nhận:</strong> {user?.name}
            </Typography>
            <Typography>
              <strong>Địa chỉ:</strong> {order.address}
            </Typography>
            <Typography>
              <strong>Số điện thoại:</strong> {order.phoneNumber}
            </Typography>
            <Typography>
              <strong>Phí vận chuyển:</strong> 25,000 VNĐ
            </Typography>
            <Typography>
              <strong>Tổng giá:</strong> {order.totalPrice.toLocaleString()} VNĐ
            </Typography>
            {(order.status === OrderStatuses.CANCELED ||
              order.status === OrderStatuses.REJECTED) && (
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Lí do hủy:</strong> {order.reason}
                </Typography>
              </Grid>
            )}
            <Box>
              <strong>Trạng thái:</strong>
              <Chip
                sx={{ ml: 1 }}
                size="small"
                label={
                  order.status === OrderStatuses.PENDING
                    ? "Đang xử lí"
                    : order.status === OrderStatuses.APPROVED
                      ? "Chờ thanh toán"
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
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Sản phẩm
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Box
              sx={{
                maxHeight: 600,
                overflowY: "auto",
              }}
            >
              {order.listProducts.map(product => (
                <Box
                  key={product.id}
                  sx={{
                    background: "azure",
                    mb: 2,
                    p: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                  }}
                >
                  <Typography>
                    <strong>Tên sản phẩm:</strong> {product.productDetailResponse.name}
                  </Typography>
                  <Typography>
                    <strong>Dung tích:</strong> {product.productDetailResponse.capacity}
                  </Typography>
                  <Typography>
                    <strong>Số lượng:</strong> {product.quantity}
                  </Typography>
                  <Typography>
                    <strong>Giá:</strong> {(product.price / product.quantity).toLocaleString()} VNĐ
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDialog;
