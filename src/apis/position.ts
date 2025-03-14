import { Position } from "@/types/schema/position";
import apiClient from "./client";

export const BASE_PATH = "/position";

const createPosition = async (data: { name: string }) => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data;
};
const getPositions = async (): Promise<Position[]> => {
  const response = await apiClient.get(BASE_PATH + "/getAllActivatedPositons");
  return response.data.data;
};

export { createPosition, getPositions };
