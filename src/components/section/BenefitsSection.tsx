import React from "react";
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { benefits } from "@/constants/fakeData";
import { useNavigate } from "react-router-dom";

const BenefitsSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f0f4f8" }}>
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "2rem" }}>
        Vì sao bạn nên đồng hành cùng 7skincare?
      </Typography>
      <Grid container spacing={4}>
        {benefits.map((benefit, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardMedia component="img" height="200" image={benefit.image} alt={benefit.title} />
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {benefit.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/dang-nhap")}>
          Tham gia ngay
        </Button>
      </Box>
    </Box>
  );
};

export default BenefitsSection;
