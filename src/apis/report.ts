import { ReportOrders, ReportRevenue, ReportStatus } from "@/types/schema/report";
import apiClient from "./client";

export const BASE_PATH = "/report";

const reportOrders = async (): Promise<ReportOrders[]> => {
  const response = await apiClient.get(BASE_PATH + "/order-detail");
  return response.data.data;
};
const reportRevenue = async (): Promise<ReportRevenue> => {
  const response = await apiClient.get(BASE_PATH + "/revenue");
  return response.data.data;
};
const reportStatus = async (): Promise<ReportStatus> => {
  const response = await apiClient.get(BASE_PATH + "/status");
  return response.data.data;
};

export { reportOrders, reportRevenue, reportStatus };
