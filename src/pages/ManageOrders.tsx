import { useState } from "react";
import { Container, Typography, Box, TextField } from "@mui/material";
import AddBrandDialog from "@/components/dialog/AddBrandDialog";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import OrdersTable from "@/components/table/OrdersTable";
import { getAllOrders } from "@/apis/order";
import { Order } from "@/types/schema/order";

const ManageOrders = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["get-orders"],
    queryFn: () => getAllOrders(),
  });

  const handleClose = () => {
    setOpen(false);
  };

  // Filter orders by phone number
  const filteredOrders = data
    ? data.filter((order: Order) => order.phoneNumber.includes(searchQuery))
    : [];

  return (
    <Container maxWidth="xl" sx={{ marginTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Danh sách đơn hàng
        </Typography>
        <TextField
          label="Tìm kiếm theo số điện thoại"
          variant="outlined"
          sx={{ marginBottom: "10px", width: 300 }}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </Box>

      {isLoading ? (
        <LoadingSection />
      ) : (
        <OrdersTable orders={filteredOrders} page={page} setPage={setPage} />
      )}

      <AddBrandDialog handleClose={handleClose} open={open} />
    </Container>
  );
};

export default ManageOrders;
