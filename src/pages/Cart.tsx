// components/Cart.tsx
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import useCartStore from "@/hooks/useCart";
import EmptyCart from "@/components/empty/EmptyCart";
import CartItem from "@/components/card/CartItem";
import CartSummary from "@/components/card/CartSummary";

const Cart = () => {
  const { items, removeItem, updateItem, clearCart } = useCartStore();

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Giỏ hàng
        </Typography>
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box display="flex" paddingX={"16px"} bgcolor={"gray"} color={"white"} p={1}>
                <Box sx={{ width: "50%" }}>
                  <Typography ml={1}>Sản phẩm</Typography>
                </Box>
                <Box sx={{ width: "50%", display: "flex" }}>
                  <Box width={"33%"} ml={3}>
                    <Typography>Đơn giá</Typography>
                  </Box>
                  <Box>
                    <Typography>Số lượng</Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
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
              </Box>
              <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" color="warning" onClick={clearCart}>
                    Xóa giỏ hàng
                  </Button>
                </Box>
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
