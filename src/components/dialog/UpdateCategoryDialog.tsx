import { CategoryUpdate } from "@/types/schema/category";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface UpdateCategoryDialogProps {
  dialogOpen: boolean;
  category: CategoryUpdate | null;
  handleCloseDialog: () => void;
  handleInputChange: (field: keyof CategoryUpdate, value: string) => void;
  handleUpdateCategory: () => void;
}

const UpdateCategoryDialog: React.FC<UpdateCategoryDialogProps> = ({
  dialogOpen,
  category,
  handleCloseDialog,
  handleInputChange,
  handleUpdateCategory,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Cập nhật danh mục</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Tên danh mục"
          fullWidth
          value={category?.name || ""}
          onChange={e => handleInputChange("name", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Mô tả"
          fullWidth
          value={category?.description || ""}
          onChange={e => handleInputChange("description", e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleUpdateCategory} color="primary" variant="contained">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCategoryDialog;
