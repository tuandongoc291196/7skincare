import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data",
  headers: {
    "Content-Type": "application/json",
    Token: "3267ff4a-0aba-11f0-9f28-eacfdef119b3",
  },
});
const getProvince = async () => {
  const response = await apiClient.get("/province");
  return response.data.data;
};
const getDistrict = async (province_id: number) => {
  const response = await apiClient.get(`/district?province_id=${province_id}`);
  return response.data.data;
};
const getWard = async (district_id: number) => {
  const response = await apiClient.get(`/ward?district_id=${district_id}`);
  return response.data.data;
};
export { getProvince, getDistrict, getWard };
