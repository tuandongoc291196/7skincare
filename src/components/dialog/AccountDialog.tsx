import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import { Account } from "@/types/schema/user";
import { Roles, Statuses } from "@/constants/status";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface AccountDetailDialogProps {
  open: boolean;
  account: Account | null;
  onClose: () => void;
  onToggleStatus: (id: number) => void;
}

const AccountDialog: React.FC<AccountDetailDialogProps> = ({
  open,
  account,
  onClose,
  onToggleStatus,
}) => {
  if (!account) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Chi tiết tài khoản
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>ID:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{account.id}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Tên:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{account.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Email:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{account.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Số điện thoại:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{account.phoneNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Địa chỉ:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{account.address}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Vai trò:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <Chip
                sx={{ height: "24px", borderRadius: "4px", fontWeight: 600 }}
                variant="outlined"
                label={account.roleName}
                color={
                  account.roleName === Roles.STAFF
                    ? "info"
                    : account.roleName === Roles.ADMIN
                      ? "secondary"
                      : "primary"
                }
              />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Trạng thái:</Typography>
          </Grid>
          <Grid item xs={6} display={"flex"} gap={1} alignItems={"center"}>
            <Box>
              {account.status === Statuses.ACTIVATED ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
            </Box>
            <Box fontWeight={600} color={account.status === Statuses.ACTIVATED ? "green" : "red"}>
              {account.status === Statuses.ACTIVATED ? "Hoạt động" : "Vô hiệu hóa"}
            </Box>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Button
              onClick={() => onToggleStatus(account.id)}
              color={account.status === Statuses.ACTIVATED ? "error" : "success"}
              variant="contained"
              size="small"
              disabled={account.roleName === Roles.ADMIN}
            >
              {account.status === Statuses.ACTIVATED ? "Vô hiệu hóa" : "Kích hoạt"}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountDialog;
