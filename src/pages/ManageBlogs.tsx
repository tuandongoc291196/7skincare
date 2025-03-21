import { useState } from "react";
import { Container, Typography, Button, Box, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import { getBlogs } from "@/apis/blog";
import AddBlogDialog from "@/components/dialog/AddBlogDialog";
import BlogsTable from "@/components/table/BlogsTable";

const ManageBlogs = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ["get-blogs"],
    queryFn: () => getBlogs(),
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

  const filteredData = data?.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container sx={{ marginTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Danh sách bài đăng
        </Typography>
        <Box display={"flex"} gap={2}>
          <TextField
            label="Tìm kiếm bài đăng"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Thêm bài đăng
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <LoadingSection />
      ) : (
        <BlogsTable blogs={filteredData ?? []} page={page} setPage={setPage} />
      )}
      <AddBlogDialog handleClose={handleClose} open={open} />
    </Container>
  );
};

export default ManageBlogs;
