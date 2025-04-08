// components/Cart.tsx
import {
  Box,
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useCartStore from "@/hooks/useCart";
import EmptyCart from "@/components/empty/EmptyCart";
import CartItem from "@/components/card/CartItem";
import CartSummary from "@/components/card/CartSummary";

const Cart = () => {
  const { items, removeItem, updateItem, clearCart } = useCartStore();

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Giỏ hàng
        </Typography>
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box px={2}>
                <Table>
                  <TableHead sx={{ backgroundColor: "red" }}>
                    <TableRow>
                      <TableCell sx={{ width: "55%" }}>Sản phẩm</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>Đơn giá</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>Số lượng</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map(item => (
                      <CartItem
                        key={item.productDetailId}
                        item={item}
                        maxQuantity={item.maxQuantity}
                        onQuantityChange={(id, quantity) => {
                          const newQuantity = Math.max(1, parseInt(quantity.toString(), 10));
                          updateItem(id, { quantity: newQuantity });
                        }}
                        onRemove={removeItem}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={2} pr={2}>
                <Button variant="outlined" color="warning" onClick={clearCart}>
                  Xóa giỏ hàng
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <CartSummary items={items} />
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Cart;
