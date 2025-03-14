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
import { createPosition } from "@/apis/position";

interface AddPositionDialogProps {
  open: boolean;
  handleClose: () => void;
}

const AddPositionDialog: React.FC<AddPositionDialogProps> = ({ open, handleClose }) => {
  const queryClient = useQueryClient();

  const addNewPosition = useMutation({
    mutationKey: ["create-position"],
    mutationFn: (name: string) => createPosition({ name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get-positions"],
      });
      handleClose();
    },
  });
  const [newPosition, setNewPosition] = useState("");

  return (
    <Dialog open={open} onClose={handleClose} sx={{ minWidth: "400px" }}>
      <DialogTitle>Thêm thương hiệu mới</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên thương hiệu"
          value={newPosition}
          onChange={e => setNewPosition(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info" variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={() => addNewPosition.mutate(newPosition)}
          color="primary"
          variant="contained"
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPositionDialog;
