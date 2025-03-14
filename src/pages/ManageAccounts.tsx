import { Container, Typography, Button, Box, TextField } from "@mui/material";

const ManageAccounts = () => {
  return (
    <Container sx={{ marginTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Danh sách tài khoản
        </Typography>
        <Box display={"flex"} gap={2}>
          <TextField label="Tìm kiếm tài khoản" variant="outlined" />
          <Button variant="contained" color="primary">
            Thêm tài khoản
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ManageAccounts;
