import { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import AddBrandDialog from "@/components/dialog/AddBrandDialog";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import OrdersTable from "@/components/table/OrdersTable";
import { getAllOrders } from "@/apis/order";

const ManageOrders = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ["get-orders"],
    queryFn: () => getAllOrders(),
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container sx={{ marginTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Danh sách đơn hàng
        </Typography>
      </Box>

      {isLoading ? (
        <LoadingSection />
      ) : (
        <OrdersTable orders={data ?? []} page={page} setPage={setPage} />
      )}
      <AddBrandDialog handleClose={handleClose} open={open} />
    </Container>
  );
};

export default ManageOrders;
