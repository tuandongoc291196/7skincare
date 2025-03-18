// FilterSection.tsx
import { Brand } from "@/types/schema/brand";
import { Category } from "@/types/schema/category";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

interface FilterSectionProps {
  isLoadingBrands: boolean;
  isLoadingCategories: boolean;
  brands?: Brand[];
  categories?: Category[];
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  priceRangeFilter: string;
  setPriceRangeFilter: (value: string) => void;
  priceRanges: {
    label: string;
    value: string;
    range: number[];
  }[];
  applyFilters: () => void;
  clearFilters: () => void;
}

const FilterSection = ({
  isLoadingBrands,
  isLoadingCategories,
  brands,
  categories,
  brandFilter,
  setBrandFilter,
  categoryFilter,
  setCategoryFilter,
  priceRangeFilter,
  setPriceRangeFilter,
  priceRanges,
  applyFilters,
  clearFilters,
}: FilterSectionProps) => {
  return (
    <>
      {isLoadingBrands || isLoadingCategories ? (
        <Box display="flex" justifyContent="center" sx={{ alignItems: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" fullWidth>
            <InputLabel>Thương hiệu</InputLabel>
            <Select
              value={brandFilter}
              label="Thương hiệu"
              onChange={e => setBrandFilter(e.target.value as string)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {brands?.map(brand => (
                <MenuItem key={brand.id} value={brand.name}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={categoryFilter}
              label="Danh mục"
              onChange={e => setCategoryFilter(e.target.value as string)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categories?.map(category => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Khoảng giá (VNĐ)</InputLabel>
            <Select
              value={priceRangeFilter}
              label="Khoảng giá"
              onChange={e => setPriceRangeFilter(e.target.value as string)}
            >
              {priceRanges.map(range => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}
      <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "end" }}>
        <Button size="small" variant="contained" onClick={applyFilters}>
          Áp dụng
        </Button>
        <Button size="small" variant="outlined" onClick={clearFilters}>
          Xóa
        </Button>
      </Box>
    </>
  );
};

export default FilterSection;
