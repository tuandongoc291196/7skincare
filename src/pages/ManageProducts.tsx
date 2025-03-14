import { useState } from "react";
import { Container, Typography, Button, Box, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import { getProducts } from "@/apis/product";
import ProductsTable from "@/components/table/ProductsTable";
import { getCategories } from "@/apis/category";
import { getBrands } from "@/apis/brand";
import AddProductDialog from "@/components/dialog/AddProductDialog";

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

  const filteredData = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {isLoadingProducts || isLoadingBrands || isLoadingCategories ? (
        <LoadingSection />
      ) : (
        categories &&
        brands && (
          <ProductsTable
            products={filteredData ?? []}
            page={page}
            setPage={setPage}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            brands={brands}
            isLoadingBrands={isLoadingBrands}
          />
        )
      )}
      {!(isLoadingProducts || isLoadingBrands || isLoadingCategories) && categories && brands && (
        <AddProductDialog
          handleClose={handleClose}
          open={open}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          brands={brands}
          isLoadingBrands={isLoadingBrands}
        />
      )}
    </Container>
  );
};

export default ManageProducts;
