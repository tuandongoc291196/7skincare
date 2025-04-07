// Products.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import ProductCard from "@/components/card/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/apis/product";
import { getCategories } from "@/apis/category";
import { getBrands } from "@/apis/brand";
import EmptyProductFilter from "@/components/empty/EmptyProductFilter";
import FilterSection from "@/components/section/FilterSection";
import { getSkinTypes } from "@/apis/skin-type";
import { Product } from "@/types/schema/product";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
  const { data: skins, isLoading: isLoadingSkins } = useQuery({
    queryKey: ["get-skin-types"],
    queryFn: () => getSkinTypes(),
  });

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByDateAsc, setSortByDateAsc] = useState(false); // Default: false (newest first)
  const itemsPerPage = 12;

  // Filter states
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [priceRangeFilter, setPriceRangeFilter] = useState<string[]>([]);
  const [skinTypeFilter, setSkinTypeFilter] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState({
    brand: [] as string[],
    category: [] as string[],
    priceRange: [] as string[],
    skinType: [] as string[],
    searchQuery: "",
  });

  const priceRanges = [
    { label: "Tất cả", value: "", range: [0, Infinity] },
    { label: "0 - 200,000", value: "0-200000", range: [0, 200000] },
    { label: "200,000 - 300,000", value: "200000-300000", range: [200000, 300000] },
    { label: "300,000 - 500,000", value: "300000-500000", range: [300000, 500000] },
    { label: "> 500,000", value: "500000+", range: [500000, Infinity] },
  ];

  useEffect(() => {
    setAppliedFilters({
      brand: brandFilter,
      category: categoryFilter,
      priceRange: priceRangeFilter,
      skinType: skinTypeFilter,
      searchQuery: searchQuery,
    });
    setPage(1);
  }, [brandFilter, categoryFilter, priceRangeFilter, skinTypeFilter, searchQuery]);

  const filteredProducts = (data ?? []).filter((product: Product) => {
    const hasPriceInRange =
      appliedFilters.priceRange.length === 0
        ? true
        : product.productDetails.some(detail =>
            priceRanges.some(range => {
              if (!appliedFilters.priceRange.includes(range.value)) return false;
              const [minPrice, maxPrice] = range.range;
              return detail.price >= minPrice && detail.price <= maxPrice;
            })
          );

    return (
      (appliedFilters.brand.length === 0 || appliedFilters.brand.includes(product.brand.name)) &&
      (appliedFilters.category.length === 0 ||
        appliedFilters.category.includes(product.category.name)) &&
      (appliedFilters.skinType.length === 0 ||
        appliedFilters.skinType.some(type => product.suitableFor.includes(type))) &&
      hasPriceInRange &&
      product.name.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase())
    );
  });

  if (sortByDateAsc) {
    filteredProducts.reverse();
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleChange = (_event: unknown, value: number) => {
    setPage(value);
  };

  const toggleSortOrder = () => {
    setSortByDateAsc(prev => !prev);
    setPage(1);
  };

  const clearFilters = () => {
    setBrandFilter([]);
    setCategoryFilter([]);
    setPriceRangeFilter([]);
    setSkinTypeFilter([]);
    setSearchQuery("");
    setPage(1);
  };

  return (
    <Container maxWidth="xl" sx={{ flexGrow: 1, mt: 4 }}>
      <Grid container spacing={4}>
        {/* Left Sidebar - Filter Section */}
        <Grid item xs={12} md={3}>
          <Box sx={{ position: "sticky", top: 20 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" gutterBottom>
                Bộ lọc sản phẩm
              </Typography>
            </Box>
            <FilterSection
              isLoadingBrands={isLoadingBrands}
              isLoadingCategories={isLoadingCategories}
              isLoadingSkins={isLoadingSkins}
              brands={brands}
              categories={categories}
              skins={skins}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              priceRangeFilter={priceRangeFilter}
              setPriceRangeFilter={setPriceRangeFilter}
              skinTypeFilter={skinTypeFilter}
              setSkinTypeFilter={setSkinTypeFilter}
              priceRanges={priceRanges}
              clearFilters={clearFilters}
            />
          </Box>
        </Grid>

        {/* Right Side - Products */}
        <Grid item xs={12} md={9}>
          {/* Search Bar and Controls */}
          <Box mb={4} display={"flex"} justifyContent="space-between" alignItems="center">
            <Box>
              <TextField
                size="small"
                label="Tìm kiếm sản phẩm"
                variant="outlined"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" mr={2}>
                Hiển thị {filteredProducts.length} sản phẩm
              </Typography>
              <Button
                variant="outlined"
                onClick={toggleSortOrder}
                startIcon={sortByDateAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                sx={{ mr: 1 }}
              >
                Sắp xếp: {sortByDateAsc ? "Cũ nhất" : "Mới nhất"}
              </Button>
              <Button variant="outlined" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </Box>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={4}>
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                sx={{ alignItems: "center", height: "90vh", width: "100%" }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {displayedProducts.length === 0 ? (
                  <EmptyProductFilter clearFilters={clearFilters} />
                ) : (
                  displayedProducts.map((product: Product, index: number) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <ProductCard product={product} />
                    </Grid>
                  ))
                )}
              </>
            )}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination count={totalPages} page={page} onChange={handleChange} color="primary" />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Products;
