import React from "react";
import { Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import useAuthStore from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccountById } from "@/apis/account";
import { createOrder } from "@/apis/order";
import { OrderData } from "@/types/schema/order";
import { useAlert } from "@/hooks/useAlert";
import useCartStore from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

interface CartSummaryProps {
  items: { price: number; quantity: number; id: number }[];
}

const CartSummary: React.FC<CartSummaryProps> = ({ items }) => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { clearCart } = useCartStore();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["get-account-by-id"],
    queryFn: () => getAccountById(user?.accountId ?? 0),
    enabled: !!user,
  });

  const createOrderMutation = useMutation({
    mutationKey: ["create-order"],
    mutationFn: (data: OrderData) => createOrder(data),
    onSuccess: async () => {
      showAlert("Tạo đơn hàng thành công", "success");
      clearCart();
      navigate("/theo-doi-don-hang");
      await queryClient.invalidateQueries({ queryKey: ["get-products"] });
    },
    onError: (error: AxiosError) => {
      if (error?.status === 400 || error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Tạo đơn hàng thất bại", "error");
    },
  });

  const handleOrder = () => {
    const orderData: OrderData = {
      accountId: data?.id as number,
      address: data?.address as string,
      phoneNumber: data?.phoneNumber as string,
      listProducts: items.map(({ id, quantity }) => ({
        productId: id,
        quantity,
      })),
    };
    createOrderMutation.mutate(orderData);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  console.log(data);
  return (
    <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" sx={{ alignItems: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Tổng giỏ hàng
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1">Tạm tính</Typography>
            <Typography variant="body1">{total.toLocaleString()}₫</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1">Giao hàng</Typography>
            <Typography variant="body1"> {data?.address}</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Phí vận chuyển sẽ báo sau.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1" fontWeight={600}>
              Tổng cộng
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {total.toLocaleString()}₫
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleOrder}
            disabled={createOrderMutation.isPending}
          >
            Đặt hàng
          </Button>
        </>
      )}
    </Box>
  );
};

export default CartSummary;
