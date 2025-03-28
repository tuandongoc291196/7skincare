import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import { getBlogById } from "@/apis/blog";

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["get-blog-by-id", id],
    queryFn: () => getBlogById(Number(id)),
    enabled: !!id,
  });
  if (isLoading) {
    return <LoadingSection />;
  }

  if (!data) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Blog này không còn tồn tại
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" gutterBottom>
          {data.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Ngày đăng: {new Date(data.createdAt).toLocaleDateString("vi-VN")}
        </Typography>
        <Box
          component="img"
          src={data.image}
          alt={data.title}
          sx={{ width: "100%", maxHeight: "400px", objectFit: "cover", mb: 3 }}
        />
        <Typography
          variant="body1"
          sx={{
            lineHeight: "1.8",
            fontSize: "1.1rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </Box>
    </Container>
  );
};

export default BlogDetail;
