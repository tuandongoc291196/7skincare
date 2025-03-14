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
import { createBrand } from "@/apis/brand";

interface AddBrandDialogProps {
  open: boolean;
  handleClose: () => void;
}

const AddBrandDialog: React.FC<AddBrandDialogProps> = ({ open, handleClose }) => {
  const queryClient = useQueryClient();

  const addNewBrand = useMutation({
    mutationKey: ["create-brand"],
    mutationFn: (name: string) => createBrand({ name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get-brands"],
      });
      handleClose();
    },
  });
  const [newBrand, setNewBrand] = useState("");

  return (
    <Dialog open={open} onClose={handleClose} sx={{ minWidth: "400px" }}>
      <DialogTitle>Thêm thương hiệu mới</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên thương hiệu"
          value={newBrand}
          onChange={e => setNewBrand(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info" variant="outlined">
          Hủy
        </Button>
        <Button onClick={() => addNewBrand.mutate(newBrand)} color="primary" variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBrandDialog;
