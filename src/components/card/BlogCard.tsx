import React from "react";
import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import { Blog } from "@/types/schema/blog";

const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
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
