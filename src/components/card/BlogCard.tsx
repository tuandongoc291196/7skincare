import React from "react";
import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import { Blog } from "@/types/schema/blog";
import { useNavigate } from "react-router-dom";

const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/blog/${blog.id}`)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* Blog Image */}
      <CardMedia
        component="img"
        height="200"
        image={blog.image}
        alt={blog.title}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Blog Title */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {blog.title}
        </Typography>

        {/* Author & Date */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            {blog.authorName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
          </Typography>
        </Box>

        {/* Blog Content Preview */}
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            flexGrow: 1,
          }}
        >
          {blog.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
