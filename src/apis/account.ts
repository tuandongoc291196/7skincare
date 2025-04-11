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

const getAccounts = async (): Promise<Account[]> => {
  const response = await apiClient.get(BASE_PATH + "/getAll");
  return response.data.data;
};

const deleteAccount = async (id: number) => {
  const response = await apiClient.delete(BASE_PATH + "/delete/", { params: { id: id } });
  return response.data;
};

const activateAccount = async (id: number) => {
  const response = await apiClient.put(BASE_PATH + `/activate/?id=${id}`);
  return response.data;
};

export { getAccountById, updateAccount, getAccounts, deleteAccount, activateAccount };
