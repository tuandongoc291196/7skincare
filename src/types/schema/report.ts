export interface ReportOrders {
  id: number;
  name: string;
  quantity: number;
}

export interface ReportRevenue {
  totalRevenue: number;
  revenueReportByDay: { date: string; totalPrice: number }[];
}

export interface ReportStatus {
  total: number;
  pending: number;
  approved: number;
  canceled: number;
  rejected: number;
  success: number;
  done: number;
}
