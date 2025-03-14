import { useState } from "react";
import { Box, Container, Grid, Pagination } from "@mui/material";
import ProductCard from "@/components/card/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/apis/product";
import LoadingSection from "@/components/section/LoadingSection";

const Products = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-products"],
    queryFn: () => getProducts(),
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const sortedProducts = (data ?? []).sort((a, b) => {
    if (a.quantity > 0 && b.quantity === 0) return -1;
    if (a.quantity === 0 && b.quantity > 0) return 1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handleChange = (event: unknown, value: number) => {
    setPage(value);
  };

  const displayedProducts = sortedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Container>
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Grid container spacing={4}>
          {isLoading ? (
            <LoadingSection />
          ) : (
            <>
              {displayedProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </>
          )}
        </Grid>
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination count={totalPages} page={page} onChange={handleChange} color="primary" />
        </Box>
      </Box>
    </Container>
  );
};

export default Products;
