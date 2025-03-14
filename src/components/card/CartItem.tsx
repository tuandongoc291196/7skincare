import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";
import { styled } from "@mui/system";
import { CartProduct } from "@/types/schema/cart";

const CartItemStyled = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  borderBottom: `1px solid #0000001f`,
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  border: `1px solid #0000001f`,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const QuantityButton = styled(Button)(() => ({
  minWidth: 20,
  height: 40,
  borderRadius: 0,
}));

interface CartItemProps {
  item: CartProduct;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <CartItemStyled>
      <Box sx={{ display: "flex", alignItems: "center", width: "60%" }}>
        <img
          src={item.image}
          alt={item.name}
          style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
        />
        <Box sx={{ ml: 2 }}>
          <Typography variant="body1">{item.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {item.price.toLocaleString()}₫
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "40%",
        }}
      >
        <QuantityControl>
          <QuantityButton onClick={() => onQuantityChange(item.id, item.quantity - 1)}>
            <Remove fontSize="small" />
          </QuantityButton>
          <TextField
            type="number"
            value={item.quantity}
            onChange={e => onQuantityChange(item.id, parseInt(e.target.value))}
            onKeyDown={e => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            sx={{ width: 50, textAlign: "center", border: "none" }}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
            variant="standard"
          />
          <QuantityButton onClick={() => onQuantityChange(item.id, item.quantity + 1)}>
            <Add fontSize="small" />
          </QuantityButton>
        </QuantityControl>
        <Typography variant="body1" sx={{ ml: 2 }}>
          {(item.price * item.quantity).toLocaleString()}₫
        </Typography>
        <Button onClick={() => onRemove(item.id)} color="error" sx={{ ml: 2 }}>
          <Delete />
        </Button>
      </Box>
    </CartItemStyled>
  );
};

export default CartItem;
