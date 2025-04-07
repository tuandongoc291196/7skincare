import { Product } from "@/types/schema/product";
import { ToggleButton, ToggleButtonGroup, Typography, Box } from "@mui/material";

interface CapacitySelectorProps {
  product: Product;
  selectedDetailId: number | null;
  setSelectedDetailId: (value: number | null) => void;
}

const CapacitySelector = ({
  product,
  selectedDetailId,
  setSelectedDetailId,
}: CapacitySelectorProps) => {
  const handleCapacityChange = (_: React.MouseEvent<HTMLElement>, newValue: number | null) => {
    if (newValue !== null) {
      setSelectedDetailId(newValue);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Dung tích
      </Typography>

      <ToggleButtonGroup
        value={selectedDetailId}
        exclusive
        onChange={handleCapacityChange}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
        }}
      >
        {product.productDetails.map(detail => (
          <ToggleButton
            key={detail.id}
            value={detail.id}
            disabled={detail.quantity === 0}
            sx={{
              borderRadius: 2,
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "left",
              p: 1,
              height: "100%",
            }}
          >
            <Typography variant="body2">{detail.capacity}</Typography>
            <Typography variant="caption" color="text.secondary">
              {detail.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Typography>
            <Typography
              variant="caption"
              color={detail.quantity > 0 ? "green" : "error"}
              sx={{ mt: 0.5 }}
            >
              {detail.quantity > 0 ? `Còn: ${detail.quantity}` : "Hết hàng"}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
export default CapacitySelector;
