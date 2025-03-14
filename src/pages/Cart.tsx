import { Box, Button, Container, Grid, Typography } from "@mui/material";
import useCartStore from "@/hooks/useCart";
import EmptyCart from "@/components/empty/EmptyCart";
import CartItem from "@/components/card/CartItem";
import CartSummary from "@/components/card/CartSummary";

const Cart = () => {
  const { items, removeItem, updateItem, clearCart } = useCartStore();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Giỏ hàng
      </Typography>
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={(id, quantity) => {
                  const newQuantity = Math.max(1, parseInt(quantity.toString(), 10));
                  updateItem(id, { quantity: newQuantity });
                }}
                onRemove={removeItem}
              />
            ))}
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
    </Container>
  );
};

export default Cart;
