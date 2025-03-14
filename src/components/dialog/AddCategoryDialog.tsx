import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/apis/category";

interface AddCategoryDialogProps {
  open: boolean;
  handleClose: () => void;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ open, handleClose }) => {
  const queryClient = useQueryClient();

  const addNewCategory = useMutation({
    mutationKey: ["create-category"],
    mutationFn: (data: { name: string; description: string }) => createCategory(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get-categories"],
      });
      handleClose();
    },
  });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Dialog open={open} onClose={handleClose} sx={{ minWidth: "400px" }}>
      <DialogTitle>Thêm thương hiệu mới</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên danh mục"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mô tả"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info" variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={() => addNewCategory.mutate({ name, description })}
          color="primary"
          variant="contained"
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryDialog;
