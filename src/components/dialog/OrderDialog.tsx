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
} from "@mui/material";
import { Order } from "@/types/schema/order";
import useAuthStore from "@/hooks/useAuth";

interface OrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDialog: React.FC<OrderDialogProps> = ({ open, onClose, order }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  if (!order) return null;
  console.log(order);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography fontSize={20} fontWeight={600}>
          Chi tiết đơn hàng
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
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
              <strong>Tổng giá:</strong> {order.totalPrice.toLocaleString()} VND
            </Typography>
            <Typography>
              <strong>Trạng thái:</strong> {order.status}
            </Typography>
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
                    <strong>Tên sản phẩm:</strong> {product.productResponse.name}
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
