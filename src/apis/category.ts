import { Category, CategoryUpdate } from "@/types/schema/category";
import apiClient from "./client";

export const BASE_PATH = "/category";

const createCategory = async (data: { name: string; description: string }) => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data;
};
const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get(BASE_PATH + "/get-all");
  return response.data.data;
};
const updateCategory = async (data: CategoryUpdate) => {
  const response = await apiClient.put(BASE_PATH + "/edit/", data);
  return response.data;
};
export { createCategory, getCategories, updateCategory };
