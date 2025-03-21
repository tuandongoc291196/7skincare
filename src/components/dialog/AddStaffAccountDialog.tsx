import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { RegisterStaffData } from "@/types/schema/user";
import { isValidEmail, isValidPhoneNumber } from "@/utils/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerStaff } from "@/apis/auth";
import { useAlert } from "@/hooks/useAlert";

interface AddStaffAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialFormState: RegisterStaffData = {
  email: "",
  password: "",
  name: "",
  address: "",
  phoneNumber: "",
  positionId: 2,
};

const AddStaffAccountDialog: React.FC<AddStaffAccountDialogProps> = ({ open, onClose }) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<RegisterStaffData>(initialFormState);

  useEffect(() => {
    if (!open) {
      setFormState(initialFormState);
    }
  }, [open]);

  const registerStaffMutation = useMutation({
    mutationKey: ["register-staff"],
    mutationFn: (data: RegisterStaffData) => registerStaff(data),
    onSuccess: async () => {
      showAlert("Thêm tài khoản nhân viên thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-accounts"] });
      onClose();
    },
    onError: () => {
      showAlert("Thêm tài khoản nhân viên thất bại", "error");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = () => {
    registerStaffMutation.mutate(formState);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Đăng ký</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên"
          fullWidth
          required
          name="name"
          value={formState.name}
          autoComplete="off"
          onChange={handleInputChange}
          sx={{ my: 2 }}
        />
        <TextField
          label="Email"
          fullWidth
          required
          name="email"
          value={formState.email}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          autoComplete="off"
          error={!!formState.email && !isValidEmail(formState.email)}
          helperText={
            !!formState.email && !isValidEmail(formState.email) ? "Vui lòng nhập email hợp lệ" : ""
          }
        />
        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          required
          name="password"
          value={formState.password}
          onChange={handleInputChange}
          autoComplete="off"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Địa chỉ"
          fullWidth
          required
          name="address"
          value={formState.address}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          autoComplete="off"
        />
        <TextField
          label="Số điện thoại"
          fullWidth
          required
          name="phoneNumber"
          value={formState.phoneNumber}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          autoComplete="off"
          error={!!formState.phoneNumber && !isValidPhoneNumber(formState.phoneNumber)}
          helperText={
            !!formState.phoneNumber && !isValidPhoneNumber(formState.phoneNumber)
              ? "Vui lòng nhập số điện thoại hợp lệ"
              : ""
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleRegister}
          color="primary"
          variant="contained"
          disabled={registerStaffMutation.isPending}
        >
          {registerStaffMutation.isPending ? "Đang tạo..." : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStaffAccountDialog;
