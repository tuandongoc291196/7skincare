import { BrandUpdate } from "@/types/schema/brand";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface UpdateBrandDialogProps {
  dialogOpen: boolean;
  brand: BrandUpdate | null;
  handleCloseDialog: () => void;
  handleInputChange: (field: keyof BrandUpdate, value: string) => void;
  handleUpdateBrand: () => void;
}

const UpdateBrandDialog: React.FC<UpdateBrandDialogProps> = ({
  dialogOpen,
  brand,
  handleCloseDialog,
  handleInputChange,
  handleUpdateBrand,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Cập nhật danh mục</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Tên thương hiệu"
          fullWidth
          value={brand?.name || ""}
          onChange={e => handleInputChange("name", e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleUpdateBrand} color="primary" variant="contained">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBrandDialog;
