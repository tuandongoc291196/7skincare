import { TableRow, TableCell, Box, Typography, TextField, Button } from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";
import { styled } from "@mui/system";
import { CartProduct } from "@/types/schema/cart";

const QuantityControl = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  border: `1px solid #0000001f`,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  width: "fit-content",
}));

const QuantityButton = styled(Button)(() => ({
  minWidth: 20,
  height: 40,
  borderRadius: 0,
}));

interface CartItemProps {
  item: CartProduct;
  maxQuantity: number;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, maxQuantity, onQuantityChange, onRemove }) => {
  return (
    <TableRow>
      <TableCell>
        <Box display="flex" alignItems="center">
          <img
            src={item.image}
            alt={item.name}
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: "8px" }}
          />
          <Box ml={2}>
            <Typography fontSize={14} fontWeight={500}>
              {item.name}
            </Typography>
            <Typography fontSize={12} color="textSecondary">
              Dung tích: {item.capacity}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography fontSize={14}>{item.price.toLocaleString()}₫</Typography>
      </TableCell>
      <TableCell sx={{ placeItems: "center" }}>
        <QuantityControl>
          <QuantityButton
            onClick={() => onQuantityChange(item.productDetailId, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Remove fontSize="small" />
          </QuantityButton>
          <TextField
            type="number"
            value={item.quantity}
            onChange={e => {
              const value = parseInt(e.target.value) || 1;
              if (value <= maxQuantity) {
                onQuantityChange(item.productDetailId, value);
              }
            }}
            onKeyDown={e => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            sx={{ width: 50, textAlign: "center" }}
            inputProps={{ min: 1, max: maxQuantity, style: { textAlign: "center" } }}
            variant="standard"
          />
          <QuantityButton
            onClick={() => onQuantityChange(item.productDetailId, item.quantity + 1)}
            disabled={item.quantity >= maxQuantity}
          >
            <Add fontSize="small" />
          </QuantityButton>
        </QuantityControl>
      </TableCell>

      <TableCell align="center">
        <Button onClick={() => onRemove(item.productDetailId)} color="error">
          <Delete />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
