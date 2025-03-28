import { useState } from "react";
import { Container, Typography, Button, Box, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import { getProducts } from "@/apis/product";
import ProductsTable from "@/components/table/ProductsTable";
import { getCategories } from "@/apis/category";
import { getBrands } from "@/apis/brand";
import AddProductDialog from "@/components/dialog/AddProductDialog";
import FilterSection from "@/components/section/FilterSection";
import { getSkinTypes } from "@/apis/skin-type";

const ManageProducts = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);

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
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState("");
  const [skinTypeFilter, setSkinTypeFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    brand: "",
    category: "",
    priceRange: "",
    skinType: "",
  });

  const priceRanges = [
    { label: "Tất cả", value: "", range: [0, Infinity] },
    { label: "0 - 200,000", value: "0-200000", range: [0, 200000] },
    { label: "200,000 - 300,000", value: "200000-300000", range: [200000, 300000] },
    { label: "300,000 - 500,000", value: "300000-500000", range: [300000, 500000] },
    { label: "> 500,000", value: "500000+", range: [500000, Infinity] },
  ];

  const filteredProducts = (products ?? [])
    .filter(product => {
      const selectedRange = priceRanges.find(range => range.value === appliedFilters.priceRange);
      const [minPrice, maxPrice] = selectedRange ? selectedRange.range : [0, Infinity];

      return (
        (!appliedFilters.brand || product.brand.name === appliedFilters.brand) &&
        (!appliedFilters.category || product.category.name === appliedFilters.category) &&
        (!appliedFilters.skinType || product.suitableFor.includes(appliedFilters.skinType)) &&
        product.price >= minPrice &&
        product.price <= maxPrice &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (a.quantity > 0 && b.quantity === 0) return -1;
      if (a.quantity === 0 && b.quantity > 0) return 1;
      return 0;
    });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const applyFilters = () => {
    setAppliedFilters({
      brand: brandFilter,
      category: categoryFilter,
      priceRange: priceRangeFilter,
      skinType: skinTypeFilter,
    });
    setPage(0);
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
      skinType: "",
    });
    setPage(1);
  };
  return (
    <Container sx={{ marginTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Danh sách sản phẩm
        </Typography>
        <Box display={"flex"} gap={2}>
          <TextField
            label="Tìm kiếm sản phẩm"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Thêm sản phẩm
          </Button>
        </Box>
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
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />
      {isLoadingProducts || isLoadingBrands || isLoadingCategories || isLoadingSkins ? (
        <LoadingSection />
      ) : (
        categories &&
        skins &&
        brands && (
          <ProductsTable
            products={filteredProducts ?? []}
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
