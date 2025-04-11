import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

interface AddBrandDialogProps {
  open: boolean;
  handleClose: () => void;
  setReason: React.Dispatch<React.SetStateAction<string>>;
  reason: string;
  onSubmit: (id: number, reason: string) => void;
  orderId: number | undefined;
}

const DoneConfirmationDialog: React.FC<AddBrandDialogProps> = ({
  open,
  handleClose,
  setReason,
  reason,
  onSubmit,
  orderId,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Xác nhận giao hàng</DialogTitle>
      <DialogContent>
        <TextField
          label="Mô tả"
          multiline
          minRows={2}
          value={reason}
          onChange={e => setReason(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info" variant="outlined">
          Hủy
        </Button>
        <Button
          disabled={reason === ""}
          onClick={() => {
            if (orderId) onSubmit(orderId, reason);
          }}
          color="primary"
          variant="contained"
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoneConfirmationDialog;
