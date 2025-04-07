import { Product, ProductCreate, ProductUpdate } from "@/types/schema/product";
import apiClient from "./client";

export const BASE_PATH = "/product";

const createProduct = async (data: ProductCreate) => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data;
};

const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get(BASE_PATH + "/getAll", {
    params: { pageSize: 1000 },
  });
  return response.data.data;
};

const updateProduct = async (data: ProductUpdate) => {
  const response = await apiClient.put(BASE_PATH + "/update", data);
  return response.data;
};

const getProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get(BASE_PATH + `/?id=${id}`);
  return response.data.data;
};

export { createProduct, getProducts, updateProduct, getProductById };
