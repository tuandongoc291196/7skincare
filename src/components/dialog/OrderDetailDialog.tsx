import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Order } from "@/types/schema/order";
import { OrderStatuses } from "@/constants/status";

interface OrderDetailDialogProps {
  order: Order | null;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <Dialog open={!!order} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Dialog Header */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Chi tiết đơn hàng
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ p: 2 }}>
          {/* Order Details */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>ID:</strong> {order.id}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Ngày tạo:</strong> {new Date(order.createAt).toLocaleString("vi-VN")}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Địa chỉ:</strong> {order.address}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Số điện thoại:</strong> {order.phoneNumber}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Phí vận chuyển:</strong> 25,000 VNĐ
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Tổng cộng:</strong> {order.totalPrice.toLocaleString()} VNĐ
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <strong>Trạng thái:</strong>{" "}
                <Chip
                  size="small"
                  label={
                    order.status === OrderStatuses.PENDING
                      ? "Chờ xử lý"
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
          </Grid>

          {/* Divider */}
          <Divider sx={{ my: 2 }} />

          {/* Product List */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Sản phẩm
          </Typography>
          <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
            {order.listProducts.map(product => (
              <Paper key={product.id} sx={{ p: 2, mb: 1, display: "flex", alignItems: "center" }}>
                <img
                  src={product.productResponse.image}
                  alt={product.productResponse.name}
                  style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }}
                />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {product.productResponse.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.quantity} x {product.price.toLocaleString()} VNĐ
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
