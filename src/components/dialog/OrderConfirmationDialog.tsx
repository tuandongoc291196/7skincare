import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider,
  Card,
  Grid,
} from "@mui/material";
import { OrderData } from "@/types/schema/order";
import { useQuery } from "@tanstack/react-query";
import { getDistrict, getWard } from "@/apis/address";
import { User } from "@/types/schema/user";

interface OrderConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmOrder: (orderData: OrderData) => void;
  items: { price: number; quantity: number; id: number; name: string }[];
  user: User;
  provinceData: { ProvinceID: number; ProvinceName: string }[];
}

const OrderConfirmationDialog: React.FC<OrderConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirmOrder,
  items,
  user,
  provinceData,
}) => {
  const [selectedProvince, setSelectedProvince] = useState<number | "">("");
  const [selectedDistrict, setSelectedDistrict] = useState<number | "">("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [address, setAddress] = useState({
    detail: "",
    ward: "",
    district: "",
    city: "",
  });

  const { data: districtData } = useQuery({
    queryKey: ["get-district"],
    queryFn: () => getDistrict(selectedProvince as number),
    enabled: !!selectedProvince,
  });

  const { data: wardData } = useQuery({
    queryKey: ["get-ward"],
    queryFn: () => getWard(selectedDistrict as number),
    enabled: !!selectedDistrict,
  });

  const resetForm = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setAddress({
      detail: "",
      ward: "",
      district: "",
      city: "",
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOrder = () => {
    const orderData: OrderData = {
      accountId: user?.accountId as number,
      address: `${address.detail}, ${address.ward}, ${address.district}, ${address.city}`,
      phoneNumber: user?.phoneNumber as string,
      listProducts: items.map(({ id, quantity }) => ({
        productId: id,
        quantity,
      })),
    };
    onConfirmOrder(orderData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>Xác nhận thanh toán</DialogTitle>
      <DialogContent sx={{ minWidth: "400px", p: 3 }}>
        {/* Address form */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Vui lòng nhập địa chỉ giao hàng
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tỉnh/Thành phố</InputLabel>
          <Select
            value={selectedProvince}
            onChange={e => {
              const provinceId = Number(e.target.value);
              const selectedProvince = provinceData.find(
                province => province.ProvinceID === provinceId
              );
              if (selectedProvince) {
                setSelectedProvince(provinceId);
                setAddress(prevState => ({
                  ...prevState,
                  city: selectedProvince.ProvinceName,
                }));
              }
            }}
            label="Tỉnh/Thành phố"
          >
            {provinceData.map(province => (
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
              const selectedDistrict = districtData?.find(
                (district: { DistrictID: number; DistrictName: string }) =>
                  district.DistrictID === districtId
              );
              if (selectedDistrict) {
                setSelectedDistrict(districtId);
                setAddress(prevState => ({
                  ...prevState,
                  district: selectedDistrict.DistrictName,
                }));
              }
            }}
            label="Quận/Huyện"
            disabled={!selectedProvince}
          >
            {districtData?.map((district: { DistrictID: number; DistrictName: string }) => (
              <MenuItem key={district.DistrictID} value={district.DistrictID}>
                {district.DistrictName}
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
              const selectedWard = wardData?.find(
                (ward: { WardCode: string; WardName: string }) => ward.WardCode === wardCode
              );
              if (selectedWard) {
                setSelectedWard(wardCode);
                setAddress(prevState => ({
                  ...prevState,
                  ward: selectedWard.WardName,
                }));
              }
            }}
            label="Phường/Xã"
            disabled={!selectedDistrict}
          >
            {wardData?.map((ward: { WardCode: string; WardName: string }) => (
              <MenuItem key={ward.WardCode} value={ward.WardCode}>
                {ward.WardName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Địa chỉ chi tiết"
          fullWidth
          name="detail"
          value={address.detail}
          onChange={handleAddressChange}
          sx={{ mb: 2 }}
          variant="outlined"
        />

        {/* Preview products */}
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Danh sách sản phẩm:
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 3 }}>
          {items.map(item => (
            <Card key={item.id} sx={{ mb: 1, borderRadius: 2, boxShadow: 1 }}>
              <Grid container spacing={1} p={1}>
                <Grid item xs={8}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.quantity} x {item.price.toLocaleString()}₫
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {(item.quantity * item.price).toLocaleString()}₫
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="body1" fontWeight={500}>
            Phí vận chuyển:
          </Typography>
          <Typography variant="body1" color="red">
            25,000 VNĐ
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography fontWeight={600}>Tạm tính</Typography>
          <Typography variant="h5" fontWeight={600}>
            {(
              items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 25000
            ).toLocaleString()}{" "}
            VNĐ
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={1} align="center">
          Vui lòng kiểm tra kĩ thông tin trước khi đặt hàng
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" sx={{ fontWeight: 600 }}>
          Hủy
        </Button>
        <Button
          onClick={handleOrder}
          variant="contained"
          color="primary"
          sx={{ fontWeight: 600 }}
          disabled={!address.detail || !selectedWard || !selectedDistrict || !selectedProvince}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderConfirmationDialog;
