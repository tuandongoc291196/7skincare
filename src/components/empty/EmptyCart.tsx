import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

const EmptyCart: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: "center", py: 5 }}>
      <ShoppingCartIcon sx={{ fontSize: 60, color: "gray" }} />
      <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
        Giỏ hàng của bạn trống
      </Typography>
      <Button
        onClick={() => navigate("/san-pham")}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Tiếp tục mua hàng
      </Button>
    </Box>
  );
};

export default EmptyCart;
