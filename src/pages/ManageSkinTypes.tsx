import { useState } from "react";
import { Container, Typography, Button, Box, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import { getSkinTypes } from "@/apis/skin-type";
import SkinTypesTable from "@/components/table/SkinTypesTable";
import AddSkinTypeDialog from "@/components/dialog/AddSkinTypeDialog";

const ManageSkinTypes = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ["get-skinTypes"],
    queryFn: () => getSkinTypes(),
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

  const filteredData = data?.filter(data =>
    data.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container  maxWidth="xl" sx={{ marginTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Danh sách loại da
        </Typography>
        <Box display={"flex"} gap={2}>
          <TextField
            label="Tìm kiếm loại da"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Thêm loại da
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <LoadingSection />
      ) : (
        <SkinTypesTable skinTypes={filteredData ?? []} page={page} setPage={setPage} />
      )}
      <AddSkinTypeDialog handleClose={handleClose} open={open} />
    </Container>
  );
};

export default ManageSkinTypes;
