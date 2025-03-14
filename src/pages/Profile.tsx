import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { UpdateAccountData } from "@/types/schema/user";
import useAuthStore from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAccountById, updateAccount } from "@/apis/account";
import { Statuses } from "@/constants/status";
import { isValidEmail, isValidPhoneNumber } from "@/utils/validation";
import { useAlert } from "@/hooks/useAlert";

const Profile: React.FC = () => {
  const { showAlert } = useAlert();
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<UpdateAccountData>({
    address: "",
    email: "",
    phoneNumber: "",
    name: "",
    id: 0,
  });
  const [isChanged, setIsChanged] = useState(false);
  const updateAccountMutation = useMutation({
    mutationKey: ["update-account"],
    mutationFn: (data: UpdateAccountData) => updateAccount(data),
    onSuccess: () => {
      updateUser(profile);
      showAlert("Cập nhật tài khoản thành công", "success");
    },
    onError: () => {
      showAlert("Cập nhật tài khoản thất bại", "error");
    },
  });
  const { data, isLoading } = useQuery({
    queryKey: ["get-account-by-id"],
    queryFn: () => getAccountById(user?.accountId ?? 0),
  });

  useEffect(() => {
    if (data) {
      setProfile({
        address: data.address,
        email: data.email,
        id: data.id,
        name: data.name,
        phoneNumber: data.phoneNumber,
      });
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const hasChanges =
        profile.address !== data.address ||
        profile.email !== data.email ||
        profile.phoneNumber !== data.phoneNumber ||
        profile.name !== data.name;
      setIsChanged(hasChanges);
    }
  }, [profile, data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateAccountMutation.mutate(profile);
  };

  if (isLoading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, my: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Thông tin cá nhân
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box display={"flex"} gap={1}>
            <Typography variant="body1">Ngày tạo:</Typography>
            <Typography variant="body1" fontWeight="bold">
              {new Date(data?.createAt ?? "").toLocaleString()}
            </Typography>
          </Box>
          <Box display={"flex"} gap={1} mt={1}>
            <Typography variant="body1">Trạng thái:</Typography>
            <Typography
              variant="body1"
              fontWeight="bold"
              color={data?.status === Statuses.ACTIVATED ? "green" : "red"}
            >
              {data?.status === Statuses.ACTIVATED ? "Hoạt động" : "Vô hiệu hóa"}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={profile.email.length > 0 && !isValidEmail(profile.email)}
            helperText={
              profile.email.length > 0 && !isValidEmail(profile.email)
                ? "Vui lòng nhập email hợp lệ"
                : ""
            }
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={profile.phoneNumber.length > 0 && !isValidPhoneNumber(profile.phoneNumber)}
            helperText={
              profile.phoneNumber.length > 0 && !isValidPhoneNumber(profile.phoneNumber)
                ? "Vui lòng nhập số điện thoại hợp lệ"
                : ""
            }
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={profile.address}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={!isChanged}
          >
            Cập nhật tài khoản
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
