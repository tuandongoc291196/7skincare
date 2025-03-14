import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface Blog {
  id: number;
  title: string;
  date: string;
  category: string;
  author: string;
  excerpt: string;
}

const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography color="text.secondary">{blog.author}</Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {blog.date} - {blog.category}
        </Typography>
        <Typography variant="body2">{blog.excerpt}</Typography>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
