import { SkinTestData, SkinTestResult, UserTest } from "@/types/schema/skin-test";
import apiClient from "./client";

export const BASE_PATH = "/userTest";

const createTest = async (data: SkinTestData): Promise<SkinTestResult> => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data.data;
};

const getUserTestByUserId = async (user_id: number): Promise<UserTest[]> => {
  const response = await apiClient.get(BASE_PATH + `/user/?id=${user_id}`);
  return response.data.data;
};

const getUserTestById = async (id: number): Promise<SkinTestResult> => {
  const response = await apiClient.get(BASE_PATH + `/?id=${id}`);
  return response.data.data;
};

const getAllUserTest = async (): Promise<UserTest> => {
  const response = await apiClient.get(BASE_PATH + `/getAll/`);
  return response.data.data;
};
export { createTest, getUserTestByUserId, getUserTestById, getAllUserTest };
