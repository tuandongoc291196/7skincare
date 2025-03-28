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
  onReject: (id: number, reason: string) => void;
  orderId: number | undefined;
}

const RejectReasonDialog: React.FC<AddBrandDialogProps> = ({
  open,
  handleClose,
  setReason,
  reason,
  onReject,
  orderId,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Vui lòng nhập lí do</DialogTitle>
      <DialogContent>
        <TextField
          label="Lý do"
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
            if (orderId) onReject(orderId, reason);
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

export default RejectReasonDialog;
