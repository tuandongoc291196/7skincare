import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import useAuthStore from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { RegisterUserData } from "@/types/schema/user";
import { isValidEmail, isValidPhoneNumber } from "@/utils/validation";
import { AxiosError } from "axios";
import { useAlert } from "@/hooks/useAlert";
import { useQuery } from "@tanstack/react-query";
import { getDistrict, getProvince, getWard } from "@/apis/address";
import { District, Province, Ward } from "@/types/schema/address";

const Register = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [formState, setFormState] = useState<RegisterUserData>({
    email: "",
    password: "",
    name: "",
    address: "",
    phoneNumber: "",
  });

  const [selectedProvince, setSelectedProvince] = useState<number | "">("");
  const [selectedDistrict, setSelectedDistrict] = useState<number | "">("");
  const [selectedWard, setSelectedWard] = useState<string>("");

  const [addressDetail, setAddressDetail] = useState("");
  const { data: provinceData, isLoading: isLoadingProvinceData } = useQuery({
    queryKey: ["get-provinces"],
    queryFn: () => getProvince(),
  }) as { data: { ProvinceID: number; ProvinceName: string }[]; isLoading: boolean };
  const { data: districtData } = useQuery({
    queryKey: ["districts", selectedProvince],
    queryFn: () => getDistrict(selectedProvince as number),
    enabled: !!selectedProvince,
  });

  const { data: wardData } = useQuery({
    queryKey: ["wards", selectedDistrict],
    queryFn: () => getWard(selectedDistrict as number),
    enabled: !!selectedDistrict,
  });

  const { registerUser, isLoading } = useAuthStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    const fullAddress = `${addressDetail}, ${wardData?.find((w: Ward) => w.WardCode === selectedWard)?.WardName || ""}, ${
      districtData?.find((d: District) => d.DistrictID === selectedDistrict)?.DistrictName || ""
    }, ${provinceData.slice(1).find((p: Province) => p.ProvinceID === selectedProvince)?.ProvinceName || ""}`;

    try {
      await registerUser({ ...formState, address: fullAddress });
      setFormState({ email: "", password: "", name: "", address: "", phoneNumber: "" });
      setAddressDetail("");
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
      showAlert("Đăng ký thành công ! Vui lòng đăng nhập", "success");
      navigate("/dang-nhap");
    } catch (error) {
      if (error instanceof AxiosError) {
        showAlert("Đăng ký thất bại ! Hãy thử lại", "error");
      }
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
          my: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%", boxShadow: 3, p: 4 }}>
          <Box sx={{ flex: 1, pr: 2 }}>
            {isLoadingProvinceData ? (
              <Box
                display="flex"
                justifyContent="center"
                sx={{ alignItems: "center", height: "100%" }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography variant="h4" gutterBottom>
                  Đăng ký
                </Typography>
                <TextField
                  label="Tên"
                  variant="outlined"
                  fullWidth
                  required
                  value={formState.name}
                  onChange={handleInputChange}
                  name="name"
                  sx={{ mb: 2 }}
                  disabled={isLoading}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  value={formState.email}
                  onChange={handleInputChange}
                  name="email"
                  sx={{ mb: 2 }}
                  disabled={isLoading}
                  error={formState.email.length > 0 && !isValidEmail(formState.email)}
                  helperText={
                    formState.email.length > 0 && !isValidEmail(formState.email)
                      ? "Vui lòng nhập email hợp lệ"
                      : ""
                  }
                />
                <TextField
                  label="Mật khẩu"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  value={formState.password}
                  onChange={handleInputChange}
                  name="password"
                  sx={{ mb: 2 }}
                  disabled={isLoading}
                />
                {/* Address Dropdowns */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tỉnh/Thành phố</InputLabel>
                  <Select
                    value={selectedProvince}
                    onChange={e => {
                      const provinceId = Number(e.target.value);
                      const province = provinceData
                        .slice(1)
                        .find((p: Province) => p.ProvinceID === provinceId);
                      if (province) {
                        setSelectedProvince(provinceId);
                      }
                    }}
                    label="Tỉnh/Thành phố"
                  >
                    {provinceData.slice(1).map(province => (
                      <MenuItem key={province.ProvinceID} value={province.ProvinceID}>
                        {province.ProvinceName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Quận/Huyện</InputLabel>
                  <Select
                    value={selectedDistrict}
                    onChange={e => {
                      const districtId = Number(e.target.value);
                      const district = districtData?.find(
                        (d: District) => d.DistrictID === districtId
                      );
                      if (district) {
                        setSelectedDistrict(districtId);
                      }
                    }}
                    label="Quận/Huyện"
                    disabled={!selectedProvince}
                  >
                    {districtData?.map((d: District) => (
                      <MenuItem key={d.DistrictID} value={d.DistrictID}>
                        {d.DistrictName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Phường/Xã</InputLabel>
                  <Select
                    value={selectedWard}
                    onChange={e => {
                      const wardCode = String(e.target.value);
                      setSelectedWard(wardCode);
                    }}
                    label="Phường/Xã"
                    disabled={!selectedDistrict}
                  >
                    {wardData?.map((w: Ward) => (
                      <MenuItem key={w.WardCode} value={w.WardCode}>
                        {w.WardName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Địa chỉ chi tiết"
                  fullWidth
                  name="addressDetail"
                  value={addressDetail}
                  onChange={e => setAddressDetail(e.target.value)}
                  sx={{ mb: 2 }}
                  variant="outlined"
                  disabled={isLoading}
                />
                <TextField
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  required
                  value={formState.phoneNumber}
                  onChange={handleInputChange}
                  name="phoneNumber"
                  sx={{ mb: 2 }}
                  disabled={isLoading}
                  error={
                    formState.phoneNumber.length > 0 && !isValidPhoneNumber(formState.phoneNumber)
                  }
                  helperText={
                    formState.phoneNumber.length > 0 && !isValidPhoneNumber(formState.phoneNumber)
                      ? "Vui lòng nhập số điện thoại hợp lệ"
                      : ""
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mb: 2 }}
                  onClick={handleRegister}
                  disabled={
                    isLoading ||
                    !formState.email ||
                    !formState.password ||
                    !formState.name ||
                    !addressDetail ||
                    !selectedWard ||
                    !selectedDistrict ||
                    !selectedProvince ||
                    !formState.phoneNumber ||
                    !isValidEmail(formState.email) ||
                    !isValidPhoneNumber(formState.phoneNumber)
                  }
                >
                  {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                </Button>
              </>
            )}
          </Box>

          {/* Login Redirect Section */}
          <Box sx={{ flex: 1, pl: 2, textAlign: "center", alignContent: "center" }}>
            <Typography variant="h4" gutterBottom>
              ĐĂNG NHẬP
            </Typography>
            <Typography variant="body1" gutterBottom color="primary">
              Vui lòng đăng nhập để truy cập vào tài khoản và sử dụng các dịch vụ chăm sóc da chuyên
              nghiệp từ Bác sĩ Diễm Hương.
            </Typography>
            <Button onClick={() => navigate("/dang-nhap")} variant="contained" color="inherit">
              Đăng nhập
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
