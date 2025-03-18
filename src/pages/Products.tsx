import { useState } from "react";
import { Box, Container, Grid, Pagination, Paper, TextField } from "@mui/material";
import ProductCard from "@/components/card/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/apis/product";
import LoadingSection from "@/components/section/LoadingSection";
import { getCategories } from "@/apis/category";
import { getBrands } from "@/apis/brand";
import EmptyProductFilter from "@/components/empty/EmptyProductFilter";
import FilterSection from "@/components/section/FilterSection";

const Products = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-products"],
    queryFn: () => getProducts(),
  });
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["get-categories"],
    queryFn: () => getCategories(),
  });
  const { data: brands, isLoading: isLoadingBrands } = useQuery({
    queryKey: ["get-brands"],
    queryFn: () => getBrands(),
  });

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 12;

  // Filter states
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    brand: "",
    category: "",
    priceRange: "",
  });

  const priceRanges = [
    { label: "Tất cả", value: "", range: [0, Infinity] },
    { label: "0 - 200,000", value: "0-200000", range: [0, 200000] },
    { label: "200,000 - 300,000", value: "200000-300000", range: [200000, 300000] },
    { label: "300,000 - 500,000", value: "300000-500000", range: [300000, 500000] },
    { label: "> 500,000", value: "500000+", range: [500000, Infinity] },
  ];

  const filteredProducts = (data ?? [])
    .filter(product => {
      const selectedRange = priceRanges.find(range => range.value === appliedFilters.priceRange);
      const [minPrice, maxPrice] = selectedRange ? selectedRange.range : [0, Infinity];

      return (
        (!appliedFilters.brand || product.brand.name === appliedFilters.brand) &&
        (!appliedFilters.category || product.category.name === appliedFilters.category) &&
        product.price >= minPrice &&
        product.price <= maxPrice &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) // Search by name
      );
    })
    .sort((a, b) => {
      if (a.quantity > 0 && b.quantity === 0) return -1;
      if (a.quantity === 0 && b.quantity > 0) return 1;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleChange = (event: unknown, value: number) => {
    setPage(value);
  };

  const applyFilters = () => {
    setAppliedFilters({
      brand: brandFilter,
      category: categoryFilter,
      priceRange: priceRangeFilter,
    });
    setPage(1);
  };

  const clearFilters = () => {
    setBrandFilter("");
    setCategoryFilter("");
    setPriceRangeFilter("");
    setSearchQuery("");
    setAppliedFilters({
      brand: "",
      category: "",
      priceRange: "",
    });
    setPage(1);
  };

  return (
    <Container>
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        {/* Search Bar */}
        <Paper elevation={3} sx={{ mb: 4, p: 1, borderRadius: 1, display: "flex", gap: 2 }}>
          <Box flex={1}>
            <TextField
              size="small"
              label="Tìm kiếm sản phẩm"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </Box>
          {/* Filter Section */}
          <Box flex={1.5}>
            <FilterSection
              isLoadingBrands={isLoadingBrands}
              isLoadingCategories={isLoadingCategories}
              brands={brands}
              categories={categories}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              priceRangeFilter={priceRangeFilter}
              setPriceRangeFilter={setPriceRangeFilter}
              priceRanges={priceRanges}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
            />
          </Box>
        </Paper>

        {/* Products Grid */}
        <Grid container spacing={4}>
          {isLoading ? (
            <LoadingSection />
          ) : (
            <>
              {displayedProducts.length === 0 ? (
                <EmptyProductFilter clearFilters={clearFilters} />
              ) : (
                displayedProducts.map((product, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <ProductCard product={product} />
                  </Grid>
                ))
              )}
            </>
          )}
        </Grid>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination count={totalPages} page={page} onChange={handleChange} color="primary" />
        </Box>
      </Box>
    </Container>
  );
};

export default Products;
