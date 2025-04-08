import { useState } from "react";
import { Container, Typography, Button, Box, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import { getPositions } from "@/apis/position";
import PositionsTable from "@/components/table/PositionsTable";
import AddPositionDialog from "@/components/dialog/AddPositionDialog";

const ManagePositions = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ["get-positions"],
    queryFn: () => getPositions(),
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredData = data?.filter(position =>
    position.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ marginTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Danh sách vị trí
        </Typography>
        <Box display={"flex"} gap={2}>
          <TextField
            label="Tìm kiếm vị trí"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Thêm vị trí
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <LoadingSection />
      ) : (
        <PositionsTable positions={filteredData ?? []} page={page} setPage={setPage} />
      )}
      <AddPositionDialog handleClose={handleClose} open={open} />
    </Container>
  );
};

export default ManagePositions;
