// FilterSection.tsx
import { skinTypeMap } from "@/constants/skinTypes";
import { Brand } from "@/types/schema/brand";
import { Category } from "@/types/schema/category";
import { SkinType } from "@/types/schema/skin-type";
import {
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
  Divider,
} from "@mui/material";

interface FilterSectionProps {
  isLoadingBrands: boolean;
  isLoadingCategories: boolean;
  isLoadingSkins: boolean;
  brands?: Brand[];
  categories?: Category[];
  skins?: SkinType[];
  brandFilter: string[];
  setBrandFilter: (value: string[]) => void;
  categoryFilter: string[];
  setCategoryFilter: (value: string[]) => void;
  priceRangeFilter: string[];
  setPriceRangeFilter: (value: string[]) => void;
  skinTypeFilter: string[];
  setSkinTypeFilter: (value: string[]) => void;
  priceRanges: {
    label: string;
    value: string;
    range: number[];
  }[];
  clearFilters: () => void;
}

const FilterSection = ({
  isLoadingBrands,
  isLoadingCategories,
  isLoadingSkins,
  brands,
  categories,
  skins,
  brandFilter,
  setBrandFilter,
  categoryFilter,
  setCategoryFilter,
  priceRangeFilter,
  setPriceRangeFilter,
  skinTypeFilter,
  setSkinTypeFilter,
  priceRanges,
}: FilterSectionProps) => {
  const handleBrandChange = (brandName: string) => {
    setBrandFilter(
      brandFilter.includes(brandName)
        ? brandFilter.filter(b => b !== brandName)
        : [...brandFilter, brandName]
    );
  };

  const handleCategoryChange = (categoryName: string) => {
    setCategoryFilter(
      categoryFilter.includes(categoryName)
        ? categoryFilter.filter(c => c !== categoryName)
        : [...categoryFilter, categoryName]
    );
  };

  const handlePriceRangeChange = (rangeValue: string) => {
    setPriceRangeFilter(
      priceRangeFilter.includes(rangeValue)
        ? priceRangeFilter.filter(r => r !== rangeValue)
        : [...priceRangeFilter, rangeValue]
    );
  };

  const handleSkinTypeChange = (skinType: string) => {
    setSkinTypeFilter(
      skinTypeFilter.includes(skinType)
        ? skinTypeFilter.filter(s => s !== skinType)
        : [...skinTypeFilter, skinType]
    );
  };

  return (
    <Box sx={{ bgcolor: "#e9f5ff", borderRadius: 1, p: 2, width: "100%" }}>
      {isLoadingBrands || isLoadingCategories || isLoadingSkins ? (
        <Box display="flex" justifyContent="center" sx={{ alignItems: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Categories Filter */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Loại sản phẩm
          </Typography>
          <Box sx={{ maxHeight: 125, overflowY: "auto", mb: 1 }}>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {categories?.map(category => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        checked={categoryFilter.includes(category.name)}
                        onChange={() => handleCategoryChange(category.name)}
                        name={category.name}
                      />
                    }
                    label={category.name}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
          <Divider sx={{ my: 1 }} />

          {/* Brands Filter */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Thương hiệu
          </Typography>
          <Box sx={{ maxHeight: 125, overflowY: "auto", mb: 1 }}>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {brands?.map(brand => (
                  <FormControlLabel
                    key={brand.id}
                    control={
                      <Checkbox
                        checked={brandFilter.includes(brand.name)}
                        onChange={() => handleBrandChange(brand.name)}
                        name={brand.name}
                      />
                    }
                    label={brand.name}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
          <Divider sx={{ my: 1 }} />

          {/* Skin Types Filter */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Loại da
          </Typography>
          <Box sx={{ maxHeight: 75, overflowY: "auto", mb: 1 }}>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {skins?.map(skin => (
                  <FormControlLabel
                    key={skin.id}
                    control={
                      <Checkbox
                        checked={skinTypeFilter.includes(skin.type)}
                        onChange={() => handleSkinTypeChange(skin.type)}
                        name={skin.type}
                      />
                    }
                    label={skinTypeMap[skin.type] || skin.type}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
          <Divider sx={{ my: 1 }} />

          {/* Price Range Filter */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Khoảng giá (VNĐ)
          </Typography>
          <Box sx={{ maxHeight: 75, overflowY: "auto", mb: 1 }}>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {priceRanges.map(range => (
                  <FormControlLabel
                    key={range.value}
                    control={
                      <Checkbox
                        checked={priceRangeFilter.includes(range.value)}
                        onChange={() => handlePriceRangeChange(range.value)}
                        name={range.value}
                      />
                    }
                    label={range.label}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FilterSection;
