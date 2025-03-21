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

  // Get status from URL or default to "All"
  const statusFromUrl = searchParams.get("status") || "All";
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

    // Update URL params
    setSearchParams({ status: newValue });
  };

  const filteredOrders =
    data?.filter((order: Order) => statusFilter === "All" || order.status === statusFilter) || [];
  console.log(data, isLoading);
  return (
    <Container sx={{ mt: 4 }}>
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
          <Tab label="Hoàn thành" value={OrderStatuses.SUCCESS} />
          <Tab label="Thất bại" value={OrderStatuses.CANCELED} />
        </Tabs>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <OrderTrackingTable
            orders={filteredOrders}
            page={page}
            setPage={setPage}
            status={statusFilter}
          />
        )}
      </Box>
    </Container>
  );
};

export default OrderTracking;
