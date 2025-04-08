import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Tabs, Tab, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getOrdersByAccountId } from "@/apis/order";
import useAuthStore from "@/hooks/useAuth";
import { Order } from "@/types/schema/order";
import OrderTrackingTable from "@/components/table/OrderTrackingTable";
import { OrderStatuses } from "@/constants/status";
import { useSearchParams } from "react-router-dom";

const OrderTracking: React.FC = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFromUrl = searchParams.get("status") || "All";
  const idFromUrl = searchParams.get("id");
  const [statusFilter, setStatusFilter] = useState<string>(statusFromUrl);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    setStatusFilter(statusFromUrl);
  }, [statusFromUrl]);

  const { data, isLoading } = useQuery({
    queryKey: ["get-orders-by-account-id"],
    queryFn: () => getOrdersByAccountId(user?.accountId as number),
    enabled: !!user,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setStatusFilter(newValue);
    setPage(0);

    setSearchParams({ status: newValue });
  };

  const filteredOrders =
    data?.filter((order: Order) => {
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;

      const matchesId = idFromUrl ? order.id === parseInt(idFromUrl) : true;

      return matchesStatus && matchesId;
    }) || [];

  const orders = [...filteredOrders].reverse();

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Theo dõi đơn hàng
      </Typography>
      <Box sx={{ width: "100%", mb: 4 }}>
        <Tabs
          value={statusFilter}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="order status tabs"
        >
          <Tab label="Tất cả" value="All" />
          <Tab label="Đang xử lý" value={OrderStatuses.PENDING} />
          <Tab label="Chờ thanh toán" value={OrderStatuses.APPROVED} />
          <Tab label="Đã thanh toán" value={OrderStatuses.SUCCESS} />
          <Tab label="Giao hàng thành công" value={OrderStatuses.DONE} />
          <Tab label="Bị từ chối" value={OrderStatuses.REJECTED} />
          <Tab label="Thất bại" value={OrderStatuses.CANCELED} />
        </Tabs>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <OrderTrackingTable orders={orders} page={page} setPage={setPage} status={statusFilter} />
        )}
      </Box>
    </Container>
  );
};

export default OrderTracking;
