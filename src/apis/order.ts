import apiClient from "./client";
import { Order, OrderData } from "@/types/schema/order";

export const BASE_PATH = "/bill";

const createOrder = async (data: OrderData) => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data;
};
const getOrdersByAccountId = async (accountId: number): Promise<Order[]> => {
  const response = await apiClient.get(BASE_PATH + "/getAllByAccount/", {
    params: { accountId: accountId, pageSize: 1000 },
  });
  return response.data.data;
};
const getAllOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get(BASE_PATH + "/getAll", {
    params: { pageSize: 1000 },
  });
  return response.data.data;
};
const paymentOrder = async (id: number) => {
  const response = await apiClient.post(`/payments/request?billId=${id}`);
  return response.data.data;
};
const cancelOrder = async (id: number, reason: string) => {
  const response = await apiClient.put(BASE_PATH + `/cancel/?id=${id}&reason=${reason}`);
  return response.data;
};
const approveOrder = async (id: number) => {
  const response = await apiClient.put(BASE_PATH + `/approved/?id=${id}`);
  return response.data;
};
const rejectOrder = async (id: number, reason: string) => {
  const response = await apiClient.put(BASE_PATH + `/reject/?id=${id}&reason=${reason}`);
  return response.data;
};
const doneOrder = async (id: number, reason: string) => {
  const response = await apiClient.put(BASE_PATH + `/done/?id=${id}&reason=${reason}`);
  return response.data;
};
const getStatusHistory = async (id: number) => {
  const response = await apiClient.get(`bill-history/?billId=${id}`);
  return response.data.data;
};
export {
  createOrder,
  getOrdersByAccountId,
  getAllOrders,
  paymentOrder,
  cancelOrder,
  approveOrder,
  rejectOrder,
  doneOrder,
  getStatusHistory,
};
