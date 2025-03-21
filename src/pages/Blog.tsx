import React, { useState } from "react";
import { Container, Grid, Pagination, Box } from "@mui/material";
import { blogPosts } from "@/constants/fakeData";
import BlogCard from "@/components/card/BlogCard";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "@/apis/blog";
import LoadingSection from "@/components/section/LoadingSection";

const Blog: React.FC = () => {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["get-blogs"],
    queryFn: () => getBlogs(),
  });

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedBlogs = data?.slice((page - 1) * perPage, page * perPage);

  return (
    <Container>
      {isLoading ? (
        <LoadingSection />
      ) : (
        <>
          <Grid container spacing={4}>
            {paginatedBlogs?.map(blog => (
              <Grid item xs={4} key={blog.id}>
                <BlogCard blog={blog} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={Math.ceil(blogPosts.length / perPage)}
              page={page}
              onChange={handleChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Blog;
