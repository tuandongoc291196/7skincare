import { Box, Grid } from "@mui/material";

interface ProductImageProps {
  isEditing: boolean;
  image: string;
  productName: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductImage: React.FC<ProductImageProps> = ({
  isEditing,
  image,
  productName,
  onImageChange,
}) => (
  <Grid item xs={12} sm={5}>
    {isEditing ? (
      <>
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          style={{ display: "none" }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Box
            sx={{
              cursor: "pointer",
              width: "100%",
              borderRadius: 2,
              border: "1px solid grey",
              overflow: "hidden",
            }}
          >
            <img src={image} alt={productName} style={{ width: "100%", display: "block" }} />
          </Box>
        </label>
      </>
    ) : (
      <Box
        sx={{
          width: "100%",
          borderRadius: 2,
          border: "1px solid grey",
          overflow: "hidden",
        }}
      >
        <img src={image} alt={productName} style={{ width: "100%", display: "block" }} />
      </Box>
    )}
  </Grid>
);

export default ProductImage;
