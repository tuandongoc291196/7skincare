// ManageProducts.tsx
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/apis/product";
import { getCategories } from "@/apis/category";
import { getBrands } from "@/apis/brand";
import { getSkinTypes } from "@/apis/skin-type";
import FilterSection from "@/components/section/FilterSection";
import ProductsTable from "@/components/table/ProductsTable";
import AddProductDialog from "@/components/dialog/AddProductDialog";
import { Product } from "@/types/schema/product";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const ManageProducts = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [sortByDateAsc, setSortByDateAsc] = useState(false); // Default: false (newest first)

  const { data: products, isLoading: isLoadingProducts } = useQuery({
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

  // Update applied filters whenever any filter changes
  useEffect(() => {
    setAppliedFilters({
      brand: brandFilter,
      category: categoryFilter,
      priceRange: priceRangeFilter,
      skinType: skinTypeFilter,
      searchQuery: searchQuery,
    });
    setPage(0);
  }, [brandFilter, categoryFilter, priceRangeFilter, skinTypeFilter, searchQuery]);

  const filteredProducts = (products ?? []).filter((product: Product) => {
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleSortOrder = () => {
    setSortByDateAsc(prev => !prev);
    setPage(0);
  };

  const clearFilters = () => {
    setBrandFilter([]);
    setCategoryFilter([]);
    setPriceRangeFilter([]);
    setSkinTypeFilter([]);
    setSearchQuery("");
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: "20px" }}>
      <Grid container spacing={4} sx={{ marginBottom: "20px" }}>
        <Grid item xs={12} md={2}>
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
        </Grid>
        <Grid item xs={12} md={10}>
          <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
            <Typography variant="h5" gutterBottom>
              Danh sách sản phẩm
            </Typography>
            <Box display={"flex"} flexDirection={"column"} gap={2}>
              <Box display={"flex"} gap={2} alignItems="center">
                <TextField
                  size="small"
                  label="Tìm kiếm sản phẩm"
                  variant="outlined"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />

                <Button variant="contained" color="primary" onClick={handleOpen}>
                  Thêm sản phẩm
                </Button>
              </Box>
              <Box display={"flex"} alignItems={"center"} justifyContent={"flex-end"}>
                <Button
                  variant="text"
                  onClick={toggleSortOrder}
                  startIcon={sortByDateAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  sx={{ mr: 1 }}
                >
                  Sắp xếp: {sortByDateAsc ? "Cũ nhất" : "Mới nhất"}
                </Button>
                <Button variant="text" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
              </Box>
            </Box>
          </Box>

          {isLoadingProducts || isLoadingBrands || isLoadingCategories || isLoadingSkins ? (
            <Box
              display="flex"
              justifyContent="center"
              sx={{ alignItems: "center", height: "90vh", width: "100%" }}
            >
              <CircularProgress />
            </Box>
          ) : (
            categories &&
            skins &&
            brands && (
              <ProductsTable
                products={filteredProducts}
                page={page}
                setPage={setPage}
                categories={categories}
                isLoadingCategories={isLoadingCategories}
                brands={brands}
                isLoadingBrands={isLoadingBrands}
                skins={skins}
                isLoadingSkins={isLoadingSkins}
              />
            )
          )}
        </Grid>
      </Grid>

      {!(isLoadingProducts || isLoadingBrands || isLoadingCategories || isLoadingSkins) &&
        categories &&
        brands &&
        skins && (
          <AddProductDialog
            handleClose={handleClose}
            open={open}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            brands={brands}
            isLoadingBrands={isLoadingBrands}
            skins={skins}
            isLoadingSkins={isLoadingSkins}
          />
        )}
    </Container>
  );
};

export default ManageProducts;
