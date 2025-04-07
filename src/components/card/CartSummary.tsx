import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import useAuthStore from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/apis/order";
import { OrderData } from "@/types/schema/order";
import { useAlert } from "@/hooks/useAlert";
import useCartStore from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { getProvince } from "@/apis/address";
import OrderConfirmationDialog from "../dialog/OrderConfirmationDialog";
import { CartProduct } from "@/types/schema/cart";
import { getAccountById } from "@/apis/account";
import { OrderStatuses } from "@/constants/status";

interface CartSummaryProps {
  items: CartProduct[];
}

const CartSummary: React.FC<CartSummaryProps> = ({ items }) => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { clearCart } = useCartStore();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: provinceData, isLoading } = useQuery({
    queryKey: ["get-provinces"],
    queryFn: () => getProvince(),
  });
  const { data: userData, isLoading: isLoadingUserData } = useQuery({
    queryKey: ["get-user-by-id"],
    queryFn: () => getAccountById(user?.accountId as number),
    enabled: !!user,
  });
  const createOrderMutation = useMutation({
    mutationKey: ["create-order"],
    mutationFn: (data: OrderData) => createOrder(data),
    onSuccess: async res => {
      showAlert("Tạo đơn hàng thành công", "success");
      clearCart();
      navigate(`/theo-doi-don-hang?id=${res.data.id}&status=${OrderStatuses.PENDING}`);
      await queryClient.invalidateQueries({ queryKey: ["get-products"] });
    },
    onError: (error: AxiosError) => {
      if (error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else if (error?.status === 400) {
        showAlert("Bạn đã chọn quá số lượng cho phép. Vui lòng điều chỉnh lại!", "error");
      } else showAlert("Tạo đơn hàng thất bại", "error");
    },
  });

  const [openModal, setOpenModal] = useState(false);

  const handleOrder = (orderData: OrderData) => {
    createOrderMutation.mutate(orderData);
  };
  const handleOpenModal = () => setOpenModal(true);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <Box sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, boxShadow: 2 }}>
      {isLoading || isLoadingUserData ? (
        <Box display="flex" justifyContent="center" sx={{ alignItems: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Tổng giỏ hàng
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
          >
            <Typography>Phí vận chuyển:</Typography>
            <Typography variant="body1" color="red">
              25,000 VNĐ
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
          >
            <Typography>Tạm tính</Typography>
            <Typography variant="h5" fontWeight={600}>
              {(total + 25000).toLocaleString()} VNĐ
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" mb={1}>
            Vui lòng kiểm tra kĩ thông tin trước khi đặt hàng
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleOpenModal}
            disabled={createOrderMutation.isPending}
            sx={{ fontWeight: 600, py: 1 }}
          >
            Đặt hàng
          </Button>
          {user && provinceData && (
            <OrderConfirmationDialog
              open={openModal}
              onClose={() => setOpenModal(false)}
              onConfirmOrder={handleOrder}
              items={items}
              provinceData={provinceData.slice(1)}
              userAddress={userData?.address ?? ""}
              user={user}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default CartSummary;
