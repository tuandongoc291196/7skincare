import { useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import AccountsTable from "@/components/table/AccountsTable";
import { getAccounts } from "@/apis/account";
import AddStaffAccountDialog from "@/components/dialog/AddStaffAccountDialog";
const ManageAccounts = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["get-accounts"],
    queryFn: () => getAccounts(),
  });

  const handleOpen = () => {
    console.log("Opening dialog, searchQuery before:", searchQuery); // Debug
    setOpen(true);
    console.log("Opening dialog, searchQuery after:", searchQuery); // Debug
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log("Current searchQuery:", searchQuery); // Moved outside render for clarity

  return (
    <Container sx={{ marginTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Danh sách tài khoản
        </Typography>
        <Box display={"flex"} gap={2}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Thêm tài khoản nhân viên
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <LoadingSection />
      ) : (
        <AccountsTable
          accounts={data ?? []}
          page={page}
          setPage={setPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
      <AddStaffAccountDialog onClose={handleClose} open={open} />
    </Container>
  );
};

export default ManageAccounts;
