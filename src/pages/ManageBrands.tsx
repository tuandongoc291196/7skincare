import { useState } from "react";
import { Container, Typography, Button, Box, TextField } from "@mui/material";
import AddBrandDialog from "@/components/dialog/AddBrandDialog";
import { getBrands } from "@/apis/brand";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import BrandsTable from "@/components/table/BrandsTable";

const ManageBrands = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ["get-brands"],
    queryFn: () => getBrands(),
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

  const filteredData = data?.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container sx={{ marginTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Danh sách thương hiệu
        </Typography>
        <Box display={"flex"} gap={2}>
          <TextField
            label="Tìm kiếm thương hiệu"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Thêm thương hiệu
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <LoadingSection />
      ) : (
        <BrandsTable brands={filteredData ?? []} page={page} setPage={setPage} />
      )}
      <AddBrandDialog handleClose={handleClose} open={open} />
    </Container>
  );
};

export default ManageBrands;
