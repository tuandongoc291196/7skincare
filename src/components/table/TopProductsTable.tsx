import { ReportOrders } from "@/types/schema/report";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export const TopProductsTable = ({ products }: { products: ReportOrders[] | undefined }) => (
  <Grid item xs={12} height={"100%"}>
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
      <Typography variant="h6" gutterBottom sx={{ color: "#1976d2", fontWeight: "bold" }}>
        Top 5 Sản Phẩm Bán Chạy
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>Tên Sản Phẩm</TableCell>
              <TableCell width={"30%"} align="right" sx={{ fontWeight: "bold", color: "#424242" }}>
                Số Lượng Bán
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.slice(0, 5).map((product, index) => (
              <TableRow
                key={product.id}
                sx={{
                  "&:hover": { backgroundColor: "#fafafa" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>
                      {index + 1}. {product.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontWeight: "medium" }}>
                    {product.quantity.toLocaleString("vi-VN")}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </Grid>
);
