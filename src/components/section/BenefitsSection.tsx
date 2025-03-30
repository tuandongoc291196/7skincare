import React from "react";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "@/apis/blog";
import BlogCard from "../card/BlogCard";

const BenefitsSection: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["get-blogs"],
    queryFn: () => getBlogs(),
  });

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f0f4f8" }}>
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "2rem" }}>
        Vì sao bạn nên đồng hành cùng 7skincare?
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" sx={{ alignItems: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {data?.slice(0, 3).map((blog, index) => (
            <Grid item xs={12} md={4} key={index}>
              <BlogCard blog={blog} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/dang-nhap")}>
          Tham gia ngay
        </Button>
      </Box>
    </Box>
  );
};

export default BenefitsSection;
