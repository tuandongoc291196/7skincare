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
import { createSkinType } from "@/apis/skin-type";

interface AddSkinTypeDialogProps {
  open: boolean;
  handleClose: () => void;
}

const AddSkinTypeDialog: React.FC<AddSkinTypeDialogProps> = ({ open, handleClose }) => {
  const queryClient = useQueryClient();

  const addNewBrand = useMutation({
    mutationKey: ["create-skinType"],
    mutationFn: (type: string) => createSkinType({ type }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get-skinTypes"],
      });
      handleClose();
    },
  });
  const [newSkinType, setNewSkinType] = useState("");

  return (
    <Dialog open={open} onClose={handleClose} sx={{ minWidth: "400px" }}>
      <DialogTitle>Thêm loại da mới</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên loại da"
          value={newSkinType}
          onChange={e => setNewSkinType(e.target.value)}
          fullWidth
          margin="normal"
          error={!newSkinType}
          helperText={!newSkinType ? "Tên loại da không được để trống" : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info" variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={() => addNewBrand.mutate(newSkinType)}
          color="primary"
          variant="contained"
          disabled={!newSkinType}
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSkinTypeDialog;
