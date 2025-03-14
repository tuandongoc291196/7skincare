import { Category } from "@/types/schema/category";
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

export { createCategory, getCategories };
