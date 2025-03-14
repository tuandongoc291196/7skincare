import apiClient from "./client";
import { Account, UpdateAccountData } from "@/types/schema/user";

export const BASE_PATH = "/account";

const updateAccount = async (data: UpdateAccountData) => {
  const response = await apiClient.put(BASE_PATH + "/edit", data);
  return response.data;
};
const getAccountById = async (id: number): Promise<Account> => {
  const response = await apiClient.get(BASE_PATH + "/", { params: { id: id } });
  return response.data.data;
};

export { getAccountById, updateAccount };
