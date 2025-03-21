import { SkinTestData, SkinTestResult } from "@/types/schema/skin-test";
import apiClient from "./client";

export const BASE_PATH = "/userTest";

const createTest = async (data: SkinTestData): Promise<SkinTestResult> => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data.data;
};

export { createTest };
