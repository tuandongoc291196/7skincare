import { Brand, BrandUpdate } from "@/types/schema/brand";
import apiClient from "./client";

export const BASE_PATH = "/brand";

const createBrand = async (data: { name: string }) => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data;
};
const getBrands = async (): Promise<Brand[]> => {
  const response = await apiClient.get(BASE_PATH + "/get-all");
  return response.data.data;
};
const updateBrand = async (data: BrandUpdate) => {
  const response = await apiClient.put(BASE_PATH + "/update/", data);
  return response.data;
};
export { createBrand, getBrands, updateBrand };
