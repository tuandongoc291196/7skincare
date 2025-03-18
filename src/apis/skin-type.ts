import apiClient from "./client";
import { SkinType, SkinTypeCreate } from "@/types/schema/skin-type";

export const BASE_PATH = "/skinType";

const createSkinType = async (data: SkinTypeCreate) => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data;
};
const getSkinTypes = async (): Promise<SkinType[]> => {
  const response = await apiClient.get(BASE_PATH + "/getAll");
  return response.data.data;
};

export { createSkinType, getSkinTypes };
