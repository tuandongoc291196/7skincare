import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getOrdersByAccountId } from "@/apis/order";
import useAuthStore from "@/hooks/useAuth";
import { Order } from "@/types/schema/order";
import OrderTrackingTable from "@/components/table/OrderTrackingTable";

const OrderTracking: React.FC = () => {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ["get-orders-by-account-id"],
    queryFn: () => getOrdersByAccountId(user?.accountId as number),
    enabled: !!user,
  });

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value as string);
    setPage(0);
  };

  const filteredOrders =
    data?.filter((order: Order) => statusFilter === "All" || order.status === statusFilter) || [];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Theo dõi đơn hàng
      </Typography>
      <Box sx={{ width: "100%", mb: 4 }}>
        <Select value={statusFilter} onChange={handleStatusChange}>
          <MenuItem value="All">Tất cả</MenuItem>
          <MenuItem value="PENDING">Đang xử lý</MenuItem>
          <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
          <MenuItem value="FAILURE">Thất bại</MenuItem>
        </Select>
        {isLoading ? (
          <Typography>
            <CircularProgress />
          </Typography>
        ) : (
          <OrderTrackingTable orders={filteredOrders} page={page} setPage={setPage} />
        )}
      </Box>
    </Container>
  );
};

export default OrderTracking;
