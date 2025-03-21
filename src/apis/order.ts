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
  const response = await apiClient.get(BASE_PATH + "/getAll");
  return response.data.data;
};
const paymentOrder = async (id: number) => {
  const response = await apiClient.post(`/payments/request?billId=${id}`);
  return response.data.data;
};
const cancelOrder = async (id: number) => {
  const response = await apiClient.put(BASE_PATH + `/cancel/?id=${id}`);
  return response.data;
};
export { createOrder, getOrdersByAccountId, getAllOrders, paymentOrder, cancelOrder };
