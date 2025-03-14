import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingSection: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{ marginBottom: "10px", alignItems: "center", height: "50vh", width: "100%" }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingSection;
