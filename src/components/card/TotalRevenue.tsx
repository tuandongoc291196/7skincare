import { Grid, Paper, Typography } from "@mui/material";

export const TotalRevenue = ({ revenue }: { revenue: number | undefined }) => (
  <Grid item xs={12} md={4}>
    <Paper
      elevation={3}
      sx={{
        p: 2,
        background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
        color: "white",
        borderRadius: 2,
      }}
    >
      <Typography variant="body1" gutterBottom sx={{ fontWeight: "medium" }}>
        Tổng Doanh Thu
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {revenue?.toLocaleString("vi-VN") || 0} VNĐ
      </Typography>
    </Paper>
  </Grid>
);
